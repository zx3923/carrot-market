"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CloseBtn() {
  const router = useRouter();
  const onClickClose = () => {
    router.back();
  };
  return (
    <>
      <button
        className="absolute right-5 top-5 text-neutral-500 "
        onClick={onClickClose}
      >
        <XMarkIcon className="size-8 " />
      </button>
    </>
  );
}
