"use client";
import BlogListBase from "@/components/global/home/Blogs/BlogListBase";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/protected/withAuth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Saved = () => {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const { isAuthenticated, loading: globalLoading, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const GetAllSavedBlogs = async () => {
    setLoading(true);
    if (globalLoading) {
      return;
    }
    if (!isAuthenticated || !token) {
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/api/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setSavedBlogs(data?.savedBlogs);
    } catch (error) {
      toast.error(`Failed in getting saved Blog`);
      console.error(`Failed in getting the blogs: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    GetAllSavedBlogs();
  }, [globalLoading, token, isAuthenticated]);

  return (
    <main className="flex flex-col gap-4 flex-1 items-center h-screen ">
      {loading ? (
        <div className="h-screen w-full ">
          <Spinner />
        </div>
      ) : (
        savedBlogs.length > 0 && (
          <BlogListBase data={savedBlogs} key={"Blogs"} isSaved={true} />
        )
      )}
      {savedBlogs && savedBlogs.length === 0 && (
        <h1 className="text-xl font-semibold text-stone-900 ">
          No Saved Blogs
        </h1>
      )}
    </main>
  );
};

export default withAuth(Saved);
