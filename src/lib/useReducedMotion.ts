"use client";

import { useSyncExternalStore } from "react";

/**
 * Media queries are external state, so they are read with
 * `useSyncExternalStore` rather than mirrored into `useState` from an effect.
 * That keeps React's copy of the value from ever being a render behind the
 * browser's, and avoids the cascading re-render an effect-and-setState pair
 * would cause on mount.
 *
 * Subscribe functions and snapshot getters are defined at module scope on
 * purpose: React re-subscribes whenever the `subscribe` identity changes, so
 * these must not be recreated per render.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const NARROW = "(max-width: 767px)";

function subscriber(query: string) {
  return (onStoreChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onStoreChange);
    return () => mq.removeEventListener("change", onStoreChange);
  };
}

const subscribeReducedMotion = subscriber(REDUCED_MOTION);
const subscribeNarrow = subscriber(NARROW);

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getNarrow = () => window.matchMedia(NARROW).matches;

/**
 * `null` until the query has actually been read in the browser.
 *
 * The server cannot know the visitor's motion preference, and guessing wrong
 * either flashes the scroll-jacked hero at someone who asked for less motion
 * or flashes the static hero at everyone else. Callers render neither branch
 * while this is `null`.
 */
export function useReducedMotion(): boolean | null {
  return useSyncExternalStore<boolean | null>(
    subscribeReducedMotion,
    getReducedMotion,
    () => null,
  );
}

/**
 * True on viewports that should get the vertical reframe of the hero plate.
 * Matched to the Tailwind `md` breakpoint so CSS and the WebGL layer agree on
 * which set of worker anchors applies.
 */
export function useIsNarrow(): boolean {
  return useSyncExternalStore(subscribeNarrow, getNarrow, () => false);
}
