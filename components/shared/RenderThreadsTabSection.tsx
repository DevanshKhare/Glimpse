"use client";
import { profileTabs } from "@/constants";
import { TabsContent } from "../ui/tabs";
import { useEffect, useState } from "react";
import { User } from "@clerk/nextjs/server";
import { fetchUserThreads } from "@/lib/actions/user.actions";
import InfiniteScroll from "react-infinite-scroll-component";
import ThreadCard from "../cards/ThreadCard";

interface Params {
  user: User | null;
  userInfo: any;
}

const RenderThreadsTabSection = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  const [threads, setThreads] = useState<Params[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [user, setUser] = useState({});
  const [skip, setSkip] = useState(0);

  const hasLikedThread = (threadLikes: string[]) => {
    if (userId) {
      return threadLikes.includes(userId);
    }
    return false;
  };

  useEffect(() => {
    let didFetchNewThreads = false;
    (async () => {
      try {
        const result = await fetchUserThreads(accountId, skip, 4);
        const threaddata = result.threads;
        setUser({ name: result.name, image: result.image, id: result.id });
        if (result.threads.length === 0) {
          setHasMore(false);
          return;
        }
        setThreads((prevItems) => [...prevItems, ...threaddata]);
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
        <section className="mt-9 flex flex-col gap-5">
          {threads.map((thread: any) => (
            <ThreadCard
              key={thread._id}
              id={thread._id}
              currentUserId={userId || ""}
              parentId={thread?.parentId}
              content={thread?.text}
              author={
                // accountType === "User"
                true
                  ? { name: user.name, image: user.image, id: user.id }
                  : {
                      name: thread.author.name,
                      image: thread.author.image,
                      id: thread.author.id,
                    }
              }
              community={thread?.community}
              createdAt={thread?.createdAt}
              comments={thread?.children}
              liked={hasLikedThread(thread?.likes)}
              likes={thread?.likes?.length}
              firstLiked={thread?.likes[0]}
              media={thread?.media}
            />
          ))}
        </section>
      </InfiniteScroll>
    </>
  );
};

export default RenderThreadsTabSection;
