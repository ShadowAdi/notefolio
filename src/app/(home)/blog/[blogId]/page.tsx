import { SingleBlogResponseCombinedInterface } from "@/types/Blog/SingleBlog";
import axios from "axios";
import React from "react";
import TagsSection from "@/components/global/Blog/TagsSection";
import BlogHeader from "@/components/global/Blog/BlogHeader";
import BlogInfo from "@/components/global/Blog/BlogInfo";
import "highlight.js/styles/github-dark.css";
import BlogDescriptionEditor from "@/components/global/Blog/BlogDescriptionEditor";
import Discussion from "@/components/global/Blog/Discussion";
import Discussions from "@/components/global/Blog/Discussions";

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
    discussionsCount,
    blogFound,
    blogUpvote,
    blogDownvote,
    user,
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
            discussionCount={discussionsCount}
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

      <div className="w-full flex-1 border-t border-t-gray-400 pt-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Discussions</h2>
        <Discussion blogId={blogId} />
        <Discussions blogId={blogId} />
      </div>
    </main>
  );
};

export default Blog;
