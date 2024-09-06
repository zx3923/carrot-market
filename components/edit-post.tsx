"use client";

import { useFormState } from "react-dom";
import Button from "./button";
import Input from "./input";
import { uploadPost } from "@/app/add/post/actions";

interface IEditPostProps {
  post: {
    title: string;
    description: string | null;
  };
}

export default function EditPost({ post }: IEditPostProps) {
  const [state, action] = useFormState(uploadPost, null);
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <Input
          name="title"
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
          defaultValue={post.title}
        />
        <div>
          <textarea
            name="description"
            placeholder="내용"
            defaultValue={post.description ?? ""}
            className="p-2 h-80 bg-transparent rounded-md w-full focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 pl-2"
          />
          <span className="text-red-500 font-medium">
            {state?.fieldErrors.description}
          </span>
        </div>
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
