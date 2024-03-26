import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserCard from "../cards/UserCard";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 5,
    sortBy: 'desc',
    suggested: true
  })

  const handleIsFollowing = (id: string) => {
    return userInfo.following.includes(id)
  }

  return (
    <section className="custom-scollbar rightsidebar top-[6.4rem]">
      {/* <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
      </div> */}
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        {result.users.map((person: any) => (
          <div className="my-[0.6rem]">
            <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imageUrl={person.image}
              personType="User"
              currentUser={userInfo._id}
              following={handleIsFollowing(person.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
export default RightSidebar;
