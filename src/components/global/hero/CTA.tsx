import React from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { CtaProps } from "@/types/CtaProps";

const CTA = ({
  heading = "Be Part of the Conversation",
  description = "Turn your ideas into beautiful blogs and newsletters — no coding, no hassle.",
  buttons = {
    primary: {
      text: "Start Writing",
      url: "http://localhost:3000/auth/signin",
    },
  },
}: CtaProps) => {
  return (
    <section className="py-36 h-screen w-full bg-[#0A0A0A] text-white">
      <div className=" container px-6">
        <div className=" rounded-lg p-8 md:rounded-xl lg:p-12">
          <div className="max-w-4xl">
            <h3 className="mb-4 text-3xl font-semibold md:text-5xl lg:mb-6 lg:text-6xl">
              {heading}
            </h3>
            <p className="text-slate-50 mb-8 text-lg font-medium lg:text-xl">
              {description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              {buttons.primary && (
                <Button size="lg" className="w-full bg-slate-50 hover:bg-slate-100 !cursor-pointer text-black sm:w-auto" asChild>
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href={buttons.secondary.url}>
                    {buttons.secondary.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
