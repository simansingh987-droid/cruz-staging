import { Section, Eyebrow, Heading, Lede } from "../ui/Section";
import { PendingNote } from "../ui/Placeholder";
import { Reveal } from "../ui/Reveal";

/**
 * Row 4 — "See Cruz in Action".
 *
 * The brief asks for a screen capture of Cruz answering a real operational
 * question, which does not exist yet. Rather than fake a product UI, this
 * renders the player frame at the right size and marks the gap, so the page
 * layout is final and only the file needs swapping.
 */
export function InAction() {
  return (
    <Section id="product">
      <Reveal>
        <Eyebrow>See Cruz in action</Eyebrow>
        <Heading>Watch it answer a real question</Heading>
        <Lede>
          Not a sizzle reel. A screen capture of Cruz reading live inventory,
          open orders and last week&rsquo;s calls, then answering the kind of
          question you&rsquo;d normally walk down the hall to ask.
        </Lede>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        <div className="border-rule/70 bg-card relative aspect-video w-full overflow-hidden rounded-sm border">
          {/* Machined corner ticks — engineered framing rather than a glow. */}
          {(
            [
              "left-0 top-0 border-l border-t",
              "right-0 top-0 border-r border-t",
              "left-0 bottom-0 border-l border-b",
              "right-0 bottom-0 border-r border-b",
            ] as const
          ).map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`border-slate/60 absolute h-5 w-5 ${pos}`}
            />
          ))}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="text-mute/50 h-12 w-12"
              aria-hidden
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="currentColor" />
            </svg>
            <span className="type-data text-mute/60">
              Explainer capture — pending
            </span>
          </div>
        </div>
        <PendingNote>
          record Cruz answering one real operational question end-to-end.
        </PendingNote>
      </Reveal>
    </Section>
  );
}
