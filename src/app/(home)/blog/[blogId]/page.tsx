import axios from "axios";
import React from "react";

const Blog = async ({ params }: { params: { blogId: string } }) => {
  const response = await axios.get(
    `http://localhost:3000/api/blog/${params.blogId}`
  );
  if (response.status !== 200) {
    throw new Error(`Failed to get Blog`);
  }
  const data = await response.data;
  return <div>Blog Id: {params.blogId}</div>;
};

export default Blog;
