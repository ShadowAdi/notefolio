import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col flex-1 space-y-4 w-full min-h-screen h-full">{children}</main>
  );
};

export default AuthLayout;
