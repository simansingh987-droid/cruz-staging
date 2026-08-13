import Image from "next/image";
import { logoBox } from "@/lib/logos";
import { Section, Heading, Lede } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { INTEGRATION_LOGOS } from "@/lib/logos";

/**
 * Rows 7 + 14 merged — the "nothing gets ripped out" compatibility grid.
 *
 * All logos live in two balanced rows. mix-blend-mode: multiply on
 * .logo-plate removes any baked-in white backgrounds site-wide.
 */
function IntegrationMark({
  system,
}: {
  system: (typeof INTEGRATION_LOGOS)[number];
}) {
  // 5600 — sized so all 15 marks fit into TWO rows rather than three.
  // Computed rather than guessed: total row width is sqrt(area) x the sum of
  // sqrt(aspect) across the row, so the area is what has to come down to fit
  // seven or eight marks on one line inside the 1152px container. At this
  // value the rows measure ~1036 and ~1048 with 24px gaps.
  //
  // Caps drop with it. Leaving them high would pin the wide lockups
  // (Workspace, Invera) at the old ceiling while everything else shrank,
  // which breaks the equal-weight sizing the whole set depends on.
  const { width, height } = logoBox(
    system.aspect,
    5600,
    210,
    70,
    system.scale,
  );
  return (
    <span
      className="relative block shrink-0"
      style={{ width, height }}
    >
      <Image
        src={system.src}
        alt={system.alt}
        fill
        sizes="200px"
        className="logo-plate object-contain"
      />
    </span>
  );
}

export function Integrations() {
  // Two rows, split 7 / 8 — NOT 8 / 7, which is the intuitive way to divide
  // 15 and the wrong one here. These marks are sized by equal AREA, so a row's
  // width depends on which aspect ratios land in it, not on how many marks it
  // holds. Splitting 8/7 puts the wide Invera lockup in the first row and
  // leaves the rows 243px apart in width; 7/8 balances Invera against Google
  // Workspace and brings them to within ~12px of each other.
  const SPLIT = 7;
  const rows = [
    INTEGRATION_LOGOS.slice(0, SPLIT),
    INTEGRATION_LOGOS.slice(SPLIT),
  ];

  return (
    <Section className="border-rule/40 border-t">
      <Reveal>
        <Heading>Nothing gets ripped out</Heading>
        <Lede>
          Cruz reads from the systems you already paid for. Your ERP stays your
          ERP. No migration, no parallel data entry, no retraining your floor on
          new software.
        </Lede>
      </Reveal>

      {rows.map((row, r) => (
        <ul
          key={r}
          className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-8 lg:justify-between ${r === 0 ? "mt-14" : "mt-10"}`}
        >
          {row.map((system, i) => (
            <Reveal
              as="li"
              key={system.name}
              delay={Math.min(r * SPLIT + i, 8) * 55}
              className="flex items-center justify-center"
            >
              <IntegrationMark system={system} />
            </Reveal>
          ))}
        </ul>
      ))}

      <Reveal delay={120}>
        <p className="text-faint mt-8 text-xs leading-relaxed">
          Integration means Cruz reads from these systems. It does not imply any
          partnership or endorsement. All marks belong to their owners.
        </p>
      </Reveal>
    </Section>
  );
}
