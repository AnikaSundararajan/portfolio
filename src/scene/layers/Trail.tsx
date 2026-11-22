import { pts } from '../geometry'
import { TRAIL, TRAIL_TOTAL, climberY, trailAtY } from '../world'
import { WorldLayer } from './WorldLayer'

const D = pts(TRAIL)

/** Trail markers (flags) are placed at the climb progress where each content panel is anchored. */
export function Trail({ markers }: { markers: { key: string; progress: number }[] }) {
  return (
    <WorldLayer name="trail">
      <polyline
        points={D}
        fill="none"
        style={{ stroke: 'var(--trail)' }}
        strokeWidth="7"
        strokeDasharray="4 22"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <polyline
        className="trail__walked"
        points={D}
        fill="none"
        stroke="rgba(40, 24, 30, 0.35)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${TRAIL_TOTAL} ${TRAIL_TOTAL}`}
        strokeDashoffset={TRAIL_TOTAL}
      />
      <polyline
        className="trail__walked"
        points={D}
        fill="none"
        style={{ stroke: 'var(--trail)' }}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${TRAIL_TOTAL} ${TRAIL_TOTAL}`}
        strokeDashoffset={TRAIL_TOTAL}
      />
      {markers.map(({ key, progress }) => {
        const { x, y } = trailAtY(climberY(progress))
        return (
          <g key={key} className="trail__marker" data-marker={key} transform={`translate(${x} ${y}) scale(1.5)`}>
            <rect x="-3" y="-78" width="6" height="80" fill="#3b2a24" />
            <polygon points="3,-78 52,-62 3,-46" fill="#e8673c" />
            <polygon points="3,-62 52,-62 3,-46" fill="#c24f2b" />
            <ellipse cx="0" cy="2" rx="14" ry="5" fill="rgba(0,0,0,0.25)" />
          </g>
        )
      })}
      <g className="trail__climber" transform={`translate(${TRAIL[0][0]} ${TRAIL[0][1]})`}>
        <g transform="scale(1.6)">
        <ellipse cx="0" cy="4" rx="20" ry="7" fill="rgba(0,0,0,0.28)" />
        <circle cx="0" cy="-26" r="22" fill="#fff8ec" />
        <circle cx="0" cy="-26" r="13" fill="#e8673c" />
        </g>
      </g>
    </WorldLayer>
  )
}
