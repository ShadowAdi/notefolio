import Image from "next/image";
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface BlogHeader {
  blogTitle: string;
  profileUrl: string | null;
  username: string;
  createdAt: string;
}

const BlogHeader = ({
  blogTitle,
  profileUrl,
  username,
  createdAt,
}: BlogHeader) => {
  return (
    <div className="flex flex-col space-y-5 w-full items-start">
      <h1 className="text-4xl capitalize font-bold text-gray-900">
        {blogTitle}
      </h1>
      <div className="flex items-center justify-between gap-4  w-full">
        <div className="flex items-center  space-x-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={username}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-gray-300 flex items-center justify-center
             text-gray-600 text-lg"
              >
                {username ? username[0].toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {username || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(createdAt), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
        <Button className="px-6 py-4 bg-transparent rounded-full !cursor-pointer hover:bg-transparent hover:shadow-md border-black border flex items-center justify-center">
          <span className="text-base text-black">Follow</span>
        </Button>
      </div>
    </div>
  );
};

export default BlogHeader;
