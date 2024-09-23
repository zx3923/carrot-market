"use client";

import { deleteProduct } from "@/app/add/product/actions";

interface DeleteBtnProps {
  id: number;
}

export default function DeleteBtn({ id }: DeleteBtnProps) {
  return (
    <>
      <button
        className="text-lg p-2.5 bg-red-500 rounded-md text-white font-medium hover:bg-red-400 transition-colors"
        onClick={() => deleteProduct(id)}
      >
        삭제하기
      </button>
    </>
  );
}
