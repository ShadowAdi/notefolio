import HomeNavbar from "@/components/global/home/HomeNavbar";
import { WriteContextProvider } from "@/context/WriteBlogContext";
import React, { ReactNode } from "react";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col flex-1 gap-4 w-full min-h-screen h-full">
      <WriteContextProvider>
        <HomeNavbar />
        {children}
      </WriteContextProvider>
    </main>
  );
};

export default HomeLayout;
