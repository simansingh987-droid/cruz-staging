import { Section, Heading, Lede } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { ThreadBranch } from "../ui/ThreadDiagram";
import { BrainGlyph } from "../ui/BrainGlyph";
import { CapabilityLayers } from "./CapabilityLayers";

/**
 * Row 6 — the capability stack, and the Convergence's second appearance.
 *
 * The hero showed the brain *forming* out of people. Here it is shown *being
 * fed*: ERP records, emails and call transcripts stream down from the top of
 * the frame and land on the same mark below. That inward direction is the
 * whole point — Cruz ingests continuously, it does not broadcast — and it is
 * what ties this diagram to the hero convergence. Cut it if it ever stops
 * carrying that meaning.
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
    // Plural, unlike the singular "Email" the Diagnostic checklist uses. There
    // it names a system you either run or don't; here it names the material
    // being read, and the other two labels on this diagram are plural records
    // ("Orders · inventory · margin", "Call transcripts") — a singular in the
    // middle read as the app rather than the correspondence.
    label: "Emails",
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
 *
 * BOTH COMPOSITIONS NOW RUN TOP-TO-BOTTOM: the three sources sit across the
 * top and the brain sits under them. The wide one used to run right-to-left
 * and the narrow one bottom-to-top, which meant the same argument was made in
 * two different directions depending on the visitor's screen width — and the
 * narrow version had light climbing *up* into the brain, so the material
 * appeared to rise out of the systems rather than collect. Downward is the
 * direction the eye already reads in, and things that collect, collect below.
 */

/**
 * Wide composition: sources across the top, brain centred beneath them.
 *
 * Sources sit at x 175 / 350 / 525. That is 175 apart, not the full width of
 * the frame: each node carries a caption under it ("Orders · inventory ·
 * margin" is the widest, ~125px at 10px), and spreading them further does not
 * buy anything once the captions clear each other. It also keeps the fan angle
 * gentle enough that the outer threads read as curves rather than diagonals.
 *
 * Threads start at y=130 — below the captions, not at the node edge, so they
 * do not run through the type — and land at y=276, which is 46 above the
 * brain's centre and therefore just inside its upper edge rather than at its
 * middle. Same inset the right-to-left version used.
 */
const WIDE_PATHS = [
  "M175 130 C 175 215, 350 205, 350 276",
  "M350 130 C 350 195, 350 215, 350 276",
  "M525 130 C 525 215, 350 205, 350 276",
];

/** Narrow composition: same top-to-bottom reading, three nodes to a row. */
const NARROW_PATHS = [
  "M74 105 C 74 165, 160 175, 160 224",
  "M160 105 C 160 150, 160 175, 160 224",
  "M246 105 C 246 165, 160 175, 160 224",
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
        {/* No fill. This was `bg-card/40` — a white wash on paper — which put a
            near-white slab behind a diagram whose three source nodes are
            themselves white cards. The nodes stopped reading as raised objects
            because they were the same colour as the surface they sat on. The
            panel now takes the page's own paper, so the only white in the
            frame is the three boxes, which is where the eye should go. The
            hairline border stays; it is what frames the diagram. */}
        <div className="border-rule/50 border p-4 sm:p-8">
          <svg
            // 420 tall, up from 356. The frame is no longer sized by the
            // stacked column of nodes but by the full descent: captions end at
            // y=123, and the brain runs 253–391 at this scale, so anything
            // shorter clipped the mark's lower edge.
            viewBox="0 0 700 420"
            className="hidden w-full sm:block"
            role="img"
            aria-label="Threads of light travelling downward from three live data sources — ERP, emails and call transcripts — into the Cruz brain mark below them."
          >
            {WIDE_PATHS.map((d, i) => (
              <ThreadBranch key={d} d={d} delay={i * 180} />
            ))}
            <BrainGlyph x={350} y={322} scale={1.15} />
            {SOURCES.map((s, i) => (
              <SourceNode
                key={s.id}
                x={[175, 350, 525][i]}
                y={52}
                source={s}
              />
            ))}
          </svg>

          <svg
            viewBox="0 0 320 330"
            className="w-full sm:hidden"
            role="img"
            aria-label="Threads of light travelling downward from three live data sources — ERP, emails and call transcripts — into the Cruz brain mark below them."
          >
            {NARROW_PATHS.map((d, i) => (
              <ThreadBranch key={d} d={d} delay={i * 180} />
            ))}
            <BrainGlyph x={160} y={262} scale={0.72} />
            {SOURCES.map((s, i) => (
              <SourceNode
                key={s.id}
                x={[74, 160, 246][i]}
                y={46}
                source={s}
                showSub={false}
              />
            ))}
          </svg>
        </div>
      </Reveal>

      <CapabilityLayers />
    </Section>
  );
}
