import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HomeNavbar = () => {
  return (
    <header className="bg-white w-full">
      <div className="mx-auto max-w-screen-xl flex flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-black cursor-pointer" href="/">
              <span className="text-black text-xl font-bold">Notefolio</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-5 flex-row">
          <Link
            href={"/write"}
            className=" bg-stone-800 hover:bg-stone-900 transition-all duration-500 px-6  py-1.5 
            text-xs font-medium text-white shadow-sm rounded-full"
          >
            Write
          </Link>
          <Button className=" bg-slate-50 hover:bg-slate-100 px-6  py-1.5 text-xs font-medium text-black shadow-sm rounded-full transition-all duration-500 !cursor-pointer">
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
