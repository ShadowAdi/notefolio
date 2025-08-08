import React, { ReactNode } from "react";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col flex-1 space-y-4 w-full min-h-screen h-full">{children}</main>
  );
};

export default HomeLayout;
