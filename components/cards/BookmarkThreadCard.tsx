"use client"
import { likeUnlikeThread } from "@/lib/actions/thread.actions";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CiBookmark } from "react-icons/ci";
import { CiBookmarkRemove } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { setBookmark } from "@/lib/actions/user.actions";

interface Props {
  user?: any;
  id: string;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: string;
  liked: boolean;
  media?: string;
  bookmarked?: boolean;
}
const BookmarkThreadCard = ({
  user,
  id,
  content,
  author,
  createdAt,
  liked,
  media,
  bookmarked,
}: Props) => {

  const handleLike = async ({ id }: { id: string }) => {
    if (id && user?.id) {
      await likeUnlikeThread(id, user?.id, liked, pathname);
    }
  };
  const pathname = usePathname();


  const handleBookmark = async () => {
    await setBookmark(id, user?.id, bookmarked, pathname)
  }

  return (
    <div className="flex flex-col justify-between bg-dark-2 text-light-2 rounded-[2rem] mx-0 leading-6 p-[1rem]">
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
          <small>{timeAgo(createdAt)}</small>
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
            src={`/assets/heart-${liked ? "filled" : "gray"}.svg`}
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
        {!bookmarked ? (
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
        )}
      </div>
      <div className="caption">
        <p>
          <b>{user?.firstName} </b>
          {content} {/* <span className="hash-tag">#Hashtag</span> */}
        </p>
      </div>
    </div>
  );
};
export default BookmarkThreadCard;
