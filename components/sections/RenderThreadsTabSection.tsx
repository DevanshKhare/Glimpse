
import { User } from "@clerk/nextjs/server";
import { fetchUserThreads } from "@/lib/actions/user.actions";;
import ThreadCardv2 from "../cards/ThreadCardv2";

interface Params {
  user: User | null;
  userInfo: any;
}

const RenderThreadsTabSection = async({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {

  const hasLikedThread = (threadLikes: string[]) => {
    if (userId) {
      return threadLikes.includes(userId);
    }
    return false;
  };
        const result = await fetchUserThreads(accountId, 0, 100);
        const threads = result.threads;
        const user = { name: result.name, image: result.image, id: result.id };
      
  return (
    <>
        <section className="mt-9 flex flex-col gap-5">
          {threads.map((thread: any) => (
            <ThreadCardv2
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
              section="profile"
              loggedInId={userId}
              profileId={accountId}
              likesArray={thread?.likes}
            />
          ))}
        </section>
    </>
  );
};

export default RenderThreadsTabSection;
