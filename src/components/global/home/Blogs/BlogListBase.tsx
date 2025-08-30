"use client";
import withAuth from "@/protected/withAuth";
import React from "react";
import BlogCard from "../../Blog/BlogCard";
import { SingleBlogInterface } from "@/types/Blog/Blog";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const BlogListBase = ({ data }: { data: SingleBlogInterface[] }) => {
  return (
    <section className="w-full flex-1 h-full py-4 max-w-6xl grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 px-5">
      {data && data.length > 0 ? (
        data.map((d, i) => <BlogCard blog={d} key={i} />)
      ) : (
        <Link href={"/write"}>
          <Card className="flex items-center justify-center border-2 border-dashed border-gray-400 h-60 rounded-2xl shadow-sm cursor-pointer">
            <p className="text-gray-500 text-lg font-medium">✍️ Write a Blog</p>
          </Card>
        </Link>
      )}
    </section>
  );
};

export default withAuth(BlogListBase);
