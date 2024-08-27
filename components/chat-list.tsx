"use server";

import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";

type ChatRoomWithMessagesUser = Prisma.ChatRoomGetPayload<{
  include: {
    messages: true;
    users: true;
  };
}>;

interface IChatListProps {
  chat: ChatRoomWithMessagesUser;
}

export async function ChatList({ chat }: IChatListProps) {
  const session = await getSession();
  if (!session.id) return notFound();
  return (
    <Link href={`chats/${chat.id}`} className="text-white">
      <div className="w-full h-24 rounded-xl flex items-center px-2 space-x-4 hover:bg-neutral-700 active:bg-neutral-600">
        <div className="rounded-full w-16 h-16 border relative overflow-hidden">
          {chat.users[0].avatar ? (
            <Image
              src={`${chat.users[0].avatar}/avatar`}
              alt={chat.users[0].user_name}
              fill
              className="object-cover"
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div className="flex justify-between chat-box">
          <div className="flex flex-col overflow-hidden">
            <span className="text-lg">
              {chat.users
                .filter((user) => {
                  return user.id !== session.id;
                })
                .map((user) => {
                  return user.user_name;
                })
                .join(", ")}
            </span>
            <span className="text-neutral-200">
              {chat.messages.length === 0 ? "" : chat.messages[0].payload}
            </span>
          </div>
          <div className="flex justify-end flex-col items-end space-y-1">
            <div className="text-sm text-neutral-400">
              {chat.messages.length === 0
                ? ""
                : formatToTimeAgo(chat.messages[0].created_at.toISOString())}
            </div>
            {/* <div className="size-6 bg-orange-500 rounded-full flex justify-center items-center">
              <span className="font-light text-xs">12</span>
            </div> */}
          </div>
        </div>
      </div>
    </Link>
  );
}
