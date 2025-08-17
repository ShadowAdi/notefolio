"use client";
import { Pause, Play } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const PlayButton = ({ blogDescription }: { blogDescription: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utterenceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const handlePlayButton = async () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(blogDescription, "text/html");
      const text = doc.body.textContent || "";
      if (!isPlaying) {
        speechSynthesis.cancel();
        const utterence = new SpeechSynthesisUtterance(text);
        utterence.lang = "en-US";
        utterence.rate = 1;
        utterence.pitch = 1;
        utterence.onend = () => setIsPlaying(false);
        utterenceRef.current = utterence;
        speechSynthesis.speak(utterence);
        setIsPlaying(true);
      } else {
        speechSynthesis.cancel();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error(`Error in speech synthesis:`, error);
      toast.error("Failed to play blog audio");
    }
  };
  return (
    <div
      onClick={handlePlayButton}
      className="flex items-center cursor-pointer hover:bg-gray-200/30 rounded-full justify-center  h-10 w-10  border border-gray-300"
    >
      {isPlaying ? (
        <Pause className="text-base  text-gray-400 " />
      ) : (
        <Play className="text-base  text-gray-400 " />
      )}
    </div>
  );
};

export default PlayButton;
