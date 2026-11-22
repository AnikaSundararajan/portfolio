import { pts, rng, type Pt } from '../geometry'
import { BAND_TOP, PEAK, RIDGE, SILHOUETTE, xLeft } from '../world'
import { xAtY } from '../geometry'
import { Band, WorldLayer } from './WorldLayer'

const POINTS = pts(SILHOUETTE)

/** Lit facets on the west face. */
const FACETS: string[] = (() => {
  const r = rng(31)
  const out: string[] = []
  for (let y = PEAK[1] + 140; y < BAND_TOP.rock + 120; y += r.range(150, 230)) {
    const ridgeX = xAtY(RIDGE, y)
    const span = ridgeX - xLeft(y)
    const a: Pt = [ridgeX - 6, y]
    const b: Pt = [ridgeX - span * r.range(0.45, 0.8), y + r.range(80, 170)]
    const c: Pt = [ridgeX - 6, y + r.range(120, 220)]
    out.push(pts([a, b, c]))
  }
  return out
})()

export function Snowcap() {
  return (
    <WorldLayer name="snowcap">
      <Band id="snow" points={POINTS} fill="--snow" shade="--snow-shade" shadow={false}>
        {FACETS.map((f) => (
          <polygon key={f} points={f} style={{ fill: 'var(--snow-light)' }} />
        ))}
      </Band>
    </WorldLayer>
  )
}
