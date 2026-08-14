# Generated hero assets

Build-time assets, not runtime generation. Higgsfield is called once by a
human running the commands below; the outputs are committed here and served
statically. On-demand generation would be wrong for a marketing page on both
cost and latency.

## Files the site expects

| File                            | Used by                             | Notes |
| ------------------------------- | ----------------------------------- | ----- |
| `approach.mp4`                  | `ConvergenceHero` (≥768px)          | 15s. Scrubbed by scroll. Never autoplays. Yard → dock → interior → brain. |
| `approach-vertical.mp4`         | `ConvergenceHero` (<768px)          | 9:16 centre crop of the same take. |
| `approach-poster.jpg`           | Desktop poster, frame-0 still, `HeroStatic` | Frame 0 of the desktop plate, so the still→video handover is invisible. |
| `approach-poster-vertical.jpg`  | Mobile poster + frame-0 still       | Frame 0 of the 9:16 plate. |
| `industry-*.jpg`                | `Industries`                        | One still per steel operation, used as the lane photos in the slitting-line accordion. |
| `frames/hero/frame-NNNN.jpg`    | Nothing at runtime                  | Full 24fps extraction of the hero take (361 frames, 1280px wide). Reference only — the hero scrubs the video, not a frame sequence. Safe to delete. |

If any file is missing the hero degrades on its own: the video's `onError`
swaps in a procedural industrial backdrop and the sequence still runs. Nothing
breaks, it just loses the photoreal plate.

## Encoding requirements

The plate is **scrubbed** — `currentTime` is driven directly from scroll
position. That places two demands on the encode that a normal web video does
not have:

1. **Dense keyframes.** Seeking lands on the nearest keyframe. With a default
   GOP the scrub visibly snaps between them. Force a keyframe every frame, or
   at minimum every 4.
2. **Small file, aggressively compressed.** Target well under 5 MB. This is
   the first thing a skeptical visitor's browser downloads.

```bash
ffmpeg -i raw.mp4 -vf "fps=24" -c:v libx264 -profile:v high -crf 30 -g 1 -keyint_min 1 -sc_threshold 0 -movflags +faststart -an approach.mp4
```

`-g 1` is what makes the scrub smooth. `-an` because the plate has no audio and
never will — it is a background element, not a video the visitor plays.

Poster frame — take it from the *encoded* plate, not the raw source, so the
still and the video's frame 0 are byte-for-byte the same shot:

```bash
ffmpeg -i approach.mp4 -frames:v 1 -q:v 3 approach-poster.jpg
```

Frame extraction (reference only):

```bash
ffmpeg -i raw.mp4 -vf "fps=24,scale=1280:-2" -q:v 4 frames/hero/frame-%04d.jpg
```

## Regenerating

Prompts live in `scripts/generate-assets.md`. Re-cut the poster from the new
encode whenever the plate changes — a stale poster shows as a visible jump the
moment the scroll starts.

## What is *not* generated

The laptop reveal is procedural Three.js, choreographed against scroll position.

The thread system (`ThreadSystem`) and the brain glow (`BrainForm`, built on
`brain-glow.png`) are no longer mounted: the plate now runs the whole arc to the
brain itself, and the overlays fought the footage. `WORKER_ANCHORS_DESKTOP` /
`WORKER_ANCHORS_MOBILE` in `src/lib/tokens.ts` are unused for the same reason —
nothing is pinned to the workers any more.
