import CTA from "@/components/global/hero/CTA";
import { DemoBlogs } from "@/components/global/hero/DemoBlogs";
import Features from "@/components/global/hero/Features";
import { HeroSection } from "@/components/global/hero/Hero";
import Testimonials from "@/components/global/hero/Testimonials";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <HeroSection />
      <Features />
      <Testimonials />
      <DemoBlogs  />
      <CTA/>
    </main>
  );
}
