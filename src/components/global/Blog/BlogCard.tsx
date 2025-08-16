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
        className="group relative grid gap-y-2 cursor-pointer text-gray-800 overflow-hidden max-h-[420px] rounded-md shadow-md pt-0 hover:shadow-lg transition-shadow duration-300 bg-white hover:bg-gray-50"
      >
        {blog?.blogCover ? (
          <div className="w-full h-48 overflow-hidden">
            <Link
              href={`/blog/${blog.id}`}
              target="_blank"
              className="block transition-opacity duration-300 group-hover:opacity-80"
            >
              <Image
                src={blog?.blogCover}
                alt={blog.blogTitle}
                height={400}
                width={600}
                unoptimized={false}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>
        ) : (
          <div className="aspect-video w-full h-48">
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          </div>
        )}
        <CardHeader className="px-4 py-2">
          <h3 className="text-xl font-bold capitalize hover:underline decoration-blue-500 decoration-2 md:text-2xl transition-colors duration-200">
            <Link href={`/blog/${blog.id}`} target="_blank">
              {blog.blogTitle}
            </Link>
          </h3>
        </CardHeader>
        <CardContent className="px-4 py-1">
          <p
            className="text-sm text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: truncate(blog.blogDescription, 120, { ellipsis: "..." }),
            }}
          />
        </CardContent>
        <CardFooter className="px-4 pt-1 pb-4 flex flex-wrap items-center gap-2">
          {blog?.tags &&
            blog?.tags.length > 0 &&
            blog.tags.slice(0, 5).map((tag, i) => (
              <Badge
                key={i}
                className={`px-3 py-1 rounded-full text-white text-xs font-medium ${tagColors[i % tagColors.length]} transition-colors duration-200`}
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