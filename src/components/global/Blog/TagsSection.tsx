import { Badge } from "@/components/ui/badge";
import React from "react";

const TagsSection = ({ blogTagsFound }: { blogTagsFound: string[] }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-3xl font-bold ">Tags</h2>
      <div className="flex  w-full flex-wrap gap-2">
        {blogTagsFound.map((tag, index) => (
          <Badge
            key={index}
            className="px-6 py-2 bg-stone-900 cursor-pointer capitalize rounded-full text-sm"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;
