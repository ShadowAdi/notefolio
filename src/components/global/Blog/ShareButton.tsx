"use client";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { LinkedinShareButton, TwitterShareButton } from "react-share";
import { toast } from "sonner";

const ShareButton = ({ title }: { title: string }) => {
  const pathname = usePathname();
  const url = `http://localhost:3000${pathname}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center px-6 py-1 border border-gray-300">
          <span className="text-base text-gray-700">Share</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-stone-950 z-50 flex flex-col items-center justify-center rounded-md text-white overflow-hidden">
        <DropdownMenuItem

          onClick={() => {
            navigator.clipboard.writeText(url);
            toast.success("Link Copied");
          }}
          className="flex flex-row items-center w-full justify-center space-x-3 cursor-pointer px-5 py-2 focus:bg-stone-900 focus:text-white"
        >
          <Link className="text-white" /> Copy Link
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <LinkedinShareButton style={{width:"100%"}} url={url} title={title}>
            <div className="flex w-full px-5 py-2 justify-center items-center hover:bg-stone-900 focus:bg-stone-900 text-white">
              Share to LinkedIn
            </div>
          </LinkedinShareButton>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <TwitterShareButton  style={{width:"100%"}}  url={url} title={title}>
            <div className="flex w-full px-5 py-2 items-center justify-center hover:bg-stone-900 focus:bg-stone-900 text-white">
              Share to Twitter
            </div>
          </TwitterShareButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
