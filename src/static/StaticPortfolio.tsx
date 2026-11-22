import { useEffect, useState, type CSSProperties } from 'react'
import { NAV_SECTIONS, experience, projects, type SectionId } from '../content'
import { TrailNav } from '../nav/TrailNav'
import { Scene } from '../scene/Scene'
import { MORNING } from '../scene/palette'
import { About, Contact, Education, JobCard, Kicker, Landing, ProjectCard } from '../sections/Content'

const scrollToSection = (id: SectionId) => document.getElementById(id)?.scrollIntoView({ block: 'start' })

/** Reduced-motion fallback: plain document scrolling, every section visible, no pinning or intro. */
export function StaticPortfolio() {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) return setActive(NAV_SECTIONS[NAV_SECTIONS.length - 1].id)
      const line = window.innerHeight * 0.35
      const passed = NAV_SECTIONS.filter(({ id }) => {
        const el = document.getElementById(id)
        return el !== null && el.getBoundingClientRect().top <= line
      })
      setActive(passed.length ? passed[passed.length - 1].id : null)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const index = active ? NAV_SECTIONS.findIndex((s) => s.id === active) : -1
  const next = NAV_SECTIONS[index + 1]

  return (
    <div className="static">
      <header className="static-hero" style={MORNING as CSSProperties}>
        <Scene markers={[]} />
        <div className="static-hero__card panel__card">
          <Landing />
        </div>
      </header>
      <main className="static-main">
        <section id="about" className="static-section">
          <About kicker="Trailhead" />
        </section>
        <section id="education" className="static-section">
          <Education kicker="Base camp" />
        </section>
        <section id="experience" className="static-section">
          <Kicker>Waypoints</Kicker>
          <h2>Experience</h2>
          <div className="waypoint-list">
            {experience.map((job, i) => (
              <JobCard key={job.company} job={job} index={i} />
            ))}
          </div>
        </section>
        <section id="projects" className="static-section">
          <Kicker>Camps</Kicker>
          <h2>Projects</h2>
          <div className="project-grid">
            {projects.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </section>
        <section id="contact" className="static-section static-section--summit">
          <Contact kicker="Summit" />
        </section>
      </main>
      <TrailNav
        active={active}
        onNavigate={scrollToSection}
        onClimb={() => next && scrollToSection(next.id)}
        climbLabel={next ? `Next: ${next.label}` : 'You made it'}
        atSummit={!next}
      />
    </div>
  )
}
