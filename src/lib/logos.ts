/**
 * Logo registry.
 *
 * Two sets, kept strictly apart because they make different claims:
 *
 *   CLIENTS  — companies using Cruz. Social proof. Appears in the marquee.
 *   FLAGSHIP — the single named reference callout in the hero.
 *   INTEGRATIONS — systems Cruz reads from. A compatibility claim, NOT an
 *     endorsement. These must never appear in the client marquee or under a
 *     "trusted by" heading; doing so would imply SAP is a Cruz customer.
 *
 * TWO THINGS MAKE THESE READ AS ONE SET, and both were learned the hard way:
 *
 *   1. Every file is TRIMMED to its content bounding box. Several arrived with
 *      enormous baked-in whitespace — Optimal Alloys' mark filled 15% of its
 *      file height, Eastern States 35% — and `object-contain` dutifully fits
 *      the whole file, dead space included, so those rendered tiny.
 *
 *   2. Every mark is sized to the same rendered AREA, which is why `aspect` is
 *      recorded here. Fitting them all into one fixed box does not work: in a
 *      short wide slot a near-square mark like Brannon is height-capped and
 *      ends up less than half the area of a long lockup like Monarch. Equal
 *      area is what "consistent size" actually means for shapes this different.
 *
 * If you add or replace a logo: trim it, then re-measure its aspect.
 */
export type Logo = {
  src: string;
  alt: string;
  /** Width / height of the TRIMMED file. Drives area-normalised sizing. */
  aspect: number;
  /**
   * Deliberate exception to equal area, for extreme-aspect lockups only.
   *
   * Equal area assumes shapes are within shouting distance of each other. Past
   * roughly 6:1 it stops holding optically: the mark is width-capped by the
   * slot long before it reaches its share of the ink, so it lands as a thin
   * strip that reads small next to a square mark of identical area. `scale`
   * lifts both the area and the cap for that one mark. Keep it near 1 — the
   * grid cell is only so wide, and a mark that runs into its neighbours is a
   * worse problem than one that reads slightly light.
   */
  scale?: number;
};

export const CLIENT_LOGOS: Logo[] = [
  { src: "/logos/clients/brannon-steel.png", alt: "Brannon Steel", aspect: 0.93 },
  { src: "/logos/clients/greer-steel.jpg", alt: "Greer Steel", aspect: 1.5 },
  { src: "/logos/clients/3gm.png", alt: "3GM Steel", aspect: 5.19 },
  {
    src: "/logos/clients/eastern-states-steel.png",
    alt: "Eastern States Steel",
    aspect: 1.78,
  },
  {
    src: "/logos/clients/monarch-steel.png",
    alt: "Monarch Steel Company",
    aspect: 4.95,
  },
  {
    src: "/logos/clients/alliance-trading.png",
    alt: "Alliance Trading Inc.",
    aspect: 2.17,
  },
  {
    src: "/logos/clients/ppc-specialty-metals.png",
    alt: "PPC Specialty Metals",
    aspect: 3.71,
  },
  { src: "/logos/clients/sabre-alloys.png", alt: "Sabre Alloys", aspect: 2.06 },
  {
    src: "/logos/clients/optimal-alloys.png",
    alt: "Optimal Alloys",
    aspect: 3.83,
  },
  {
    src: "/logos/clients/discount-pipe-steel.png",
    alt: "Discount Pipe & Steel",
    aspect: 3.93,
  },
];

export const FLAGSHIP_LOGO: Logo = {
  src: "/logos/flagship/gerdau.jpg",
  alt: "Gerdau",
  aspect: 1,
};

/**
 * `note` is the category, not a claim about the relationship. Keep it that way
 * — "Native" is only true of EOXS, which is the same team and data model.
 */
export type Integration = Logo & { name: string; note: string };

export const INTEGRATION_LOGOS: Integration[] = [
  {
    name: "EOXS",
    note: "Native — same team, same data model",
    src: "/logos/integrations/eoxs.png",
    alt: "EOXS",
    aspect: 1.92,
  },

  // Steel-industry systems, placed directly after EOXS so the metals-specific
  // stack reads first, before the general-purpose ERP and comms tools.
  //
  // Every one of these was TRIMMED to its content box before being listed —
  // the files as supplied carried 83-84% whitespace (RealSTEEL, P.S. Data),
  // and `object-contain` fits the whole file including dead margin, so
  // untrimmed they rendered at a fraction of the size of the existing marks.
  // Aspects below are measured off the trimmed files, which is what makes
  // area-normalised sizing put them on equal footing with the rest.
  {
    name: "RealSTEEL",
    note: "ERP / Steel",
    src: "/logos/integrations/real-steel.webp",
    alt: "RealSTEEL",
    aspect: 2.95,
  },
  {
    name: "Enmark Systems",
    note: "ERP / Steel",
    src: "/logos/integrations/enmark.webp",
    alt: "Enmark Systems, Inc.",
    aspect: 2.89,
  },
  {
    name: "Invera",
    note: "ERP / Metals",
    // Rebuilt from the vendor's own menu asset. The 1024px master that was in
    // the repo is a vertically STRETCHED copy — it measures 1.24 for what is
    // a 6.4:1 wordmark, and shipping it would have put a visibly distorted
    // logo on the page.
    src: "/logos/integrations/invera.webp",
    alt: "Invera",
    aspect: 6.4,
    // Past ~6:1 equal area stops holding optically: the mark is width-capped
    // by the slot before it earns its share of ink and reads thin next to the
    // square marks. Same exception Google Workspace needs, for the same reason.
    scale: 1.2,
  },
  {
    name: "QuickBooks",
    note: "Accounting",
    // The supplied file had the editor's transparency checkerboard baked in
    // as opaque pixels — flood-filled out, same defect and same fix as the
    // Salesforce mark below.
    src: "/logos/integrations/quickbooks.webp",
    alt: "QuickBooks",
    aspect: 1.0,
  },
  {
    name: "P.S. Data Services",
    note: "ERP / Steel",
    src: "/logos/integrations/ps-data-services.webp",
    alt: "P.S. Data Services, Inc.",
    aspect: 2.98,
  },

  {
    name: "SAP",
    note: "ERP",
    src: "/logos/integrations/sap.jpg",
    alt: "SAP",
    aspect: 2.0,
  },
  {
    name: "Epicor",
    note: "ERP / Metals",
    src: "/logos/integrations/epicor.jpg",
    alt: "Epicor",
    aspect: 1.99,
  },
  {
    name: "Infor",
    note: "ERP",
    src: "/logos/integrations/infor.png",
    alt: "Infor",
    aspect: 1.0,
  },
  {
    name: "Microsoft Dynamics",
    note: "ERP / CRM",
    src: "/logos/integrations/microsoft-dynamics.png",
    alt: "Microsoft Dynamics",
    aspect: 0.76,
  },
  {
    name: "Oracle NetSuite",
    note: "ERP",
    src: "/logos/integrations/netsuite.png",
    alt: "Oracle NetSuite",
    aspect: 3.31,
  },
  {
    name: "Salesforce",
    note: "CRM",
    // .webp, not .png. The original had the editor's transparency CHECKERBOARD
    // baked in as opaque pixels — it was never a background the CSS could hide.
    // That is flood-filled out now, and the format change is deliberate: it
    // gives the file a new URL, so a browser holding the old checkerboard copy
    // cannot keep serving it. Also 162KB -> 20KB.
    src: "/logos/integrations/salesforce.webp",
    alt: "Salesforce",
    aspect: 0.98,
  },
  {
    name: "Microsoft 365",
    note: "Email & calendar",
    src: "/logos/integrations/microsoft-365.webp",
    alt: "Microsoft 365",
    aspect: 0.91,
  },
  {
    name: "Google Workspace",
    note: "Email & calendar",
    src: "/logos/integrations/google-workspace.png",
    alt: "Google Workspace",
    // 7.68, not the 5.43 of the original file: a third of that file's height
    // was empty margin, which `object-contain` was faithfully rendering.
    aspect: 7.68,
    // The row is wrapped flex now, so this is no longer fighting a fixed
    // column width — 1.15 lands it around 334×43. Note it can only grow along
    // the diagonal: the wordmark is a fixed 7.68:1, so taller always means
    // wider too, and forcing height alone would deform the logo.
    scale: 1.15,
  },
  {
    name: "Zoom",
    note: "Call transcripts",
    src: "/logos/integrations/zoom.png",
    alt: "Zoom",
    aspect: 3.7,
  },

];

/**
 * Rendered size for a mark, normalised so every logo covers the same area.
 *
 * `w * h = area` and `w / h = aspect`, clamped so nothing exceeds the slot.
 * This is the whole trick: a 5:1 lockup comes out long and short, a square
 * mark comes out compact and tall, and both occupy the same amount of ink.
 */
export function logoBox(
  aspect: number,
  area: number,
  maxW: number,
  maxH: number,
  /** Per-logo exception — see `Logo.scale`. Lifts the area and the cap together,
   *  so a width-capped lockup actually gets bigger instead of just being
   *  re-clamped to the same slot. */
  boost = 1,
) {
  let w = Math.sqrt(area * boost * boost * aspect);
  let h = Math.sqrt((area * boost * boost) / aspect);

  const fit = Math.min(1, (maxW * boost) / w, (maxH * boost) / h);
  w *= fit;
  h *= fit;

  return { width: Math.round(w), height: Math.round(h) };
}
