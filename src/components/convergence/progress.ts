import type { RefObject } from "react";

/**
 * Scroll progress is passed around as a mutable ref, never as React state.
 *
 * The Convergence updates every frame; routing that through `setState` would
 * re-render the whole hero 60 times a second. GSAP writes the target, a single
 * rAF loop smooths it, and both the WebGL layer and the imperative DOM updates
 * read the same number.
 */
export type ProgressRef = RefObject<number>;
