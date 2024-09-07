import db from "@/lib/db";
import { getSession } from "@/lib/session";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatToWon } from "@/lib/utils";
import DeleteBtn from "@/components/delete-btn";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title", "product-detail"],
});

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          user_name: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  };

  const buyProduct = async () => {
    "use server";
    const session = await getSession();
    if (session.id) {
      const existingPurchase = await db.purchase.findFirst({
        where: {
          productId: id,
        },
      });
      if (existingPurchase) {
        notFound();
      } else {
        const product = await db.product.update({
          where: {
            id,
          },
          data: {
            sale_status: 1,
          },
        });
        const buyProduct = await db.purchase.create({
          data: {
            buyerId: session.id,
            productId: id,
          },
        });
        const saleProduct = await db.sale.create({
          data: {
            sellerId: product.userId,
            productId: id,
          },
        });
      }
    }
    revalidateTag("product-detail");
    redirect("/products");
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={`${product.photo}/public`} alt={product.title} />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={`${product.user.avatar}/avatar`}
              width={40}
              height={40}
              alt={product.user.user_name}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.user_name}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          // <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
          //   Delete product
          // </button>
          <DeleteBtn id={id} />
        ) : null}
        <form action={createChatRoom}>
          <button className="primary-btn text-lg p-2.5">채팅하기</button>
        </form>
        <form action={buyProduct}>
          <button
            className="primary-btn text-lg p-2.5 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
            disabled={product.sale_status === 1 ? true : false}
          >
            구매하기
          </button>
        </form>
      </div>
    </div>
  );
}
