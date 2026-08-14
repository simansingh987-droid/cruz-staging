import Image from "next/image";
import { Heading } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

/**
 * The people behind the product.
 *
 * Placed straight after the trust pillars, because it is the same argument
 * continued: the pillars claim how Cruz is built, and this is who is building
 * it. It reads as evidence there rather than as an "about us" aside.
 *
 * THE SECTION IS DARK, and it is the only dark stretch on the page. That is
 * the photograph's doing, not a design flourish: it is a stage shot lit in
 * blue against near-black, and dropping it into the paper-white rhythm as an
 * ordinary bordered card would have left a black rectangle sitting in the
 * middle of the page with a hard seam on all four sides. Letting the section
 * take the photograph's own colour instead means the image runs edge to edge
 * and the page steps into it and back out.
 *
 * COMPOSITION drives the layout. The frame is deliberately lopsided — everyone
 * is banked to the right, and the left third is empty stage and haze. That
 * empty third is where the copy goes on desktop, so the type sits in negative
 * space the photographer already left rather than on top of anyone's face. It
 * is also why this cannot be an overlay on phones: at that width the crop has
 * nowhere empty left, so the copy moves out above the image instead.
 *
 * NO HEADCOUNT, no "N people across M offices". The number of people in the
 * frame is not the number of people at the company, and counting faces in a
 * photograph to produce a statistic for a marketing page is inventing a fact.
 */
export function Team() {
  return (
    <section id="team" className="bg-ink relative w-full overflow-hidden">
      {/* ---- The photograph. ----
          Positioned, not just dropped in: `object-right` pins the crop to the
          side the people are on, so narrowing the viewport eats the empty
          stage on the left rather than slicing the group in half. */}
      <div className="relative aspect-[16/10] w-full md:absolute md:inset-0 md:aspect-auto md:h-full">
        <Image
          src="/photos/team.webp"
          alt="The Cruz team on stage at a company gathering, gathered in rows under blue stage lighting with the Ask Cruz name lit on the screen behind them."
          fill
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Deepens the left side on desktop so the copy has a floor to sit on.
            Left-to-right only, and it stops well before the group — the point
            is to extend the haze that is already there, not to veil the
            photograph. Off on phones, where the copy is not over the image. */}
        <div
          aria-hidden
          className="from-ink via-ink/80 absolute inset-0 hidden bg-gradient-to-r to-transparent md:block"
        />
        {/* Feathers the top and bottom edges into the flat section colour, so
            the image does not butt against the sections above and below with a
            visible seam. */}
        <div
          aria-hidden
          className="from-ink absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
        />
        <div
          aria-hidden
          className="from-ink absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent"
        />
      </div>

      {/* ---- The copy. ----
          Below the photo on phones; over its empty left third from `md` up,
          where `relative` lifts it above the absolutely-positioned image. */}
      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-32 lg:px-12">
        <div className="max-w-md">
          <Reveal>
            <p className="type-label mb-5 text-white/45">Behind the product</p>
            {/* "Cruz", not "CRUZ". The brand is set as a word everywhere else
                on this page and in the wordmark itself; an all-caps spelling
                here would be the only one on the site. */}
            <Heading className="!text-white">The Team Behind Cruz</Heading>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
              Cruz is built by the team behind EOXS — the same people who have
              spent years inside steel service centers, processors and mills,
              building the software those businesses actually run on.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              That is why Cruz knows what a heat number is without being told.
              The domain knowledge is not a training set — it is the room in
              this photograph.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
