import { Header } from "@/components/Header";
import "./home-landing.css";
import {
  AutonomousAgentsShowcase,
  HomeHero,
  MarketplaceSubletTeaser,
  PaymentOrchestrationBar,
  PlatformEnginesSection,
} from "@/components/landing";
import { fetchPlatformEnginesPublic } from "@/lib/api";
import { ScrollStorySection } from "@/components/ScrollStorySection";
import { AmbientIdentityModule } from "@/components/AmbientIdentityModule";
import { PrestigeMarquee } from "@/components/PrestigeMarquee";
import { ExoticPillars } from "@/components/ExoticPillars";
import { ConfiguratorPreview } from "@/components/ConfiguratorPreview";
import { FeaturedInventory } from "@/components/FeaturedInventory";
import { PremiumServices } from "@/components/PremiumServices";
import { TestDriveStrip } from "@/components/TestDriveStrip";
import { TrustStrip } from "@/components/TrustStrip";

/** Marketing home: SSR-friendly shell; hero WebGL loads via `HomeHero` → `DynamicHeroShell` (no SSR on Canvas). */
export default async function HomePage() {
  const platformEngines = await fetchPlatformEnginesPublic();

  return (
    <>
      <Header />
      <AmbientIdentityModule />
      <main id="main-content" className="home-main home-landing" aria-label="Vex dealer platform home">
        <HomeHero />
        <AutonomousAgentsShowcase />
        <PlatformEnginesSection initial={platformEngines} />
        <MarketplaceSubletTeaser />
        <PaymentOrchestrationBar />
        <ScrollStorySection />
        <PrestigeMarquee />
        <ExoticPillars />
        <ConfiguratorPreview />
        <FeaturedInventory />
        <PremiumServices />
        <TestDriveStrip />
        <TrustStrip />
      </main>
    </>
  );
}
