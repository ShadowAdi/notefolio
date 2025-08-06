import CTA from "@/components/global/hero/CTA";
import { DemoBlogs } from "@/components/global/hero/DemoBlogs";
import Features from "@/components/global/hero/Features";
import Footer from "@/components/global/hero/Footer";
import { HeroSection } from "@/components/global/hero/Hero";
import Navbar from "@/components/global/hero/Navbar";
import Testimonials from "@/components/global/hero/Testimonials";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
              <Navbar />

      <HeroSection />
      <Features />
      <Testimonials />
      <DemoBlogs  />
      <CTA/>
      <Footer/>
    </main>
  );
}
