"use client";
import React from "react";
import UserCard from "../cards/UserCard";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { fetchUsers } from "@/lib/actions/user.actions";
import Image from "next/image";

interface User {
  users: any;
  isNext: boolean;
}

const SearchSection = ({ id }: { id: string }) => {
  const [userData, setUserData] = useState<User[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    (async () => {
      const { users } = await fetchUsers({
        userId: id,
        searchString: searchString,
        pageNumber: 1,
        pageSize: 25,
        sortBy: "desc",
      });
      setUserData(users);
    })();
  }, [searchString]);

  const handleSearch = async (event: any) => {
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery.length > 0) setSearchActive(true);
    setSearchString(searchQuery);
  };

  return (
    <>
      <div className="searchbar">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        />
        <Input
          type="text"
          placeholder="Search"
          className="no-focus searchbar_input"
          onKeyUp={handleSearch}
        />
      </div>
      <div className="mt-14 flex flex-col gap-9">
        {userData.length === 0 || (searchActive && userData.length === 0) ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {userData.map((person: any) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imageUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default SearchSection;
