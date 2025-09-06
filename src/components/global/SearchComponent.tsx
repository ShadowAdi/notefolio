"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

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

  const params = new URLSearchParams(searchParams.toString());
  useEffect(() => {
    const timeout = setTimeout(() => {
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
        <div className="relative flex-1">
          <Input
            className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Search by Title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="relative flex-1  flex flex-col space-y-4 justify-between items-start">
          <Input
            className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            placeholder="Enter Tags (press Enter to add)..."
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

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
        <Button
          onClick={() => {
            setTagsArray([]);
            setSearchInput("");
            setTagsInput("");
            router.push("/home"); 
          }}
          className="bg-stone-900 hover:bg-stone-950 py-3 px-6 rounded-full cursor-pointer"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SearchComponent;
