"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { followUnfollow } from "@/lib/actions/user.actions";

interface Props {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  personType: string;
  currentUser?: any;
  following?: boolean;
}

const UserCard = ({ id, name, username, imageUrl, personType, currentUser, following }: Props) => {
const handleFollowUnfollow = async() => {
  await followUnfollow(id, currentUser, following);
}
  console.log("currentUser", following);
  const router = useRouter();
  return (
    <article className="user-card">
      <div className="user-card_avatar">
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
        <Button
          className="user-card_btn"
          onClick={() => {
            router.push(`/profile/${id}`);
          }}
        >
          view
        </Button>
          <Button
          className="user-card_btn"
          onClick={handleFollowUnfollow}
        >
          {following ? "Following" : "Follow"}
        </Button>
      </div>
    </article>
  );
};

export default UserCard;
