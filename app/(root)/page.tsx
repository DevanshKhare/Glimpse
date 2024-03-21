import ThreadsSectionWithoutLazy from "@/components/sections/ThreadsSectionWithoutLazy";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if(!user) return null;
  const userInfo = await fetchUser(user?.id || "");
  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <>
      {/* <RenderThreadsSection
        user={JSON.parse(JSON.stringify(user))}
        userInfo={userInfo}
      /> */}
      
      <ThreadsSectionWithoutLazy
        user={JSON.parse(JSON.stringify(user))}
        userInfo={userInfo}
      />
    </>
  );
}
