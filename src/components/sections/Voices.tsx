import Image from "next/image";
import { Section, Heading, Lede } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

const VOICES = [
  {
    name: "David Verville",
    title: "Vice President (Quality and Process Improvement)",
    company: "Eaton Steel",
    photo: "/photos/david-verville.webp",
    quote:
      "With AI, I think you'll see more of the analytics integrated in because customers oftentimes don't have a real good sense of what they're using and how often they need it.",
  },
  {
    name: "Timothy Quinn",
    title: "Chief Commercial Officer / Vice President (Sales)",
    company: "American Consolidated Industries, Inc.",
    photo: "/photos/timothy-quinn.webp",
    quote:
      "You're going to see people move more into a technology based arena — more and more customer portals, more access to system sharing.",
  },
  {
    name: "Eric Engels",
    title: "Sales Manager (Coated Metals Division)",
    company: "Camden Yards Steel",
    photo: "/photos/eric-engels.webp",
    quote:
      "If the steel industry doesn't really migrate towards an e-commerce type platform, I think it's going to cause some issues.",
  },
] as const;

export function Voices() {
  return (
    <Section id="for-steel" className="border-rule/40 border-t">
      <Reveal>
        <Heading>What People Are Saying</Heading>
        <Lede>
          Every operator we talk to describes the same bottleneck in different
          words: the company already knows the answer, but only one person does,
          and they&rsquo;re on a truck, in a meeting, or gone.
        </Lede>
      </Reveal>

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {VOICES.map((v, i) => (
          <Reveal
            as="li"
            key={i}
            delay={i * 90}
            className="border-rule/50 bg-card/50 flex flex-col border px-6 py-8"
          >
            {/* Person first, quote second. These are real named operators, so
                the face and name carry the credibility — leading with them and
                setting the quote smaller underneath makes the attribution the
                anchor rather than a footnote under a wall of italics. */}
            <div className="flex items-center gap-4">
              <Image
                src={v.photo}
                alt={`${v.name}, ${v.title} at ${v.company}`}
                width={160}
                height={160}
                sizes="80px"
                className="border-rule/40 bg-paper h-20 w-20 shrink-0 rounded-full border object-cover"
              />
              <div className="min-w-0">
                <p className="type-display text-ink text-lg font-semibold leading-snug sm:text-xl">
                  {v.name}
                </p>
                <p className="text-slate mt-1 text-xs font-medium">
                  {v.company}
                </p>
              </div>
            </div>

            <p className="text-mute mt-3 text-xs leading-snug">{v.title}</p>

            <blockquote className="text-ink/85 border-rule/30 mt-5 flex-1 border-t pt-5 text-sm leading-relaxed">
              <span aria-hidden className="text-slate/40 mr-1 text-base">
                &ldquo;
              </span>
              {v.quote}
            </blockquote>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
