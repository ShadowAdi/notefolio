"use client";
import { CreateDiscussionAction } from "@/actions/Discussion/DiscussionAction";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { toast } from "sonner";

const Discussion = ({ blogId }: { blogId: string }) => {
  const [discussionText, setDiscussionText] = useState("");
  const { isAuthenticated, loading: globalLoading, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const CreateDiscussion = async () => {
    if (globalLoading) {
      return;
    }
    setLoading(true);
    if (!isAuthenticated || !token) {
      toast.error(`Please Login to start a discussion`);
      return;
    }
    if (!blogId) {
      toast.error(`Failed to get Blog Id`);
      return;
    }
    const { success, discussion, error, message } =
      await CreateDiscussionAction(discussionText, token, blogId);
    if (success) {
      toast.success(message);
      setDiscussionText("");
    } else {
      toast.error(error || message);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center mb-5 space-y-6">
      <Textarea
        value={discussionText}
        onChange={(e) => {
          setDiscussionText(e.target.value);
        }}
        placeholder="Start Discussion..."
        className="w-full focus-visible:ring-0  placeholder:text-black/60 py-4 h-[60px] px-2 bg-transparent border-b border-b-gray-600 "
      />
      <div className="flex w-full items-end justify-end space-x-4">
        <Button
          disabled={loading}
          onClick={() => {
            setDiscussionText("");
          }}
          variant={"outline"}
          className="px-5 text-base"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={() => {
            CreateDiscussion();
          }}
          className="px-5 text-base"
        >
          {loading ? "Loading..." : "Send..."}
        </Button>
      </div>
    </div>
  );
};

export default Discussion;
