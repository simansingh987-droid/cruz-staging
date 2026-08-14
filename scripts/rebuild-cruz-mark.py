"""Rebuild public/brand/askcruz-mark.webp from its uncropped source render.

Kept in the repo so this is reproducible rather than reconstructed from
memory — see the long comment above `CruzMark` in src/components/Nav.tsx for
the full history of what was wrong with each earlier version of this file.

USAGE
    Put the source PNG (the vendor's original, glossy-navy-tubes-on-a-
    checkerboard render) somewhere on disk and run:

        python scripts/rebuild-cruz-mark.py path/to/source.png

    It overwrites public/brand/askcruz-mark.webp in place. Run from the repo
    root, or pass absolute paths.

WHAT THIS DOES, AND WHY EACH STEP IS SHAPED THE WAY IT IS

  1. KNOCK OUT THE CHECKERBOARD, BY COLOUR.
     The source has a real (but useless) alpha channel -- uniformly 255, the
     editor's transparency checkerboard baked in as opaque pixels. The
     checkerboard is perfectly neutral grey; every part of the artwork,
     including the pale glass disc behind the node, carries blue. That gap
     (spread <= 12 vs. spread >= 46) is wide enough that a threshold sits in
     open space between the two populations, so this is exact, not a fudge.
     Flood-filled in from the border rather than a global threshold, so a
     stray neutral pixel that happens to be surrounded by artwork is never
     removed.

  2. FEATHER ALPHA BY DISTANCE, NOT BY COLOUR.
     A pixel's colour saturation says nothing about whether it is near an
     edge. The specular highlight on each rounded cap is low-saturation by
     nature -- it's a near-white glint -- and an earlier version of this
     script feathered alpha using colour spread as the signal, which quietly
     gave every highlight pixel a soft, partially-transparent halo regardless
     of how far it actually was from the silhouette boundary. On the
     bottom-left arm the brightest highlight happens to sit right at the tip,
     so that arm faded into the page background exactly at its cap and read
     as clipped. `distance_transform_edt` fixes this properly: only pixels
     within FEATHER px of real background get any alpha falloff at all.

  3. TRIM to the ink, at whatever the alpha-16 boundary is.

  4. SHIP LOSSLESS. Lossy WEBP re-touches the alpha channel on compression,
     and on an image whose only mid-tone alpha values are meant to be a
     deliberate ~2px feather ring, lossy's own artefacts are large enough to
     matter at this size. `quality=100` is irrelevant under `lossless=True`
     but kept so PIL doesn't apply any default lossy quality if the flag is
     ever dropped.

  5. RESIZE to OUT_WIDTH before the lossless encode, not after. OUT_WIDTH
     should stay comfortably above the largest size this ever renders at --
     currently 11x the 44px it once used, room for retina without shipping
     the full source's file weight. If the mark's rendered size in Nav.tsx
     changes meaningfully, revisit this constant.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt
from collections import deque

OUT_WIDTH = 480
DST = Path("public/brand/askcruz-mark.webp")


def main(src_path: str) -> None:
    rgb = np.array(Image.open(src_path).convert("RGB")).astype(int)
    H, W = rgb.shape[:2]
    lum = rgb.mean(axis=2)
    spread = rgb.max(axis=2) - rgb.min(axis=2)

    neutral = spread <= 12
    checker = neutral & (lum > 150) & (lum < 246)

    bg = np.zeros((H, W), bool)
    q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if checker[y, x] and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    for y in range(H):
        for x in (0, W - 1):
            if checker[y, x] and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < H and 0 <= nx < W and checker[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True
                q.append((ny, nx))
    bg |= checker
    fg = ~bg

    dist = distance_transform_edt(fg)
    FEATHER = 2.2  # px, at source resolution
    alpha = np.clip(dist / FEATHER * 255, 0, 255)
    alpha[bg] = 0

    out = np.dstack([rgb, alpha]).astype(np.uint8)
    ys, xs = np.where(alpha > 16)
    img = Image.fromarray(out, "RGBA").crop(
        (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    )

    w = OUT_WIDTH
    h = round(w * img.size[1] / img.size[0])
    img = img.resize((w, h), Image.LANCZOS)

    DST.parent.mkdir(parents=True, exist_ok=True)
    img.save(DST, "WEBP", lossless=True, quality=100, method=6)

    chk = np.array(Image.open(DST)).astype(int)
    al = chk[:, :, 3]
    mid = ((al > 5) & (al < 250)).sum()
    print(f"wrote {DST}  {chk.shape[1]}x{chk.shape[0]}")
    print(f"partial-alpha px: {mid} ({mid / al.size * 100:.2f}%) -- should be a few percent, edge-only")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
