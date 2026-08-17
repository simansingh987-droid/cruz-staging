import Image from "next/image";
import { Section, Heading, Lede, Eyebrow } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

/**
 * The people behind the product.
 *
 * Placed straight after the trust pillars, because it is the same argument
 * continued: the pillars claim how Cruz is built, and this is who is building
 * it. It reads as evidence there rather than as an "about us" aside.
 */
export function Team() {
  return (
    <Section id="team" className="border-rule/40 border-t">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="order-2 lg:order-1">
          <Reveal>
            <Eyebrow>Behind the product</Eyebrow>
            <Heading>The Team Behind Cruz</Heading>
          </Reveal>
          <Reveal delay={90}>
            <Lede>
              Cruz is built by the team behind EOXS — the same people who have
              spent years inside steel service centers, processors and mills,
              building the software those businesses actually run on.
            </Lede>
          </Reveal>
          <Reveal delay={180}>
            <Lede>
              That is why Cruz knows what a heat number is without being told.
              The domain knowledge is not a training set — it is the room in
              this photograph.
            </Lede>
          </Reveal>
        </div>

        <Reveal delay={270} className="order-1 lg:order-2">
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl shadow-slate/10 ring-1 ring-slate/5">
            <Image
              src="/photos/team-current.jpg"
              alt="The Cruz team standing in their office."
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Inner ring for a premium card feel */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
