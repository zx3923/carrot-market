import EditPost from "@/components/edit-post";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";

const getCachedPosts = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
});

async function getPost(id: number) {
  const post = await db.post.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
    },
  });
  return post;
}

export type InitialPost = Prisma.PromiseReturnType<typeof getPost>;

export default async function EditPosts({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const post = await getCachedPosts(id);
  if (!post) {
    return notFound();
  }
  return <EditPost post={post!} />;
}
