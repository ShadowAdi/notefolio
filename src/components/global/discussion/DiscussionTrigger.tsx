"use client";
import { DeleteDiscussionAction } from "@/actions/Discussion/DiscussionAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const DiscussionTrigger = ({
  discussionId,
  discussionUserId,
  fetchDiscussions,
  onEdit,
}: {
  discussionId: string;
  discussionUserId: string;
  fetchDiscussions: () => void;
  onEdit: () => void;
}) => {
  const { isAuthenticated, loading: globalLoading, token, user } = useAuth();
  const handleDelete = async () => {
    if (globalLoading) {
      return;
    }
    if (!isAuthenticated || !token || !user) {
      toast.error(`User Not Authenticated`);
    }
    if (user && user?.id !== discussionUserId) {
      toast.error(`User Not Authenticated`);
    }

    try {
      const { success, error, message } = await DeleteDiscussionAction(
        discussionId,
        token!
      );
      if (success) {
        toast.success(message);
        fetchDiscussions();
      } else {
        console.error(`Failed to delete discussion ${error}`);
        toast.error(`Failed to delete discussion ${error}`);
      }
    } catch (error) {
      console.error(`Failed to delete discussion ${error}`);
      toast.error(`Failed to delete discussion`);
      return;
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="text-base cursor-pointer text-gray-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
          className="cursor-pointer flex items-center justify-center"
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DiscussionTrigger;
