import { Section, Heading, Lede } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { ThreadBranch } from "../ui/ThreadDiagram";
import { BrainGlyph } from "../ui/BrainGlyph";

/**
 * Row 6 — the capability stack, and the Convergence's second appearance.
 *
 * The hero showed the brain *forming* out of people. Here it is shown *being
 * fed*: ERP records, email and call transcripts stream inward and land on the
 * same mark. That inward direction is the whole point — Cruz ingests
 * continuously, it does not broadcast — and it is what ties this diagram to
 * the hero convergence. Cut it if it ever stops carrying that meaning.
 */
const SOURCES = [
  {
    id: "erp",
    label: "ERP",
    sub: "Orders · inventory · margin",
    icon: (
      <>
        <ellipse cx="0" cy="-7" rx="10" ry="4" />
        <path d="M-10 -7v14c0 2.2 4.5 4 10 4s10-1.8 10-4V-7" />
        <path d="M-10 0c0 2.2 4.5 4 10 4s10-1.8 10-4" />
      </>
    ),
  },
  {
    id: "email",
    label: "Email",
    sub: "What was actually promised",
    icon: (
      <>
        <rect x="-11" y="-8" width="22" height="16" rx="1.5" />
        <path d="M-11 -7l11 8 11-8" />
      </>
    ),
  },
  {
    id: "calls",
    label: "Call transcripts",
    sub: "The reasoning nobody logs",
    icon: (
      <>
        <path d="M-11 0v0M-11 -3v6M-6.5 -7v14M-2 -10v20M2.5 -6v12M7 -3v6M11 -1v2" />
      </>
    ),
  },
] as const;

const LAYERS = [
  {
    n: "01",
    name: "Company Brain",
    body: "Everything your business knows, held in one place and kept current — who does what, how the work is really done, and why past calls went the way they did.",
  },
  {
    n: "02",
    name: "Company Hands",
    body: "Cruz acts on what it knows: drafts the quote, flags the slipping order, files the call against the right account. Knowledge that does something.",
  },
  {
    n: "03",
    name: "Digital Workforce",
    body: "Standing roles rather than one-off answers. Cruz watches a queue, chases an exception, and reports back the way a coordinator would.",
  },
  {
    n: "04",
    name: "Company Personalization",
    body: "It converges on how your own company operates — your pricing logic, your tolerances, your vocabulary. Two steel businesses get two different Cruzes.",
  },
] as const;

function SourceNode({
  x,
  y,
  source,
  showSub = true,
}: {
  x: number;
  y: number;
  source: (typeof SOURCES)[number];
  /** The narrow composition sits the three nodes side by side, where the
   *  descriptions are wide enough to collide. Labels only there. */
  showSub?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x="-26"
        y="-26"
        width="52"
        height="52"
        rx="2"
        fill="var(--color-card)"
        stroke="var(--color-rule)"
      />
      <g
        fill="none"
        stroke="var(--color-slate)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      >
        {source.icon}
      </g>
      <text
        y="46"
        textAnchor="middle"
        fill="var(--color-ink)"
        className=""
        // Tighter in the narrow composition, where three labels share a row
        // and "CALL TRANSCRIPTS" would otherwise run into its neighbour.
        fontSize={showSub ? 12 : 9}
        letterSpacing={showSub ? 1.4 : 0.4}
      >
        {source.label.toUpperCase()}
      </text>
      {showSub ? (
        <text
          y="63"
          textAnchor="middle"
          fill="var(--color-mute)"
          className=""
          fontSize="10"
        >
          {source.sub}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Direction matters here, and the first pass had it backwards.
 *
 * Every path starts at a SOURCE and ends at the BRAIN, so both the draw-on and
 * the travelling light packet run inward. Cruz ingests continuously; it does
 * not broadcast. A diagram showing light leaving the brain and arriving at the
 * ERP says the opposite of the product — and the same inward motion is what
 * ties this section to the hero convergence.
 */

/** Wide composition: sources on the right, brain on the left. */
const WIDE_PATHS = [
  "M566 62 C 400 62, 330 170, 196 170",
  "M566 170 C 420 170, 350 170, 196 170",
  "M566 278 C 400 278, 330 170, 196 170",
];

/** Narrow composition: sources beneath, brain above. */
const NARROW_PATHS = [
  "M74 214 C 74 160, 160 150, 160 96",
  "M160 214 C 160 180, 160 170, 160 96",
  "M246 214 C 246 160, 160 150, 160 96",
];

export function CapabilityStack() {
  return (
    <Section id="product" className="border-rule/40 border-t">
      <Reveal>
        <Heading>What Cruz Knows Isn&rsquo;t a Guess</Heading>
        <Lede>
          It reads the systems your business already runs on — continuously, not
          as a one-time import. What it tells you on Thursday reflects what
          happened Wednesday.
        </Lede>
      </Reveal>

      {/* ---- The brain, acting. ---- */}
      <Reveal delay={80} className="mt-14">
        <div className="border-rule/50 bg-card/40 border p-4 sm:p-8">
          <svg
            // Height leaves room for the description under the lowest node —
            // at 340 the last line was clipped by the viewBox edge.
            viewBox="0 0 700 356"
            className="hidden w-full sm:block"
            role="img"
            aria-label="Threads of light travelling inward from three live data sources — ERP, email and call transcripts — into the Cruz brain mark."
          >
            {WIDE_PATHS.map((d, i) => (
              <ThreadBranch key={d} d={d} delay={i * 180} />
            ))}
            <BrainGlyph x={150} y={170} scale={1.15} />
            {SOURCES.map((s, i) => (
              <SourceNode
                key={s.id}
                x={592}
                y={[62, 170, 278][i]}
                source={s}
              />
            ))}
          </svg>

          <svg
            viewBox="0 0 320 330"
            className="w-full sm:hidden"
            role="img"
            aria-label="Threads of light travelling inward from three live data sources — ERP, email and call transcripts — into the Cruz brain mark."
          >
            {NARROW_PATHS.map((d, i) => (
              <ThreadBranch key={d} d={d} delay={i * 180} />
            ))}
            <BrainGlyph x={160} y={58} scale={0.72} />
            {SOURCES.map((s, i) => (
              <SourceNode
                key={s.id}
                x={[74, 160, 246][i]}
                y={240}
                source={s}
                showSub={false}
              />
            ))}
          </svg>
        </div>
      </Reveal>

      {/* ---- The four layers, in order of sophistication. ---- */}
      <ul className="mt-6 grid gap-px sm:grid-cols-2">
        {LAYERS.map((l, i) => (
          <Reveal
            as="li"
            key={l.n}
            delay={i * 70}
            className="border-rule/50 bg-card/50 border p-7 sm:p-8"
          >
            <div className="flex items-baseline gap-3">
              <span className="type-label text-slate">
                {l.n}
              </span>
              <h3 className="type-display text-ink text-xl sm:text-2xl">
                {l.name}
              </h3>
            </div>
            <p className="text-mute mt-3.5 text-sm leading-relaxed">{l.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
