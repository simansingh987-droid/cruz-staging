import Image from "next/image";
import { logoBox, type Logo } from "@/lib/logos";

/**
 * The single logo treatment used everywhere on the site.
 *
 * Sizing is AREA-NORMALISED, not box-fitted. Two earlier attempts fitted every
 * mark into one fixed slot with `object-contain`, and both left the near-square
 * logos looking tiny: in a short wide slot, Brannon (aspect 0.93) is
 * height-capped and covers less than half the ink of Monarch (aspect 4.95).
 * Same box, wildly different optical weight.
 *
 * Here each mark gets its own width and height, computed so `w * h` is
 * constant. Long lockups come out long and short, square marks compact and
 * tall, and every logo carries the same visual weight as it scrolls past.
 *
 * Full colour always — no greyscale, no hover reveal.
 */

/** Ink per logo, in px². Tuned so the widest lockup still fits the slot. */
const TARGET_AREA = 15000;
const MAX_W = 300;
const MAX_H = 132;

export function LogoPlate({
  logo,
  className = "",
}: {
  logo: Logo;
  className?: string;
}) {
  const { width, height } = logoBox(
    logo.aspect,
    TARGET_AREA,
    MAX_W,
    MAX_H,
    logo.scale,
  );

  return (
    <div
      className={`flex h-44 w-[21rem] shrink-0 items-center justify-center px-6 ${className}`}
    >
      <div className="relative" style={{ width, height }}>
        <Image
          src={logo.src}
          alt={logo.alt}
          fill
          sizes="300px"
          className="logo-plate object-contain"
        />
      </div>
    </div>
  );
}
