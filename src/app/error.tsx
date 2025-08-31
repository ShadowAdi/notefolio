"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {  useEffect, useState } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    console.error("Global Error caught:", error);
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [error]);

  const getPupilStyle = (eyeX: number, eyeY: number) => {
    const dx = mouse.x - eyeX;
    const dy = mouse.y - eyeY;

    const angle = Math.atan2(dy, dx);
    const radius = 25;
    const pupilX = Math.cos(angle) * radius;
    const pupilY = Math.sin(angle) * radius;
    return { transform: `translate(${pupilX}px, ${pupilY}px)` };
  };

  return (
    <section className=" w-full h-screen py-6 px-8 flex flex-col space-y-4 bg-stone-900 items-center justify-center">
      <div className="flex items-center justify-end space-x-3">
        <h1 className="text-[200px] font-bold px-0 text-white">5</h1>
        <div className="w-[140px] h-[140px] flex items-center justify-center rounded-full bg-white relative overflow-hidden">
          <div
            className="absolute h-[60px] w-[60px] rounded-full bg-black transition-transform duration-75"
            style={getPupilStyle(
              window.innerWidth / 2 - 80,
              window.innerHeight / 2
            )}
          ></div>
        </div>

        <div className="w-[140px] h-[140px] flex items-center justify-center rounded-full bg-white relative overflow-hidden">
          <div
            className="absolute h-[60px] w-[60px] rounded-full bg-black transition-transform duration-75"
            style={getPupilStyle(
              window.innerWidth / 2 + 80,
              window.innerHeight / 2
            )}
          ></div>
        </div>
      </div>
      <div className=" text-white  flex items-center space-x-2 rounded-lg  max-w-xl">
        <h2 className="font-bold text-2xl text-red-500">Error:</h2>
        <p className="text-2xl">{error.message}</p>
      </div>
      <Link href={`/home`}>
      <Button className="bg-slate-100 hover:bg-slate-50 mt-3 text-black hover:shadow-sm text-base flex items-center justify-center">
          <ArrowLeft/>
        <span>
          Back To Home</span>
      </Button>
      </Link>
    </section>
  );
}
