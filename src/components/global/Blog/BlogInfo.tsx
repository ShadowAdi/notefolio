"use client";
import { ArrowBigDown, ArrowBigUp, Bookmark } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import ShareButton from "./ShareButton";
import PlayButton from "./PlayButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpvoteBlogAction } from "@/actions/Blog/UpvoteBlog";
import { DownvoteBlogAction } from "@/actions/Blog/DownvoteBlog";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import {
  SingleBlogDownvotesResponseInterface,
  SingleBlogResponseCombinedInterface,
  SingleBlogUpvotesResponseInterface,
  UserIds,
} from "@/types/Blog/SingleBlog";

const BlogInfo = ({
  blogTitle,
  blogDescription,
  downvotes: initialDownvotes,
  upvotes: initialUpvotes,
  blogId,
  discussionCount,
  savedIds,
}: {
  blogTitle: string;
  blogDescription: string | null;
  upvotes: SingleBlogUpvotesResponseInterface[];
  downvotes: SingleBlogDownvotesResponseInterface[];
  blogId: string;
  discussionCount: number;
  savedIds: UserIds[];
}) => {
  const { isAuthenticated, loading, token, user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [upvotes, setUpvotes] =
    useState<SingleBlogUpvotesResponseInterface[]>(initialUpvotes);
  const [downvotes, setDownvotes] =
    useState<SingleBlogDownvotesResponseInterface[]>(initialDownvotes);

  const refetchBlogData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/blog/${blogId}`);
      if (response.status !== 200) throw new Error("Failed to fetch blog data");
      const data: SingleBlogResponseCombinedInterface = response.data;
      if (!data.success)
        throw new Error(`Failed to get the blog: ${data.error}`);
      setUpvotes(data.blogUpvotes);
      setDownvotes(data.blogDownvotes);
    } catch (error) {
      console.error(`Failed to refetch blog data: ${error}`);
      toast.error(`Failed to refresh blog data`);
    }
  }, [blogId]);

  // derive initial saved state from server-provided ids
  useEffect(() => {
    if (user) {
      setIsSaved(savedIds.some((s) => s.userIds === user.id));
    } else {
      setIsSaved(false);
    }
  }, [savedIds, user]);

  const UpvoteBlog = async () => {
    try {
      if (loading) return;
      if (!isAuthenticated || !token)
        return toast.error("User is not authenticated");
      if (!blogId) return toast.error("Blog ID is required");

      const result = await UpvoteBlogAction(blogId, token);
      if (result.success) {
        toast.success(result.message);
        await refetchBlogData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(`Failed to upvote blog: ${error}`);
      toast.error(`Failed to upvote blog: ${error}`);
    }
  };

  const DownvoteBlog = async () => {
    try {
      if (loading) return;
      if (!isAuthenticated || !token)
        return toast.error("User is not authenticated");
      if (!blogId) return toast.error("Blog ID is required");

      const result = await DownvoteBlogAction(blogId, token);
      if (result.success) {
        toast.success(result.message);
        await refetchBlogData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(`Failed to downvote blog: ${error}`);
      toast.error(`Failed to downvote blog: ${error}`);
    }
  };

  const handleSave = useCallback(async () => {
    if (!token || !isAuthenticated) {
      toast.error("User is not authenticated");
      return;
    }
    // optimistic
    setIsSaved(true);
    try {
      const response = await axios.post(`/api/saved/${blogId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      if (!data.success) {
        setIsSaved(false); // rollback
        toast.error(`Failed to save Blog ${data.error}`);
        console.error(`Failed to save Blog ${data.error}`);
      } else {
        toast.success(data.message);
      }
      // optional: await refetchBlogData(); // only if your blog API returns saved state
    } catch (error) {
      setIsSaved(false); // rollback
      console.error(`Failed to bookmark the blog ${error}`);
      toast.error(`Failed to bookmark the blog. ${error}`);
    }
  }, [blogId, token, isAuthenticated]);

  const handleUnSave = useCallback(async () => {
    if (!token || !isAuthenticated) {
      toast.error("User is not authenticated");
      return;
    }
    // optimistic
    const prev = isSaved;
    setIsSaved(false);
    try {
      const response = await axios.delete(`/api/saved/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      if (!data.success) {
        setIsSaved(prev); // rollback
        toast.error(`Failed to unsave Blog ${data.error}`);
        console.error(`Failed to unsave Blog ${data.error}`);
      } else {
        toast.success(data.message);
      }
      // optional: await refetchBlogData();
    } catch (error) {
      setIsSaved(true); // rollback
      console.error(`Failed to unsave the blog ${error}`);
      toast.error(`Failed to unsave the blog. ${error}`);
    }
  }, [blogId, token, isAuthenticated, isSaved]);

  return (
    <div className="flex items-center justify-between w-full border-t border-b border-t-gray-300 border-b-gray-300 py-3">
      <div className="flex items-center space-x-4 justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={UpvoteBlog}
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-12 w-12 border border-gray-300"
            >
              <ArrowBigUp
                className={`text-sm ${
                  upvotes.some((u) => u.userId === user?.id)
                    ? "fill-stone-800"
                    : " text-gray-400"
                }`}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base text-gray-200">{upvotes.length} UpVotes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={DownvoteBlog}
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-12 w-12 border border-gray-300"
            >
              <ArrowBigDown
                className={`text-sm ${
                  downvotes.some((u) => u.userId === user?.id)
                    ? "fill-stone-800"
                    : " text-gray-400"
                }`}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base text-gray-200">
              {downvotes.length} Downvotes
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-12 w-12 border border-gray-300">
              <FaComment className="text-sm text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base text-gray-200">
              {discussionCount} Comments
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center space-x-4 justify-between">
        <div
          onClick={isSaved ? handleUnSave : handleSave}
          className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-12 w-12 border border-gray-300"
        >
          <Bookmark
            className={`text-sm ${
              isSaved ? "fill-stone-800" : " text-gray-400"
            }`}
          />
        </div>
        <ShareButton title={blogTitle} />
        <PlayButton blogDescription={blogDescription ?? ""} />
      </div>
    </div>
  );
};

export default BlogInfo;
