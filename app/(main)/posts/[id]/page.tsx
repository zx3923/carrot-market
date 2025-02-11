import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import LikeButton from "@/components/like-btn";
import Link from "next/link";
import DeletePosts from "@/components/delete-posts";
import CommentForm from "@/components/comment-form";
import DeleteComment from "@/components/delete-comment";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            user_name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

async function getComment(id: number) {
  const comment = await db.comment.findMany({
    where: {
      postId: id,
    },
    include: {
      user: {
        select: {
          avatar: true,
          user_name: true,
        },
      },
    },
  });

  return comment;
}

const getCachedComment = nextCache(getComment, ["comment"], {
  tags: ["comment"],
});

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});
async function getLikeStatus(postId: number, userId: number) {
  // const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}
async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  const comment = await getCachedComment(id);

  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  const session = await getSession();
  const isOwner = session.id === post.userId;
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        {post.user.avatar ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={`${post.user.avatar}/avatar`}
            alt={post.user.user_name}
          />
        ) : (
          <UserIcon className="size-7" />
        )}
        <div>
          <span className="text-sm font-semibold">{post.user.user_name}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <div className="flex justify-between w-full">
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
          {isOwner ? (
            <div className="flex gap-4 text-orange-500 ">
              <Link
                href={`/posts/${post.id}/edit`}
                className="hover:text-white flex items-center"
              >
                수정
              </Link>
              <DeletePosts id={id} />
            </div>
          ) : null}
        </div>
        <div className="w-full">
          {comment.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-neutral-500 mb-4 pb-4"
            >
              <div>
                <div className="flex mb-2">
                  <div className="size-5 relative rounded-full overflow-hidden mb-2">
                    {item.user.avatar ? (
                      <Image
                        fill
                        src={`${item.user.avatar}/avatar`}
                        alt={item.user.user_name}
                        className="object-contain"
                      />
                    ) : (
                      <UserIcon className="size-5" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold ml-2">
                    {item.user.user_name}
                  </h3>
                </div>
                <span className="text-xs font-semibold">{item.payload}</span>
              </div>
              <div>
                {session.id === item.userId ? (
                  <DeleteComment id={item.id} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <CommentForm id={id} />
      </div>
    </div>
  );
}
