import Image from "next/image";
import React from "react";

const SharedSection = () => {
  return (
    <section
      className="w-1/2
    flex-1 h-screen relative"
    >
      <Image
        src="https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=1600&auto=format&fit=cover&q=80"
        alt="Office image"
        fill
        className="object-cover w-1/2 h-full"
      />
    </section>
  );
};

export default SharedSection;
