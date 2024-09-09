"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function likePost(postId: number) {
  // await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

const formSchema = z.object({
  comment: z.string().min(1, "댓글은 필수입니다"),
  id: z.coerce.number(),
});

export async function addComment(prevState: any, formData: FormData) {
  const data = {
    comment: formData.get("comment"),
    id: formData.get("id"),
  };

  const result = await formSchema.spa(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const comment = await db.comment.create({
        data: {
          postId: result.data.id,
          userId: session.id,
          payload: result.data.comment,
        },
      });

      revalidateTag("comment");
      // redirect(`/posts/${result.data.id}`);
    }
  }
}

export async function deleteComment(id: number) {
  const comment = await db.comment.delete({
    where: {
      id,
    },
  });

  revalidateTag("comment");
}
