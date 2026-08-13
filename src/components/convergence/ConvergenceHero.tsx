"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Cta } from "../ui/Cta";
import { HeroStatic } from "./HeroStatic";
import { FlagshipBadge } from "./FlagshipBadge";
import { FRAME_COPY, beatProgress, scrubTime, smooth } from "@/lib/tokens";
import { useIsNarrow, useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The Convergence.
 *
 * STRUCTURE — the thing the first pass got wrong: the hero *is* frame 0 of
 * this sequence, not a section that appears after it. On load, with zero
 * scroll, the visitor sees the complete hero: headline, subhead, CTA and the
 * Gerdau badge on the left, the distant warehouse on the right. Scrolling
 * carries that same shot forward through the dock door and into the building.
 *
 * Composition is fixed across all five frames — copy left, visual right — so
 * the eye never has to re-find the text between frames.
 *
 * Pinning is CSS `position: sticky`; progress is measured natively from one
 * rect read per scroll. No scroll library, and it re-derives from live layout
 * so a resize or mobile URL-bar collapse needs no refresh call.
 *
 * Every per-frame update is imperative — routing scroll through React state
 * would re-render the hero on every scroll event.
 */
export function ConvergenceHero() {
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLDivElement>(null);
  /** Still + video together — faded out as one for the laptop payoff. */
  const plateRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  const progress = useRef(0);
  const target = useRef(0);

  const [plateFailed, setPlateFailed] = useState(false);
  /** Drives the on-load cascade. Set on mount so the entrance runs once. */
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (reduced === null) return;
    // Next frame, so the initial (hidden) styles are committed first and the
    // transition actually runs rather than being skipped.
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced !== false) return;

    const apply = (p: number) => {
      // --- Frame 0 still hands over to the video once the push begins. Both
      //     are the same shot — the video was generated *from* this still — so
      //     the handover is invisible.
      if (stillRef.current) {
        const handover = smooth(beatProgress(p, [0.1, 0.18]));
        stillRef.current.style.opacity = String(1 - handover);
      }

      // --- Camera push: scrub the plate by scroll position.
      //
      // `scrubTime` rather than a flat multiply: the pacing is keyframed so the
      // approach flies past and the brain and the closing machine crawl. See
      // SCRUB_KEYS for the rates.
      // Gate on `duration` alone, NOT on `readyState >= 2`.
      //
      // That old gate silently froze the entire sequence on phones. Switching
      // the mobile plate to `preload="metadata"` means the element settles at
      // readyState 1 (HAVE_METADATA) — duration known, no frame decoded — and
      // never climbs on its own, because nothing here ever calls play(). So
      // the seek below was skipped on every frame and the hero just sat on its
      // first frame while the page scrolled past it. Desktop hid the bug:
      // `preload="auto"` races to readyState 4 before anyone scrolls.
      //
      // readyState 1 is all a seek actually needs. Assigning currentTime is
      // what triggers the range request for that part of the file, so the
      // decode follows the scrub rather than having to precede it.
      const video = videoRef.current;
      if (video && Number.isFinite(video.duration)) {
        const t = scrubTime(p, video.duration);
        // 0.033s ≈ one frame at 30fps, raised from 0.015. Below one frame the
        // seek cannot change what is displayed, so the old threshold spent
        // decoder work on sub-frame requests that produced an identical
        // picture — and at 1920x1080 all-intra, every one of those is a full
        // independent frame decode. Skipping them is most of the perceived
        // smoothness gain on slower machines.
        if (Math.abs(video.currentTime - t) > 0.033) video.currentTime = t;
      }

      // --- Hero copy holds through frame 0, then clears for the taglines.
      if (heroCopyRef.current) {
        const out = smooth(beatProgress(p, [0.06, 0.15]));
        heroCopyRef.current.style.opacity = String(1 - out);
        heroCopyRef.current.style.transform = `translateY(${out * -22}px)`;
        heroCopyRef.current.style.pointerEvents = out > 0.4 ? "none" : "auto";
      }

      // --- One tagline per frame, crossfading at the boundaries.
      FRAME_COPY.forEach((frame, i) => {
        const el = frameRefs.current[i];
        if (!el) return;
        const [start, end] = frame.beat;
        const inN = smooth(beatProgress(p, [start, start + 0.05]));
        const outN = smooth(beatProgress(p, [end - 0.04, end]));
        const v = inN * (1 - outN);
        el.style.opacity = String(v);
        el.style.transform = `translateY(${(1 - v) * 16}px)`;
      });

      // --- Frame 4 needs no page-side staging any more.
      //
      // The laptop used to be a separate <Image> that rose into place while
      // this plate faded out from under it. The plate now performs that beat
      // itself — it pulls back off the brain, reveals the machine and titles
      // it — so the handover, the fade and the still are all gone. Nothing
      // here should touch plate opacity: fading it out would be fading out
      // the payoff.

      // The per-worker labels ("RECEIVING · 14 YRS" and friends) and the
      // near-opaque scrim that used to black out the plate for the brain glow
      // are both gone. The scrim went with them on purpose: with no overlay to
      // read against, it would only have hidden the plate's own ending.

      if (hintRef.current) {
        hintRef.current.style.opacity = String(
          1 - smooth(beatProgress(p, [0.0, 0.07])),
        );
      }
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
      target.current = measure();
      // Frames may not be arriving (background tab, throttled window). Being
      // in the right state matters more than smoothing it.
      if (performance.now() - lastFrame > 200) {
        progress.current = target.current;
        apply(progress.current);
      }
    };

    let raf = 0;
    let running = false;

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      lastFrame = now;
      target.current = measure();
      // 0.075, down from 0.11. The playhead chases the wheel more slowly, so
      // a flick resolves as a glide instead of a snap — this is what buys the
      // smoothness back after shortening the track. Lower is smoother but
      // laggier; below ~0.06 the plate visibly trails the scroll and starts
      // to feel disconnected from the input.
      progress.current += (target.current - progress.current) * 0.075;
      apply(progress.current);
    };

    /**
     * The loop only runs while the hero is on screen.
     *
     * Left unguarded it runs for the life of the page — a rect read, a video
     * seek check and a dozen style writes every frame, for a section the
     * visitor scrolled past minutes ago. On a laptop that is a core spinning
     * for nothing; on a phone it is battery and it steals frames from whatever
     * section the visitor is actually reading.
     */
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      // Settle on the true value on the way out, so leaving mid-beat doesn't
      // freeze the hero in a half-eased state it would still be in on return.
      progress.current = target.current = measure();
      apply(progress.current);
    };

    progress.current = measure();
    target.current = progress.current;
    apply(progress.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Re-apply once the plate reports its duration.
    //
    // With `preload="metadata"` the metadata lands well after this effect
    // first runs, so the initial apply() above happens while duration is still
    // NaN and the seek is skipped. Without this the plate holds frame 0 until
    // the visitor scrolls — which looks exactly like a broken animation to
    // someone who landed mid-page or restored a scroll position.
    const video = videoRef.current;
    const onMeta = () => apply(progress.current);
    video?.addEventListener("loadedmetadata", onMeta);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      // A margin of slack so the loop is already warm by the time any of it
      // is visible, rather than starting on the first visible pixel.
      { rootMargin: "20% 0px" },
    );
    if (trackRef.current) io.observe(trackRef.current);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video?.removeEventListener("loadedmetadata", onMeta);
    };
  }, [reduced]);

  if (reduced === null) return <div className="min-h-svh" aria-hidden />;
  if (reduced) return <HeroStatic />;

  /** The one entrance pattern, staggered. Reused by every section. */
  const cascade = (i: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "none" : "translateY(14px)",
    transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${120 + i * 110}ms, transform .9s cubic-bezier(.16,1,.3,1) ${120 + i * 110}ms`,
  });

  return (
    // 640svh. This is the lever that sets how far the FRAMES advance per unit
    // of wheel: a longer track spends more scroll on the same 34s of footage,
    // so each notch of the wheel moves the plate less and the sequence reads
    // slower and steadier.
    //
    // It briefly went the other way (380) on a reading of "decrease the
    // scrolling movement" as "less scroll distance". That is the opposite
    // control — shortening the track makes the frames race, because the same
    // footage has to fit in less travel. Longer track = slower frames.
    // `data-nav-overlay` marks this as a full-bleed VISUAL stretch. Nav.tsx
    // watches for these passing under the bar and drops its fill while one is
    // there, so the chrome gets out of the way of the imagery.
    <div
      id="top"
      ref={trackRef}
      data-nav-overlay
      className="relative h-[640svh] w-full"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* ================= VISUAL LAYER =================
            Sits right of centre and bleeds left behind the copy, faded into
            the paper so the text never needs a scrim to stay readable. */}
        {/* `top-20` clears the nav — measured at 77px tall, so 64 was not enough.
            The bar has no fill by design, so its links and CTA were sitting
            directly on the plate — and against the blown-out warehouse roof at
            the top of this clip, "For Steel", "Company" and the CTA were
            effectively invisible. Giving the bar its own background would undo
            the whole point of it being transparent, so the plate starts below
            it instead and the nav reads against paper. The gradient below
            feathers the new top edge so it is a fade, not a seam. */}
        <div className="absolute inset-x-0 bottom-0 top-20 md:left-auto md:right-0 md:w-[62%]">
          {plateFailed ? (
            <div aria-hidden className="bg-rule/30 absolute inset-0" />
          ) : (
            <div ref={plateRef} className="absolute inset-0">
              {/* Frame 0 — the distant establishing shot. A still, so it is
                  sharp and instant on load rather than waiting on a decode. */}
              <div ref={stillRef} className="absolute inset-0">
                <Image
                  src={
                    narrow
                      ? "/generated/approach-poster-vertical.jpg"
                      : "/generated/approach-poster.jpg"
                  }
                  alt="A steel service center seen from across its yard, with flatbed trucks loaded with steel coils outside the loading dock."
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 62vw"
                  className="object-cover"
                />
              </div>

              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={
                  narrow
                    ? "/generated/approach-vertical.mp4"
                    : "/generated/approach.mp4"
                }
                poster={
                  narrow
                    ? "/generated/approach-poster-vertical.jpg"
                    : "/generated/approach-poster.jpg"
                }
                muted
                playsInline
                // `auto` on desktop, `metadata` on phones. The vertical plate
                // is 7.3MB and `auto` pulled the whole thing down before the
                // visitor had scrolled a pixel — on cellular that is a real
                // cost to them and a slow first paint for no benefit. With
                // `metadata` the browser takes the moov atom (the file is
                // written +faststart, so it is at the front) and then range-
                // requests the rest as the scrub actually reaches it.
                preload={narrow ? "metadata" : "auto"}
                onError={() => setPlateFailed(true)}
                aria-hidden
              />
            </div>
          )}

          {/* Feather the visual into the page on its left, top and lower edges. */}
          <div
            aria-hidden
            className="from-paper via-paper/70 absolute inset-0 bg-gradient-to-r to-transparent md:via-transparent"
          />
          <div
            aria-hidden
            className="from-paper absolute inset-x-0 top-0 h-16 bg-gradient-to-b to-transparent"
          />
          <div
            aria-hidden
            className="from-paper absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent"
          />

        </div>

        {/* The WebGL intelligence layer used to mount here. Nothing was left
            in it once the threads, the brain and the procedural laptop came
            out, so the whole canvas — and three + R3F with it — is gone from
            the hero. `ConvergenceScene` and its parts stay on disk. */}

        {/* ================= COPY COLUMN (always left) ================= */}
        <div className="pointer-events-none absolute inset-0">
          {/* `pt` clears the fixed nav. The stack is vertically centred, so the
              padding only takes off the top and the whole block settles half
              that distance lower — enough that a two-line headline stops
              running under "AskCruz" and the nav links at narrow widths. */}
          {/* pt raised to 36/44 (was 28/32). The stack is vertically centred,
              so this padding only takes off the top and the block settles at
              half the added distance — on a short laptop viewport (~620px)
              the eyebrow was landing 24px under the nav, close enough to read
              as overlapping it. Measured rather than guessed: at 1280x900 the
              clearance was already fine, which is why this only shows up on
              short screens. */}
          <div className="mx-auto flex h-full w-full max-w-6xl items-center px-5 pt-36 sm:px-8 sm:pt-44 lg:px-12">
            <div className="relative w-full max-w-xl">
              {/* Frame 0 — the full hero, visible on load with no scroll. */}
              <div ref={heroCopyRef} className="pointer-events-auto">
                {/* Every gap in this stack is tightened on phones and restored
                    at `sm`. The desktop rhythm (mb-6 / mt-7 / mt-10 / mt-14)
                    adds up to ~140px of air, which a 667px handset does not
                    have to spare — it pushed the flagship badge down into the
                    "Scroll" hint at the bottom of the hero. Desktop spacing is
                    unchanged. */}
                <p className="type-label text-slate mb-4 sm:mb-6" style={cascade(0)}>
                  AI Operating System for Steel
                </p>
                <h1
                  // Down from clamp(2.5rem,5.4vw,4.5rem). The ceiling stays
                  // above the 3rem section headings so the hero is still the
                  // largest type on the page, just no longer shouting.
                  className="type-display text-ink text-[clamp(1.9rem,3.9vw,3.25rem)]"
                  style={cascade(1)}
                >
                  Where Steel Meets Intelligence
                </h1>
                <p
                  className="text-mute mt-5 max-w-lg text-base leading-relaxed sm:mt-7 sm:text-lg"
                  style={cascade(2)}
                >
                  Cruz is the AI that knows your business the way your best
                  people do — every system, every call, every decision, in one
                  place.
                </p>
                <div className="mt-7 sm:mt-10" style={cascade(3)}>
                  <Cta className="px-8 py-4 text-base" />
                </div>
                <div className="mt-8 sm:mt-14" style={cascade(4)}>
                  <FlagshipBadge />
                </div>
              </div>

              {/* Frames 1–4 — one tagline at a time, same left column. */}
              {FRAME_COPY.map((frame, i) => (
                <div
                  key={frame.text}
                  ref={(el) => {
                    frameRefs.current[i] = el;
                  }}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0"
                >
                  {/* Scaled down with the headline so the frames keep the same
                      relationship to it they had before. */}
                  <p className="type-display text-ink text-[clamp(1.6rem,3.2vw,2.6rem)]">
                    {frame.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll affordance — the sequence needs the visitor to start it. */}
        <div
          ref={hintRef}
          aria-hidden
          // Sits lower and shorter on phones. The full-height version is 60px
          // of affordance plus 28px of inset, and on a 667px handset that was
          // enough to reach up into the flagship badge. The desktop treatment
          // is unchanged.
          className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 sm:bottom-7 sm:gap-2.5"
          style={cascade(5)}
        >
          <span className="type-label text-faint">Scroll</span>
          <span className="via-faint h-5 w-px bg-gradient-to-b from-transparent to-transparent sm:h-9" />
        </div>
      </div>
    </div>
  );
}
