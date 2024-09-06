"use client";

import { deletePosts } from "@/app/posts/[id]/edit/actions";

interface DeletePostsProps {
  id: number;
}

export default function DeletePosts({ id }: DeletePostsProps) {
  return (
    <>
      <button onClick={() => deletePosts(id)} className="hover:text-white">
        삭제
      </button>
    </>
  );
}
