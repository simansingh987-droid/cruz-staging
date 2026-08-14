import { Section, Heading } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

/**
 * Row 12 — the rollout.
 *
 * Answers the objection every steel buyer raises third: *how does this
 * actually get installed, and what does it cost my people?*
 *
 * This file was `LearnsAndBuild.tsx` and rendered TWO sections. The first,
 * "Two halves of the same system", split the Brain/Hands distinction into two
 * columns of concrete artefacts. It is gone, along with the Company Brain /
 * Company Hands cards that used to sit under the diagram in `CapabilityStack`
 * — the same vocabulary was being taught in two places and demonstrated in
 * neither. Renamed with it, because a component called `LearnsAndBuild` that
 * only builds is a worse signpost than no name at all.
 */
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

export function HowItWorks() {
  return (
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
              <span className="type-display text-slate text-2xl">{s.step}</span>
              <span className="type-data text-mute/70">{s.time}</span>
            </div>
            <h3 className="type-display text-ink mt-4 text-xl">{s.title}</h3>
            <p className="text-mute mt-3 text-sm leading-relaxed">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
