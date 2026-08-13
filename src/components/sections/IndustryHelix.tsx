"use client";

import { useEffect, useRef } from "react";
import type { ProgressRef } from "../convergence/progress";

/**
 * The Industries section's connecting motif: a real 3D DNA double helix.
 *
 * WHY THIS IS A SCRUBBED VIDEO AND NOT THREE.JS: two procedural attempts
 * failed for the same underlying reason — getting a helix to read correctly
 * depends almost entirely on framing, material and lighting, none of which the
 * headless geometry checks can catch and none of which I can see here. The
 * second attempt put the camera effectively inside the helix, so the page
 * showed one enormous grey sine wave rather than a molecule.
 *
 * A generated render sidesteps all of that: it is a photoreal, properly lit,
 * correctly framed helix, and scroll drives `currentTime` so the rotation is
 * still under the visitor's control rather than autoplaying.
 *
 * The render is on a white field, matching the page, so it composites with no
 * mask. Industry photos sit in the DOM alongside it — see `Industries` — which
 * also makes them readable at any viewport, unlike planes mounted in 3D that
 * tumbled edge-on as they came round.
 */
export default function IndustryHelix({ progress }: { progress: ProgressRef }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const v = videoRef.current;
      if (!v || v.readyState < 2 || !Number.isFinite(v.duration)) return;

      const t = progress.current * v.duration;
      // Only seek on a meaningful delta — seeking every frame stalls the
      // decoder and the scrub goes choppy.
      if (Math.abs(v.currentTime - t) > 0.015) v.currentTime = t;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <video
      ref={videoRef}
      // Full-bleed: the render fills the pinned viewport edge to edge rather
      // than sitting letterboxed inside it. `cover` crops rather than pillars
      // because the helix is centred with margin to spare on every side.
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      src="/generated/dna-helix.mp4"
      poster="/generated/dna-helix-poster.jpg"
      muted
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}
