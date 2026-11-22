import { pts, range } from '../geometry'
import { VIEW_H, WIDE_W } from '../world'

const BACK = range({
  seed: 9,
  width: WIDE_W,
  height: VIEW_H,
  peakMin: 540,
  peakMax: 640,
  saddleMin: 680,
  saddleMax: 740,
  spacingMin: 300,
  spacingMax: 600,
})

const FRONT = range({
  seed: 17,
  width: WIDE_W,
  height: VIEW_H,
  peakMin: 660,
  peakMax: 740,
  saddleMin: 770,
  saddleMax: 820,
  spacingMin: 380,
  spacingMax: 700,
})

export function MidRidges() {
  return (
    <svg className="layer layer--wide layer--ridges" viewBox={`0 0 ${WIDE_W} ${VIEW_H}`} aria-hidden="true">
      <polygon points={pts(BACK.outline)} transform="translate(0 -10)" style={{ fill: 'var(--paper-shadow)' }} />
      <polygon points={pts(BACK.outline)} style={{ fill: 'var(--ridge-mid)' }} />
      {BACK.peaks.map(({ peak, right }) => (
        <polygon
          key={peak[0]}
          points={pts([peak, right, [right[0], VIEW_H], [peak[0] + 40, VIEW_H]])}
          style={{ fill: 'var(--ridge-mid-shade)' }}
        />
      ))}
      <polygon points={pts(FRONT.outline)} transform="translate(0 -10)" style={{ fill: 'var(--paper-shadow)' }} />
      <polygon points={pts(FRONT.outline)} style={{ fill: 'var(--ridge-near)' }} />
    </svg>
  )
}
