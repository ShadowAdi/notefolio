"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const Write = () => {
  const [blogTitle, setBlogTitle] = useState("");

  return (
    <main className="flex flex-col gap-4 items-center ">
      <Input
        onChange={(e) => {
          setBlogTitle(e.currentTarget.value);
        }}
        value={blogTitle}
        type="text"
        className="py-5 placeholder:text-neutral-400 text-black text-xl"
      />
    </main>
  );
};

export default Write;
