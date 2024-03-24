"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { followUnfollow } from "@/lib/actions/user.actions";
import { useOptimistic } from "react";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  personType: string;
  currentUser?: any;
  following?: boolean;
}

const UserCard = ({
  id,
  name,
  username,
  imageUrl,
  personType,
  currentUser,
  following,
}: Props) => {
  const [optimisticFollowState, addOptimisticFollowState] = useOptimistic(
    following,
    (following, newLState: boolean) => newLState
  );

  const handleFollowUnfollow = async () => {
    addOptimisticFollowState(!optimisticFollowState);
    await followUnfollow(id, currentUser, following);
  };
  console.log("currentUser", following);
  const router = useRouter();
  return (
    <article className="user-card">
      <Link href={`/profile/${id}`} className="user-card_avatar">
        <Image
          src={imageUrl}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </Link>
      <Button
        className={`${!optimisticFollowState && "bg-primary-500"} followButton`}
        onClick={handleFollowUnfollow}
      >
        {optimisticFollowState ? "Following" : "Follow"}
      </Button>
    </article>
  );
};

export default UserCard;
