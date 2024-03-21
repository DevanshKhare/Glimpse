import BookmarkThreadCard from "@/components/cards/BookmarkThreadCard";
import { fetchUser, getBookmarked } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const response = await getBookmarked(userInfo?._id)
  const bookmarks = response.map((ele: any)=>ele._id)

  const hasLikedThread = (threadLikes: string[]) => {
    return user && threadLikes.includes(user?.id);
  };
  const isBookmarked = (threadID: string) => {
    return user && bookmarks.includes(threadID);
  };

  return (
    <div>
      {response?.map((thread: any, index:any) => (
        <section className={`${index != 0 && "mt-[1rem]"} flex flex-col`}>
          <BookmarkThreadCard
            user={JSON.parse(JSON.stringify(user))}
            key={thread?._id}
            id={thread?._id}
            content={thread?.text}
            author={thread?.author}
            createdAt={thread?.createdAt}
            liked={hasLikedThread(thread?.likes)}
            media={thread?.media}
            bookmarked={isBookmarked(thread?._id)}
          />
        </section>
      ))}
    </div>
  );
};

export default Page;
