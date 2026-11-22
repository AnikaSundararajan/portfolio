import { pine, pts, rng } from '../geometry'
import { BAND_TOP, WORLD_H, bandPolygon, xLeft, xRight } from '../world'
import { Band, WorldLayer } from './WorldLayer'

/** Saw-toothed tree line. */
const POINTS = pts(bandPolygon(BAND_TOP.forest, 46, 61, (i, r) => (i % 2 === 1 ? -r.range(40, 90) : r.range(0, 14))))

const TREES = (() => {
  const r = rng(67)
  const out: ReturnType<typeof pine>[] = []
  for (let y = BAND_TOP.forest + 40; y < WORLD_H + 120; y += r.range(42, 60)) {
    const t = (y - BAND_TOP.forest) / (WORLD_H - BAND_TOP.forest)
    const xl = xLeft(y) + 40
    const xr = xRight(y) - 40
    for (let x = xl + r.range(0, 60); x < xr; x += r.range(55, 105)) {
      out.push(pine(x, y, r.range(90, 150) * (0.8 + t * 0.6)))
    }
  }
  return out
})()

export function PineForest() {
  return (
    <WorldLayer name="forest">
      <Band id="forest" points={POINTS} fill="--forest" shade="--forest-shade">
        {TREES.map((t) => (
          <g key={t.lit}>
            <polygon points={t.lit} style={{ fill: 'var(--pine-lit)' }} />
            <polygon points={t.shade} style={{ fill: 'var(--pine-shade)' }} />
          </g>
        ))}
      </Band>
    </WorldLayer>
  )
}
