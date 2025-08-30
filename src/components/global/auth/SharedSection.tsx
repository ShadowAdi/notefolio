import Image from "next/image";
import React from "react";

const SharedSection = () => {
  return (
    <section className="w-full h-[100vh] relative">
      <Image
        src="https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=1600&auto=format&fit=cover&q=80"
        alt="Office image"
        fill
        className="object-cover"
        priority 
      />
    </section>
  );
};

export default SharedSection;