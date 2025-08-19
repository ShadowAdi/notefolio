"use client";

import Image from "next/image";
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { EditIcon, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteBlog } from "@/app/actions/DeleteBlog";
import { useRouter } from "next/navigation";

interface BlogHeaderProps {
  blogTitle: string;
  profileUrl: string | null;
  username: string;
  createdAt: string;
  authorId: string;
  blogId: string;
}

const BlogHeader = ({
  blogTitle,
  profileUrl,
  username,
  createdAt,
  authorId,
  blogId,
}: BlogHeaderProps) => {
  const { user, loading, isAuthenticated, token } = useAuth();
  const router = useRouter();

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to follow this author.");
      return;
    }

    toast.success(`Now following ${username}`);
  };

  const handleDeleteBlog = async () => {
    try {
      if (loading) {
        return;
      }
      if (!isAuthenticated || !token) {
        toast.error(`You are not Authenticated`);
      }
      if (!blogId) {
        toast.error(`Blog Id Not Found`);
      }
      if (user && authorId !== user.id) {
        toast.error(`You can only delete your blogs`);
      }
      const { success, error, message } = await DeleteBlog(blogId, token!);
      if (success) {
        toast.success(message);
        router.push("/home");
      } else {
        console.error(`Failed to delete Blog: ${error}`);
        toast.error(`Failed to delete Blog: ${error}`);
      }
    } catch (error) {
      console.error(`Failed to delete Blog: ${error}`);
      toast.error(`Failed to delete Blog: ${error}`);
    }
  };

  return (
    <div className="flex flex-col space-y-5 w-full items-start">
      <h1 className="text-4xl capitalize font-bold text-gray-900">
        {blogTitle}
      </h1>

      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center space-x-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {profileUrl ? (
              <img src={profileUrl} alt={username} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg">
                {username ? username[0].toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {username || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(createdAt), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>

        {!loading && isAuthenticated && user && authorId === user.id && (
          <div className="flex items-center space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center justify-center cursor-pointer bg-red-500 hover:bg-red-600 rounded-full h-10 w-10">
                  <Trash size={20} className="text-xs  text-white " />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your blog and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteBlog();
                    }}
                  >
                    Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-center cursor-pointer bg-green-500 hover:bg-green-600 rounded-full h-10 w-10">
              <EditIcon size={20} className="text-xs  text-white " />
            </div>
          </div>
        )}

        {!loading && authorId !== user?.id && (
          <Button
            onClick={handleFollowClick}
            className="px-6 py-4 bg-transparent rounded-full !cursor-pointer hover:bg-transparent hover:shadow-md border-black border flex items-center justify-center"
          >
            <span className="text-base text-black">Follow</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlogHeader;
