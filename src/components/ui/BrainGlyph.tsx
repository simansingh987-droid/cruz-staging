/**
 * The brain mark used in the 2D diagrams (capability grid, flagship spotlight).
 *
 * This was drawn as a hand-built SVG path across three passes and read as a
 * horseshoe every time. It is now a real anatomical line-art illustration —
 * generated once and committed — which is the right tool for a static mark on
 * a white page. There is no reason to approximate a brain with bezier curves
 * when the mark never animates or rotates here.
 *
 * `preserveAspectRatio` keeps it centred in the slot the diagrams reserve.
 */
export function BrainGlyph({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  // The source is square; 120 units at scale 1 matches the footprint the old
  // glyph occupied, so the surrounding diagram geometry needs no changes.
  const size = 120 * scale;

  return (
    <image
      href="/generated/brain-line.png"
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
