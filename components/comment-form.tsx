"use client";

import { addComment } from "@/app/posts/[id]/actions";
import { useFormState } from "react-dom";
import Button from "./button";
import { useState } from "react";

interface ICommentFormProps {
  id: number;
}

export default function CommentForm({ id }: ICommentFormProps) {
  const [comment, setComment] = useState("");
  const [state, action] = useFormState(addComment, null);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼의 기본 동작 방지

    // FormData 객체 생성
    const formData = new FormData(e.target as HTMLFormElement);

    await action(formData); // FormData를 action에 전달
    setComment(""); // 제출 후 textarea 비우기
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
      <textarea
        className="p-2 h-28 bg-transparent rounded-md w-full focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 pl-2"
        name="comment"
        placeholder="댓글"
        value={comment}
        onChange={handleInputChange}
      ></textarea>
      <input type="hidden" name="id" value={id} />
      <Button text="등록" width="20" />
    </form>
  );
}
