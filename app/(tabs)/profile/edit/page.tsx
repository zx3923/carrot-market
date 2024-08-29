import EditProfileForm from "@/components/edit-profile-form";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

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

export type InitialUser = Prisma.PromiseReturnType<typeof getUser>;

export default async function EditProfile() {
  const user = await getUser();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">계정 / 정보 수정</h1>
      <EditProfileForm initialUser={user} />
    </div>
  );
}
