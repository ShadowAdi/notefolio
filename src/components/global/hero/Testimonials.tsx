import { testimonials } from "@/data/Hero/TestimonialsData";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Testimonials = () => {
  return (
    <section id="testimonies" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12 text-center space-y-3">
          <div className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-lg">
            Words from Others
          </div>
          <h1 className="text-3xl font-semibold lg:text-5xl">
            It's not just us.
          </h1>
          <p className="text-muted-foreground text-lg lg:text-xl">
            Here's what others have to say about us.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Link key={i} href={t.link} target="_blank">
              <div className="p-6 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full"
                    height={40}
                    width={40}
                  />
                  <div>
                    <h3 className="text-lg text-stone-900 font-semibold">
                      {t.name}
                    </h3>
                    <p className="text-stone-800 text-sm">{t.role}</p>
                  </div>
                </div>
                <p className="text-stone-800">{t.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
