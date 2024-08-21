"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogIn } from "./actions";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, action] = useFormState(smsLogIn, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h1 className="text-2xl">휴대폰 번호로 가입해주세요.</h1>
        <h2 className="text-sm">
          당근은 휴대폰 번호로 가입해요. 번호는 안전하게 보관되며 어디에도 공개
          되지 않아요.
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="인증번호 입력"
            required
            min={100000}
            max={999999}
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="휴대폰 번호(-없이 숫자만 입력)"
            required
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? "문자 인증하기" : "인즌문자 받기"} />
      </form>
    </div>
  );
}
