"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-sm">이메일과 비밀번호로 가입하세요!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="userName"
          type="text"
          placeholder="유저명"
          // required
          // minLength={PASSWORD_MIN_LENGTH}
          // maxLength={10}
          errors={state?.fieldErrors.userName}
        />
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          // required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          // required
          // minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          // required
          // minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.confirmPassword}
        />
        <Button text="가입하기" />
      </form>
      <SocialLogin />
    </div>
  );
}
