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
    <main className="flex flex-row  gap-8 flex-1 items-start justify-between w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col flex-1 w-[80%] items-start space-y-8">
        <div className="flex flex-col space-y-5 w-full items-start">
          <h1 className="text-4xl capitalize font-bold text-gray-900">
            {blogFound.blogTitle}
          </h1>
          <div className="flex items-center justify-between gap-4  w-full">
            <div className="flex items-center  space-x-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                {user.profileUrl ? (
                  <Image
                    src={user.profileUrl}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gray-300 flex items-center justify-center
             text-gray-600 text-lg"
                  >
                    {user.username ? user.username[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {user.username || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(blogFound.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <Button className="px-6 py-4 bg-transparent rounded-full !cursor-pointer hover:bg-transparent hover:shadow-md border-black border flex items-center justify-center">
              <span className="text-base text-black">Follow</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between w-full  border-t border-b border-t-gray-300 border-b-gray-300 py-3 ">
          <div className="flex items-center space-x-4 justify-between  ">
            <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-10 w-10 border border-gray-300">
              <ArrowBigUp className="text-base  text-gray-400 " />
            </div>
            <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-10 w-10 border border-gray-300">
              <ArrowBigDown className="text-base  text-gray-400 " />
            </div>
            <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center  h-10 w-10  border border-gray-300">
              <FaComment className="text-base  text-gray-400 " />
            </div>
          </div>
          <div className="flex items-center space-x-4 justify-between  ">
            <ShareButton title={blogFound.blogTitle} />
            <PlayButton blogDescription={blogFound?.blogDescription} />
          </div>
        </div>

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
      </div>
      <section className="flex flex-col w-[20%]  items-start justify-start  gap-4  ">
        <TagsSection blogTagsFound={blogTagsFound} />
      </section>

      {/* <div className="w-full">
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
      </div> */}
    </main>
  );
};

export default Blog;
