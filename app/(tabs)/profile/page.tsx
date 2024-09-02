import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "프로필",
};

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function getPurchase() {
  const session = await getSession();
  const purchaseList = await db.purchase.findMany({
    where: {
      buyerId: session.id,
    },
  });
  return purchaseList;
}

async function getSale() {
  const session = await getSession();
  const saleList = await db.sale.findMany({
    where: {
      sellerId: session.id,
    },
  });
  return saleList;
}

async function getProducts(id: number) {
  const product = await db.product.findMany({
    where: {
      id,
    },
    take: 2,
  });
  console.log("@@@@");
  console.log(product);
  return product;
}

export default async function Profile() {
  const user = await getUser();
  const purchaseList = await getPurchase();
  const saleList = await getSale();
  const firstPurchaseList = purchaseList[0]
    ? await getProducts(purchaseList[0].productId)
    : [];
  const firstSaleList = saleList[0]
    ? await getProducts(saleList[0].productId)
    : [];
  // const firstPurchaseList = [];
  // const firstSaleList = [];
  // if (purchaseList[0]) {
  //   firstPurchaseList.push(await getProducts(purchaseList[0].productId));
  // }
  // if (saleList[0]) {
  //   firstSaleList.push(await getProducts(saleList[0].productId));
  // }
  // console.log(firstPurchaseList);
  console.log(firstSaleList);
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">프로필</h1>
      <div className="mt-4 flex flex-col gap-4">
        <h1 className="text-xl">안녕하세요! {user?.user_name} 님!</h1>
        <h1 className="text-xl">나의 거래</h1>
        <div>
          <Link href="/profile/purchase">
            <h1>구매 내역</h1>
          </Link>
          {firstPurchaseList.map((item, i) => (
            <Link href={`/products/${item.id}`} key={i} className="flex gap-4">
              <div className="relative size-28 rounded-md overflow-hidden">
                <Image
                  fill
                  src={`${item.photo}/avatar`}
                  className="object-cover"
                  alt={item.title}
                />
              </div>
              <div className="flex flex-col gap-1 *:text-white ">
                <span className="text-lg">{item.title}</span>
                <span className="text-sm text-neutral-500">
                  {formatToTimeAgo(item.created_at.toString())}
                </span>
                <span className="text-lg font-semibold">
                  {formatToWon(item.price)}원
                </span>
                <span>{item.sale_status === 1 ? "판매완료" : "판매중"}</span>
              </div>
            </Link>
          ))}
          <Link href="/profile/sale">
            <h1>판매 내역</h1>
          </Link>
          {firstSaleList.map((item) => (
            <Link
              href={`/products/${item.id}`}
              key={item.id}
              className="flex gap-4"
            >
              <div className="relative size-28 rounded-md overflow-hidden">
                <Image
                  fill
                  src={`${item.photo}/avatar`}
                  className="object-cover"
                  alt={item.title}
                />
              </div>
              <div className="flex flex-col gap-1 *:text-white">
                <span className="text-lg">{item.title}</span>
                <span className="text-sm text-neutral-500">
                  {formatToTimeAgo(item.created_at.toString())}
                </span>
                <span className="text-lg font-semibold">
                  {formatToWon(item.price)}원
                </span>
                <span>{item.sale_status === 1 ? "판매완료" : "판매중"}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="profile/edit" className="primary-btn text-lg py-2.5 w-40">
          계정 / 정보 관리
        </Link>
        <form action={logOut}>
          <button className="primary-btn p-2.5">로그아웃</button>
        </form>
      </div>
    </div>
  );
}
