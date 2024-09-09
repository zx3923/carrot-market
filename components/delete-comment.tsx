"use client";

import { deleteComment } from "@/app/posts/[id]/actions";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface DeleteCommentProps {
  id: number;
}

export default function DeleteComment({ id }: DeleteCommentProps) {
  return (
    <>
      <button onClick={() => deleteComment(id)} className="hover:text-white">
        <XMarkIcon className="size-5" />
      </button>
    </>
  );
}
