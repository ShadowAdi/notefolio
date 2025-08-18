import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SingleBlogInterface } from "@/types/Blog/Blog";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import truncate from "truncate-html";

const tagColors = [
  "bg-blue-500 hover:bg-blue-600",
  "bg-green-500 hover:bg-green-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-red-500 hover:bg-red-600",
  "bg-yellow-500 hover:bg-yellow-600",
  "bg-teal-500 hover:bg-teal-600",
];

const BlogCard = ({ blog }: { blog: SingleBlogInterface }) => {
  return (
    <Link href={`/blog/${blog.id}`}>
      <Card
        key={blog.id}
        className="group relative grid gap-y-2 cursor-pointer text-gray-800 
             overflow-hidden rounded-md shadow-md pt-0 hover:shadow-lg 
             transition-shadow duration-300 bg-white hover:bg-gray-50 h-[440px]  min-h-[440px] max-h-[440px]"
      >
        {blog?.blogCover ? (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={blog?.blogCover}
              alt={blog.blogTitle}
              height={400}
              width={600}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video w-full h-48">
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          </div>
        )}
        <CardHeader className="px-4 py-2">
          <h3 className="text-xl font-bold capitalize transition-colors duration-200 line-clamp-2">
            {blog.blogTitle}
          </h3>
        </CardHeader>

        <CardContent className="px-4 py-1">
          <p
            className="text-sm text-gray-600 leading-relaxed line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: truncate(blog.blogDescription, 120, { ellipsis: "..." }),
            }}
          />
        </CardContent>
        <CardFooter className="px-4 pt-1 pb-4 flex flex-wrap items-center gap-2 mt-auto">
          {blog?.tags?.slice(0, 3).map((tag, i) => (
            <Badge
              key={i}
              className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                tagColors[i % tagColors.length]
              } transition-colors duration-200`}
            >
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
