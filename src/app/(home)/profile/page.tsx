"use client";
import { GetUserAction } from "@/actions/User/User";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/protected/withAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UserProfileInterface } from "@/types/user/UserInterface";
import { UserBlogResponseInterface } from "@/types/Blog/UserBlogResponseInterface";
import { Spinner } from "@/components/ui/Spinner";
import BlogHorizontalCard from "@/components/global/Blog/BlogHorizontalCard";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfileInterface | null>(null);
  const [blogs, setBlogs] = useState<UserBlogResponseInterface[]>([]);
  const { isAuthenticated, loading: globalLoading, token } = useAuth();
  const router = useRouter();
  const [tabs, setTabs] = useState<"Blogs" | "About" | "Newsletters">("Blogs");

  const GetUser = async () => {
    setLoading(true);
    try {
      if (globalLoading) return;
      if (!isAuthenticated || !token) {
        router.push("/home");
        return;
      }

      const res = await GetUserAction(token);

      if (res.success) {
        if (res.user) setUser(res.user);
        if (res.blogs) setBlogs(res.blogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetUser();
  }, [globalLoading, isAuthenticated, token]);

  useEffect(() => {
    if (blogs.length > 0) {
      console.log("Blogs tags ", blogs[0]?.tags);
    }
  }, [blogs]);

  if (loading || globalLoading)
    return (
      <section className="flex items-center justify-center w-full min-h-[80vh]">
        <Spinner />
      </section>
    );

  return (
    <main className="w-full min-h-[80vh] max-w-7xl py-6  px-8 flex justify-between items-start mx-auto space-x-6">
      <section className="flex-1 flex flex-col space-y-6 items-start h-full py-3">
        <ul className="flex flex-wrap space-x-4">
          {(["Blogs", "About", "Newsletters"] as const).map((tab) => (
            <li
              key={tab}
              onClick={() => setTabs(tab)}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer transition-colors
          ${
            tabs === tab
              ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
              : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
          }`}
            >
              {tab}
            </li>
          ))}
        </ul>

        <div className="flex w-full flex-1 items-start justify-start py-3">
          {tabs === "Blogs" &&
            (blogs.length > 0 ? (
              blogs.map((blog, i) => <BlogHorizontalCard key={i} b={blog} />)
            ) : (
              <div className="w-full flex flex-col">
                <h2 className="text-3xl font-semibold text-stone-900">
                  No Blogs Found
                </h2>
              </div>
            ))}
          {tabs === "Newsletters" && (
            <div className="w-full flex flex-col">
              <h2 className="text-3xl font-semibold text-stone-900">
                No Newsletters Found
              </h2>
            </div>
          )}

          {tabs === "About" && (
            <div className="w-full flex flex-col">
              <h2 className="text-3xl font-semibold text-stone-900">
                No About Found
              </h2>
            </div>
          )}
        </div>
      </section>

      {user && (
        <div>
          <p>{user.username}</p>
          <p>{user.email}</p>
          <p>{user.bio}</p>
        </div>
      )}
    </main>
  );
};

export default withAuth(Profile);
