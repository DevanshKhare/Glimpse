"use client"

import Image from "next/image"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"

const SearchBar = ({page}: {page: string}) => {
    const router = useRouter();
    const handleSearch = (event: any) => {
        const searchString = event?.target?.value || "";
        if(searchString) return router.push(`/${page}?q=${searchString}`)
        else return router.push(`/`)
    }
  return (
    <div className="searchbar">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        />
        <Input
          type="search"
          placeholder="Search"
          className="no-focus searchbar_input"
          onKeyUp={handleSearch}
        />
      </div>
  )
}

export default SearchBar