import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SingleBlogInterface } from "@/types/Blog/Blog";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import truncate from "truncate-html";

const BlogCard = ({ blog }: { blog: SingleBlogInterface }) => {
  return (
    <Card
      key={blog.id}
      className="grid gap-y-2 cursor-pointer pb-0 text-black overflow-hidden max-h-[360px] rounded-md  pt-0 "
    >
      {blog?.blogCover ? (
        <div className="w-full ">
          <Link
            href={`/blog/${blog.id}`}
            target="_blank"
            className="transition-opacity duration-200 fade-in hover:opacity-70"
          >
            <Image
              src={blog?.blogCover}
              alt={blog.blogTitle}
              height={600}
              width={600}
              unoptimized={false}
              className="h-full w-full object-cover object-center"
            />
          </Link>
        </div>
      ) : (
        <div className="aspect-16/9 w-full">
          <div className="w-full h-full bg-gray-300 " />
        </div>
      )}
      <CardHeader className=" px-2 py-0">
        <h3 className="text-lg font-semibold capitalize hover:underline md:text-xl">
          <Link href={`/blog/${blog.id}`} target="_blank">
            {blog.blogTitle}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="px-2 py-0">
        <p
        className="text-sm"
          dangerouslySetInnerHTML={{
            __html: truncate(blog.blogDescription, 150, { ellipsis: "..." }),
          }}
        />
      </CardContent>
      <CardFooter className="pb-0">

      </CardFooter>
    </Card>
  );
};

export default BlogCard;
