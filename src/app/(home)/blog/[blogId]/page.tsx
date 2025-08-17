import { SingleBlogResponseCombinedInterface } from "@/types/Blog/SingleBlog";
import axios from "axios";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ArrowBigDown,
  ArrowBigUp,
  Ellipsis,
  Play,
  PlayCircle,
} from "lucide-react";
import { FaComment } from "react-icons/fa";
import PlayButton from "@/components/global/Blog/PlayButton";
import ShareButton from "@/components/global/Blog/ShareButton";
import { Badge } from "@/components/ui/badge";
import TagsSection from "@/components/global/Blog/TagsSection";
import BlogHeader from "@/components/global/Blog/BlogHeader";
import BlogInfo from "@/components/global/Blog/BlogInfo";

const Blog = async ({ params }: { params: { blogId: string } }) => {
  const response = await axios.get(
    `http://localhost:3000/api/blog/${params.blogId}`
  );
  if (response.status !== 200) {
    throw new Error(`Failed to get Blog`);
  }
  const data: SingleBlogResponseCombinedInterface = await response.data;
  if (!data.success) {
    throw new Error(`Failed to get the blog: ${data.error}`);
  }

  const {
    blogFound,
    blogUpvote,
    blogDownvote,
    user,
    discussions,
    blogTagsFound,
  } = data;

  return (
    <main className="flex flex-col  gap-8 flex-1 items-start justify-between w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-row  gap-8 flex-1 items-start justify-between w-full  mx-auto">
        <section className="flex flex-col flex-1 w-[80%] items-start space-y-8">
          <BlogHeader
            blogTitle={blogFound.blogTitle}
            createdAt={blogFound.createdAt}
            profileUrl={user.profileUrl}
            username={user.username}
            authorId={blogFound.authorId}
          />

          <BlogInfo
            blogDescription={blogFound?.blogDescription}
            blogTitle={blogFound.blogTitle}
          />

          {blogFound.blogCover ? (
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <Image
                src={blogFound.blogCover}
                alt={blogFound.blogTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Cover Image</span>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: blogFound.blogDescription }}
          />
        </section>
        <section className="flex flex-col w-[20%]  items-start justify-start  gap-4  ">
          <TagsSection blogTagsFound={blogTagsFound} />
        </section>
      </div>

      <div className="w-full flex-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Discussions
        </h2>
        {Array.isArray(discussions) && discussions.length > 0 ? (
          discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="p-4 mb-4 bg-white border border-gray-200 rounded-lg"
            >
              <p className="text-gray-800">{discussion.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Commented on{" "}
                {format(new Date(discussion.createdAt), "MMMM dd, yyyy")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No discussions yet.</p>
        )}
      </div>
    </main>
  );
};

export default Blog;
