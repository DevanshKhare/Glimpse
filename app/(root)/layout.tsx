import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Threads",
  desciption: "A Next.js 13 Meta Threads Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className="relative top-[6.4rem]">
            <div className="grid grid-cols-[18vw,auto,20vw] gap-x-[2rem] w-[80%] my-0 mx-auto">
              <LeftSidebar />
              <section>{children}</section>
              <RightSidebar />
            </div>
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
