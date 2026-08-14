# AskCruz — marketing site

An AI operating system for steel. This site's job is credibility with
mid-size steel operators, not broad top-of-funnel.

```bash
npm run dev                  # dev server
npm run build                # production build
npm run verify:convergence   # headless check of the hero's geometry + beat sheet
```

## The one thing to understand first

The Convergence — the scroll-driven hero — is the whole pitch compressed into
five frames. Frame 0 IS the hero — a complete headline, CTA and flagship badge
visible with no scroll. Scrolling carries that same shot through the dock door,
into the building, where threads rise from three workers and land on a brain,
which then pulls back onto a laptop screen. Everything else on the page is
quiet by design so that this lands.

It is built from two layers that are deliberately kept apart, because their
separation *is* the argument:

| Layer                | What it is                                    | Where it comes from |
| -------------------- | --------------------------------------------- | ------------------- |
| The industrial world | Wide exterior still, then a scrubbed push through the dock door | Generated (Higgsfield), committed to `public/generated/` |
| The intelligence     | Threads + brain mark                          | Procedural Three.js, `src/lib/convergence-geometry.ts` |

The thread/brain layer is **not** generated video. It has to be choreographed
against scroll position and against each worker's on-screen position, which a
baked clip cannot do.

The same idea recurs exactly twice more — the capability grid (the brain
reaching out to its live sources) and the flagship spotlight (data in, answer
out). Those two are SVG rather than WebGL, so the page carries only one GPU
context. **If a proposed animation doesn't map to "people-knowledge becomes
machine-intelligence", cut it.**

## Layout

```
src/
  app/                          layout, globals.css (design tokens), page.tsx (section order)
  components/
    convergence/                the hero: scroll driving, WebGL scene, reduced-motion twin
    sections/                   one file per section of the architecture
    ui/                         Cta, Section, Reveal, ThreadDiagram, BrainGlyph, Placeholder
  lib/
    tokens.ts                   palette mirror for WebGL + the beat sheet + worker anchors
    convergence-geometry.ts     thread curves and brain construction
scripts/
  generate-assets.md            the exact Higgsfield prompts behind the plates
  verify-convergence.ts         geometry + beat-sheet assertions
public/generated/README.md      encoding requirements (dense keyframes!) and regeneration steps
```

## Rules this codebase enforces

- **One CTA.** "See What Cruz Knows" is the only call to action, everywhere, and
  its wording lives in `CTA_LABEL` so it cannot drift section to section. No
  waitlist or trial language — not even as a negation.
- **Client logos and integration logos are different claims.** Clients
  (`public/logos/clients/`, plus Gerdau as flagship) are social proof and go in
  the marquee. Integrations (`public/logos/integrations/`) are a compatibility
  claim and stay static — putting SAP in the client strip would read as SAP
  endorsing Cruz. See `src/lib/logos.ts`.
- **No fabricated trust signals.** Logos, press, badges and testimonials render
  as visibly-unfinished slots (`ui/Placeholder.tsx`) until real cleared assets
  exist. Grep for `PendingNote` to find every one.
- **Page chrome uses one accent; the 3D sequence uses its own.** White paper,
  ink text and a single deep steel-blue (`slate`) for CTAs, active states and
  the 2D thread diagrams. The Convergence renders over the dark warehouse plate
  and has a separate palette in `SCENE` — lime threads, blue brain mesh, orange
  core. Never use `SCENE` colours for buttons, borders or type.
- **Additive blending is for the 3D sequence only.** It works over the dark
  plate and is invisible on white — the 2D thread diagrams on the page must
  stay normal-blended.
- **Reduced motion gets an equivalent, never a disabled animation.**
  `HeroStatic` shows the sequence's resolved state.
- **Content is visible by default.** Scroll-reveal only hides things once an
  inline script confirms JS is running, so a failed bundle can't blank the page.

## Known gaps

- Copy is a first draft pending Sheenam/Raj sign-off.
- The explainer video and customer quotes are marked placeholders.
- The laptop in frame 4 is still built from primitives and does not read as a
  real machine. The dock/dissolve choreography works; the object does not.
- Plates need re-encoding with dense keyframes before launch
  (`public/generated/README.md`); the current files are raw generations.

## Where generated assets are used, and why

Three things are generated rather than built procedurally, each after a
procedural attempt failed for a reason worth remembering:

| Asset | Why not procedural |
| --- | --- |
| `brain-glow.png` | Gyri and sulci are the entire visual signature of a brain and do not survive being approximated with noise on a sphere. Three attempts read as a stone. |
| `brain-line.png` | A static 2D mark on a white page — hand-built bezier paths read as a horseshoe. White field is knocked out to alpha. |

`dna-helix.mp4` used to be listed here as a third case. It has been deleted
along with `IndustryHelix`: a scrubbed molecule was a biotech image doing duty
in a steel section, and it cost 20MB and 420svh of scroll to make no claim
about the business. `Industries` now runs the slitting-line accordion over the
four `industry-*.jpg` stills instead — no video, no scroll hijacking.

The rule that falls out of this: **geometry that must hit exact screen
positions is procedural; geometry judged purely on how it looks is generated.**
The thread lines are anchored to people in the plate, so they stay procedural.
