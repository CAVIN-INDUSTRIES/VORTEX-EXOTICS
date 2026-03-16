import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedInventory } from "@/components/FeaturedInventory";
import { PremiumServices } from "@/components/PremiumServices";
import { TrustStrip } from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedInventory />
        <PremiumServices />
        <TrustStrip />
      </main>
    </>
  );
}
