import { Section, Heading } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

/**
 * Row 10 — answers the procurement/security question before it is asked.
 * A steel CFO forwards this section to IT; it has to survive that reading.
 */
const PILLARS = [
  {
    title: "Built by operators, not just engineers",
    body: "The team behind Cruz has spent years inside steel ERP implementations. The product knows your workflow because we've had to live in it.",
    icon: (
      <path
        d="M4 20v-2a5 5 0 015-5h6a5 5 0 015 5v2M12 3a4 4 0 100 8 4 4 0 000-8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Your data never leaves your control",
    body: "Cruz runs under a zero-data-retention agreement with Anthropic. Your operational data is not retained by the model provider and is never used to train anyone's model.",
    icon: (
      <path
        d="M12 3l7 3v6c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6l7-3zM9.5 12l1.8 1.9 3.5-3.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Live, not static",
    body: "This is not a document store you have to remember to update. Cruz ingests ERP records, email and call transcripts continuously, so what it knows is what's true today.",
    icon: (
      <path
        d="M12 7v5l3.2 2M21 12a9 9 0 11-3.2-6.9M21 3v4h-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function TrustPillars() {
  return (
    <Section id="company" className="border-rule/40 border-t">
      <Reveal>

        <Heading>The questions procurement always sends back</Heading>
      </Reveal>

      <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {PILLARS.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 90}>
            <span className="border-rule/70 text-slate flex h-11 w-11 items-center justify-center border">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none">
                {p.icon}
              </svg>
            </span>
            <h3 className="type-display text-ink mt-5 text-xl">{p.title}</h3>
            <p className="text-mute mt-3 text-sm leading-relaxed">{p.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
