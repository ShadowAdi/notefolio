"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import DiscussionTrigger from "../discussion/DiscussionTrigger";
import { DisscussionInterfaceType } from "@/types/Discussion/DiscussionInterface";
import { CreateDiscussionAction } from "@/actions/Discussion/DiscussionAction";
import Link from "next/link";

const Discussions = ({ blogId }: { blogId: string }) => {
  const { isAuthenticated, loading: globalLoading, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [discussionText, setDiscussionText] = useState("");
  const [discussions, setDiscussions] = useState<DisscussionInterfaceType[]>(
    []
  );

  const fetchDiscussions = async () => {
    try {
      const response = await axios.get(`/api/discussions/${blogId}`);
      if (response.data.success) {
        setDiscussions(response.data.discussions);
      } else {
        toast.error(response.data.error || "Failed to load discussions");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch discussions");
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [blogId]);

  const handleCreate = async () => {
    if (globalLoading) return;
    setLoading(true);

    if (!isAuthenticated || !token) {
      toast.error("Please Login to start a discussion");
      setLoading(false);
      return;
    }

    const { success, discussion, error, message } =
      await CreateDiscussionAction(discussionText, token, blogId);

    if (success) {
      toast.success(message);
      setDiscussionText("");
      fetchDiscussions();
    } else {
      toast.error(error || message);
    }

    setLoading(false);
  };

  return (
    <section className="w-full flex flex-col space-y-6">
      <div className="flex flex-col items-center mb-5 space-y-6">
        <Textarea
          value={discussionText}
          onChange={(e) => setDiscussionText(e.target.value)}
          placeholder="Start Discussion..."
          className="w-full focus-visible:ring-0 placeholder:text-black/60 py-4 h-[60px] px-2 bg-transparent border-b border-b-gray-600 "
        />
        <div className="flex w-full items-end justify-end space-x-4">
          <Button
            disabled={loading}
            onClick={() => setDiscussionText("")}
            variant="outline"
            className="px-5 text-base"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handleCreate}
            className="px-5 text-base"
          >
            {loading ? "Loading..." : "Send"}
          </Button>
        </div>
      </div>

      {discussions.length > 0 ? (
        discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="p-4 pb-2 mb-4 bg-white border border-gray-200 rounded-lg flex justify-between items-center w-full"
          >
            <div className="flex w-full flex-col items-start space-y-3">
              <div className="flex items-center justify-between w-full space-x-2">
                <div className="flex items-center space-x-3">
                  <Link
                    href={"/"}
                    className="relative w-8 h-8 rounded-full overflow-hidden"
                  >
                    {discussion.profileUrl ? (
                      <img
                        src={discussion.profileUrl}
                        alt={discussion.profileUrl}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg">
                        {discussion.username
                          ? discussion.username[0].toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </Link>
                  <span className="text-sm text-black">
                    {discussion.username}
                  </span>
                </div>
                <DiscussionTrigger
                  discussionId={discussion.id}
                  discussinUserId={discussion.userId}
                  fetchDiscussions={fetchDiscussions}
                />
              </div>
              <p className="text-gray-800">{discussion.description}</p>
              <p>
                {discussion.createdAt
                  ? format(new Date(discussion.createdAt), "PPpp")
                  : "Unknown"}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No discussions yet.</p>
      )}
    </section>
  );
};

export default Discussions;
