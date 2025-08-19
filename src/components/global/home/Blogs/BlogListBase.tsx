"use client";
import withAuth from "@/protected/withAuth";
import React from "react";
import BlogCard from "../../Blog/BlogCard";
import { SingleBlogInterface } from "@/types/Blog/Blog";
const BlogListBase = ({ data }: { data: SingleBlogInterface[] }) => {
  return (
    <section className="w-full flex-1 h-full py-4 max-w-7xl grid  md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8  px-5">
      {data &&
        data?.length > 0 &&
        data.map((d, i) => <BlogCard blog={d} key={i} />)}
    </section>
  );
};

export default withAuth(BlogListBase);
