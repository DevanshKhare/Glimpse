import { SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";

function Topbar() {
  return (
    <nav className="w-full bg-dark-2 px-0 py-[0.7rem] fixed top-0">
      <div className="w-4/5 my-0 mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/assets/logo.svg" alt="logo" height={28} width={28} />
          <p className="text-heading3-bold text-light-1 max-xs:hidden">
            Threads
          </p>
        </Link>

        <SearchBar page="search" />
        <div className="flex items-center gap-[2rem]">
          <div className="flex gap-[2rem] items-center ">
            <label className="bg-primary-500 py-[0.6rem] px-[2rem] rounded-[2rem] cursor-pointer">
              Create
            </label>
          </div>
          <div className="block ">
            <SignedIn>
              <UserButton
                appearance={{
                  baseTheme: dark,
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Topbar;
