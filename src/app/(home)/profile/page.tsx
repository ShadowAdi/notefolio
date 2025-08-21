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
import Image from "next/image";
import truncate from "truncate-html";
import { Button } from "@/components/ui/button";
import { FollowersInterface } from "@/types/Blog/Followers";
import { FollowingsInterface } from "@/types/Blog/Followings";
import UserProfileInline from "@/components/global/Profile/UserProfileInline";
import EditorBio from "@/components/global/Profile/EditorBio";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfileInterface | null>(null);
  const [blogs, setBlogs] = useState<UserBlogResponseInterface[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const [followers, setFollowers] = useState<FollowersInterface[] | null>(null);
  const [followings, setFollowings] = useState<FollowingsInterface[] | null>(
    null
  );
  const { isAuthenticated, loading: globalLoading, token } = useAuth();
  const router = useRouter();
  const [tabs, setTabs] = useState<"Blogs" | "About" | "Newsletters">("Blogs");
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio);

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
        if (res.followersCount) setFollowersCount(res.followersCount);
        if (res.followingsCount) setFollowersCount(res.followingsCount);
        if (res.followers) setFollowers(res.followers);
        if (res.followings) setFollowings(res.followings);
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
      <section className="flex-1 flex border-r pr-7 border-r-gray-300 h-full min-h-[80vh] flex-col space-y-6 items-start  py-3">
        <ul className="flex flex-wrap space-x-4">
          {(["Blogs", "Newsletters", "About"] as const).map((tab) => (
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

        <div className="flex w-full flex-1 px-4 items-start justify-start py-3">
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

          {tabs === "About" &&
            (user && user?.bio ? (
              <div className="w-full flex flex-col  h-full items-start  justify-center">
                {isEditing ? (
                  <EditorBio
                    isEditing={isEditing}
                    bio={user.bio}
                    onChange={(newBio) => setBio(newBio)}
                  />
                ) : (
                  <div className="p-0 mb-3">
                    <p
                      className="text-xl text-stone-950 leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: bio!,
                      }}
                    />
                  </div>
                )}
                <div className="flex w-full items-end justify-end">
                  <Button
                    onClick={async () => {
                      if (isEditing) {
                        try {
                          const response = await axios.patch(
                            "/api/user",
                            { bio },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                        } catch (err) {
                          console.error("Failed to update bio", err);
                          toast.error(`Failed to update bio: ${err}`);
                        }
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="px-6 py-4 bg-transparent rounded-full !cursor-pointer hover:bg-transparent hover:shadow-md border-black border flex items-center justify-center"
                  >
                    {isEditing ? (
                      <span className="text-lg text-black">Save</span>
                    ) : (
                      <span className="text-lg text-black">Edit</span>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full bg-gray-200/60 flex items-center flex-col space-y-3 justify-center py-6 min-h-[40vh] ">
                <h2 className="text-2xl font-semibold text-black">
                  Tell the world about Yourself
                </h2>
                <p className="text-lg ">
                  Share your story, your passions, and what makes you unique.
                </p>
                <Button className="px-6 py-7 bg-transparent rounded-full !cursor-pointer hover:bg-transparent hover:shadow-md border-black border flex items-center justify-center">
                  <span className="text-lg text-black">Start Writing</span>
                </Button>
              </div>
            ))}
        </div>
      </section>

      {user && (
        <section className="flex-[0.3] pl-2 flex space-y-6 flex-col py-5 items-start">
          {user.profileUrl ? (
            <Image
              src={user.profileUrl}
              alt={user.username}
              className="rounded-full h-[150px] w-[150px] object-cover"
              height={150}
              width={150}
            />
          ) : (
            <div className="rounded-full h-[150px] w-[150px] flex items-center justify-center bg-gray-300">
              <span className="text-6xl flex items-center justify-center font-semibold text-black">
                {user.username && user.username[0]}
              </span>
            </div>
          )}
          <h2 className="text-3xl font-bold capitalize text-black">
            {user.username}
          </h2>
          <div className="flex flex-col w-full py-5 items-start my-3 space-y-4 border-t border-t-gray-400  ">
            <h5 className="text-lg font-semibold text-black">
              {followersCount} Followers
            </h5>
            <div className="flex flex-col items-start space-y-3">
              {followers &&
                followers.length > 0 &&
                followers?.map((follower, i) => (
                  <UserProfileInline
                    id={follower.id}
                    profileUrl={follower.profileUrl}
                    username={follower.username}
                    key={i}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col w-full py-5 items-start my-3 space-y-4 border-t border-t-gray-400  ">
            <h5 className="text-lg font-semibold text-black">
              {followingsCount} Followings
            </h5>
            <div className="flex flex-col items-start space-y-3">
              {followings &&
                followings.length > 0 &&
                followings?.map((following, i) => (
                  <UserProfileInline
                    id={following.id}
                    profileUrl={following.profileUrl}
                    username={following.username}
                    key={i}
                  />
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default withAuth(Profile);
