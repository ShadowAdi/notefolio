"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";

const SearchComponent = ({
  limit,
  page,
  search,
  tags,
}: {
  limit: string | undefined;
  page: string | undefined;
  search: string | undefined;
  tags: string | undefined;
}) => {
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(search || "");
  const [tagsInput, setTagsInput] = useState("");
  const [tagsArray, setTagsArray] = useState<string[]>(
    tags ? tags.split(",") : []
  );
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagsInput.trim()) {
      if (!tagsArray.includes(tagsInput.trim())) {
        setTagsArray([...tagsArray, tagsInput.trim()]);
      }
      setTagsInput("");
    }
  };

  const removeTag = (index: number) => {
    setTagsArray(tagsArray.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const currentTags = searchParams.get("tags");
    setTagsArray(currentTags ? currentTags.split(",") : []);
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }

      if (tagsArray.length > 0) {
        params.set("tags", tagsArray.join(","));
      } else {
        params.delete("tags");
      }

      if (limit) params.set("limit", limit);
      if (page) params.set("page", page);

      router.push(`/home?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput, tagsArray, limit, page, router, searchParams]);

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Input
            className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Search by Title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
            />
          </svg>
        </div>

        {/* Tags input */}
        <div className="relative flex-1">
          <Input
            className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Enter Tags (press Enter to add)..."
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7h10v10H7zM4 10h16M10 4v16"
            />
          </svg>

          {/* Active tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {tagsArray.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 justify-center"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => removeTag(index)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
