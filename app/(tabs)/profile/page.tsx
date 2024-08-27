import db from "@/lib/db";
import { getSession } from "@/lib/session";
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
    <div className="p-5 flex flex-col">
      <h1>안녕하세요! {user?.user_name} 님!</h1>
      <form action={logOut}>
        <button>로그아웃</button>
      </form>
    </div>
  );
}
