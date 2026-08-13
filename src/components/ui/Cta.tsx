import Link from "next/link";

/**
 * The only call to action on this site.
 *
 * Two rules, both load-bearing:
 *
 *   1. Sales-led. There is no waitlist, no trial, no self-serve signup, and no
 *      competing secondary form. Every conversion point routes here.
 *   2. One wording, everywhere. "See What Cruz Knows" is repeated identically
 *      in the nav, every section CTA and the final CTA — a working phrase
 *      repeated beats a different phrase per section. It also opens a
 *      curiosity gap that a generic verb can't: it implies Cruz already knows
 *      something specific about *your* business, and clicking is how you find
 *      out what.
 *
 * If you are adding a second CTA component, or rewording this one for a single
 * section, that is the bug.
 */
export const CTA_LABEL = "See What Cruz Knows";

export function Cta({
  variant = "solid",
  className = "",
  children = CTA_LABEL,
}: {
  variant?: "solid" | "outline";
  className?: string;
  children?: React.ReactNode;
}) {
  // The lift is on the base so every CTA behaves identically: it rises a
  // couple of pixels and drops a soft shadow beneath and behind itself, then
  // presses flat again on click.
  const base =
    "group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-[0.01em] transition-all duration-300 ease-out will-change-transform hover:-translate-y-[3px] active:translate-y-0 active:duration-75";

  const styles =
    variant === "solid"
      ? // Filled with the theme's own slate, not white — this is the only CTA
        // on the site (see the file-level note above), so its resting state
        // needs to read as the primary action on sight, not blend into the
        // paper background until hovered. `brightness-110` carries the hover
        // feedback now that colour and border can't move the way they did on
        // the unfilled version; the lift + shadow from `base` still does the
        // rest.
        "bg-slate text-paper hover:brightness-110 hover:shadow-[0_12px_26px_-10px_rgba(43,66,87,0.55)] active:shadow-[0_3px_8px_-4px_rgba(43,66,87,0.45)] active:brightness-100"
      : // Unfilled, for a deliberately quieter second action alongside the
        // solid CTA. PriorityPicker used to be this variant's one call site;
        // it was moved to solid because every button reading "See What Cruz
        // Knows" is meant to be the same weight of action, and having one
        // outlined made it look like it did something different. Currently
        // unused — kept because a real secondary action (an outline next to
        // a solid, not instead of it) is exactly what this was built for.
        "border border-rule/70 text-mute hover:border-slate hover:text-slate hover:shadow-[0_10px_22px_-10px_rgba(43,66,87,0.40)] active:shadow-none";

  return (
    <Link href="https://cal.com/rajatjain/30min" target="_blank" rel="noopener noreferrer" className={`${base} ${styles} ${className}`}>
      {children}
      <span
        aria-hidden
        className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
