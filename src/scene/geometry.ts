export type Pt = [number, number]

/** Deterministic PRNG so the procedural art is identical on every render. */
export function rng(seed: number) {
  let a = seed >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return { next, range: (min: number, max: number) => min + (max - min) * next() }
}

export const pts = (list: Pt[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** x on a polyline whose y values are monotonic. */
export function xAtY(edge: Pt[], y: number): number {
  for (let i = 0; i < edge.length - 1; i++) {
    const [x1, y1] = edge[i]
    const [x2, y2] = edge[i + 1]
    if ((y >= y1 && y <= y2) || (y <= y1 && y >= y2)) {
      const t = y2 === y1 ? 0 : (y - y1) / (y2 - y1)
      return lerp(x1, x2, t)
    }
  }
  return y < edge[0][1] ? edge[0][0] : edge[edge.length - 1][0]
}

/** A jagged mountain range: alternating peaks and saddles across [0, width]. */
export function range(opts: {
  seed: number
  width: number
  height: number
  peakMin: number
  peakMax: number
  saddleMin: number
  saddleMax: number
  spacingMin: number
  spacingMax: number
}) {
  const r = rng(opts.seed)
  const peaks: { peak: Pt; left: Pt; right: Pt }[] = []
  const outline: Pt[] = [[0, opts.height]]
  let x = -r.range(0, opts.spacingMax)
  let prevSaddle: Pt = [x, r.range(opts.saddleMin, opts.saddleMax)]
  outline.push(prevSaddle)
  while (x < opts.width + opts.spacingMax) {
    const half = r.range(opts.spacingMin, opts.spacingMax) / 2
    const peak: Pt = [x + half + r.range(-half * 0.3, half * 0.3), r.range(opts.peakMin, opts.peakMax)]
    x += half * 2
    const saddle: Pt = [x, r.range(opts.saddleMin, opts.saddleMax)]
    peaks.push({ peak, left: prevSaddle, right: saddle })
    outline.push(peak, saddle)
    prevSaddle = saddle
  }
  outline.push([opts.width + opts.spacingMax * 2, opts.height])
  return { outline, peaks }
}

/** Paper-cut pine: a stepped silhouette split into a lit and a shaded half. */
export function pine(x: number, base: number, h: number, w = h * 0.42) {
  const tiers = 3
  const top = base - h
  const left: Pt[] = [[x, top]]
  const right: Pt[] = [[x, top]]
  for (let k = 1; k <= tiers; k++) {
    const y = top + (h * 0.88 * k) / tiers
    const half = (w / 2) * (0.55 + (0.45 * k) / tiers)
    const notch = half * 0.55
    left.push([x - half, y])
    right.push([x + half, y])
    if (k < tiers) {
      left.push([x - notch, y - h * 0.02])
      right.push([x + notch, y - h * 0.02])
    }
  }
  const trunkW = Math.max(w * 0.08, 3)
  const trunkTop = top + h * 0.88
  return {
    lit: pts([...left, [x, trunkTop]]),
    shade: pts([...right, [x, trunkTop]]),
    trunk: { x: x - trunkW / 2, y: trunkTop - 1, w: trunkW, h: h * 0.12 + 1 },
  }
}
