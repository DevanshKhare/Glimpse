import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  threads: any;
  user: any;
}
const ThreadsTabs = async ({
  currentUserId,
  accountId,
  accountType,
  threads,
  user
}: Props) => {
  // if(accountType==="Community"){
  //   result = await fetchCommunityPosts(accountId);
  // }else{
  //   result = await fetchUserThreads(accountId);
  // }
  // if (!result) redirect("/");

  const hasLikedThread = (threadLikes: string[]) =>{
    if(currentUserId){
      return threadLikes.includes(currentUserId)
    }
    return false;
  }
  return (
    <section className="mt-9 flex flex-col gap-5">
      {threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId || ""}
          parentId={thread?.parentId}
          content={thread?.text}
          author={
            accountType === "User"
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
  );
};
export default ThreadsTabs;
