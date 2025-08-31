import BlogListBase from "@/components/global/home/Blogs/BlogListBase";
import axios from "axios";
import React from "react";

const Home = async () => {
  const response = await axios.get(`http://localhost:3000/api/blog`);
  const result = await response.data;
  const {data}=result

  return (
    <main className="flex flex-col gap-4 flex-1 items-center h-screen ">
      <BlogListBase data={data} key={"Blogs"} />
    </main>
  );
};

export default Home;
