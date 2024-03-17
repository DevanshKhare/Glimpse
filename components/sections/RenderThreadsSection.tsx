"use client";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { User } from "@clerk/nextjs/server";
import React, { useEffect, useState } from "react";
import ThreadCard from "../cards/ThreadCard";
import InfiniteScroll from "react-infinite-scroll-component";
interface Params {
  user: User | null;
}
const RenderThreadsSection = ({ user }: Params) => {
  const [threads, setThreads] = useState<Params[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState(0);

  const hasLikedThread = (threadLikes: string[]) => {
    if (user) {
      return threadLikes.includes(user?.id);
    }
    return false;
  };

  useEffect(() => {
    let didFetchNewThreads = false;

    (async () => {
      try {
        const { threads } = await fetchThreads(skip, 4);
        if (threads.length === 0) {
          setHasMore(false);
          return;
        }
        setThreads((prevItems) => [...prevItems, ...threads]);
        didFetchNewThreads = true;
      } catch (err) {
        console.error(err);
      }
    })();

    if (didFetchNewThreads) {
      setSkip((prevSkip) => prevSkip + 4);
    }
  }, [skip]);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      {threads?.length === 0 ? (
        <p className="no-result">No threads found</p>
      ) : (
        <>
          <InfiniteScroll
            dataLength={threads.length}
            next={() => setSkip((prevSkip) => prevSkip + 4)}
            hasMore={hasMore}
            loader={<h4 className="text-gray-1 text-center mt-2">Loading...</h4>}
            scrollThreshold={0.9}
            endMessage={
              <p className="text-gray-1 text-center mt-2">
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {threads?.map((thread: any) => (
              <section className="mt-9 flex flex-col">
                <ThreadCard
                  key={thread?._id}
                  id={thread?._id}
                  currentUserId={user?.id || ""}
                  parentId={thread?.parentId}
                  content={thread?.text}
                  author={thread?.author}
                  community={thread?.community}
                  createdAt={thread?.createdAt}
                  comments={thread?.children}
                  liked={hasLikedThread(thread.likes)}
                  likes={thread?.likes?.length}
                  media={thread?.media}
                />
              </section>
            ))}
          </InfiniteScroll>
        </>
      )}
    </>
  );
};

export default RenderThreadsSection;
