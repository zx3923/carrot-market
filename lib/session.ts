import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "carrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function successLogin(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
