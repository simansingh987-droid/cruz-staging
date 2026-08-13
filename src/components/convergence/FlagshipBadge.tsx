import Image from "next/image";
import { FLAGSHIP_LOGO } from "@/lib/logos";

/**
 * The single flagship reference, shown in the hero without scrolling.
 *
 * Deliberately static — one named callout, not a list, so it does not belong
 * in the client marquee and must not move.
 *
 * Full colour, large, and with NO plate behind it. Two earlier passes got this
 * wrong in the same way: a greyscale-at-55%-opacity treatment on a white card
 * made Gerdau's lockup look like an empty box, and the card itself read as an
 * unfilled placeholder. The mark now sits directly on the page at flagship
 * scale, which is what a single named reference is for.
 */
export function FlagshipBadge() {
  return (
    <div className="inline-flex items-center gap-3 sm:gap-5">
      <span className="type-label text-faint whitespace-nowrap">
        Trusted by
      </span>
      <span aria-hidden className="bg-rule h-8 w-px sm:h-12" />
      {/* h-20 on phones, h-40 from `sm` up. At the flagship size this is meant
          to be on desktop, the mark was 160px square — a quarter of the height
          of a 667px handset — and it ran straight into the "Scroll" hint at
          the bottom of the hero. Shorter phones, or any phone once the browser
          chrome is showing, pushed it off the fold entirely. Desktop keeps the
          scale a single named reference deserves; phones get a badge that
          still reads without eating the first screen. */}
      <span className="relative block h-20 w-20 sm:h-40 sm:w-40">
        <Image
          src={FLAGSHIP_LOGO.src}
          alt={FLAGSHIP_LOGO.alt}
          fill
          sizes="(max-width: 640px) 80px, 200px"
          className="logo-plate object-contain"
        />
      </span>
    </div>
  );
}
