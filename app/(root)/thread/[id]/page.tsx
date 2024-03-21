import ThreadCard from "@/components/cards/ThreadCard";
import ThreadCardv2 from "@/components/cards/ThreadCardv2";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser, getBookmarked } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  const hasLikedThread = (threadLikes: string[]) => {
    return user && threadLikes.includes(user?.id);
  };
    const response = await getBookmarked(userInfo?._id)
  const bookmarks = response.map((ele: any)=>ele._id)
    const isBookmarked = (threadID: string) => {
    return user && bookmarks.includes(threadID);
  };

  return (
    <section className="relative">
      <div>
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
          firstLiked={thread?.likes[0]}
          bookmarked={isBookmarked(thread?._id)}

        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread?._id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {thread?.children?.map((childItem: any) => (
          <ThreadCardv2
            key={childItem?._id}
            id={childItem?._id}
            currentUserId={childItem?.id || ""}
            parentId={childItem?.parentId}
            content={childItem?.text}
            author={childItem?.author}
            community={childItem?.community}
            createdAt={childItem?.createdAt}
            comments={childItem?.children}
            isComment
            liked={hasLikedThread(childItem?.likes)}
            likes={childItem?.likes?.length}
            firstLiked={thread?.likes[0]}
            bookmarked={isBookmarked(thread?._id)}
          />
        ))}
      </div>
    </section>
  );
};
export default Page;