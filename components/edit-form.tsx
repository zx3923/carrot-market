"use client";

import Image from "next/image";
import Input from "./input";
import Button from "./button";
import { useState } from "react";
import { useFormState } from "react-dom";
import { getUploadUrl } from "@/app/add/post/actions";
import { editAction } from "@/app/products/[id]/edit/actions";

interface IEditProps {
  product: {
    id: number;
    title: string;
    photo: string;
    description: string;
    price: number;
  };
}

export default function EditForm({ product }: IEditProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [imageId, setImageId] = useState<string>("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) {
      return;
    }
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      return {
        error: "이미지 파일만 업로드 가능합니다.",
      };
    }

    const fileSizeInMb = file.size / (1024 * 1024);

    if (fileSizeInMb > 2) {
      return {
        error: "이미지의 크기가 2MB를 초과하는 이미지는 업로드 할 수 없습니다.",
      };
    }
    // 새로 선택된 이미지의 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreview(url);

    const { result, success } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };

  const interceptAction = async (prevState: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    console.log(await response.text());
    if (response.status !== 200) {
      return;
    }
    const photoUrl = `https://imagedelivery.net/ZP9kJzPJnmRlD3LZ99JLsg/${imageId}`;
    formData.set("photo", photoUrl);
    return editAction(prevState, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div>
      <form className="p-5 flex flex-col gap-5" action={action}>
        <div className="relative aspect-square w-full bg-contain">
          {preview ? (
            <label
              htmlFor="photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
              style={{
                backgroundImage: `url(${preview})`,
              }}
            />
          ) : (
            <Image
              src={`${product.photo}/public`}
              alt={product.title}
              fill
              className="object-cover rounded-md"
            />
          )}
        </div>

        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="mt-2"
        />
        <input type="hidden" name="id" value={product.id} />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
          defaultValue={product.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
          defaultValue={product.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
          defaultValue={product.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
