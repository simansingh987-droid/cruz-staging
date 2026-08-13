/**
 * Single source of truth for values shared between CSS and WebGL.
 *
 * The Three.js layer cannot read Tailwind's `@theme` custom properties at
 * material-construction time, so the palette is mirrored here. If a colour
 * changes in `globals.css`, change it here too — these two must not drift.
 */
export const PALETTE = {
  paper: "#faf9f7",
  card: "#ffffff",
  ink: "#1a1a1a",
  mute: "#6e7276",
  rule: "#e6e4df",
  /** The page accent — CTAs, active states, 2D thread diagrams. */
  slate: "#2b4257",
  /** Lighter pass — glow, rim light. */
  slateSoft: "#5b7f9e",
} as const;

/**
 * Colours for the 3D sequence only.
 *
 * Deliberately scoped away from PALETTE: these render over the dark warehouse
 * interior, never against the white page, so they follow the reference art
 * rather than the site's restrained chrome. Using any of these for buttons,
 * borders or type would break the luxury-minimal direction everywhere else.
 */
export const SCENE = {
  /** Threads. Bright lime/chartreuse, emissive over the dark plate. */
  thread: "#b6ff2e",
  threadGlow: "#8fdd1a",
  /** Brain mesh — glowing blue wireframe. */
  brainMesh: "#3fa9ff",
  brainDeep: "#0b3f7a",
  /** Energy concentrated toward the brain's centre. */
  brainCore: "#ff8a1e",
  brainCoreHot: "#ffd08a",
} as const;

/**
 * The Convergence, frame by frame, as normalised scroll progress.
 *
 * IMPORTANT STRUCTURAL POINT: frame 0 is the hero itself, at scroll position
 * zero. The hero is not a payoff that appears once the sequence finishes — the
 * visitor lands on a complete hero (headline, subhead, CTA, flagship badge)
 * with no scroll required, and scrolling then carries that same shot forward
 * into the building. Getting this backwards was the main defect in the first
 * pass.
 *
 * Beats overlap on purpose so the sequence reads as continuous motion rather
 * than a series of discrete states.
 */
export const BEATS = {
  /** Frame 0 — the hero. Exterior wide shot, full hero copy, Gerdau badge. */
  hero: [0.0, 0.13],
  /** Frame 1 — camera pushes toward the dock door from the same shot. */
  approach: [0.15, 0.3],
  /** Frame 2 — the boardroom; the people the system is actually about. */
  interior: [0.35, 0.52],
  /** Frame 3 — threads leave their heads and braid into the brain. */
  converge: [0.58, 0.84],
  /**
   * Frame 4 — pull back to reveal the brain on a laptop screen.
   *
   * Clears by 0.88 on purpose. The plate renders its own "Ask CRUZ" from ~0.88
   * onward, and two pieces of display type arriving together read as a collision
   * rather than a close, so this one is gone before that lands.
   */
  command: [0.86, 0.93],

  /**
   * Video scrub. Spans almost the whole track, because the plate is now the
   * entire sequence: the 23s clip carries the push, the filaments, the white
   * blowout, the brain AND the pull-back to the laptop, so there is nothing
   * left for the page to stage after it. It used to stop at 0.62 and hand off
   * to a separate laptop layer; that layer is gone.
   *
   * The tagline beats above are pinned to what the plate is actually showing
   * at that scroll position — 0.84 of track across 23s of footage, so roughly
   * 0.0365 of scroll per second of video. Re-derive them if the plate is ever
   * recut, or the copy will describe the wrong shot.
   */
  push: [0.13, 0.97],

  /** Each worker registers individually, never simultaneously. */
  worker: [
    [0.4, 0.56],
    [0.46, 0.62],
    [0.52, 0.68],
  ],
  /** The brain forms as the threads land on it. */
  brain: [0.66, 0.84],
  /** The laptop assembles around the finished mark. */
  laptop: [0.86, 0.98],
} as const;

/**
 * Scroll → playhead map for the plate, as (scroll, fraction-of-video) pairs.
 *
 * WHY THIS IS NOT LINEAR. The 23s clip is not 23s of equally interesting
 * footage. A straight mapping spends the same scroll on the truck yard as on
 * the brain, which gets it backwards twice over: the approach is travel the
 * eye reads instantly and starts to fidget through, while the brain and the
 * final machine are the two things the whole sequence exists to deliver and
 * they flick past before they register.
 *
 * So the rate is shaped deliberately. Video-seconds consumed per unit of
 * scroll, by segment:
 *
 *   yard → dock door → aisle          0–15s   75.0  fastest, it is transit
 *   cut to the boardroom             15–20s   45.5  the people arrive
 *   threads rise from their HEADS    20–25s   27.8  slow — this is the argument
 *   threads converge into the screen 25–28s   37.5  handing over
 *   the brain forms and holds        28–32s   23.5  SLOWEST — the payoff
 *   laptop settles, "Ask CRUZ"     32–35.69s  36.9  the close
 *
 * These are rates per unit of NORMALISED scroll, so they only describe the
 * split between shots. Perceived speed also depends on the track height in
 * ConvergenceHero — raising that slows everything at once without touching
 * these ratios, and it is the right lever when the whole sequence feels rushed.
 *
 * The plate is 35.69s and it finally makes the argument the section exists to
 * make: in the boardroom beat the threads leave the PEOPLE'S HEADS and braid
 * into one brain. Three earlier generations put the light in mid-air with the
 * workers standing unconnected beside it, which said nothing.
 *
 * That beat is therefore the second-slowest thing here, behind only the brain:
 * it is the one stretch a visitor has to actually read rather than glide over.
 * The warehouse in front of it is pure transit and runs nearly four times
 * faster. Keep the pairs sorted by scroll, and keep the fractions in 0–1 so a
 * recut of a different length still lands on the right shots.
 */
export const SCRUB_KEYS: readonly (readonly [number, number])[] = [
  [0.13, 0.0], // first frame, held through the static hero
  [0.33, 14.5 / 34.2], // through the aisle, about to cut
  [0.44, 19 / 34.2], // boardroom established
  [0.62, 24 / 34.2], // threads out of the heads
  [0.7, 27 / 34.2], // converged into the screen
  [0.87, 31 / 34.2], // brain, then laptop revealed
  [0.97, 1.0], // "Ask CRUZ" settled — holds to the end of the track
];

/**
 * Playhead for a given scroll position, in seconds.
 *
 * Piecewise-linear through SCRUB_KEYS. Deliberately NOT smoothed per segment:
 * easing each one would stall the playhead at every control point and read as
 * five separate clips rather than one continuous camera move. The rate changes
 * at the joins; the motion never stops.
 */
export function scrubTime(p: number, duration: number) {
  const keys = SCRUB_KEYS;
  if (p <= keys[0][0]) return 0;
  if (p >= keys[keys.length - 1][0]) return duration;

  for (let i = 1; i < keys.length; i++) {
    const [pB, fB] = keys[i];
    if (p > pB) continue;
    const [pA, fA] = keys[i - 1];
    const local = (p - pA) / (pB - pA);
    return (fA + (fB - fA) * local) * duration;
  }
  return duration;
}

/**
 * The left-hand tagline for each frame. Text stays on the left in every frame,
 * visual on the right, so the composition never jumps scroll to scroll.
 */
export const FRAME_COPY = [
  { beat: BEATS.approach, text: "All Your Company's Data. One Place." },
  { beat: BEATS.interior, text: "Every Person. One System." },
  { beat: BEATS.converge, text: "Centralized Intelligence." },
  { beat: BEATS.command, text: "At Your Command." },
] as const;

/**
 * Where each worker's head sits in the plate, in normalised viewport coords
 * (0,0 = top-left, 1,1 = bottom-right).
 *
 * Measured off the mid-push frame of `approach.mp4`, in the PLATE's own
 * normalised space — NOT viewport space. `plateToViewport` below maps them. A thread that starts
 * off someone's shoulder instead of their head undercuts the whole argument
 * the sequence is making, so **these must be re-measured whenever the plate is
 * regenerated** — see `public/generated/README.md`.
 *
 * Ordered by how the camera reaches them: the two foreground workers first,
 * then the one furthest down the aisle.
 */
export type WorkerAnchor = { x: number; y: number; label: string };

export const WORKER_ANCHORS_DESKTOP: readonly WorkerAnchor[] = [
  { x: 0.373, y: 0.563, label: "RECEIVING · 14 YRS" },
  { x: 0.651, y: 0.569, label: "SLITTING LINE · 22 YRS" },
  { x: 0.475, y: 0.604, label: "SHIPPING · 9 YRS" },
];

/** On narrow viewports the plate fills the pane, but object-cover crops the
 *  sides hard. Same source positions; the mapping in ConvergenceHero handles
 *  the crop, so these stay in video space like the desktop set. */
export const WORKER_ANCHORS_MOBILE = WORKER_ANCHORS_DESKTOP;

/**
 * Native size of the plate the anchors were measured against. Needed to
 * reproduce the browser's `object-fit: cover` maths when mapping a point in
 * video space onto the page.
 */
export const PLATE_SIZE = { width: 1280, height: 720 } as const;

/**
 * Where the convergence — and therefore the brain, and then the laptop — sits
 * on screen, in viewport-normalised coordinates.
 *
 * This is NOT centre screen. The layout rule from the hero onward is: visual
 * right, taglines left, no exceptions. The brain and laptop beats drifting to
 * the middle of the page broke that pattern, so the convergence point is
 * anchored into the right-hand visual column instead and the world position is
 * derived from it at runtime.
 */
export const CONVERGENCE_ANCHOR_DESKTOP = { x: 0.69, y: 0.47 } as const;
/** On narrow viewports the visual is full-bleed, so centre is correct there. */
export const CONVERGENCE_ANCHOR_MOBILE = { x: 0.5, y: 0.42 } as const;

/**
 * Map a point in the plate's own normalised space onto the page.
 *
 * This is not optional bookkeeping. The visual occupies only the right ~62% of
 * the hero on desktop and is `object-fit: cover`, so a point at 0.373 across
 * the *video* is nowhere near 0.373 across the *viewport* — and the offset
 * changes with viewport aspect. Skipping this is why threads would appear to
 * start in mid-air next to the people they belong to.
 *
 * Returns viewport-normalised coordinates, which is what both the DOM labels
 * and the WebGL anchor projection expect.
 */
export function plateToViewport(
  nx: number,
  ny: number,
  box: { left: number; top: number; width: number; height: number },
  viewport: { width: number; height: number },
) {
  // `cover` scales to the larger ratio and centres the overflow.
  const scale = Math.max(
    box.width / PLATE_SIZE.width,
    box.height / PLATE_SIZE.height,
  );
  const drawnWidth = PLATE_SIZE.width * scale;
  const drawnHeight = PLATE_SIZE.height * scale;
  const originX = box.left + (box.width - drawnWidth) / 2;
  const originY = box.top + (box.height - drawnHeight) / 2;

  return {
    x: (originX + nx * drawnWidth) / viewport.width,
    y: (originY + ny * drawnHeight) / viewport.height,
  };
}

/** Linear interpolation of `t` into the 0→1 span of a beat, clamped. */
export function beatProgress(t: number, beat: readonly [number, number]) {
  const [start, end] = beat;
  if (end <= start) return t >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (t - start) / (end - start)));
}

/** Smoothstep — used to soften every beat transition so nothing snaps. */
export function smooth(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}
