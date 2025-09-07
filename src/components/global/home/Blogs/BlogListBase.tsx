"use client";
import withAuth from "@/protected/withAuth";
import React from "react";
import BlogCard from "../../Blog/BlogCard";
import { SingleBlogInterface } from "@/types/Blog/Blog";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const BlogListBase = ({
  data,
  isSaved,
}: {
  data: SingleBlogInterface[];
  isSaved?: boolean;
}) => {
  if (!data || data.length === 0 && !isSaved ) {
    return (
      <section className="w-full flex-1 h-full py-4 max-w-xl grid items-center justify-center px-5">
      <Link href={"/write"}>
          <Card className="flex items-center justify-center border-2 border-dashed border-gray-400 h-60 rounded-2xl shadow-sm cursor-pointer w-[400px]">
            <p className="text-gray-500 text-lg font-medium">✍️ Write a Blog</p>
          </Card>
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full flex-1 h-full py-4 max-w-xl grid items-center justify-center grid-cols-1 gap-8 px-5">
      {data.map((d, i) => (
        <BlogCard blog={d} key={d.id ?? i} />
      ))}
    </section>
  );
};

export default withAuth(BlogListBase);
