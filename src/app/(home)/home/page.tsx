import BlogListBase from "@/components/global/home/Blogs/BlogListBase";
import SearchComponent from "@/components/global/SearchComponent";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Link from "next/link";
import React from "react";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    limit?: string;
    page?: string;
    tags?: string;
  }>;
}) => {
  const { limit, page, search, tags } = await searchParams;

  const response = await axios.get(`http://localhost:3000/api/blog`, {
    params: { search, page, limit, tags },
  });

  const { data } = response.data;

  return (
    <main className="flex flex-col gap-2 flex-1 items-center justify-center  h-screen">
      {data && data.length > 0 && (
        <SearchComponent
          limit={limit}
          page={page}
          search={search}
          tags={tags}
        />
      )}
      <BlogListBase data={data} key={"Blogs"} isSaved={false} />
    </main>
  );
};

export default Home;
