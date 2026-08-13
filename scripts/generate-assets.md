# Hero asset generation

The exact Higgsfield calls behind the files in `public/generated/`. Kept in the
repo so a regeneration is reproducible rather than reconstructed from memory.

Model: `seedance_2_0`, duration 5s, ~22.5 credits per clip.

> If a stylised preset is recommended instead of your job being submitted,
> decline it (`declined_preset_id`). Presets fight the documentary realism this
> plate needs — steel buyers read a graded, cinematic warehouse as a stock
> video, which is the opposite of the credibility the page is buying.

## 1. Desktop plate — `warehouse-push.mp4`

`aspect_ratio: "16:9"`

> Photorealistic documentary interior of a steel service center warehouse. Wide
> establishing shot looking straight down a long central aisle. Towering racks
> of hot-rolled steel coils and stacked steel plate on both sides, an overhead
> gantry crane on rails near the ceiling, bare concrete floor with faded yellow
> painted safety lines. Three workers in hi-vis vests and hard hats at
> different depths: one in the mid-left foreground inspecting the edge of a
> steel coil, one on the right operating a slitting line control panel, one
> further back in the center walking while looking at a tablet. Lighting is
> natural and unglamorous - cool grey daylight falling from high clerestory
> windows mixed with warm sodium work lamps overhead. Muted graphite, gunmetal
> and rust palette. The camera pushes forward slowly and steadily down the
> aisle on a smooth dolly, constant speed, locked horizon, no handheld shake,
> no zoom, no cuts. Realistic industrial photography, fine metallic detail,
> subtle airborne dust, shallow depth of field.

## 2. Mobile plate — `warehouse-push-vertical.mp4`

`aspect_ratio: "9:16"`

Generated rather than cropped: at 9:16 a centre-crop of the desktop plate loses
the left and right workers entirely, and the whole sequence depends on three
people being visible.

> Photorealistic documentary interior of a steel service center warehouse,
> vertical portrait framing. Tall composition looking straight down a central
> aisle, emphasising the full height of the racking and the overhead gantry
> crane above. Racks of hot-rolled steel coils and stacked plate rise on both
> sides of a narrow concrete aisle with faded yellow safety lines. Three
> workers in hi-vis vests and hard hats arranged vertically through the depth
> of frame: one lower left inspecting a steel coil edge, one at mid height on
> the right at a slitting line control panel, one further back near the center
> of frame walking with a tablet. Cool grey daylight from high clerestory
> windows mixed with warm sodium work lamps. Muted graphite, gunmetal and rust
> palette. The camera pushes forward slowly and steadily down the aisle on a
> smooth dolly, constant speed, locked horizon, no shake, no zoom, no cuts.
> Realistic industrial photography, fine metallic detail, airborne dust,
> shallow depth of field.

## 3. Optional polish

- `upscale_video` on the selected desktop take before encoding — the plate runs
  full-bleed on large displays.
- `generate_3d` for a brain GLB was considered and **not used**. The brain is
  built procedurally in `src/lib/convergence-geometry.ts` so its vertices can be
  driven from the same light as the threads and grown out of the convergence
  point. A generated mesh would have to be re-rigged to do that, and would sit
  in the bundle as an extra download for no gain.

## After regenerating

1. Encode per `public/generated/README.md` (dense keyframes — non-negotiable).
2. Extract the poster frame.
3. **Retune the worker anchors** in `src/lib/tokens.ts` to the new worker
   positions, then run `npm run verify:convergence`.
