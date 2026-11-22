import { pts, range } from '../geometry'
import { VIEW_H, WIDE_W } from '../world'

const RANGE = range({
  seed: 3,
  width: WIDE_W,
  height: VIEW_H,
  peakMin: 300,
  peakMax: 520,
  saddleMin: 560,
  saddleMax: 680,
  spacingMin: 260,
  spacingMax: 520,
})

export function DistantPeaks() {
  return (
    <svg className="layer layer--wide layer--peaks-far" viewBox={`0 0 ${WIDE_W} ${VIEW_H}`} aria-hidden="true">
      <polygon points={pts(RANGE.outline)} style={{ fill: 'var(--peak-far)' }} />
      {RANGE.peaks.map(({ peak, left, right }) => {
        const [px, py] = peak
        const snowDepth = Math.min(70, (right[1] - py) * 0.3)
        const lx = px + (left[0] - px) * (snowDepth / (left[1] - py))
        const rx = px + (right[0] - px) * (snowDepth / (right[1] - py))
        const sy = py + snowDepth
        return (
          <g key={px}>
            <polygon
              points={pts([peak, right, [right[0], VIEW_H], [px + (right[0] - px) * 0.25, VIEW_H]])}
              style={{ fill: 'var(--peak-far-shade)' }}
            />
            <polygon
              points={pts([peak, [rx, sy], [px + (rx - px) * 0.4, sy - 14], [px, sy + 8], [px + (lx - px) * 0.5, sy - 12], [lx, sy]])}
              style={{ fill: 'var(--peak-far-snow)' }}
            />
          </g>
        )
      })}
    </svg>
  )
}
