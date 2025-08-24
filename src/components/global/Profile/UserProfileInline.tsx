"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface UserProfileInlineInterface {
  username: string;
  profileUrl: string;
  id: string;
}

const UserProfileInline = ({
  username,
  profileUrl,
  id,
}: UserProfileInlineInterface) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(`/user/${id}`);
      }}
      className="flex flex-row items-center justify-start cursor-pointer hover:bg-gray-100 px-3 py-2 w-full space-x-3 rounded-lg"
    >
      {profileUrl ? (
        <img src={profileUrl} alt={id} className="object-cover h-10 w-10" />
      ) : (
        <div className=" bg-gray-300 flex h-10 w-10 rounded-full items-center justify-center text-gray-600 text-lg">
          {username ? username[0].toUpperCase() : "U"}
        </div>
      )}
      <span className="text-lg text-black font-semibold">{username}</span>
    </div>
  );
};

export default UserProfileInline;
