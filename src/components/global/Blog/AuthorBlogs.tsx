import { AuthorBlogInterface } from "@/types/Blog/AuthorBlog";
import axios from "axios";
import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthorBlogs = async ({ blogId }: { blogId: string }) => {
  const response = await axios.get(
    `http://localhost:3000/api/blog/${blogId}/author`
  );
  const data: AuthorBlogInterface = await response.data;
  if (!data.success) {
    throw new Error(`Failed to get the author blogs: ${data.error}`);
  }

  if (data.authorBlogs.length<=0) {
    return
  }

  return (
    <div className="flex flex-col space-y-4  w-full items-start">
      <h2 className="text-[28px] font-bold line-clamp-1">More By Author</h2>
      <div className="flex flex-col space-y-2 w-full ">
        {data.authorBlogs.map((authorBlog) => (
          <Link href={`/blog/${authorBlog.id}`} key={authorBlog.id}>
            <div className="flex flex-col py-0    space-y-1 min-h-[100px] justify-between ">
              <div className="relative  flex-1  h-full overflow-hidden rounded-md ">
                <Image
                  src={authorBlog.blogCover}
                  className="h-full w-full object-cover max-h-[80px]"
                  alt="caption"
                  height={80}
                  width={100}
                />
              </div>
              <div className="flex-1 space-y-1  h-full w-full ">
                <h1 className="text-base line-clamp-2 font-semibold">
                  {authorBlog.blogTitle}
                </h1>
                <div className="flex flex-row flex-wrap space-x-4 ">
                  <div
                    className="flex items-center space-x-1 cursor-default"
                    aria-label="Upvote"
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span>{authorBlog.upvotes}</span>
                  </div>
                  <div
                    className="flex items-center space-x-1 cursor-default"
                    aria-label="Downvote"
                  >
                    <ArrowDown className="w-4 h-4" />
                    <span>{authorBlog.downvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuthorBlogs;
