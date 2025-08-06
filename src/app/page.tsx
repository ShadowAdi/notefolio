import Features from "@/components/global/Features";
import { HeroSection } from "@/components/global/Hero";
import Testimonials from "@/components/global/Testimonials";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <HeroSection />
      <Features />
      <Testimonials/>
    </main>
  );
}
