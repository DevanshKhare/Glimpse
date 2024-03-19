"use client";
import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  const user = useUser();
  return (
    <section className="h-max sticky top-[6.4rem] max-xl:hidden">
      <Link
        href="/"
        className="rounded-[1rem] flex items-center p-[1rem] gap-x-[1em] w-full bg-dark-2"
      >
        <div className="w-[2.7rem] aspect-square rounded-full overflow-hidden">
          <Image
            className="block w-full"
            alt="test"
            src="https://i.pinimg.com/280x280_RS/70/bd/dc/70bddcca951f099b28dfc499cdef0163.jpg"
            width={24}
            height={24}
          />
        </div>
        <div>
          <h4 className="text-light-1">{user?.user?.firstName}</h4>
          <p className="text-light-4 text-base-regular">
            {user?.user?.username}
          </p>
        </div>
      </Link>
      <div className="mt-[1rem] bg-dark-2 rounded-[1rem]">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          if (link.route === "/profile") link.route = `${link.route}/${userId}`;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={` flex items-center h-[4rem] cursor-pointer transition duration-300 all ease-in-out hover:bg-dark-1 ${isActive && "before:content[''] before:block before:w-[0.5rem] before:h-[4rem] before:absolute before:bg-primary-500 bg-dark-1  before:first:rounded-tl-[1rem] before:last:rounded-bl-[1rem]" }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
                className="ml-[2rem] relative mr-4"
              />
              <p
                className={`text-light-1 max-lg:hidden ${
                  isActive &&
                  "text-primary-500"
                }`}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
export default LeftSidebar;
