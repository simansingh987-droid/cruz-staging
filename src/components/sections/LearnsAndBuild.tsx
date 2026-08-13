import { Section, Heading, Lede } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

/**
 * Row 12 — two splits.
 *
 * "What Cruz Learns" breaks the Brain/Hands distinction into concrete
 * artefacts, and "How It Gets Built" answers the objection every steel buyer
 * raises third: *how does this actually get installed, and what does it cost
 * my people?*
 */
const BRAIN = [
  "Who does what, and who to ask when they're out",
  "How your quotes actually get priced, including the exceptions",
  "Which customers tolerate a late ship and which never will",
  "Why last quarter's margin moved, in your own vocabulary",
];

const HANDS = [
  "Draft the quote, with your terms and your pricing logic",
  "Flag the order that's about to miss its promise date",
  "Summarise the call and file it against the right account",
  "Answer the question a report was never built to cover",
];

const STAGES = [
  {
    step: "01",
    title: "Connect your data sources",
    time: "Week 1",
    body: "Read-only connections to your ERP, mail and call recording. No migration, no schema changes, nothing removed from service.",
  },
  {
    step: "02",
    title: "Train on your operations",
    time: "Weeks 2–4",
    body: "We sit with your people, capture how the work is really done, and encode the judgment that isn't written down anywhere.",
  },
  {
    step: "03",
    title: "Go live",
    time: "Week 5",
    body: "Your team starts asking Cruz real questions. It keeps ingesting as you work, so it gets more current every day rather than staler.",
  },
];

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className="bg-slate/70 mt-[0.6rem] h-px w-4 shrink-0"
          />
          <span className="text-mute text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LearnsAndBuild() {
  return (
    <>
      <Section className="border-rule/40 border-t">
        <Reveal>

          <Heading>Two halves of the same system</Heading>
          <Lede>
            The Brain is everything your company knows. The Hands are what it
            does with that. One without the other is either a search box or a
            robot with no context.
          </Lede>
        </Reveal>

        {/* Two halves, presented as two halves.
            The previous version was two identical bordered boxes side by side,
            which said "two unrelated lists" rather than "one system split down
            the middle". This gives them a single shared rule between them and
            an animated node riding it, so the divider itself carries the
            relationship. Generous whitespace, no box chrome. */}
        <div className="relative mt-16 grid gap-14 md:grid-cols-2 md:gap-0">
          {/* The seam. Vertical on desktop, horizontal on mobile. */}
          <div
            aria-hidden
            className="via-rule pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent to-transparent md:inset-y-0 md:left-1/2 md:h-auto md:w-px md:bg-gradient-to-b"
          >
            <span className="bg-slate absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            <span className="bg-slate/25 absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full" />
          </div>

          <Reveal className="md:pr-14 lg:pr-20">
            <span className="type-label text-slate">Company Brain</span>
            <h3 className="type-display text-ink mt-4 text-3xl sm:text-4xl">
              What it knows
            </h3>
            <List items={BRAIN} />
          </Reveal>

          <Reveal delay={140} className="md:pl-14 lg:pl-20">
            <span className="type-label text-slate">Company Hands</span>
            <h3 className="type-display text-ink mt-4 text-3xl sm:text-4xl">
              What it does
            </h3>
            <List items={HANDS} />
          </Reveal>
        </div>
      </Section>

      <Section id="how-it-works" className="border-rule/40 border-t">
        <Reveal>

          <Heading>Five weeks, and nobody changes how they work</Heading>
        </Reveal>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STAGES.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 90} className="relative">
              {/* Connector rule between stages — structural, not decorative. */}
              {i < STAGES.length - 1 ? (
                <span
                  aria-hidden
                  className="bg-rule/60 absolute top-3 left-[4.5rem] hidden h-px w-[calc(100%-4rem)] md:block"
                />
              ) : null}
              <div className="flex items-baseline gap-4">
                <span className="type-display text-slate text-2xl">
                  {s.step}
                </span>
                <span className="type-data text-mute/70">{s.time}</span>
              </div>
              <h3 className="type-display text-ink mt-4 text-xl">{s.title}</h3>
              <p className="text-mute mt-3 text-sm leading-relaxed">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>
    </>
  );
}
