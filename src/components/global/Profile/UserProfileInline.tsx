import Image from "next/image";
import Link from "next/link";
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
  return (
    <div className="flex flex-row items-start w-full bg-red-600 py-2 px-1 space-x-3">
      {profileUrl ? (
        <img src={profileUrl} alt={id} className="object-cover h-10 w-10" />
      ) : (
        <div className=" bg-gray-300 flex h-10 w-10 items-center justify-center text-gray-600 text-lg">
          {username ? username[0].toUpperCase() : "U"}
        </div>
      )}
      <span className="text-lg text-black font-semibold">{username}</span>
    </div>
  );
};

export default UserProfileInline;
