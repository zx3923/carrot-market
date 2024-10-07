"use client";

import { InitialPosts } from "@/app/(tabs)/life/page";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { getMorePosts } from "@/app/(tabs)/life/actions";

interface PostListProps {
  initialPosts: InitialPosts;
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newPosts = await getMorePosts(page + 1);
          if (newPosts.length !== 0) {
            setPosts((prev) => [...prev, ...newPosts]);
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      // trigger가 null 이 아닐때
      observer.observe(trigger.current);
    }
    return () => {
      //Cleanup
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="mt-4 mb-56 flex flex-col">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0"
        >
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "더보기"}
        </span>
      ) : null}
    </div>
  );
}
