"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const Discussion = () => {
  const [discussionText, setDiscussionText] = useState("");
  return (
    <div className="flex flex-col items-center mb-5 space-y-6">
      <Textarea
        placeholder="Start Discussion"
        className="w-full focus-visible:ring-0  placeholder:text-black/60 py-4 h-[60px] px-2 bg-transparent border-b border-b-gray-600 "
      />
      <div className="flex w-full items-end justify-end space-x-4">
        <Button
          onClick={() => {
            setDiscussionText("");
          }}
          variant={"outline"}
          className="px-5 text-base"
        >
          Cancel
        </Button>
        <Button onClick={()=>{
            
        }} className="px-5 text-base">Send</Button>
      </div>
    </div>
  );
};

export default Discussion;
