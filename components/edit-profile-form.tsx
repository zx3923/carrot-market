"use client";

import { InitialUser } from "@/app/(tabs)/profile/edit/page";
import Input from "./input";
import TokenInput from "./token-input";
import Button from "./button";
import { useFormState } from "react-dom";
import { smsLogIn } from "@/app/(auth)/sms/actions";
import {
  updateEmail,
  updatePassword,
  updateUserName,
} from "@/app/(tabs)/profile/edit/actions";

interface EditProfileFormProps {
  initialUser: InitialUser;
}

const initialState = {
  token: false,
  error: undefined,
};

export default function EditProfileForm({ initialUser }: EditProfileFormProps) {
  const [userPhoneState, userPhoneAction] = useFormState(
    smsLogIn,
    initialState
  );
  const [nameState, nameAction] = useFormState(updateUserName, null);
  const [emailstate, emailAction] = useFormState(updateEmail, null);
  const [passwordState, passwordAction] = useFormState(updatePassword, null);
  return (
    <div className="mt-20 flex flex-col gap-4">
      <span>유저이름</span>
      <form action={nameAction} className="flex justify-between">
        <Input
          name="userName"
          defaultValue={initialUser.user_name}
          placeholder="유저명"
          errors={nameState?.fieldErrors.userName}
        />
        <Button text="저장" width="20" />
      </form>
      <span>이메일</span>
      <form action={emailAction} className="flex justify-between">
        <Input
          name="email"
          defaultValue={initialUser.email ? initialUser.email : ""}
          placeholder="이메일"
          errors={emailstate?.fieldErrors.email}
        />
        <Button text="저장" width="20" />
      </form>
      <span>비밀 번호</span>
      <form action={passwordAction} className="flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <Input
            name="password"
            type="password"
            placeholder="비밀번호"
            errors={passwordState?.fieldErrors.password}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            errors={passwordState?.fieldErrors.confirmPassword}
          />
        </div>
        <Button text="저장" width="20" />
      </form>
    </div>
  );
}
