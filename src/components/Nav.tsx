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
 * The asset is the UNCROPPED master, supplied late and worth the wait. The
 * file that shipped before it was 640x378 and cut on three sides: ink ran off
 * the left edge and the bottom, so all three converging arms ended in flat
 * vertical shears instead of the rounded caps the render actually draws. No
 * amount of reconstruction fixed that honestly — the geometry was simply not
 * in the file.
 *
 * The replacement arrived 2400x1792 with the editor's transparency
 * CHECKERBOARD baked in as opaque pixels (its alpha channel was uniformly
 * 255), the same defect the Salesforce and QuickBooks marks had. It is knocked
 * out on colour: the checkerboard is perfectly neutral grey and every part of
 * the artwork — including the pale glass disc behind the node, the one piece a
 * brightness threshold destroys — carries blue, B−R ≥ 46 against the
 * background's 0.
 *
 * ALPHA IS FEATHERED BY DISTANCE TO THE KNOCKED-OUT REGION, NOT BY COLOUR.
 * A first pass feathered by colour saturation instead — ramping alpha down
 * wherever a pixel was low-saturation, on the reasoning that the mark/
 * checkerboard boundary is itself a low-saturation blend. That reasoning had
 * a blind spot: the specular HIGHLIGHT on each rounded cap is *also*
 * low-saturation, being close to white, and it sits nowhere near the actual
 * silhouette edge. Feathering by colour alone quietly punched partial-alpha
 * holes straight through the highlights — worst on the bottom-left arm, where
 * the brightest highlight happens to sit right at the tip, so that arm read as
 * fading out / cut off exactly where a visitor would look for its cap. Fixed
 * by computing a literal pixel-distance-to-background map instead: only
 * pixels within ~2px of a real edge get feathered, so a highlight forty pixels
 * from the silhouette boundary is left at full alpha regardless of how
 * desaturated its colour is.
 *
 * SAVED LOSSLESS, not the quality-95 lossy WEBP an earlier pass used. Lossy
 * compression re-touches the alpha channel too, and on an image whose only
 * mid-tone alpha values are meant to be a deliberate 2px feather ring,
 * lossy's own compression artefacts are large enough to matter at this size.
 *
 * Trimmed to the ink and shipped at 480px — roughly 11x the largest size this
 * has ever rendered at (44px), which is headroom for retina displays without
 * carrying the full 2400px source's file weight for no visible benefit.
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
      width={480}
      height={328}
      // `h-9 w-auto` — 36px tall, 53px wide. NOT a forced square box.
      //
      // This mark carries a lot of structure for its size: three converging
      // arms, a node, a glass disc and a chevron across a 1.46:1 frame. Bench
      // rendering the real (correct, uncropped) asset at 36 / 40 / 44 / 48 /
      // 52 / 64px found the caps read cleanly from 44 up and comfortably from
      // 48. 36 is BELOW that floor on purpose, at explicit request, after two
      // prior steps down (48 -> 44 -> 40 -> this) — each arm comes out close to
      // 2px wide, thin enough to look faint rather than clipped. The asset
      // itself is not the problem this time: nothing is cropped, there is
      // simply very little of it left to render. If "the logo looks cut off"
      // comes back, the fix is sizing back up, not touching this file again.
      className="h-9 w-auto shrink-0 object-contain"
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
      className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
    >
      {/* Same max-width and horizontal padding as the hero's copy column
          (see ConvergenceHero's `max-w-6xl px-5 sm:px-8 lg:px-12`), so the
          wordmark lands exactly where the hero headline starts instead of at
          a pill's own, narrower, centred inset. */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Primary"
          // ONE pill spanning the content column — not two.
          //
          // Giving the wordmark its own pill beside the links pill fixed the
          // overlap problem (page copy was scrolling under an unbacked mark)
          // but produced two floating capsules with a gap between them, which
          // reads as two navigation bars rather than one.
          //
          // `-mx-[13px]` against `px-3` is what lets a single pill do both jobs
          // at once. The fill extends past the content column on each side,
          // while the pill's CONTENT box starts exactly ON the column edge —
          // so the wordmark sits at the hero headline's x, unmoved, and the
          // CTA ends flush with the column's right edge. Padding without the
          // negative margin would have pushed both inward by 12px.
          //
          // 13, not 12, because the pill is `border` — one pixel of it. The
          // margin has to cancel border + padding, and at -12 the wordmark
          // measured exactly 1px right of the h1 it is meant to line up with.
          //
          // Translucent + backdrop-blur, NOT an opaque fill. The bar has to
          // stay readable over the hero footage — the reason it stopped being
          // transparent — but at 80% over a blur the page reads through it as
          // texture rather than legible detail, so the links keep their
          // contrast while the bar stops looking like a slab pasted on top.
          //
          // Two states, switched by what is currently behind the bar. Over a
          // visual the fill, border and shadow all drop away so the chrome
          // stops competing with the imagery; the blur is deliberately KEPT
          // even then, since it is the only thing standing between these links
          // and the blown-out warehouse roof that made them unreadable when
          // this bar was last fully transparent. Over ordinary content the
          // pill comes back, transitioned rather than snapped.
          className={`-mx-[13px] flex items-center justify-between gap-5 rounded-full border px-3 py-1.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ease-out ${
            overVisual
              ? "border-transparent bg-transparent shadow-none"
              : "bg-paper/80 border-rule/60 shadow-[0_8px_30px_-12px_rgba(43,66,87,0.28)]"
          }`}
        >
          <Link
            href="#top"
            // `-my-1 py-1` restores the 44px minimum hit target: the mark is
            // 36px now, 8px under it. The padding grows the tappable box by
            // 4px top and bottom while the matching negative margin cancels it
            // in layout, so the pill's height and the wordmark's position are
            // both unchanged by it.
            className="-my-1 flex shrink-0 items-center gap-2.5 py-1"
            aria-label="AskCruz home"
          >
            <CruzMark />
            <span className="type-display text-ink text-base tracking-tight">
              AskCruz
            </span>
          </Link>

          {/* Links and CTA travel together, hard right. `justify-between` on
              the pill would otherwise fan them across the full column now that
              it is 6xl rather than the 3xl the old links-only pill was. */}
          <div className="flex items-center gap-5">
            <ul className="hidden items-center gap-8 md:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  {/* Hover does two things at once: the label takes the brand
                      slate, and it lifts off the page — a small rise plus a
                      soft shadow cast down and behind it, so the link reads as
                      a physical key being raised rather than just recoloured.
                      `active` presses it back down flat, which is what makes
                      the lift feel like depth instead of a wobble. */}
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
              // reliably land on. The negative margin keeps it optically
              // aligned to the pill's content edge despite the extra padding.
              className="text-ink -mr-2.5 p-2.5 md:hidden"
            >
              <span className="sr-only">
                {open ? "Close menu" : "Open menu"}
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden
                fill="none"
              >
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
          </div>
        </nav>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          // Its own rounded card below the pill, not a panel welded under a
          // full-width band — the old `border-t` was there to butt against a
          // bar that no longer spans the viewport, and would have hung in
          // mid-air on its own. Padded to the same 6xl content column as the
          // header row above it, so its edges line up with the wordmark.
          className="mx-auto mt-2 max-w-6xl px-5 sm:px-8 lg:px-12 md:hidden"
        >
          <div className="border-rule/60 bg-paper/95 rounded-3xl border px-5 pt-3 pb-6 shadow-[0_8px_30px_-12px_rgba(43,66,87,0.28)] backdrop-blur-xl">
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
        </div>
      ) : null}
    </header>
  );
}
