const CLOUDS = [
  { x: 260, y: 210, s: 1.1 },
  { x: 980, y: 140, s: 0.8 },
  { x: 1380, y: 300, s: 1.3 },
  { x: 620, y: 420, s: 0.9 },
  { x: 120, y: 560, s: 0.7 },
  { x: 1180, y: 620, s: 1 },
]

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  const body = (
    <>
      <circle cx={-60} cy={-8} r={34} />
      <circle cx={-10} cy={-30} r={48} />
      <circle cx={48} cy={-14} r={38} />
      <rect x={-110} y={-14} width={210} height={30} rx={15} />
    </>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform="translate(6 10)" style={{ fill: 'var(--cloud-shade)' }}>
        {body}
      </g>
      <g style={{ fill: 'var(--cloud)' }}>{body}</g>
    </g>
  )
}

export function Clouds() {
  return (
    <svg className="layer layer--clouds" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {CLOUDS.map((c) => (
        <Cloud key={`${c.x}-${c.y}`} {...c} />
      ))}
    </svg>
  )
}
