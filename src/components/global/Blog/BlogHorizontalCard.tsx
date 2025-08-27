import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserBlogResponseInterface } from "@/types/Blog/UserBlogResponseInterface";
import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import truncate from "truncate-html";

const BlogHorizontalCard = ({ b }: { b: UserBlogResponseInterface }) => {
  return (
    <Link href={`/blog/${b.id}`}>
      <Card className="flex flex-row items-center w-full max-w-3xl border-none shadow-lg rounded-lg overflow-hidden bg-gray-100/40">
        <div className="flex-1 p-4">
          <CardHeader className="p-0 mb-2">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
              {b.title}
            </h2>
          </CardHeader>
          <CardContent className="p-0 mb-3">
            <p
              className="text-sm text-gray-600 leading-relaxed line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: truncate(b.description, 120, {
                  ellipsis: "...",
                }),
              }}
            />
          </CardContent>
          <CardFooter className="p-0 flex flex-col space-y-4 justify-between items-start">
            <div className="flex space-x-2">
              {b?.tags?.slice(0, 3).map((tag: any, j) => {
                return (
                  <span
                    key={j}
                    className="px-3 py-1 rounded-full text-white text-xs font-medium bg-stone-950"
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <div className="flex space-x-6 items-center">
              <div
                className="flex items-center space-x-1 cursor-default"
                aria-label="Upvote"
              >
                <ArrowUp className="w-4 h-4" />
                <span>{b.upvotes}</span>
              </div>
              <div
                className="flex items-center space-x-1 cursor-default"
                aria-label="Downvote"
              >
                <ArrowDown className="w-4 h-4" />
                <span>{b.downvotes}</span>
              </div>
            </div>
          </CardFooter>
        </div>
        <div className="w-48 h-48 flex-1 relative">
          <Image
            src={b.cover}
            alt={b.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
            priority
          />
        </div>
      </Card>
    </Link>
  );
};

export default BlogHorizontalCard;
