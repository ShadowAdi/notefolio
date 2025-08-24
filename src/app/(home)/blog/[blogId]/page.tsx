import { SingleBlogResponseCombinedInterface } from "@/types/Blog/SingleBlog";
import axios from "axios";
import React from "react";
import { format } from "date-fns";
import TagsSection from "@/components/global/Blog/TagsSection";
import BlogHeader from "@/components/global/Blog/BlogHeader";
import BlogInfo from "@/components/global/Blog/BlogInfo";
import "highlight.js/styles/github-dark.css";
import BlogDescriptionEditor from "@/components/global/Blog/BlogDescriptionEditor";

const Blog = async ({ params }: { params: Promise<{ blogId: string }> }) => {
  const { blogId } = await params;

  const response = await axios.get(`http://localhost:3000/api/blog/${blogId}`);
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
    <main className="flex flex-col  gap-8 flex-1 items-start justify-between w-full max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
      <div className="flex flex-row   gap-4 flex-1 items-start justify-between w-full  mx-auto">
        <section className="flex flex-col flex-1 w-[80%]  items-start space-y-8">
          <BlogHeader
            blogTitle={blogFound.blogTitle}
            createdAt={blogFound.createdAt}
            profileUrl={user.profileUrl}
            username={user.username}
            authorId={blogFound.authorId}
            blogId={blogId}
            followers={user.followers}
          />

          <BlogInfo
            blogDescription={blogFound?.blogDescription}
            blogTitle={blogFound.blogTitle}
            downvotes={blogDownvote.count}
            upvotes={blogUpvote.count}
            blogId={blogId}
          />

          {blogFound.blogCover ? (
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <img
                src={blogFound.blogCover}
                alt={blogFound.blogTitle}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Cover Image</span>
            </div>
          )}

          <BlogDescriptionEditor blogDescription={blogFound.blogDescription} />
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
