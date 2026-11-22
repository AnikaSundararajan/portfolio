import type { ReactNode } from 'react'
import { SHADE_FACE, WORLD_H, WORLD_W } from '../world'

/** One separately animatable SVG layer positioned in mountain (world) coordinates. */
export function WorldLayer({ name, children }: { name: string; children: ReactNode }) {
  return (
    <svg
      className={`layer layer--world layer--${name}`}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/** A band filled with `fill`, with its shaded east face and paper drop-shadow baked in. */
export function Band({
  id,
  points,
  fill,
  shade,
  shadow = true,
  children,
}: {
  id: string
  points: string
  fill: string
  shade: string
  shadow?: boolean
  children?: ReactNode
}) {
  return (
    <>
      <defs>
        <clipPath id={`clip-${id}`}>
          <polygon points={points} />
        </clipPath>
      </defs>
      {shadow && <polygon points={points} transform="translate(0 -16)" style={{ fill: 'var(--paper-shadow)' }} />}
      <polygon points={points} style={{ fill: `var(${fill})` }} />
      <g clipPath={`url(#clip-${id})`}>
        <polygon points={SHADE_FACE} style={{ fill: `var(${shade})` }} />
        {children}
      </g>
    </>
  )
}
