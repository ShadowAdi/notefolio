"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const Blog = () => {
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blogId");
  return <div>Blog Id: {blogId}</div>;
};

export default Blog;
