import { Section, Heading, Lede } from "../ui/Section";
import { Cta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";
import { LiveAnswer } from "./LiveAnswer";

/**
 * Row 15 — the flagship feature spotlight.
 *
 * The section used to open with a second thread diagram: artefacts on the
 * left, the brain mark in the middle, an answer on the right. It is gone — see
 * the note in the markup below — leaving the heading, the claim, and
 * `LiveAnswer` actually performing it. `CapabilityStack` is now the page's
 * single diagrammatic statement of how Cruz ingests.
 */
export function Spotlight() {
  return (
    <Section bleed className="bg-card/45 border-rule/40 border-y">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-3xl">

          <Heading className="text-4xl sm:text-5xl md:text-6xl">
            Ask Cruz What Happened This Week
          </Heading>
          <Lede>
            Not a dashboard you have to interpret. A question, asked the way
            you&rsquo;d ask your best operations manager — answered from live
            orders, live email and last week&rsquo;s calls.
          </Lede>
        </Reveal>

        {/* The second brain diagram lived here — an SVG that ran packets from
            an invoice, an email and a call recording into the brain mark and
            an answer out the far side. Removed. It was the same picture as the
            one in `CapabilityStack` with different labels on the boxes, so the
            page made the ingest argument diagrammatically twice, and the
            second time it sat directly above `LiveAnswer`, which demonstrates
            the very thing the diagram was illustrating. Showing the answer
            beats drawing an arrow toward it. */}

        {/* ---- The answer, played rather than pictured. ----
            `mt-14` where it used to be `mt-6`: it followed the diagram before
            and only needed to clear it, and now it follows the lede and has to
            carry the section break itself. */}
        <Reveal delay={80} className="mt-14">
          <LiveAnswer />
        </Reveal>
      </div>
    </Section>
  );
}
