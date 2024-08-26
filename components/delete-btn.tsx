"use client";

import { deleteProduct } from "@/app/add/post/actions";

interface DeleteBtnProps {
  id: number;
}

export default function DeleteBtn({ id }: DeleteBtnProps) {
  return (
    <>
      <button
        className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
        onClick={() => deleteProduct(id)}
      >
        Delete product
      </button>
    </>
  );
}
