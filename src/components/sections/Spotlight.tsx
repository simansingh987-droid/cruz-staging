import { Section, Heading, Lede } from "../ui/Section";
import { Cta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";
import { ThreadBranch } from "../ui/ThreadDiagram";
import { BrainGlyph } from "../ui/BrainGlyph";
import { LiveAnswer } from "./LiveAnswer";

/**
 * Row 15 — the flagship feature spotlight, and the Convergence's third and
 * final appearance.
 *
 * Hero: the brain forms. Row 6: the brain reaches out to its sources. Here:
 * the loop closes — a packet of light travels from a real artefact (an
 * invoice, an email, a call) into the brain, and an answer comes back out.
 * Data in, intelligence out, while you watch.
 */
const INPUTS = [
  {
    id: "invoice",
    label: "INVOICE #44182",
    icon: (
      <>
        <path d="M-8 -11h16v22l-4-2.5-4 2.5-4-2.5-4 2.5z" />
        <path d="M-4 -5h8M-4 0h8" />
      </>
    ),
  },
  {
    id: "email",
    label: "RE: DELIVERY DATE",
    icon: (
      <>
        <rect x="-10" y="-7" width="20" height="14" rx="1.5" />
        <path d="M-10 -6l10 7 10-7" />
      </>
    ),
  },
  {
    id: "call",
    label: "CALL · 14:02",
    icon: <path d="M-10 -3v6M-5 -8v16M0 -11v22M5 -7v14M10 -2v4" />,
  },
] as const;

const IN_PATHS = [
  "M140 44 C 260 44, 312 130, 392 130",
  "M140 130 C 260 130, 320 130, 392 130",
  "M140 216 C 260 216, 312 130, 392 130",
];

const IN_ROWS = [44, 130, 216];

const OUT_PATH = "M508 130 C 620 130, 690 130, 784 130";

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

        <Reveal delay={80} className="mt-14 hidden sm:block">
          <div className="border-rule/50 bg-paper/60 border p-4 sm:p-8">
            <svg
              viewBox="0 0 900 260"
              className="w-full"
              role="img"
              aria-label="Threads of light travel from an invoice, an email and a call recording into the Cruz brain mark, and an answer emerges from the other side."
            >
              {IN_PATHS.map((d, i) => (
                <ThreadBranch key={d} d={d} delay={i * 200} />
              ))}

              {INPUTS.map((src, i) => (
                // Labels sit beneath their box, not beside it — placing them
                // to the left pushed them outside the viewBox and the SVG
                // clipped them.
                <g key={src.id} transform={`translate(100 ${IN_ROWS[i]})`}>
                  <rect
                    x="-34"
                    y="-24"
                    width="68"
                    height="40"
                    rx="2"
                    fill="var(--color-card)"
                    stroke="var(--color-rule)"
                  />
                  <g
                    transform="translate(0 -4)"
                    fill="none"
                    stroke="var(--color-slate)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {src.icon}
                  </g>
                  <text
                    y="30"
                    textAnchor="middle"
                    fill="var(--color-mute)"
                    className=""
                    fontSize="10"
                    letterSpacing="0.8"
                  >
                    {src.label}
                  </text>
                </g>
              ))}

              <BrainGlyph x={450} y={130} scale={1.2} />

              <ThreadBranch d={OUT_PATH} delay={760} />

              {/* The answer emerging — forge-toned, because this is the part a
                  person acts on. */}
              <g transform="translate(830 130)">
                <rect
                  x="-44"
                  y="-30"
                  width="88"
                  height="60"
                  rx="2"
                  fill="var(--color-card)"
                  stroke="var(--color-slate)"
                  strokeOpacity="0.65"
                />
                <path
                  d="M-26 -12h52M-26 -2h52M-26 8h32"
                  stroke="var(--color-ink)"
                  strokeOpacity="0.55"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
        </Reveal>

        {/* ---- The answer, played rather than pictured. ---- */}
        <Reveal delay={140} className="mt-6">
          <LiveAnswer />
        </Reveal>

        <Reveal delay={180} className="mt-10">
          <Cta className="px-8 py-4 text-base" />
        </Reveal>
      </div>
    </Section>
  );
}
