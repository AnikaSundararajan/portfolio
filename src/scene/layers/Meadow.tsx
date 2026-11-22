import { pts, rng } from '../geometry'
import { BAND_TOP, bandPolygon, xLeft, xRight } from '../world'
import { Band, WorldLayer } from './WorldLayer'

const POINTS = pts(bandPolygon(BAND_TOP.meadow, 120, 51, (i, r) => Math.sin(i * 1.3) * 26 + r.range(-12, 12)))

const STRIPES: string[] = (() => {
  const r = rng(53)
  const out: string[] = []
  for (let y = BAND_TOP.meadow + 90; y < BAND_TOP.forest + 40; y += r.range(90, 140)) {
    const xl = xLeft(y)
    const xr = xRight(y)
    const x0 = xl + r.range(0, (xr - xl) * 0.4)
    const x1 = x0 + r.range(400, 900)
    out.push(pts([[x0, y + 18], [x0 + 120, y], [x1 - 140, y - 6], [x1, y + 14], [x1 - 60, y + 30], [x0 + 60, y + 32]]))
  }
  return out
})()

const FLOWERS = (() => {
  const r = rng(57)
  const colors = ['#f6d36b', '#f3a6b8', '#ffffff', '#c7a6f0']
  return Array.from({ length: 120 }, () => {
    const y = r.range(BAND_TOP.meadow + 60, BAND_TOP.forest + 40)
    return { x: r.range(xLeft(y) + 30, xRight(y) - 30), y, r: r.range(5, 9), c: colors[Math.floor(r.next() * colors.length)] }
  })
})()

const BOULDERS: string[] = (() => {
  const r = rng(59)
  return Array.from({ length: 14 }, () => {
    const y = r.range(BAND_TOP.meadow + 80, BAND_TOP.forest)
    const x = r.range(xLeft(y) + 80, xRight(y) - 80)
    const s = r.range(18, 40)
    return pts([[x - s, y], [x - s * 0.6, y - s * 0.8], [x + s * 0.3, y - s], [x + s, y - s * 0.3], [x + s * 0.9, y]])
  })
})()

export function Meadow() {
  return (
    <WorldLayer name="meadow">
      <Band id="meadow" points={POINTS} fill="--meadow" shade="--meadow-shade">
        {STRIPES.map((s) => (
          <polygon key={s} points={s} style={{ fill: 'var(--meadow-light)' }} opacity="0.7" />
        ))}
        {BOULDERS.map((b) => (
          <polygon key={b} points={b} style={{ fill: 'var(--rock)' }} />
        ))}
        {FLOWERS.map((f) => (
          <circle key={`${f.x}-${f.y}`} cx={f.x} cy={f.y} r={f.r} fill={f.c} opacity="0.9" />
        ))}
      </Band>
    </WorldLayer>
  )
}
