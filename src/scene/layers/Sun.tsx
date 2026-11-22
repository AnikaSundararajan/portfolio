const RAYS = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2)

export function Sun() {
  return (
    <svg className="layer layer--sun" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="sun-glow">
          <stop offset="0" style={{ stopColor: 'var(--sun-glow)', stopOpacity: 0.85 }} />
          <stop offset="1" style={{ stopColor: 'var(--sun-glow)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <g className="sun__body" transform="translate(1110 600)">
        <circle r="420" fill="url(#sun-glow)" />
        <g className="sun__rays" style={{ fill: 'var(--sun-ring)' }} opacity="0.35">
          {RAYS.map((a) => {
            const w = 0.07
            const r1 = 120
            const r2 = 200
            const p = [
              [Math.cos(a - w) * r1, Math.sin(a - w) * r1],
              [Math.cos(a) * r2, Math.sin(a) * r2],
              [Math.cos(a + w) * r1, Math.sin(a + w) * r1],
            ]
            return <polygon key={a} points={p.map((q) => q.join(',')).join(' ')} />
          })}
        </g>
        <circle r="122" style={{ fill: 'var(--sun-ring)' }} opacity="0.45" />
        <circle r="100" style={{ fill: 'var(--sun-ring)' }} opacity="0.7" />
        <circle r="80" style={{ fill: 'var(--sun-core)' }} />
      </g>
    </svg>
  )
}
