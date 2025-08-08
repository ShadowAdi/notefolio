import Link from "next/link";
import React from "react";

const HomeNavbar = () => {
  return (
    <header className="bg-white w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-black cursor-pointer" href="/">
              <span className="text-black text-xl font-bold">
                Notefolio
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
