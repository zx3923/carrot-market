"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().min(1, "내용은 필수입니다"),
});

export async function uploadPost(prevState: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = await formSchema.spa(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const post = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          userId: session.id,
        },
      });

      redirect(`/posts/${post.id}`);
    }
  }
}
