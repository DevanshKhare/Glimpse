"use client";
import {
  deleteThread,
  getFirstLikedUserDetails,
  likeUnlikeThread,
} from "@/lib/actions/thread.actions";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchUserImages, setBookmark } from "@/lib/actions/user.actions";
import { CiBookmark } from "react-icons/ci";
import { CiBookmarkRemove } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { useOptimistic } from 'react';

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
  firstLiked: string;
  section?: string;
  loggedInId?: string;
  profileId?: string;
  likesArray?: string[];
  bookmarked?: boolean;
}
const ThreadCardv2 = ({
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
  firstLiked,
  section,
  loggedInId,
  profileId,
  likesArray,
  bookmarked,
}: Props) => {
  const [lStatus, setLStatus] = useState(liked);
  const { user } = useUser();
  const [firstLikedName, setFirstLikedName] = useState("");
  const pathname = usePathname();
  const [likedImages, setLikedImages] = useState<string[]>([]);

  const [optimisticLiked, addOptimisticLiked] = useOptimistic(
    liked,
    (liked, newLState: boolean) => newLState
  );

  const [optimisticBookmark, addOptimisticBookMark] = useOptimistic(
    bookmarked,
    (bookmarked, newLState: boolean) => newLState
  );

  const handleLike = async ({ id }: { id: string }) => {
    addOptimisticLiked(!lStatus);
    if (id && user?.id) {
      await likeUnlikeThread(id, user?.id, liked, pathname);
    }
  };

//   useEffect(() => {
//       (async () => {
//       if (likesArray?.length) {
//         const images = await fetchUserImages(likesArray);
//         if (images?.length) {
//           setLikedImages(images);
//         }
//       }
//     })();
//   }, [lStatus]);

  useEffect(() => {
    (async () => {
      const firstLikedUser = await getFirstLikedUserDetails(firstLiked);
      setFirstLikedName(firstLikedUser?.name);
    })();
  }, [firstLiked]);

  useEffect(() => {
    setLStatus(liked);
  }, [liked]);

  const handleDeleteThread = async () => {
    await deleteThread(id, pathname);
  };

  const handleBookmark = async () => {
    addOptimisticBookMark(!bookmarked)
    await setBookmark(id, user?.id, bookmarked, pathname);
  };

  return (
    <div className={`flex flex-col justify-between bg-dark-2 text-light-2 rounded-[2rem] mx-0 leading-6 p-[1rem] ${isComment && "mb-5 ml-[3rem]"}`}>
      <div className="flex flex-row gap-[1rem]">
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
        <div>
          <h3>{author?.name}</h3>
          <small>{timeAgo(createdAt)} {community && ` - ${community.name} Community`}</small>
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
          />
        </div>
      )}
      <div className="flex justify-between items-center m-[0.6rem]">
        <div className="flex gap-3.5">
          <Image
            src={`/assets/heart-${optimisticLiked ? "filled" : "gray"}.svg`}
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
        </div>
        {section != "profile" && !isComment &&
          (!optimisticBookmark ? (
            <CiBookmark
              style={{ fontSize: "1.3rem" }}
              className="cursor-pointer"
              onClick={handleBookmark}
            />
          ) : (
            <CiBookmarkRemove
              style={{ fontSize: "1.3rem" }}
              className="cursor-pointer"
              onClick={handleBookmark}
            />
          ))}
        {section === "profile" && loggedInId === profileId && (
          <Image
            src="/assets/delete.svg"
            alt="delete"
            width={18}
            height={18}
            className="cursor-pointer object-contain justfy-self-start"
            onClick={handleDeleteThread}
          />
        )}
      </div>
      <div className="flex">
        {/* {likedImages.map((url) => (
          <span className="w-[1.4rem] h-[1.4rem] block rounded-full overflow-hidden border-2 border-solid border-gray-1 ml-[-0.6rem]">
            <Image
              src={url}
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
        ))} */}

        {likes > 0 && !isComment && (
          <p className="ml-[0.5rem]">
            Liked by <b>{firstLikedName}</b>{" "}
            {likes > 1 && (
              <>
                <span>and&nbsp;</span>
                <b>{likes - 1} others</b>
              </>
            )}
          </p>
        )}
      </div>
      <div className="caption">
        <p>
          <b>{author?.name} </b>
          {content} {/* <span className="hash-tag">#Hashtag</span> */}
        </p>
      </div>
      {comments.length > 0 && (
        <div className="comments text-gray-1">
          View {comments.length > 1 && "all"} {comments.length} comments
        </div>
      )}
    </div>
  );
};
export default ThreadCardv2;
