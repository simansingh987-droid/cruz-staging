import Image from "next/image";
import { Cta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";

/**
 * The reduced-motion equivalent of the Convergence.
 *
 * A genuine substitute, not a disabled animation. It carries the identical
 * composition as frame 0 — copy left, distant warehouse right — so a visitor
 * who prefers reduced motion sees exactly the hero
 * everyone else lands on. What they don't get is the push through the door;
 * the copy that follows on the page does that work instead.
 */
export function HeroStatic() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh w-full items-center overflow-hidden"
    >
      <div className="absolute inset-y-0 right-0 w-full md:w-[62%]">
        <Image
          src="/generated/approach-poster.jpg"
          alt="A steel service center seen from across its yard, with flatbed trucks loaded with steel coils outside the loading dock."
          fill
          priority
          sizes="(max-width: 768px) 100vw, 62vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="from-paper via-paper/70 absolute inset-0 bg-gradient-to-r to-transparent md:via-transparent"
        />
        <div
          aria-hidden
          className="from-paper absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl px-5 py-28 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <Reveal>
            <p className="type-label text-slate mb-6">
              AI Operating System for Steel
            </p>
          </Reveal>
          <Reveal delay={110}>
            {/* Matches the animated hero exactly — the reduced-motion visitor
                gets the same composition, so it has to be the same size. */}
            <h1 className="type-display text-ink text-[clamp(1.9rem,3.9vw,3.25rem)]">
              Where Steel Meets Intelligence
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="text-mute mt-7 max-w-lg text-base leading-relaxed sm:text-lg">
              Cruz is the AI that knows your business the way your best people
              do — every system, every call, every decision, in one place.
            </p>
          </Reveal>
          <Reveal delay={330}>
            <div className="mt-10">
              <Cta className="px-8 py-4 text-base" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
