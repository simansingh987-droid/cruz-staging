"use client";

import { useEffect, useRef } from "react";

/**
 * The Convergence's visual language, reused in 2D.
 *
 * Rows 6 and 15 of the brief repeat the hero's argument, but neither justifies
 * a second WebGL context on the page — that would cost a real amount of memory
 * and fill rate for a diagram, and Section 5 is explicit that the hero must not
 * tank Core Web Vitals. These moments are SVG: identical thread colour,
 * identical travelling-light behaviour, a fraction of the cost.
 *
 * A branch draws itself on scroll-into-view, then a light packet runs its
 * length. Under `prefers-reduced-motion` the branch is simply drawn.
 *
 * WHY THE PACKET IS SMIL AND NOT CSS.
 *
 * This used to move the packet with CSS `offset-path: path(...)` plus an
 * `offset-distance` keyframe. That is the tidier modern syntax and it is also
 * why these diagrams were reported broken on Macs: Safari did not ship
 * `offset-path` until v16, and `path()` support there is still uneven. With the
 * property unsupported the declaration is dropped, the packet keeps its default
 * cx/cy of 0,0, and it renders as a dot pinned to the top-left of the viewBox
 * instead of travelling the thread — the animation does not degrade, it visibly
 * misplaces itself.
 *
 * `<animateMotion>` is the SVG-native way to do the same thing and has worked
 * in Safari, Chrome and Firefox for many years, so the diagram behaves the same
 * everywhere. It costs a few more lines than the CSS version; that is the whole
 * price.
 */
export function ThreadBranch({
  d,
  delay = 0,
  reverse = false,
  className = "",
}: {
  /** SVG path data. Reused verbatim as the packet's motion path. */
  d: string;
  delay?: number;
  /** Run the packet from the far end back toward the origin. */
  reverse?: boolean;
  className?: string;
}) {
  const groupRef = useRef<SVGGElement>(null);
  const motionRef = useRef<SVGAnimateElement>(null);
  const fadeRef = useRef<SVGAnimateElement>(null);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      // Draw the thread, park the packet at the far end, and never move it.
      el.dataset.shown = "true";
      el.dataset.static = "true";
      return;
    }

    // Observe the nearest HTML ancestor, NOT this <g>.
    //
    // The second half of the Mac problem. IntersectionObserver is specified
    // over Elements, but observing an SVG child element is a long-standing
    // weak spot in WebKit — it can simply never report an intersection, and
    // an observer that never fires means data-shown is never set, so the
    // thread never draws AND the packet never begins. That fails exactly the
    // way this was described: the diagram sits there inert. The wrapping <div>
    // is an ordinary block box that every engine measures correctly, and it
    // shares the SVG's geometry closely enough for a 0.3 threshold.
    const target: Element = el.closest("svg")?.parentElement ?? el;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          el.dataset.shown = "true";
          // Both animations are `begin="indefinite"`, so they wait here rather
          // than running while the section is still off screen.
          motionRef.current?.beginElement();
          fadeRef.current?.beginElement();
          io.unobserve(target);
        }
      },
      { threshold: 0.3 },
    );

    io.observe(target);
    return () => io.disconnect();
  }, []);

  const begin = `${delay + 260}ms`;

  return (
    <g ref={groupRef} className={`thread-branch ${className}`}>
      <path
        d={d}
        className="thread-branch__line"
        style={{ transitionDelay: `${delay}ms` }}
      />
      {/* `opacity` as a presentation attribute, not CSS: SMIL overrides
          attributes, so the fade below can take control of it. A CSS
          `opacity` rule would win instead and pin the packet invisible. */}
      <circle r="3" opacity="0" className="thread-branch__packet">
        <animateMotion
          ref={motionRef as React.RefObject<SVGAnimateMotionElement>}
          dur="2.8s"
          begin={`indefinite;${begin}`}
          repeatCount="indefinite"
          path={d}
          // Matches the old cubic-bezier(.5,0,.5,1): ease in, ease out, so the
          // packet gathers pace mid-thread rather than sliding at a constant
          // rate. keyPoints is what makes `reverse` work — it walks the same
          // path from the far end back.
          calcMode="spline"
          keyPoints={reverse ? "1;0" : "0;1"}
          keyTimes="0;1"
          keySplines="0.5 0 0.5 1"
        />
        <animate
          ref={fadeRef}
          attributeName="opacity"
          dur="2.8s"
          begin={`indefinite;${begin}`}
          repeatCount="indefinite"
          values="0;1;1;0"
          keyTimes="0;0.12;0.82;1"
        />
      </circle>
    </g>
  );
}
