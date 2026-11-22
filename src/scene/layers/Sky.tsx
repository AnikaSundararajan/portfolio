export function Sky() {
  return (
    <svg className="layer layer--sky" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--sky-top)' }} />
          <stop offset="0.45" style={{ stopColor: 'var(--sky-mid)' }} />
          <stop offset="0.78" style={{ stopColor: 'var(--sky-low)' }} />
          <stop offset="1" style={{ stopColor: 'var(--sky-horizon)' }} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sky-gradient)" />
    </svg>
  )
}
