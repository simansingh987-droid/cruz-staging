import { Nav } from "@/components/Nav";
import { ConvergenceHero } from "@/components/convergence/ConvergenceHero";
import { ClientMarquee } from "@/components/sections/ClientMarquee";
import { Industries } from "@/components/sections/Industries";
import { CapabilityStack } from "@/components/sections/CapabilityStack";
import { Integrations } from "@/components/sections/Integrations";
import { Voices } from "@/components/sections/Voices";
import { Diagnostic } from "@/components/sections/Diagnostic";
import { TrustPillars } from "@/components/sections/TrustPillars";
import { LearnsAndBuild } from "@/components/sections/LearnsAndBuild";
import { Spotlight } from "@/components/sections/Spotlight";
import { PriorityPicker } from "@/components/sections/PriorityPicker";
import { FinalCta, SeoBlock, Footer } from "@/components/sections/Close";

/**
 * Section order follows the architecture table in the brief exactly — it maps
 * eoxs.com's proven sequence onto Cruz's content and is a settled decision.
 *
 * Rows deliberately absent:
 *   11 — review/rating badges: none exist yet, and fabricating them is banned.
 *   13 — press/recognition logos: same.
 *   14 — duplicate integration strip: merged into row 7.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <ConvergenceHero />
        <ClientMarquee />
        <Industries />
        <CapabilityStack />
        <Integrations />
        <Voices />
        <Diagnostic />
        <TrustPillars />
        <LearnsAndBuild />
        <Spotlight />
        <PriorityPicker />
        <FinalCta />
        <SeoBlock />
      </main>
      <Footer />
    </>
  );
}
