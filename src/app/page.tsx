import Features from "@/components/global/Features";
import { HeroSection } from "@/components/global/Hero";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <HeroSection />
      <Features />
    </main>
  );
}
