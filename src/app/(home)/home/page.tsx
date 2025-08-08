"use client"; 
import withAuth from "@/protected/withAuth";
import React from "react";

const Home = () => {
  return (
    <main className="px-8">
      <h1>Home</h1>
    </main>
  );
};

export default withAuth(Home);
