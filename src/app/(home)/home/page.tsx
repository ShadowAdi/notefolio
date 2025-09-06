import BlogListBase from "@/components/global/home/Blogs/BlogListBase";
import SearchComponent from "@/components/global/SearchComponent";
import axios from "axios";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Home = async ({
  searchParams,
}: {
  searchParams: {
    search?: string;
    limit?: string;
    page?: string;
    tags?: string;
  };
}) => {
  const { limit, page, search, tags } = searchParams;
  const response = await axios.get(`http://localhost:3000/api/blog`, {
    params: {
      search,
      page,
      limit,
      tags,
    },
  });
  const { data } = response.data;

  return (
    <main className="flex flex-col gap-4 flex-1 items-center h-screen ">
      <SearchComponent limit={limit} page={page} search={search} tags={tags} />
      <BlogListBase data={data} key={"Blogs"}  />
      {/* <Pagination className="pb-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                currentPage > 1
                  ? `/home?search=${search || ""}&tags=${
                      tags || ""
                    }&limit=${1}&page=${currentPage - 1}`
                  : "#"
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`/home?search=${search || ""}&tags=${tags || ""}&limit=${
                    limit || 5
                  }&page=${pageNum}`}
                  isActive={pageNum === currentPage}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages
                  ? `/?search=${search || ""}&tags=${tags || ""}&limit=${
                      limit || 5
                    }&page=${currentPage + 1}`
                  : "#"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </main>
  );
};

export default Home;
