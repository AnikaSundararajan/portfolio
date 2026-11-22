import { pts, rng, type Pt } from '../geometry'
import { BAND_TOP, bandPolygon, xLeft, xRight } from '../world'
import { Band, WorldLayer } from './WorldLayer'

/** Snow tongues reach down into the rock: the rock's top edge dips into sharp V's. */
const POINTS = pts(bandPolygon(BAND_TOP.rock, 70, 41, (i, r) => (i % 2 === 1 ? r.range(-30, -5) : r.range(20, 140))))

const CRAGS: string[] = (() => {
  const r = rng(43)
  const out: string[] = []
  for (let i = 0; i < 70; i++) {
    const y = r.range(BAND_TOP.rock + 60, BAND_TOP.meadow + 80)
    const x = r.range(xLeft(y) + 40, xRight(y) - 40)
    const h = r.range(40, 120)
    const w = r.range(14, 46)
    const tri: Pt[] = [
      [x, y],
      [x + w * r.range(0.6, 1.4), y + h],
      [x - w * r.range(0.2, 0.6), y + h * r.range(0.7, 1)],
    ]
    out.push(pts(tri))
  }
  return out
})()

const STRATA: string[] = (() => {
  const r = rng(47)
  const out: string[] = []
  for (let y = BAND_TOP.rock + 180; y < BAND_TOP.meadow; y += r.range(110, 170)) {
    const x0 = xLeft(y) + r.range(60, 240)
    const x1 = x0 + r.range(300, 700)
    out.push(pts([[x0, y], [x1, y + r.range(-20, 20)], [x1 - 40, y + 16], [x0 + 30, y + 14]]))
  }
  return out
})()

export function RockFace() {
  return (
    <WorldLayer name="rock">
      <Band id="rock" points={POINTS} fill="--rock" shade="--rock-shade">
        {STRATA.map((s) => (
          <polygon key={s} points={s} style={{ fill: 'var(--rock-shade)' }} opacity="0.55" />
        ))}
        {CRAGS.map((c) => (
          <polygon key={c} points={c} style={{ fill: 'var(--rock-dark)' }} opacity="0.7" />
        ))}
      </Band>
    </WorldLayer>
  )
}
