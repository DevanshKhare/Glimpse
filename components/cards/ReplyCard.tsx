"use client";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FaReplyd } from "react-icons/fa";
interface Props {
  replies: any;
}
const ReplyCard = ({ replies }: Props) => {

  return (
    <div className="mt-[2.5rem]">
      {replies?.map((reply: any) => (
        <div className="flex flex-col justify-between bg-dark-2 text-light-2 rounded-[2rem] mx-0 leading-6 p-[1rem] mb-[1rem]">
          <div>
            <h3>You replied {timeAgo(reply?.createdAt)}</h3>
            <div className="flex gap-1">
              <FaReplyd className="text-[1.5rem]" />
              <h3>{reply.text}</h3>
            </div>
          </div>
          <Link href={`/thread/${reply?.parentId?._id}`}>
          <div className="bg-dark-4 p-3 rounded-[2rem] mt-4">
            <div className="flex flex-row gap-[1rem] text-[1rem] ">
              <div className="w-11 aspect-square rounded-full overflow-hidden h-11 ">
                <Image
                  src={reply?.parentId?.author?.image}
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
                <h4>{reply?.author?.name}</h4>
                <small>{timeAgo(reply?.parentId?.createdAt)} </small>
              </div>
            </div>

            {reply?.parentId?.media && (
              <div className="rounded-[1rem] overflow-hidden mx-0 my-[0.7rem]">
                <Image
                  src={reply?.parentId?.media || ""}
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
            <div className="caption text-[0.9rem] mt-[0.8rem]">
              <p>
                <b>{reply?.parentId?.author?.name} </b>
                {reply?.parentId?.text}
              </p>
            </div>
          </div>
          </Link>
        </div>

      ))}
    </div>
  );
};
export default ReplyCard;
