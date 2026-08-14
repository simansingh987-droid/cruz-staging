"use client";

import { useEffect, useRef, useState } from "react";
import { Cta } from "../ui/Cta";
import { HeroStatic } from "./HeroStatic";
import { useIsNarrow, useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The hero.
 *
 * NOT SCROLL-DRIVEN ANY MORE. This used to be "The Convergence": a 640svh
 * track with a sticky viewport, where scroll position drove `video.currentTime`
 * through a keyframed scrub and swapped four taglines in and out of the left
 * column beat by beat. All of that is gone.
 *
 * The problem with it was the thing it was built to do. Scrubbing means the
 * page owns the wheel: six viewport-heights of scrolling advanced the visitor
 * through 34 seconds of footage instead of down the page, so reaching the
 * second section took a deliberate effort and reaching the fifth felt like
 * work. A hero should not be a toll gate.
 *
 * So the plate simply PLAYS — autoplay, muted, looped, on its own clock — and
 * the page scrolls at the speed the visitor expects. The composition is
 * unchanged: copy left, footage right, bleeding into the paper. What went with
 * the scrub is the per-frame tagline swap; the hero copy is now just the hero
 * copy, stated once and left alone.
 *
 * The on-load entrance cascade stays. It runs once, off a mount, and has never
 * had anything to do with scroll.
 */
export function ConvergenceHero() {
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();

  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Autoplay is REQUESTED, not assumed.
  //
  // `autoPlay` on the element is enough for the common case, but a muted
  // autoplay can still be refused — Low Power Mode on iOS is the usual reason,
  // and Chrome will reject the promise if the element is not yet attached the
  // way it wants. The play() call gives the browser a second chance once the
  // element has data, and swallowing the rejection matters: an unhandled
  // promise rejection in the hero is a console error on every affected device.
  // If it stays refused the poster is what shows, which is the same frame the
  // video opens on, so nothing looks broken.
  useEffect(() => {
    if (reduced !== false) return;
    const video = videoRef.current;
    if (!video) return;
    const attempt = () => void video.play().catch(() => {});
    attempt();
    video.addEventListener("loadeddata", attempt);
    return () => video.removeEventListener("loadeddata", attempt);
  }, [reduced, narrow]);

  if (reduced === null) return <div className="min-h-svh" aria-hidden />;
  if (reduced) return <HeroStatic />;

  /** The one entrance pattern, staggered. Reused by every section. */
  const cascade = (i: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "none" : "translateY(14px)",
    transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${120 + i * 110}ms, transform .9s cubic-bezier(.16,1,.3,1) ${120 + i * 110}ms`,
  });

  return (
    // One viewport tall, and that is all. The 640svh track this replaced was
    // the scrub's travel budget; with nothing being scrubbed there is nothing
    // for it to buy, and leaving it in place would have kept the six screens
    // of dead scroll that made the rest of the page hard to reach.
    //
    // `data-nav-overlay` marks this as a full-bleed VISUAL stretch. Nav.tsx
    // watches for these passing under the bar and drops its fill while one is
    // there, so the chrome gets out of the way of the imagery.
    <section
      id="top"
      data-nav-overlay
      className="relative flex min-h-svh w-full items-center overflow-hidden"
    >
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
      <div className="absolute inset-x-0 top-20 bottom-0 md:right-0 md:left-auto md:w-[62%]">
        {plateFailed ? (
          <div aria-hidden className="bg-rule/30 absolute inset-0" />
        ) : (
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
            // The frame-0 <Image> still that used to sit over this is gone
            // with the scrub. It existed so the opening frame was sharp before
            // the decoder had caught up with a seek; a video that just plays
            // has its own poster for that, and the still was only ever faded
            // out by the scroll handler that no longer exists.
            autoPlay
            muted
            loop
            playsInline
            // `auto` on desktop, `metadata` on phones. The vertical plate is
            // 7.3MB, and on cellular pulling all of it up front is a real cost
            // to the visitor. `metadata` takes the moov atom (the file is
            // written +faststart, so it is at the front) and the rest streams
            // as playback reaches it.
            preload={narrow ? "metadata" : "auto"}
            onError={() => setPlateFailed(true)}
            aria-hidden
          />
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

      {/* ================= COPY COLUMN (always left) =================
          Stated once. The four scroll-swapped taglines that used to crossfade
          through this same column went with the scrub — without a scrub there
          is no beat to hang them on, and a hero that rewrites itself while the
          visitor is trying to leave the page is the behaviour being removed. */}
      <div className="relative mx-auto flex w-full max-w-6xl items-center px-5 pt-28 pb-20 sm:px-8 sm:pt-32 lg:px-12">
        <div className="w-full max-w-xl">
          <p className="type-label text-slate mb-4 sm:mb-6" style={cascade(0)}>
            AI Operating System for Steel
          </p>
          <h1
            // Down from clamp(2.5rem,5.4vw,4.5rem). The ceiling stays above
            // the 3rem section headings so the hero is still the largest type
            // on the page, just no longer shouting.
            className="type-display text-ink text-[clamp(1.9rem,3.9vw,3.25rem)]"
            style={cascade(1)}
          >
            Where Steel Meets Intelligence
          </h1>
          <p
            className="text-mute mt-5 max-w-lg text-base leading-relaxed sm:mt-7 sm:text-lg"
            style={cascade(2)}
          >
            Cruz is the AI that knows your business the way your best people do
            — every system, every call, every decision, in one place.
          </p>
          {/* The Gerdau flagship badge used to sit below this CTA. It has moved
              into the client marquee — one logo among the others — so the hero
              ends on the call to action. */}
          <div className="mt-7 sm:mt-10" style={cascade(3)}>
            <Cta className="px-8 py-4 text-base" />
          </div>
        </div>
      </div>
    </section>
  );
}
