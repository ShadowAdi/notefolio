"use client";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React, { useState, useCallback } from "react";
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

const BlogInfo = ({
  blogTitle,
  blogDescription,
  downvotes: initialDownvotes,
  upvotes: initialUpvotes,
  blogId,
  discussionCount
}: {
  blogTitle: string;
  blogDescription: string | null;
  upvotes: number;
  downvotes: number;
  blogId: string;
  discussionCount:number
}) => {
  const { isAuthenticated, loading, token } = useAuth();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

  const refetchBlogData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/blog/${blogId}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch blog data");
      }
      const data = response.data;
      if (!data.success) {
        throw new Error(`Failed to get the blog: ${data.error}`);
      }
      setUpvotes(data.blogUpvote.count);
      setDownvotes(data.blogDownvote.count);
    } catch (error) {
      console.error(`Failed to refetch blog data: ${error}`);
      toast.error(`Failed to refresh blog data`);
    }
  }, [blogId]);

  const UpvoteBlog = async () => {
    try {
      if (loading) {
        return;
      }
      if (!isAuthenticated || !token) {
        toast.error("User is not authenticated");
        return;
      }
      if (!blogId) {
        toast.error("Blog ID is required");
        return;
      }
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
      if (loading) {
        return;
      }
      if (!isAuthenticated || !token) {
        toast.error("User is not authenticated");
        return;
      }
      if (!blogId) {
        toast.error("Blog ID is required");
        return;
      }
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

  return (
    <div className="flex items-center justify-between w-full border-t border-b border-t-gray-300 border-b-gray-300 py-3">
      <div className="flex items-center space-x-4 justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={UpvoteBlog}
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-12 w-12 border border-gray-300"
            >
              <ArrowBigUp className="text-sm text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base text-gray-200">{upvotes} UpVotes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={DownvoteBlog}
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-12 w-12 border border-gray-300"
            >
              <ArrowBigDown className="text-sm text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base text-gray-200">{downvotes} Downvotes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center h-12 w-12 border border-gray-300">
              <FaComment className="text-sm text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base text-gray-200">{discussionCount} Comments</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center space-x-4 justify-between">
        <ShareButton title={blogTitle} />
        <PlayButton blogDescription={blogDescription!} />
      </div>
    </div>
  );
};

export default BlogInfo;
