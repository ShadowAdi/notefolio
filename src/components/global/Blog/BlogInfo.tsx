import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React from "react";
import { FaComment } from "react-icons/fa";
import ShareButton from "./ShareButton";
import PlayButton from "./PlayButton";

const BlogInfo = ({
  blogTitle,
  blogDescription,
}: {
  blogTitle: string;
  blogDescription: string | null;
}) => {
  return (
    <div className="flex items-center justify-between w-full  border-t border-b border-t-gray-300 border-b-gray-300 py-3 ">
      <div className="flex items-center space-x-4 justify-between  ">
        <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-10 w-10 border border-gray-300">
          <ArrowBigUp className="text-base  text-gray-400 " />
        </div>
        <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-10 w-10 border border-gray-300">
          <ArrowBigDown className="text-base  text-gray-400 " />
        </div>
        <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center  h-10 w-10  border border-gray-300">
          <FaComment className="text-base  text-gray-400 " />
        </div>
      </div>
      <div className="flex items-center space-x-4 justify-between  ">
        <ShareButton title={blogTitle} />
        <PlayButton blogDescription={blogDescription!} />
      </div>
    </div>
  );
};

export default BlogInfo;
