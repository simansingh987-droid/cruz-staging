"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Section, Heading, Lede } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { beatProgress, smooth } from "@/lib/tokens";
import { useReducedMotion } from "@/lib/useReducedMotion";

const IndustryHelix = dynamic(() => import("./IndustryHelix"), { ssr: false });

/**
 * Row 5 — the steel taxonomy, reused directly from EOXS's own categories.
 *
 * The point of this section is recognition: a service-center COO should see
 * their exact operation named, not a generic "manufacturing" bucket.
 *
 * Presentation is a scroll-driven double helix rather than a grid. The helix
 * rotates as the visitor scrolls, bringing one industry to the front at a
 * time. The description alternates left/right down the list — that alternation
 * is deliberate, not incidental: it keeps the eye moving across the helix
 * instead of reading a single static column beside it.
 *
 * Copy is unchanged from the grid version; only the layout is new.
 */
const SEGMENTS = [
  {
    name: "Service Centers",
    detail: "Coils, sheets, plates, structural — multi-location inventory.",
    corner: "tl",
    image: "/generated/industry-service-center.jpg",
    alt: "Racks of steel coils and stacked plate inside a service center.",
  },
  {
    name: "Processors",
    detail: "Slitting, cut-to-length, blanking, levelling, toll processing.",
    corner: "tr",
    image: "/generated/industry-processor.jpg",
    alt: "A slitting line splitting a wide coil into narrow strips.",
  },
  {
    name: "Tube Mills",
    detail: "Mill scheduling, coil consumption, yield and scrap tracking.",
    corner: "bl",
    image: "/generated/industry-tube-mill.jpg",
    alt: "Strip forming into welded tube through roll stands in a tube mill.",
  },
  {
    name: "Distributors",
    detail: "Buy-sell, mill direct, drop ship, and consignment programs.",
    corner: "br",
    image: "/generated/industry-distributor.jpg",
    alt: "Flatbed trucks being loaded with bundled structural steel.",
  },
] as const;

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

/** Each industry owns an equal slice of the section's scroll. */
const SLICE = 1 / SEGMENTS.length;

/**
 * Where each caption sits, and which way it comes in from.
 *
 * One per corner, clockwise from top-left. The molecule owns the middle of the
 * frame, so the copy stays out at the edges; entering along the diagonal from
 * its own corner means the movement always reads as coming from off-frame
 * rather than sliding around inside it.
 */
const CORNERS = {
  tl: {
    place: "left-4 top-[12%] text-left sm:left-8 lg:left-12",
    dx: -1,
    dy: -1,
  },
  tr: {
    place: "right-4 top-[12%] text-right sm:right-8 lg:right-12",
    dx: 1,
    dy: -1,
  },
  bl: {
    place: "left-4 bottom-[12%] text-left sm:left-8 lg:left-12",
    dx: -1,
    dy: 1,
  },
  br: {
    place: "right-4 bottom-[12%] text-right sm:right-8 lg:right-12",
    dx: 1,
    dy: 1,
  },
} as const;

/** How far out of its corner a caption starts, in px. */
const ENTRY_TRAVEL = 52;

export function Industries() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduced !== false) return;

    const apply = (p: number) => {
      if (p > 0.005) setArmed(true);

      SEGMENTS.forEach((segment, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const start = i * SLICE;
        // Crossfade so exactly one industry is legible at a time.
        const inN = smooth(beatProgress(p, [start, start + SLICE * 0.34]));
        const outN =
          i === SEGMENTS.length - 1
            ? 0
            : smooth(beatProgress(p, [start + SLICE * 0.76, start + SLICE]));
        const v = inN * (1 - outN);
        const { dx, dy } = CORNERS[segment.corner];
        const away = (1 - v) * ENTRY_TRAVEL;
        el.style.opacity = String(v);
        el.style.transform = `translate(${dx * away}px, ${dy * away}px)`;
        el.style.pointerEvents = v > 0.5 ? "auto" : "none";
      });
    };

    const measure = () => {
      const track = trackRef.current;
      if (!track) return 0;
      const travel = track.offsetHeight - window.innerHeight;
      if (travel <= 0) return 0;
      return Math.min(
        1,
        Math.max(0, -track.getBoundingClientRect().top / travel),
      );
    };

    let lastFrame = 0;
    const onScroll = () => {
      progress.current = measure();
      if (performance.now() - lastFrame > 200) apply(progress.current);
    };

    let raf = 0;
    let running = false;

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      lastFrame = now;
      progress.current = measure();
      apply(progress.current);
    };

    // Same visibility gate as the hero: this loop also drives a video scrub,
    // and there is no reason for it to run while the visitor is three sections
    // away. See `ConvergenceHero` for the full reasoning.
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      progress.current = measure();
      apply(progress.current);
    };

    apply(measure());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "20% 0px" },
    );
    if (trackRef.current) io.observe(trackRef.current);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  // Reduced motion gets the same content as a plain stacked list — every
  // industry legible at once, no scroll dependency, no helix.
  if (reduced !== false) {
    return (
      <Section className="border-rule/40 border-t">
        <Reveal>
          
          <Heading>We speak your specific business</Heading>
          <Lede>
            Cruz is trained on steel operations first — not adapted from a
            generic manufacturing model. It knows what a heat number is, why a
            partial coil matters, and what happens when a slitter goes down.
          </Lede>
        </Reveal>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2">
          {SEGMENTS.map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 80}>
              <div className="border-rule/60 relative aspect-[4/3] w-full overflow-hidden rounded-sm border">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <h3 className="type-display text-ink mt-5 text-2xl">{s.name}</h3>
              <p className="text-mute mt-2 text-sm leading-relaxed">
                {s.detail}
              </p>
            </Reveal>
          ))}
        </ul>

        <FormsRow />
      </Section>
    );
  }

  return (
    <section className="border-rule/40 border-t">
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

      {/* Scroll track — one viewport per industry, plus a lead-in. */}
      {/* `data-nav-overlay` — see Nav.tsx. The helix runs full-bleed behind
          this whole track, so the nav drops its fill while it is passing. */}
      <div
        ref={trackRef}
        data-nav-overlay
        className="relative h-[420svh] w-full"
      >
        <div className="sticky top-0 flex h-svh w-full items-center overflow-hidden">
          {/* The helix runs behind everything as the connecting motif. */}
          {armed ? (
            <IndustryHelix progress={progress} />
          ) : null}

          {/* Captions are corner-anchored, one per corner in reading order:
              Service Centers top-left, Processors top-right, Tube Mills
              bottom-left, Distributors bottom-right. `inset-y-0` gives the
              bottom pair something to hang off; the middle is left clear for
              the molecule.

              Copy only — the DOM photo card that used to sit beside the helix
              is gone: the render carries its own industry panels, and a second
              set of stills laid over them just collided with the footage. The
              stacked reduced-motion list above still shows every photo. */}
          <div className="absolute inset-y-0 left-1/2 w-full max-w-6xl -translate-x-1/2">
            {SEGMENTS.map((s, i) => (
              <div
                key={s.name}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className={`absolute w-[min(12rem,calc(50%-1.5rem))] opacity-0 will-change-transform sm:w-[min(22rem,calc(100%-2.5rem))] ${CORNERS[s.corner].place}`}
              >
                <p className="type-label text-slate mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="type-display text-ink text-2xl sm:text-3xl">
                  {s.name}
                </h3>
                <p className="text-mute mt-3 text-sm leading-relaxed">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 md:pb-28 lg:px-12">
        <FormsRow />
      </div>
    </section>
  );
}

function FormsRow() {
  return (
    <Reveal delay={120} className="mt-10">
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
