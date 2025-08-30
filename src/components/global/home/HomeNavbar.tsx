"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import PublishModal from "./write/PublishModal";
import PublishEditModal from "../Blog/Edit/PublishEditModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const HomeNavbar = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="bg-white py-3 w-full">
      <div className="mx-auto max-w-[90%] flex flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-black cursor-pointer" href="/">
              <span className="text-black text-2xl font-bold">Notefolio</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-5 flex-row">
          {pathname?.includes("/write") ? (
            <PublishModal />
          ) : pathname.includes("/edit") ? (
            <PublishEditModal />
          ) : (
            <Link
              href={"/write"}
              className=" bg-stone-800 hover:bg-stone-900 transition-all duration-500 px-6  py-1.5 
            text-base font-medium text-white shadow-sm rounded-full"
            >
              Write
            </Link>
          )}

          {loading ? (
            <Badge
              className=" bg-stone-800 hover:bg-stone-900 transition-all duration-500 px-6  py-1.5 
            text-base font-medium text-white shadow-sm rounded-full"
            >
              Loading...
            </Badge>
          ) : (
            isAuthenticated &&
            user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Link
                    href={"/profile"}
                    className="relative w-10 h-10 rounded-full overflow-hidden"
                  >
                    {user.profileUrl ? (
                      <img
                        src={user.profileUrl}
                        alt={user.profileUrl}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg">
                        {user.username ? user.username[0].toUpperCase() : "U"}
                      </div>
                    )}
                  </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      router.push("/profile");
                    }}
                  >
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
