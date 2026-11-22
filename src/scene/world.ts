import { lerp, pts, rng, xAtY, type Pt } from './geometry'

/** World units for the main mountain. The camera shows at least CAM_W×CAM_H of them. */
export const WORLD_W = 3200
export const WORLD_H = 3600
export const CAM_W = 2400
export const CAM_H = 1350
/** Background layers (sun, clouds, ranges, foreground) use their own 1600×900 frame. */
export const VIEW_W = 1600
export const VIEW_H = 900
/** Wide background layers extend this many viewport-widths so the intro zoom-out never shows an edge. */
export const WIDE = 4
export const WIDE_W = VIEW_W * WIDE

export const PEAK: Pt = [WORLD_W / 2, 240]

/** Elevation lines (world y) where each band begins. */
export const BAND_TOP = {
  rock: 1150,
  meadow: 2050,
  forest: 2750,
}

function edge(side: -1 | 1, seed: number): Pt[] {
  const r = rng(seed)
  const out: Pt[] = [PEAK]
  const span = WORLD_H - PEAK[1]
  for (let y = PEAK[1] + 90; y <= WORLD_H + 200; y += r.range(90, 170)) {
    const t = (y - PEAK[1]) / span
    const hw = 1400 * Math.pow(t, 0.85) + 30
    const bump = Math.sin(t * 9 + seed) * 50 * t
    out.push([PEAK[0] + side * (hw + bump + r.range(-35, 35) * (0.3 + t)), y])
  }
  return out
}

export const LEFT_EDGE = edge(-1, 11)
export const RIGHT_EDGE = edge(1, 23)

export const xLeft = (y: number) => xAtY(LEFT_EDGE, y)
export const xRight = (y: number) => xAtY(RIGHT_EDGE, y)

/** Full mountain silhouette polygon. */
export const SILHOUETTE: Pt[] = [
  ...LEFT_EDGE.slice().reverse(),
  ...RIGHT_EDGE.slice(1),
]

/** The ridge splitting the lit (west) face from the shaded (east) face. */
export const RIDGE: Pt[] = (() => {
  const r = rng(5)
  const out: Pt[] = [PEAK]
  for (let y = PEAK[1] + 220; y < WORLD_H; y += r.range(260, 420)) {
    const t = (y - PEAK[1]) / (WORLD_H - PEAK[1])
    out.push([PEAK[0] + 40 + t * 260 + r.range(-70, 70), y])
  }
  out.push([PEAK[0] + 340, WORLD_H + 200])
  return out
})()

export const SHADE_FACE = pts([
  ...RIDGE,
  [WORLD_W + 400, WORLD_H + 200],
  ...RIGHT_EDGE.slice().reverse(),
])

/**
 * A band polygon: the silhouette below a jagged boundary line.
 * `profile(i, r)` returns the y-offset of boundary vertex i.
 */
export function bandPolygon(top: number, step: number, seed: number, profile: (i: number, r: ReturnType<typeof rng>) => number) {
  const r = rng(seed)
  const xl = xLeft(top)
  const xr = xRight(top)
  const boundary: Pt[] = []
  const n = Math.max(2, Math.round((xr - xl) / step))
  for (let i = 0; i <= n; i++) {
    const x = lerp(xl, xr, i / n)
    const y = i === 0 || i === n ? top : top + profile(i, r)
    boundary.push([x, y])
  }
  const right = RIGHT_EDGE.filter(([, y]) => y > top)
  const left = LEFT_EDGE.filter(([, y]) => y > top).reverse()
  return [...boundary, ...right, ...left]
}

/** Switchback trail from the base to the summit. */
export const TRAIL: Pt[] = (() => {
  const r = rng(77)
  const legs = 15
  const start = WORLD_H + 40
  const end = PEAK[1] + 70
  const out: Pt[] = [[PEAK[0] - 40, start]]
  for (let i = 1; i <= legs; i++) {
    const y = lerp(start, end, Math.pow(i / legs, 0.95))
    const hw = (xRight(y) - xLeft(y)) / 2
    const side = i % 2 === 0 ? -1 : 1
    const reach = Math.max(40, hw * r.range(0.22, 0.38))
    out.push([PEAK[0] + 60 + side * reach, y])
  }
  out.push([PEAK[0], PEAK[1] + 6])
  return out
})()

export const TRAIL_LENGTHS: number[] = TRAIL.reduce<number[]>((acc, p, i) => {
  if (i === 0) return [0]
  const [x0, y0] = TRAIL[i - 1]
  acc.push(acc[i - 1] + Math.hypot(p[0] - x0, p[1] - y0))
  return acc
}, [])
export const TRAIL_TOTAL = TRAIL_LENGTHS[TRAIL_LENGTHS.length - 1]

/** Point and distance travelled along the trail at world elevation y. */
export function trailAtY(y: number): { x: number; y: number; length: number } {
  for (let i = 0; i < TRAIL.length - 1; i++) {
    const [x1, y1] = TRAIL[i]
    const [x2, y2] = TRAIL[i + 1]
    if (y <= y1 && y >= y2) {
      const t = (y1 - y) / (y1 - y2 || 1)
      return { x: lerp(x1, x2, t), y, length: lerp(TRAIL_LENGTHS[i], TRAIL_LENGTHS[i + 1], t) }
    }
  }
  if (y > TRAIL[0][1]) return { x: TRAIL[0][0], y: TRAIL[0][1], length: 0 }
  const last = TRAIL[TRAIL.length - 1]
  return { x: last[0], y: last[1], length: TRAIL_TOTAL }
}

/** Climber elevation for climb progress p ∈ [0, 1]. Independent of viewport so trail markers are static. */
export const CLIMBER_START_Y = WORLD_H - 0.3 * CAM_H
export const CLIMBER_END_Y = PEAK[1] + 6
export const climberY = (p: number) => lerp(CLIMBER_START_Y, CLIMBER_END_Y, p)
