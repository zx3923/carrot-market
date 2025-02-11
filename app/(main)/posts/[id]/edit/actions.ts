"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePosts(id: number) {
  const post = await db.post.delete({
    where: {
      id,
    },
  });

  revalidateTag("post-detail");
  redirect("/life");
}
