import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import SearchBar from "@/components/shared/SearchBar";
import ThreadsTabs from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
const Page = async ({searchParams}: {searchParams: {q: string}}) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: 1,
    pageSize: 25,
    sortBy: 'desc'
  })

  return (
    <section>
      <h1 className="head-text-mb-10">Search</h1>
      <SearchBar page="communities"/>
      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
            <p className="no-result">No communities</p>
        ):
        
        <>
            {result.communities.map((community:any)=>(
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
                />
            ))}
        </>
        }
      </div>
    </section>
  );
};

export default Page;
