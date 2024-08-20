"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";

const formSchema = z
  .object({
    userName: z
      .string()
      .min(1, "유저명은 필수 입니다")
      .min(4, "4글자 이상으로 해주세요"),
    email: z
      .string()
      .email({
        message: "올바른 이메일 주소를 입력해주세요.",
      })
      .toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 6자 이상으로 해주세요")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 6자 이상으로 해주세요"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 같지 않습니다",
        path: ["confirmPassword"],
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    userName: formData.get("userName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
