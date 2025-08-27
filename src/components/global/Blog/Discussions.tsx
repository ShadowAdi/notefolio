import React from "react";
import { format } from "date-fns";
import axios from "axios";
import { DisscussionInterfaceType } from "@/types/Discussion/DiscussionInterface";
import Link from "next/link";
import DiscussionTrigger from "../discussion/DiscussionTrigger";

const Discussions = async ({ blogId }: { blogId: string }) => {
  const response = await axios.get(
    `http://localhost:3000/api/discussions/${blogId}`
  );
  if (response.status !== 200) {
    throw new Error(`Failed to get discussion`);
  }
  const data = await response.data;
  if (!data.success) {
    throw new Error(`Failed to get the discussion: ${data.error}`);
  }
  const { discussions }: { discussions: DisscussionInterfaceType[] } = data;

  return (
    <section className="w-full flex flex-col">
      {Array.isArray(discussions) && discussions.length > 0 ? (
        discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="p-4 pb-2 mb-4 bg-white border border-gray-200 rounded-lg flex justify-between items-center w-full"
          >
            <div className="flex w-full flex-col items-start space-y-3">
              <div className="flex items-center justify-between w-full space-x-2">
                <div className="flex  items-center space-x-3">
                  <Link
                    href={"/"}
                    className="relative  w-8 h-8 rounded-full overflow-hidden"
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
                <DiscussionTrigger discussionId={discussion.id} discussinUserId={discussion.userId}/>
               
              </div>
              <p className="text-gray-800">{discussion.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Commented on{" "}
                {format(new Date(discussion.createdAt), "MMMM dd, yyyy")}
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
