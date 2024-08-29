"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";

const userNameSchema = z
  .object({
    userName: z
      .string()
      .min(1, "유저명은 필수 입니다")
      .min(4, "4글자 이상으로 해주세요")
      .toLowerCase()
      .trim(),
  })
  .superRefine(async ({ userName }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        user_name: userName,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이름입니다.",
        path: ["userName"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

const emailSchema = z
  .object({
    email: z
      .string()
      .email({
        message: "올바른 이메일 주소를 입력해주세요.",
      })
      .toLowerCase(),
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이메일 입니다",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 6자 이상으로 해주세요")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 6자 이상으로 해주세요"),
  })
  .refine(checkPasswords, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export async function updateUserName(prevState: any, formData: FormData) {
  const data = {
    userName: formData.get("userName"),
  };
  const result = await userNameSchema.spa(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const updateUser = await db.user.update({
        where: {
          id: session.id,
        },
        data: {
          user_name: result.data.userName,
        },
        select: {
          id: true,
        },
      });

      redirect("/profile");
    }
  }
}
export async function updateEmail(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
  };
  const result = await emailSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const updateUser = await db.user.update({
        where: {
          id: session.id,
        },
        data: {
          email: result.data.email,
        },
        select: {
          id: true,
        },
      });

      redirect("/profile");
    }
  }
}

export async function updatePassword(prevState: any, formData: FormData) {
  const data = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = await passwordSchema.spa(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const hashedPassword = await bcrypt.hash(result.data.password, 12);
      const updateUser = await db.user.update({
        where: {
          id: session.id,
        },
        data: {
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });

      redirect("/profile");
    }
  }
}
