"use client";

import { CLIENT_LOGOS } from "@/lib/logos";
import { LogoPlate } from "../ui/LogoPlate";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The client strip — a continuous, seamless marquee.
 *
 * The track holds the logo set twice, back to back, and translates by exactly
 * -50%. At the end of the cycle the second copy sits precisely where the first
 * began, so the loop restarts with nothing to see. Getting this wrong — a
 * single copy, or a translate that isn't exactly half the track — is what
 * produces the visible jump most marquees have.
 *
 * Speed is derived from the logo count so the pixels-per-second stay constant:
 * add a client and the loop gets proportionally longer rather than faster.
 * Tuned so an individual mark is readable as it passes, not a blur.
 *
 * Scope: only this strip moves. The single Gerdau badge in the hero is a
 * flagship callout, not a list, and the ERP integration logos are a factual
 * compatibility grid — animating those would make a technical claim look like
 * a promotional reel.
 */
const SECONDS_PER_LOGO = 3.6;

export function ClientMarquee() {
  const reduced = useReducedMotion();
  const duration = CLIENT_LOGOS.length * SECONDS_PER_LOGO;

  return (
    <section
      aria-label="Steel operators working with Cruz"
      className="border-rule/70 border-y py-12"
    >
      <p className="type-label text-faint mb-9 text-center">
        Trusted across the steel supply chain
      </p>

      {reduced ? (
        // Equivalent, not absent: the same logos as a static wrapped grid.
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5">
          {CLIENT_LOGOS.map((logo) => (
            <li key={logo.src}>
              <LogoPlate logo={logo} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="marquee marquee-mask relative w-full overflow-hidden">
          <div
            className="marquee-track"
            style={{ animationDuration: `${duration}s` }}
          >
            {/* Two identical passes. The duplicate is presentational, so it is
                hidden from assistive tech to avoid reading every client twice. */}
            {[0, 1].map((copy) => (
              <div className="flex shrink-0" key={copy} aria-hidden={copy === 1}>
                {CLIENT_LOGOS.map((logo) => (
                  <LogoPlate key={`${copy}-${logo.src}`} logo={logo} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
