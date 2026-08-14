"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrainGlyph } from "../ui/BrainGlyph";
import { Reveal } from "../ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The four capability layers, as ONE DIAGRAM THAT ACCUMULATES.
 *
 * These were four bordered cards, then a text ladder. Both had the same
 * problem: they presented four things side by side, and these are not four
 * things. They are one capability deepening — Cruz knows, then acts on what it
 * knows, then holds standing roles doing the acting, then bends the whole of
 * it to one company's way of working. Every layer presupposes the one before
 * it, and a list cannot say that no matter how it is indented.
 *
 * So there is a single canvas and stepping forward only ever ADDS to it.
 * Nothing is cleared between layers; earlier layers stay on screen and drop
 * back to a quieter weight. By 04 the whole figure is present at once, which
 * is the argument: the last layer is not a separate feature, it is what the
 * first three become.
 *
 *   01  knowledge collects   inward threads from five sources into the mark
 *   02  work goes out        outward threads to three artefacts
 *   03  roles stand up       an orbit of standing workers around the mark
 *   04  it takes your shape  the orbit resolves into one company's contour
 *
 * Layer 4 draws TWO contours, the active one and a ghost of a different one,
 * because the claim it illustrates is specifically that two steel businesses
 * get two different Cruzes. One contour would have shown personalisation; two
 * shows that it differs per company, which is the actual sentence.
 *
 * The contours are GENERATED, not hand-drawn. A closed Catmull-Rom through
 * eight deliberately uneven radii gives a shape that is smooth everywhere and
 * obviously not a circle — hand-fudged bezier control points reliably produce
 * either a wobbly circle or a potato.
 */

const CX = 320;
const CY = 190;
// Threads stop 58 units out from (CX, CY) — just off the mark, so they touch
// it rather than cross it. That radius is baked into the path data below
// rather than held as a constant, because the paths are hand-placed curves
// and a constant that nothing reads is a constant that goes stale.

type Layer = {
  n: string;
  name: string;
  verb: string;
  body: string;
};

const LAYERS: readonly Layer[] = [
  {
    n: "01",
    name: "Company Brain",
    verb: "What it knows",
    body: "Everything your business knows, held in one place and kept current — who does what, how the work is really done, and why past calls went the way they did.",
  },
  {
    n: "02",
    name: "Company Hands",
    verb: "What it does",
    body: "Cruz acts on what it knows: drafts the quote, flags the slipping order, files the call against the right account. Knowledge that does something.",
  },
  {
    n: "03",
    name: "Digital Workforce",
    verb: "What it runs",
    body: "Standing roles rather than one-off answers. Cruz watches a queue, chases an exception, and reports back the way a coordinator would.",
  },
  {
    n: "04",
    name: "Company Personalization",
    verb: "What it becomes",
    body: "It converges on how your own company operates — your pricing logic, your tolerances, your vocabulary. Two steel businesses get two different Cruzes.",
  },
];

/** Sources feeding the brain, on the left arc. Paths end on the mark's edge. */
const IN_THREADS = [
  "M128 74 C 200 100, 240 130, 278 156",
  "M100 132 C 180 148, 220 160, 266 174",
  "M92 190 C 170 190, 210 190, 262 190",
  "M100 248 C 180 232, 220 220, 266 206",
  "M128 306 C 200 280, 240 250, 278 224",
];
const IN_DOTS: readonly [number, number][] = [
  [128, 74],
  [100, 132],
  [92, 190],
  [100, 248],
  [128, 306],
];

/** What Cruz produces, on the right. */
const OUT_THREADS = [
  "M378 168 C 430 150, 470 120, 500 108",
  "M378 190 C 430 190, 470 190, 500 190",
  "M378 212 C 430 230, 470 260, 500 272",
];
const OUT_TILES: readonly { y: number; label: string }[] = [
  { y: 104, label: "QUOTE" },
  { y: 190, label: "ORDER" },
  { y: 276, label: "CALL" },
];

const ORBIT_R = 112;
/** Standing roles, spaced around the orbit. */
const ORBIT_MARKS = [45, 135, 225, 315];

/**
 * A closed smooth curve through points at the given radii, one per 45°.
 *
 * Catmull-Rom converted to cubic beziers, which is the standard way to get a
 * curve that actually passes through its control points — a plain bezier chain
 * only approaches them, and for a shape this small the difference is the
 * difference between "a company's outline" and "a lumpy circle".
 */
function contour(radii: readonly number[], cx = CX, cy = CY) {
  const n = radii.length;
  const pts = radii.map((r, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

/** Two companies, two shapes. Same mean radius so neither reads as "bigger". */
const SHAPE_A = contour([134, 148, 132, 142, 136, 130, 145, 139]);
const SHAPE_B = contour([146, 131, 143, 133, 147, 138, 132, 142]);

/** How long a layer holds before the diagram advances, in ms. */
const DWELL = 4600;

export function CapabilityLayers() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const select = useCallback((i: number) => {
    setManual(true);
    setActive(i);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced !== false || manual || !inView) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % LAYERS.length),
      DWELL,
    );
    return () => clearInterval(id);
  }, [reduced, manual, inView]);

  // Under reduced motion the build is not a build — every layer shows at once,
  // which is the diagram's end state anyway, so nothing is withheld.
  const showAll = reduced !== false;
  const on = (i: number) => showAll || active >= i;
  /** Layers already passed sit back so the current one reads as the subject. */
  const weight = (i: number) =>
    showAll ? 1 : active === i ? 1 : active > i ? 0.42 : 0;
  const running = reduced === false && !manual && inView;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    select((active + d + LAYERS.length) % LAYERS.length);
  };

  return (
    <div ref={rootRef} className="mt-20">
      <Reveal>
        <p className="type-label text-faint mb-10">
          Each layer stands on the one before it
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,21rem)_1fr] lg:gap-14">
          {/* ---- The diagram. First on narrow screens, right on wide: it is
                  the thing being explained, so it should not be below the fold
                  of its own explanation on a phone. ---- */}
          <div className="order-1 lg:order-2">
            <svg
              viewBox="0 0 640 380"
              className="w-full"
              role="img"
              aria-label={`Diagram of the four Cruz capability layers, built up one on top of the last. Currently showing layer ${LAYERS[active].n}, ${LAYERS[active].name}.`}
            >
              {/* ===== 01 — knowledge collecting inward ===== */}
              <g
                style={{ opacity: weight(0), transition: "opacity .7s ease" }}
              >
                {IN_THREADS.map((d, i) => (
                  <g key={d}>
                    <path d={d} className="cap-line" />
                    {/* The pulse is a SECOND copy of the same path carrying a
                        short dash, offset over time. Pure CSS, so it needs no
                        SMIL and no offset-path — the property that broke these
                        diagrams on Safari once already (see ThreadDiagram). */}
                    <path
                      d={d}
                      className="cap-pulse"
                      style={{ animationDelay: `${i * 420}ms` }}
                    />
                  </g>
                ))}
                {IN_DOTS.map(([x, y]) => (
                  <circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="var(--color-slate)"
                  />
                ))}
              </g>

              {/* ===== 03 — the orbit of standing roles =====
                  Drawn BEFORE the mark and the outward threads so it passes
                  behind them rather than cutting across the artefact tiles. */}
              <g style={{ opacity: weight(2), transition: "opacity .7s ease" }}>
                <g className={on(2) ? "cap-orbit" : undefined}>
                  <circle
                    cx={CX}
                    cy={CY}
                    r={ORBIT_R}
                    fill="none"
                    stroke="var(--color-slate)"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="3 9"
                  />
                  {ORBIT_MARKS.map((deg) => {
                    const a = (deg * Math.PI) / 180;
                    return (
                      <circle
                        key={deg}
                        cx={CX + ORBIT_R * Math.cos(a)}
                        cy={CY + ORBIT_R * Math.sin(a)}
                        r="5"
                        fill="var(--color-paper)"
                        stroke="var(--color-slate)"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              </g>

              {/* ===== 04 — the company's own contour =====
                  Two of them: the ghost is a different company's shape, which
                  is the half of the claim a single outline cannot make. */}
              <g style={{ opacity: weight(3), transition: "opacity .7s ease" }}>
                <path
                  d={SHAPE_B}
                  fill="none"
                  stroke="var(--color-slate)"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                  strokeDasharray="2 7"
                />
                <path d={SHAPE_A} className="cap-contour" />
              </g>

              {/* ===== The mark. Always present — it is what every layer is
                      about, so it never fades. ===== */}
              <BrainGlyph x={CX} y={CY} scale={0.92} />

              {/* ===== 02 — work going out ===== */}
              <g style={{ opacity: weight(1), transition: "opacity .7s ease" }}>
                {OUT_THREADS.map((d, i) => (
                  <g key={d}>
                    <path d={d} className="cap-line" />
                    <path
                      d={d}
                      className="cap-pulse"
                      style={{ animationDelay: `${i * 520}ms` }}
                    />
                  </g>
                ))}
                {OUT_TILES.map((t) => (
                  <g key={t.label}>
                    <rect
                      x="506"
                      y={t.y - 21}
                      width="100"
                      height="42"
                      rx="2"
                      fill="var(--color-card)"
                      stroke="var(--color-rule)"
                    />
                    <text
                      x="556"
                      y={t.y + 4}
                      textAnchor="middle"
                      fill="var(--color-mute)"
                      fontSize="10"
                      letterSpacing="1.4"
                    >
                      {t.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>

          {/* ---- The four steps. ---- */}
          <ol
            className="order-2 lg:order-1"
            onMouseEnter={() => setManual(true)}
            onKeyDown={onKeyDown}
          >
            {LAYERS.map((l, i) => {
              const current = !showAll && i === active;
              return (
                <li key={l.n}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-current={current ? "step" : undefined}
                    // A hairline on the left that fills with slate for the
                    // current step — the same rule-and-accent vocabulary the
                    // rest of the page uses, rather than a bordered card.
                    className={`relative block w-full border-l py-4 pl-5 text-left transition-colors duration-500 ${
                      current || showAll ? "border-slate" : "border-rule/70"
                    }`}
                  >
                    {/* Dwell meter, keyed on `active` so it REMOUNTS each
                        advance — a CSS animation cannot be restarted by
                        changing a class, and without the remount it would fill
                        once and then sit still for every step after. */}
                    {current && running ? (
                      <span
                        key={active}
                        aria-hidden
                        className="dwell-meter bg-slate absolute top-0 -left-px block h-full w-px origin-top"
                        style={{
                          animationDuration: `${DWELL}ms`,
                          animationName: "dwell-fill-y",
                        }}
                      />
                    ) : null}

                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span
                        className={`type-label transition-colors duration-500 ${
                          current || showAll ? "text-slate" : "text-faint"
                        }`}
                      >
                        {l.n}
                      </span>
                      <span className="type-display text-ink text-xl">
                        {l.name}
                      </span>
                      <span className="type-label text-faint">{l.verb}</span>
                    </span>
                    {/* Body copy for the current step only. The other three are
                        titles until you get to them, which is what keeps this
                        a diagram with a caption rather than four paragraphs
                        competing with the picture. Always rendered, so the
                        text is in the DOM for search and screen readers. */}
                    <span
                      className={`text-mute block overflow-hidden text-sm leading-relaxed transition-all duration-500 ${
                        current || showAll
                          ? "mt-2.5 max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {l.body}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </div>
  );
}
