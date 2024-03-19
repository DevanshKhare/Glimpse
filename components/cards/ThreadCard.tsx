"use client";
import { deleteThread, likeUnlikeThread } from "@/lib/actions/thread.actions";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  liked: boolean;
  likes: number;
  media?: string;
}
const ThreadCard = ({
  id,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  liked,
  likes,
  media,
}: Props) => {
  const [lStatus, setLStatus] = useState(false);
  const { user } = useUser();

  const handleLike = async ({ id }: { id: string }) => {
    if (id && user?.id) {
      setLStatus(!lStatus);
      await likeUnlikeThread(id, user?.id);
    }
  };

  useEffect(() => {
    setLStatus(liked);
  }, [liked]);

  const handleDeleteThread = async () => {
    await deleteThread(id);
  };
  return (
    <div className="flex flex-col justify-between bg-dark-2 text-light-2 rounded-[2rem] mx-0 leading-6 p-[1rem]">
      <div className="flex gap-[1rem]">
        <div className="w-11 aspect-square rounded-full overflow-hidden h-11 ">
          <Image
            src={author?.image}
            alt="profile image"
            height={0}
            width={0}
            className="w-[100%] block"
            quality={100}
            unoptimized
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="">
          <h3>{user?.firstName}</h3>
          <small>Satna, 15 MINUTES AGO</small>
        </div>
      </div>
      {media && (
        <div className="rounded-[1rem] overflow-hidden mx-0 my-[0.7rem]">
          <Image
            src={media || ""}
            alt="media"
            className="w-[100%] block"
            width={0}
            height={0}
            quality={100}
            unoptimized
            decoding="async"
            loading="lazy"
            style={{ imageRendering: "optimizeQuality" }}
          />
        </div>
      )}
      <div className="flex justify-between items-center m-[0.6rem]">
        <div className="flex gap-3.5">
          <Image
            src={`/assets/heart-${liked || lStatus ? "filled" : "gray"}.svg`}
            alt="heart"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
            onClick={() => handleLike({ id: id })}
          />
          <Link href={`/thread/${id}`}>
            <Image
              src="/assets/reply.svg"
              alt="reply"
              width={24}
              height={24}
              className="cursor-pointer object-contain"
            />
          </Link>
          <Image
            src="/assets/repost.svg"
            alt="repost"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
          <Image
            src="/assets/share.svg"
            alt="share"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
          {/* bookmark icon pending*/}
        </div>
      </div>
      <div className="flex">
        <span className="w-[1.4rem] h-[1.4rem] block rounded-full overflow-hidden border-2 border-solid border-gray-1 ml-[-0.6rem]">
          <Image
            src={author.image}
            height={0}
            width={0}
            alt="icon"
            className="h-[1.4rem] w-[1.4rem] first:m-[0.1rem]"
            quality={100}
            unoptimized
            decoding="async"
            loading="lazy"
          />
        </span>
        <span className="w-[1.4rem] h-[1.4rem] block rounded-full overflow-hidden border-2 border-solid border-gray-1 ml-[-0.6rem]">
          <Image
            src={author.image}
            height={0}
            width={0}
            alt="icon"
            className="h-[1.4rem] w-[1.4rem] first:m-[0.1rem]"
            quality={100}
            unoptimized
            decoding="async"
            loading="lazy"
          />
        </span>

        <p className="ml-[0.5rem]">
          Liked by <b>Devansh</b> and <b>10 others</b>
        </p>
      </div>
      <div className="caption">
        <p>
          <b>Devansh </b>This section is for caption{" "}
          <span className="hash-tag">#Hashtag</span>
        </p>
      </div>
      <div className="comments text-gray-1">View all 277 comments</div>
    </div>
  );
};
export default ThreadCard;
