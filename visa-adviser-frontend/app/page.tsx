import { HomeContent } from "@/components/home/home-content";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeContent />
      <Footer />
    </>
  );
}
