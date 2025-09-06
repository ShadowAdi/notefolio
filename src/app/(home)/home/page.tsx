import BlogListBase from "@/components/global/home/Blogs/BlogListBase";
import SearchComponent from "@/components/global/SearchComponent";
import axios from "axios";
import React from "react";

const Home = async ({
  searchParams,
}: {
  searchParams: { search?: string; limit?: string; page?: string,tags?:string };
}) => {
  const { limit, page, search,tags } = searchParams;
  const response = await axios.get(`http://localhost:3000/api/blog`, {
    params: {
      search,
      page,
      limit,
      tags
    },
  });
  const {data} =  response.data;

  return (
    <main className="flex flex-col gap-4 flex-1 items-center h-screen ">
      <SearchComponent limit={limit} page={page} search={search} tags={tags} />
      <BlogListBase data={data} key={"Blogs"} />
    </main>
  );
};

export default Home;
