import { User } from "@clerk/nextjs/server";
import SingleLineThreadCreatev2 from "../forms/SingleLineThreadCreatev2";
import { fetchThreads } from "@/lib/actions/thread.actions";
import ThreadCardv2 from "../cards/ThreadCardv2";
import { getBookmarked } from "@/lib/actions/user.actions";
interface Params {
  user: User | null;
  userInfo: any;
}
const ThreadsSectionWithoutLazy = async ({ user, userInfo }: Params) => {
  const { threads } = await fetchThreads(0, 10);
  const hasLikedThread = (threadLikes: string[]) => {
    return user && threadLikes.includes(user?.id);
  };

  const isBookmarked = (threadId: string) => {
    return user && userInfo?.bookmarked?.includes(threadId);
  };
  return (
    <>
      <SingleLineThreadCreatev2
        userId={userInfo?._id}
        user={JSON.parse(JSON.stringify(user))}
        userInfo={userInfo}
      />
      {threads?.map((thread: any, index) => (
        <section className={`${index != 0 && "mt-[1rem]"} flex flex-col`}>
          <ThreadCardv2
            key={thread?._id}
            id={thread?._id}
            currentUserId={user?.id || ""}
            parentId={thread?.parentId}
            content={thread?.text}
            author={thread?.author}
            community={thread?.community}
            createdAt={thread?.createdAt}
            comments={thread?.children}
            liked={hasLikedThread(thread?.likes)}
            likes={thread?.likes?.length}
            media={thread?.media}
            firstLiked={thread?.likes[0]}
            likesArray={thread?.likes}
            bookmarked={isBookmarked(thread?._id)}
          />
        </section>
      ))}
    </>
  );
};

export default ThreadsSectionWithoutLazy;
