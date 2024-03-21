import SingleLineThreadCreatev2 from "@/components/forms/SingleLineThreadCreatev2";
import ThreadsSectionNew from "@/components/sections/ThreadsSectionNew";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if(!user) return null;
  const userInfo = await fetchUser(user?.id || "");
  if (!userInfo?.onboarded) redirect("/onboarding");
  const { threads } = await fetchThreads(0, 4);

  return (
    <>
      {/* <RenderThreadsSection
        user={JSON.parse(JSON.stringify(user))}
        userInfo={userInfo}
      /> */}
      <SingleLineThreadCreatev2
        userId={userInfo?._id}
        user={JSON.parse(JSON.stringify(user))}
        userInfo={userInfo}
      />
      <ThreadsSectionNew
        user={JSON.parse(JSON.stringify(user))}
        userInfo={userInfo}
        initialThreads={threads}
      />
    </>
  );
}
