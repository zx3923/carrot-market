import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import PostList from "@/components/post-list";

async function getInitialPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return posts;
}

export type InitialPosts = Prisma.PromiseReturnType<typeof getInitialPosts>;

export const metadata = {
  title: "동네생활",
};

export default async function Life() {
  const initialPosts = await getInitialPosts();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">게시글</h1>
      <PostList initialPosts={initialPosts} />
      <Link
        href="/add/post"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
