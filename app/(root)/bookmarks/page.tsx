import BookmarkThreadCard from "@/components/cards/BookmarkThreadCard";
import { getBookmarkedThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const threads = await getBookmarkedThreads(userInfo?._id);

  const hasLikedThread = (threadLikes: string[]) => {
    return user && threadLikes.includes(user?.id);
  };
  const isBookmarked = (bookmarks: string[]) => {
    return user && bookmarks.includes(user?.id);
  };

  return (
    <div>
      {threads?.map((thread: any, index:any) => (
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
            bookmarked={isBookmarked(thread?.bookmarks)}
          />
        </section>
      ))}
    </div>
  );
};

export default Page;
