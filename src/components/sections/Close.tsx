import { Section, Heading } from "../ui/Section";
import { Cta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";

/**
 * Rows 17, 18 and 19 — final CTA, a deliberately short SEO block, and footer.
 *
 * The copy block is three paragraphs, not the long tail EOXS runs: growth here
 * is outbound and social, so over-investing in search copy would be effort
 * pointed the wrong way.
 */
export function FinalCta() {
  return (
    <Section id="fit-call" className="border-rule/40 border-t">
      <Reveal className="relative overflow-hidden">
        <div className="border-rule/60 bg-card/60 border px-7 py-16 text-center sm:px-12 sm:py-20">

          <Heading className="mx-auto max-w-3xl text-4xl sm:text-5xl md:text-6xl">
            Find out what Cruz would know about your floor
          </Heading>
          <p className="text-mute mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            Thirty minutes with someone who has implemented steel systems
            before. We look at what you run, tell you what Cruz could do with
            it, and say so directly if the answer is not much.
          </p>
          <div className="mt-10 flex justify-center">
            <Cta className="px-8 py-4 text-base" />
          </div>
          {/* Reassurance without echoing product-led vocabulary — naming the
              things we don't do would still put those words on the page. */}
          <p className="type-data text-mute/50 mt-8 text-center">
            30 minutes&nbsp;&middot; A straight answer&nbsp;&middot; No procurement paperwork to start
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

export function SeoBlock() {
  return (
    <Section className="border-rule/40 border-t">
      <div className="max-w-3xl">
        <h2 className="type-display text-ink text-xl">
          An AI operating system for steel service centers, processors and
          distributors
        </h2>
        <div className="text-mute mt-5 space-y-4 text-sm leading-relaxed">
          <p>
            AskCruz is an AI operating system built for the steel industry. It
            connects to the ERP, email and call recordings a mid-size service
            center, processor, tube mill or distributor already runs, and turns
            that flow into a single working picture of the business — current,
            not archived.
          </p>
          <p>
            Where a document store waits to be searched and a generic AI
            assistant knows nothing about your operation, Cruz learns how your
            company actually works: how quotes get priced, which customers
            tolerate a late ship, why margin moved last quarter, and what your
            most experienced people know that was never written down.
          </p>
          <p>
            Cruz sits on top of existing systems rather than replacing them.
            Implementation runs about five weeks, from read-only data
            connections through training on your operations to going live —
            with no migration and no change to how your floor works day to day.
          </p>
        </div>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-rule/40 border-t px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <p className="type-display text-ink text-lg">AskCruz</p>
          <p className="text-mute mt-3 text-sm leading-relaxed">
            An AI operating system for steel. Built on the operational
            experience behind EOXS.
          </p>
        </div>
      </div>

      <div className="border-rule/40 mx-auto mt-12 flex w-full max-w-6xl flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-mute/60 text-xs tracking-wide sm:text-[11px]">
          © {new Date().getFullYear()} AskCruz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
