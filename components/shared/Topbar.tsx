import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";

function Topbar() {
  return (
    <nav className="w-full bg-dark-2 px-0 py-[0.7rem] fixed top-0 z-10 mb-[1rem]">
      <div className="w-4/5 my-0 mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/assets/logo.svg" alt="logo" height={28} width={28} />
          <p className="text-heading3-bold text-light-1 hidden md:block">
            Threads
          </p>
        </Link>

        <SearchBar page="search" />
        <div className="flex items-center gap-[2rem]">
          <div className="hidden md:flex gap-[2rem] items-center">
            <OrganizationSwitcher appearance={{
              baseTheme: dark
            }}/>
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
