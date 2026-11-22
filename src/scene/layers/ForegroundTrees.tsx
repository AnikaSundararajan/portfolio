import { pine, rng } from '../geometry'
import { VIEW_H, WIDE_W } from '../world'

type Tree = ReturnType<typeof pine>
const CX = WIDE_W / 2

function grove(seed: number, from: number, to: number, hMin: number, hMax: number, count: number): Tree[] {
  const r = rng(seed)
  return Array.from({ length: count }, () => {
    const x = CX + r.range(from, to)
    return pine(x, VIEW_H + r.range(10, 60), r.range(hMin, hMax))
  }).sort((a, b) => b.trunk.h - a.trunk.h)
}

/** Groves: outer ones frame the base; the inner "curtain" fills the frame at the start of the intro. */
const GROVES = {
  'outer-left': grove(71, -1500, -560, 380, 700, 22),
  'outer-right': grove(73, 560, 1500, 380, 700, 22),
  'curtain-left': [pine(CX - 110, VIEW_H + 40, 1250), ...grove(79, -560, 0, 700, 1050, 16)],
  'curtain-right': [pine(CX + 110, VIEW_H + 40, 1250), ...grove(83, 0, 560, 700, 1050, 16)],
}

function Grove({ name, trees }: { name: string; trees: Tree[] }) {
  return (
    <g className={`fg__grove fg__grove--${name}`}>
      {trees.map((t) => (
        <g key={t.lit}>
          <polygon points={t.lit} transform="translate(-8 -10)" style={{ fill: 'var(--paper-shadow)' }} />
          <rect x={t.trunk.x} y={t.trunk.y} width={t.trunk.w} height={t.trunk.h} fill="#20160f" />
          <polygon points={t.lit} style={{ fill: 'var(--fg-pine-lit)' }} />
          <polygon points={t.shade} style={{ fill: 'var(--fg-pine-shade)' }} />
        </g>
      ))}
    </g>
  )
}

export function ForegroundTrees() {
  return (
    <svg className="layer layer--wide layer--foreground" viewBox={`0 0 ${WIDE_W} ${VIEW_H}`} aria-hidden="true">
      {Object.entries(GROVES).map(([name, trees]) => (
        <Grove key={name} name={name} trees={trees} />
      ))}
      <rect x="0" y={VIEW_H - 18} width={WIDE_W} height="18" style={{ fill: 'var(--fg-pine-shade)' }} />
    </svg>
  )
}
