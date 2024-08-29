"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
  width?: string;
}

export default function Button({ text, width }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={`primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed ${
        width ? `w-${width}` : "w-full"
      }`}
    >
      {pending ? "로딩 중" : text}
    </button>
  );
}
