import db from "@/lib/db";
import { successLogin } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const checkUserName = async (userName: string) => {
  const user = await db.user.findUnique({
    where: {
      user_name: userName,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  // get email
  // const userEmailResponse = await fetch("https://api.github.com/user/emails", {
  //   headers: {
  //     Authorization: `Bearer ${access_token}`,
  //   },
  //   cache: "no-cache",
  // });
  // const emails = await userEmailResponse.json();
  const { id, avatar_url, login } = await userProfileResponse.json();
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await successLogin(user.id);
    // const session = await getSession();
    // session.id = user.id;
    // await session.save();
    return redirect("/profile");
  }
  const newUser = await db.user.create({
    data: {
      user_name: (await checkUserName(login)) ? `${login}-gh` : login, // 만약 깃허브 유저네임이 이미 있다면 -gh 처리
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  await successLogin(newUser.id);
  // const session = await getSession();
  // session.id = newUser.id;
  // await session.save();
  redirect("/profile");
}
