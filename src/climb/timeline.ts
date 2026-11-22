import { NAV_SECTIONS, PANELS, type SectionId } from '../content'

/** Master timeline length: one unit per content panel. */
export const DURATION = PANELS.length

const LAST = PANELS.length - 1

/** Timeline time at which panel i is fully revealed (used by nav + trail markers). */
export function anchorTime(i: number) {
  if (i === 0) return 0
  if (i === LAST) return DURATION
  return i + 0.45
}

export const PANEL_TIMES = PANELS.map((_, i) => anchorTime(i))

export const SECTION_TIMES = Object.fromEntries(
  NAV_SECTIONS.map(({ id }) => [id, anchorTime(PANELS.findIndex((p) => p.section === id))]),
) as Record<SectionId, number>

/** Panel index on screen at timeline time t. */
export function panelAt(t: number) {
  return Math.max(0, Math.min(LAST, Math.floor(t + 0.15)))
}

export const MARKERS = PANELS.slice(1).map((p, i) => ({ key: p.key, progress: anchorTime(i + 1) / DURATION }))

/** Display elevation (ft) for climb progress p. */
export const elevationAt = (p: number) => Math.round((1200 + p * 12800) / 10) * 10
