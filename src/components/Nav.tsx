"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cta } from "./ui/Cta";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#for-steel", label: "For Steel" },
  { href: "#company", label: "Company" },
];

/**
 * The mark: the same three-strokes-converging-to-a-node composition as the
 * old flat SVG (`CruzMark`, now retired), rendered from the supplied 3D
 * asset — glossy navy tubes, originally composed on black.
 *
 * Rendered from the LIGHT-BACKDROP version of the asset, which is why this
 * one comes out clean. The earlier render was lit on black with a bloom, and
 * no post-hoc separation handled it well: treating it as additive light left
 * the navy tubes semi-transparent, while a luminance threshold hollowed the
 * right-hand chevron into an outline, because that shape's navy is no
 * brighter than the black behind it. Here the backdrop is light and the
 * tubes are dark, so a border flood-fill separates them exactly — 73% of the
 * frame lifted with the mark untouched.
 *
 * The source is CROPPED: the lower-left arm runs off the bottom edge of the
 * supplied file. Verified at true render size before shipping — at 44px the
 * cut is not perceptible. It would be at large sizes, so re-export with the
 * full mark in frame before using this anywhere bigger.
 *
 * NOT used for the browser-tab favicon: at 16px the detail collapses into an
 * unreadable blur (verified by rendering at true size) — the flat linework
 * mark survives that size and this render does not, so favicon.ico keeps the
 * old asset.
 */
function CruzMark() {
  return (
    <Image
      src="/brand/askcruz-mark.webp"
      alt=""
      width={640}
      height={378}
      className="h-8 w-8 shrink-0 object-contain"
      priority
    />
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  /** True while a full-bleed visual stretch is passing under the bar. */
  const [overVisual, setOverVisual] = useState(false);

  useEffect(() => {
    // Rect maths on scroll, deliberately NOT IntersectionObserver.
    //
    // The question here is "does a visual currently sit UNDER the bar", which
    // is a comparison against one thin strip of the viewport. An observer
    // answers "is it anywhere in view", and these tracks are 640svh and
    // 420svh — they stay in view for most of the page, so the bar would stay
    // stripped long after the visual had passed it. That is expressible with
    // a negative rootMargin, but it then has to be torn down and rebuilt on
    // every resize because rootMargin is fixed at construction, and this
    // codebase has already been bitten once by IntersectionObserver quietly
    // never firing (see ThreadDiagram.tsx, where observing an SVG child broke
    // the diagrams on Safari). Two rect reads per scroll is cheaper than that
    // class of bug, and the hero already runs its own scroll loop regardless.
    const measure = () => {
      // Queried on every pass, NOT captured once on mount. ConvergenceHero
      // renders a bare placeholder until its reduced-motion check resolves,
      // so at the moment this effect first runs the hero's track does not
      // exist yet — a one-time querySelectorAll silently misses it and the
      // bar then never reacts to the largest visual on the page. The
      // selector is a single attribute match over a handful of nodes.
      const targets = document.querySelectorAll<HTMLElement>(
        "[data-nav-overlay]",
      );
      const header = document.querySelector("header");
      const bar = header?.getBoundingClientRect().bottom ?? 80;
      // A visual covers the bar when it spans the strip from 0 to the bar's
      // lower edge — i.e. it starts at or above that line and has not yet
      // scrolled fully past the top of the viewport.
      let covered = false;
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < bar && r.bottom > 0) covered = true;
      });
      setOverVisual(covered);
    };
    // Measured straight off the scroll event, not deferred into rAF. Three
    // rect reads is little enough to do inline, and rAF is throttled or
    // suspended whenever the page is not compositing — a background tab, or a
    // hidden preview — which would strand the bar in whichever state it held
    // when the frames stopped. React bails out of a re-render when the value
    // is unchanged, so the common case costs nothing beyond the reads.
    measure();
    // The hero's track mounts a beat after this effect (reduced-motion check,
    // then a dynamic import), so the first pass above can run before the
    // largest visual on the page exists. Without these the bar would render
    // filled over the hero on a fresh load and only correct itself once the
    // visitor scrolled.
    const retries = [60, 250, 800].map((ms) => window.setTimeout(measure, ms));

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      retries.forEach(clearTimeout);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Close the mobile sheet on Escape — expected behaviour for a dialog-ish
  // disclosure, and cheap to support.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent the page from scrolling beneath the open mobile menu.
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <header
      // A floating pill rather than a full-width band welded to the top edge.
      // The padding here is what detaches it — the bar no longer spans the
      // viewport, it hovers inside it, which is the current convention for
      // this kind of marketing site and reads as considerably lighter than a
      // hard-edged strip.
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4"
    >
      <nav
        aria-label="Primary"
        // Translucent + backdrop-blur, NOT the previous opaque fill. The bar
        // still has to stay readable over the hero footage — that was the
        // whole reason it stopped being transparent — but at 80% over a blur
        // the page reads through it as texture rather than legible detail, so
        // the links keep their contrast while the bar stops looking like a
        // solid slab pasted on top.
        //
        // Two states, switched by what is currently behind the bar.
        //
        // Over a visual (hero plate, DNA helix) the fill, border and shadow
        // all drop away so the chrome stops competing with the imagery. The
        // backdrop-blur is deliberately KEPT even then: it is not a
        // background, it just softens whatever is behind the type, and it is
        // the only thing standing between these links and the stretch of
        // blown-out warehouse roof that made them unreadable when this bar
        // was last fully transparent.
        //
        // Over ordinary content the pill comes back. Transitioned rather than
        // snapped, so passing a section boundary reads as the bar settling in
        // rather than a flicker.
        //
        // max-w-4xl (896px) — narrowed from 5xl, originally 6xl. The pill sits
        // well inside the page's own 6xl content width, which is what makes it
        // read as floating rather than as a band with rounded ends.
        className={`mx-auto flex w-full max-w-3xl items-center justify-between gap-5 rounded-full border px-3.5 py-1.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ease-out sm:px-4 sm:py-1.5 ${
          overVisual
            ? "border-transparent bg-transparent shadow-none"
            : "bg-paper/80 border-rule/60 shadow-[0_8px_30px_-12px_rgba(43,66,87,0.28)]"
        }`}
      >
        <Link
          href="#top"
          // `-my-2 py-2` lifts the home link's hit box from 28px to 44px
          // without shifting the wordmark — the padding is absorbed by the
          // matching negative margin.
          className="-my-2 flex items-center gap-2.5 py-2"
          aria-label="AskCruz home"
        >
          <CruzMark />
          <span className="type-display text-ink text-base tracking-tight">
            AskCruz
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              {/* Hover does two things at once: the label takes the brand
                  slate, and it lifts off the page — a small rise plus a soft
                  shadow cast down and behind it, so the link reads as a
                  physical key being raised rather than just recoloured.
                  `active` presses it back down flat, which is what makes the
                  lift feel like depth instead of a wobble. */}
              <Link
                href={l.href}
                className="text-mute hover:text-slate inline-block text-sm font-medium transition-all duration-200 ease-out will-change-transform hover:-translate-y-0.5 hover:[text-shadow:0_6px_12px_rgba(43,66,87,0.28)] active:translate-y-0 active:[text-shadow:none]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Cta className="px-4 py-2 text-xs" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          // p-2.5 puts the hit box at 44px — the minimum a fingertip can
          // reliably land on. The negative margin keeps it optically aligned
          // to the container edge despite the extra padding.
          className="text-ink -mr-2.5 p-2.5 md:hidden"
        >
          <span className="sr-only">
            {open ? "Close menu" : "Open menu"}
          </span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          // Its own rounded card below the pill, not a panel welded under a
          // full-width band — the old `border-t` was there to butt against a
          // bar that no longer spans the viewport, and would have hung in
          // mid-air on its own.
          className="border-rule/60 bg-paper/95 mx-auto mt-2 max-w-3xl rounded-3xl border px-5 pt-3 pb-6 shadow-[0_8px_30px_-12px_rgba(43,66,87,0.28)] backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-ink border-rule/35 block border-b py-3.5 text-base font-medium"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Cta className="mt-6 w-full justify-center" />
        </div>
      ) : null}
    </header>
  );
}
