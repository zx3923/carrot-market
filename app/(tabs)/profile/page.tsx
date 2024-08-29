import db from "@/lib/db";
import { getSession } from "@/lib/session";
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

export default async function Profile() {
  const user = await getUser();
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
          <h1>판매 내역</h1>
          <h1>구매 내역</h1>
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
