import { SingleBlogResponseCombinedInterface } from "@/types/Blog/SingleBlog";
import axios from "axios";
import React from "react";
import TagsSection from "@/components/global/Blog/TagsSection";
import BlogHeader from "@/components/global/Blog/BlogHeader";
import BlogInfo from "@/components/global/Blog/BlogInfo";
import "highlight.js/styles/github-dark.css";
import BlogDescriptionEditor from "@/components/global/Blog/BlogDescriptionEditor";
import Discussions from "@/components/global/Blog/Discussions";
import AuthorBlogs from "@/components/global/Blog/AuthorBlogs";

const Blog = async (context: { params: Promise<{ blogId: string }> }) => {
  const { blogId } = await context.params;

  const response = await axios.get(`http://localhost:3000/api/blog/${blogId}`);
  const data: SingleBlogResponseCombinedInterface = await response.data;
  if (!data.success) {
    throw new Error(`Failed to get the blog: ${data.error}`);
  }
  const {
    discussionsCount,
    blogFound,
    blogUpvotes,
    blogDownvotes,
    user,
    blogTagsFound,
    savedIds,
    error,
    success,
  } = data;

  if (!success) {
    throw new Error(error || `Failed to get the blog`);
  }

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
            downvotes={blogDownvotes}
            upvotes={blogUpvotes}
            blogId={blogId}
            discussionCount={discussionsCount}
            savedIds={savedIds}
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
        <section className="flex flex-col w-[20%]  items-start justify-start  gap-4 space-y-8  ">
          <TagsSection blogTagsFound={blogTagsFound} />
          <AuthorBlogs blogId={blogId} />
        </section>
      </div>

      <div className="w-full flex-1 border-t border-t-gray-400 pt-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Discussions</h2>
        <Discussions blogId={blogId} />
      </div>
    </main>
  );
};

export default Blog;
