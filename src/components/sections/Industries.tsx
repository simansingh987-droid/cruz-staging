"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heading, Lede } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Row 5 — the steel taxonomy, reused directly from EOXS's own categories.
 *
 * The point of this section is recognition: a service-center COO should see
 * their exact operation named, not a generic "manufacturing" bucket. So it
 * follows eoxs.com's own "Industries We Serve" structure — a photo tile per
 * industry, with that industry's material forms called out underneath.
 *
 * THE SLITTING LINE — why the layout is what it is.
 *
 * The scroll-driven DNA helix that used to live here is gone. It was a
 * scrubbed video of a molecule, which is a biotech image doing duty in a steel
 * section: pretty, but it made no claim about the business and cost 420svh of
 * scroll plus a video decode to say nothing.
 *
 * What replaced it is a horizontal accordion built as a slitting line — the
 * machine that takes one wide coil and splits it into narrow strips, and one
 * of the four operations named on this very list. The panels ARE the strips:
 * the selected one runs out to full width while the rest stay held as narrow
 * lanes, and every seam carries a knife line. The metaphor is doing real work
 * here rather than being decoration, because "one wide thing divided into
 * lanes, one at a time" is exactly what an accordion is.
 *
 * It also costs the page nothing: four stills that were already in the repo,
 * a flex-grow transition, and no scroll hijacking at all.
 */
type Segment = {
  name: string;
  detail: string;
  /** The material forms this operation actually handles — EOXS's sub-tags. */
  forms: readonly string[];
  image: string;
  alt: string;
};

/**
 * Four, not eoxs.com's five.
 *
 * Their list separates "Steel Service Center" from "Steel Warehouse" but gives
 * both the identical material tags (coils, sheets, plates) — they are one
 * category split in two. Merging them keeps the taxonomy honest and, more
 * practically, avoids shipping a fifth tile with either a duplicated photo or
 * the washed-out yard exterior that is the only other still on hand. The
 * warehouse side of the work is named in the Service Centers copy instead.
 */
const SEGMENTS: readonly Segment[] = [
  {
    name: "Service Centers",
    detail:
      "Multi-location inventory down to the bin, with cycle counts and transfers that actually reconcile.",
    forms: ["Coils", "Sheets", "Plates", "Structural"],
    image: "/generated/industry-service-center.jpg",
    alt: "Racks of steel coils and stacked plate inside a service center.",
  },
  {
    name: "Processors",
    detail:
      "Slitting, cut-to-length, blanking and levelling — with toll work costed against the customer's own metal.",
    forms: ["Slitting", "Cut-to-length", "Blanking", "Plasma"],
    image: "/generated/industry-processor.jpg",
    alt: "A slitting line splitting a wide coil into narrow strips.",
  },
  {
    name: "Tube Mills",
    detail:
      "Mill scheduling against coil consumption, with yield and scrap tracked per run rather than per month.",
    forms: ["Tube", "Pipe", "Squares", "Rectangles"],
    image: "/generated/industry-tube-mill.jpg",
    alt: "Strip forming into welded tube through roll stands in a tube mill.",
  },
  {
    name: "Distributors",
    detail:
      "Buy-sell, mill direct, drop ship and consignment — every program on one margin picture.",
    forms: ["Carbon", "Hot & cold roll bar", "Flat roll", "Stainless"],
    image: "/generated/industry-distributor.jpg",
    alt: "Flatbed trucks being loaded with bundled structural steel.",
  },
];

/** How long a lane stays open before the line advances, in ms. */
const DWELL = 5200;

export function Industries() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  /** Set once the visitor takes over; the line stops advancing on its own. */
  const [manual, setManual] = useState(false);
  const [inView, setInView] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const select = useCallback((i: number) => {
    setManual(true);
    setActive(i);
  }, []);

  // Only run the line while it is actually on screen, and never under reduced
  // motion — an auto-advancing carousel is precisely the thing that preference
  // is asking not to see.
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced !== false || manual || !inView) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % SEGMENTS.length),
      DWELL,
    );
    return () => clearInterval(id);
  }, [reduced, manual, inView]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    select((active + delta + SEGMENTS.length) % SEGMENTS.length);
  };

  /** The line is running only when it is unattended, visible and allowed to. */
  const running = reduced === false && !manual && inView;

  return (
    <section id="industries" className="border-rule/40 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-8 md:pt-28 lg:px-12">
        <Reveal>
          <Heading>We speak your specific business</Heading>
          <Lede>
            Cruz is trained on steel operations first — not adapted from a
            generic manufacturing model. It knows what a heat number is, why a
            partial coil matters, and what happens when a slitter goes down.
          </Lede>
        </Reveal>
      </div>

      {/* ================= THE SLITTING LINE =================
          Full-bleed, because a coil running through a slitter does not have
          margins. The header above keeps the page's 6xl column; this does not. */}
      <Reveal delay={120}>
        <div
          ref={stripRef}
          role="tablist"
          aria-label="Steel operations Cruz is built for"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setManual(true)}
          // Stacked on phones, where four lanes would each be 24px of nothing;
          // slit horizontally from `md` up.
          className="bg-ink mt-14 flex h-[560px] w-full flex-col overflow-hidden md:mt-20 md:h-[68svh] md:min-h-[440px] md:flex-row"
        >
          {SEGMENTS.map((s, i) => {
            const open = i === active;
            return (
              <button
                key={s.name}
                type="button"
                role="tab"
                aria-selected={open}
                aria-label={s.name}
                onClick={() => select(i)}
                onFocus={() => select(i)}
                // `flex-[N]` is the whole mechanism: the open lane claims four
                // shares of the strip and the held lanes one each, so opening
                // one physically pushes the others narrow. Transitioning
                // flex-grow (not width) keeps the four lanes summing to exactly
                // 100% at every frame of the move, with no sub-pixel gap
                // opening at the seams mid-transition.
                className={`group relative isolate min-w-0 overflow-hidden text-left transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${
                  open ? "flex-[4]" : "flex-[1]"
                }`}
              >
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  // Held lanes are desaturated and dim; the open one comes up
                  // to full colour. The scale nudge is what stops the photo
                  // looking like it is being squeezed as the lane narrows —
                  // it is already slightly overscanned, so the crop tightens
                  // instead of the image compressing.
                  className={`object-cover transition-[filter,opacity,transform] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${
                    open
                      ? "scale-100 opacity-100 saturate-100"
                      : "scale-[1.12] opacity-55 saturate-0 group-hover:opacity-75"
                  }`}
                />

                {/* Two scrims. The base keeps every lane dark enough for white
                    type; the second is a bottom-up gradient that only the open
                    lane gets, so its copy block has its own footing. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 -z-0 transition-colors duration-[900ms] ${
                    open ? "bg-ink/35" : "bg-ink/60"
                  }`}
                />
                <span
                  aria-hidden
                  className={`from-ink/95 via-ink/45 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent transition-opacity duration-[900ms] ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* THE KNIFE LINE — the seam every lane carries on its leading
                    edge, standing in for the slitter's circular knife. Bright
                    hairline plus a short bloom bleeding off it, so it reads as
                    a cut being made rather than a table border. Suppressed on
                    the first lane, which has no neighbour to be cut from. */}
                {i > 0 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent md:inset-x-auto md:inset-y-0 md:left-0 md:h-auto md:w-px md:bg-gradient-to-b"
                  />
                ) : null}

                {/* The lane index, set enormous and nearly transparent behind
                    the copy — the strip number stencilled on the stand. */}
                <span
                  aria-hidden
                  className={`type-display pointer-events-none absolute -bottom-6 right-2 z-0 text-[7rem] leading-none text-white transition-opacity duration-[900ms] select-none sm:right-5 sm:text-[11rem] ${
                    open ? "opacity-[0.07]" : "opacity-0"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* ---- HELD LANE: name only.
                        Turned on its side from `md` up, where a held lane is a
                        112px-wide column: "Service Centers" does not fit across
                        that at any readable size, and vertical set type is the
                        honest answer to a tall narrow slot rather than an
                        ellipsis. Below `md` the lanes stack into 80px-tall
                        ROWS, which are wide and short — exactly the opposite
                        shape — so there the same label sets normally and hangs
                        off the left edge like a card title. Every held lane has
                        to be named on both: a row of unlabelled dim photos is
                        not a menu, it is four mystery boxes. */}
                <span
                  aria-hidden
                  className={`type-label absolute inset-0 z-10 flex items-center px-6 text-white/85 transition-opacity duration-500 md:justify-center md:px-0 ${
                    open ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="md:[writing-mode:vertical-rl]">
                    {s.name}
                  </span>
                </span>

                {/* ---- OPEN LANE: the full card. */}
                <span
                  className={`absolute inset-x-0 bottom-0 z-10 block p-6 transition-[opacity,transform] duration-700 ease-out sm:p-9 md:p-10 ${
                    open
                      ? "translate-y-0 opacity-100 delay-200"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <span className="type-label mb-3 block text-white/55">
                    {String(i + 1).padStart(2, "0")} / {String(SEGMENTS.length).padStart(2, "0")}
                  </span>
                  <span className="type-display block text-3xl text-white sm:text-4xl md:text-5xl">
                    {s.name}
                  </span>
                  <span className="mt-4 block max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                    {s.detail}
                  </span>

                  {/* The material forms — eoxs.com's own sub-tags per tile.
                      Staggered so they arrive after the lane has finished
                      opening rather than travelling with it. */}
                  <span className="mt-6 flex flex-wrap gap-2">
                    {s.forms.map((f, k) => (
                      <span
                        key={f}
                        className={`type-label block border border-white/25 px-3 py-1.5 text-white/80 transition-[opacity,transform] duration-500 ease-out ${
                          open
                            ? "translate-y-0 opacity-100"
                            : "translate-y-2 opacity-0"
                        }`}
                        style={{ transitionDelay: open ? `${340 + k * 70}ms` : "0ms" }}
                      >
                        {f}
                      </span>
                    ))}
                  </span>
                </span>

                {/* Dwell meter. Keyed on `active` so the element is REPLACED
                    each time the line advances — a CSS animation cannot be
                    restarted by changing a class, and without the remount the
                    bar would fill once and then sit there for every lane
                    after. It disappears the moment the visitor takes over,
                    because there is no longer a timer for it to describe. */}
                {open && running ? (
                  <span
                    key={active}
                    aria-hidden
                    className="dwell-meter absolute inset-x-0 bottom-0 z-20 h-0.5 origin-left bg-white/70"
                    style={{ animationDuration: `${DWELL}ms` }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 md:pb-28 lg:px-12">
        <FormsRow />
      </div>
    </section>
  );
}

const FORMS = [
  "Hot rolled coil",
  "Cold rolled",
  "Galvanized",
  "Plate",
  "Structural",
  "Tube & pipe",
  "Stainless",
  "Aluminum",
];

function FormsRow() {
  return (
    <Reveal delay={120} className="mt-14">
      <p className="type-label text-faint mb-5">Every form you carry</p>
      <ul className="flex flex-wrap gap-2">
        {FORMS.map((f) => (
          <li
            key={f}
            className="border-rule/70 text-mute type-label border px-3 py-2"
          >
            {f}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
