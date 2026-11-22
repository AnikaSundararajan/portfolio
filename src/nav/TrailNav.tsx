import { NAV_SECTIONS, type SectionId } from '../content'

type Props = {
  active: SectionId | null
  onNavigate: (id: SectionId) => void
  onClimb: () => void
  climbLabel: string
  atSummit: boolean
  hidden?: boolean
}

/** Desktop: right-side vertical trail rail + Climb button. Mobile: top-right trail-marker tabs. */
export function TrailNav({ active, onNavigate, onClimb, climbLabel, atSummit, hidden }: Props) {
  return (
    <>
      <nav className={`rail ${hidden ? 'is-hidden' : ''}`} aria-label="Sections">
        <ol className="rail__list">
          {NAV_SECTIONS.slice()
            .reverse()
            .map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`rail__marker ${active === id ? 'is-active' : ''}`}
                  aria-current={active === id ? 'step' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate(id)
                  }}
                >
                  <span className="rail__label">{label}</span>
                  <span className="rail__blaze" aria-hidden="true" />
                </a>
              </li>
            ))}
        </ol>
        <button type="button" className="climb-button" onClick={onClimb} disabled={atSummit}>
          <span className="climb-button__arrow" aria-hidden="true">
            ▲
          </span>
          <span>{atSummit ? 'Summit' : 'Climb'}</span>
          <span className="climb-button__next">{climbLabel}</span>
        </button>
      </nav>
      <nav className={`tabs ${hidden ? 'is-hidden' : ''}`} aria-label="Sections">
        <ul>
          {NAV_SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`tabs__tab ${active === id ? 'is-active' : ''}`}
                aria-current={active === id ? 'step' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(id)
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
