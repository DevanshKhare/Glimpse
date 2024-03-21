"use client"
import { User } from "@clerk/nextjs/server";
import { fetchThreads } from "@/lib/actions/thread.actions";
import ThreadCardv2 from "../cards/ThreadCardv2";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer'

interface Params {
  user: User | null;
  userInfo: any;
  initialThreads: any; // corrected spelling of initialThreads
}

const ThreadsSectionNew = ({ user, userInfo, initialThreads }: Params) => {
  const [offset, setOffset] = useState(4);
  const [threads, setThreads] = useState(initialThreads);
  const { ref, inView } = useInView();

  const loadMoreThreads = async () => {
    const { threads: apiThreads } = await fetchThreads(offset, 4); // use offset
    setThreads([...threads, ...apiThreads]);
    setOffset(prevOffset => prevOffset + 4); // update offset
  }

  useEffect(() => {
    if (inView ) { // check threads length against offset
      loadMoreThreads();
    }
  }, [inView]); // added threads as dependency

  const hasLikedThread = (threadLikes: string[]) => {
    return user && threadLikes.includes(user.id);
  };

  const isBookmarked = (threadId: string) => {
    return user && userInfo?.bookmarked?.includes(threadId);
  };

  return (
    <>

      {threads.map((thread: any, index) => (
        <section key={thread._id} className={`${index !== 0 && "mt-[1rem]"} flex flex-col`}>
          <ThreadCardv2
            id={thread._id}
            currentUserId={user?.id || ""}
            parentId={thread.parentId}
            content={thread.text}
            author={thread.author}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            liked={hasLikedThread(thread.likes)}
            likes={thread.likes.length}
            media={thread.media}
            firstLiked={thread.likes[0]}
            likesArray={thread.likes}
            bookmarked={isBookmarked(thread._id)}
          />
        </section>
      ))}
      <div ref={ref} className="text-light-1">Load more</div>
    </>
  );
};

export default ThreadsSectionNew;
