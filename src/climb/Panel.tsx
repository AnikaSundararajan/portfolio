import { experience, projects, type PanelDef } from '../content'
import { About, Contact, Education, JobCard, Kicker, Landing, ProjectCard } from '../sections/Content'
import { DURATION, PANEL_TIMES, elevationAt } from './timeline'

const ft = (i: number) => `${elevationAt(PANEL_TIMES[i] / DURATION).toLocaleString('en-US')} ft`

export function Panel({ panel, index }: { panel: PanelDef; index: number }) {
  const elev = ft(index)
  switch (panel.section) {
    case null:
      return <Landing />
    case 'about':
      return <About kicker={`Trailhead · ${elev}`} />
    case 'education':
      return <Education kicker={`Base camp · ${elev}`} />
    case 'experience':
      return (
        <>
          <Kicker>
            Experience · Waypoint {panel.index + 1} of {experience.length} · {elev}
          </Kicker>
          <JobCard job={experience[panel.index]} index={panel.index} />
        </>
      )
    case 'projects':
      return (
        <>
          <Kicker>
            Projects · Camp {panel.index + 1} of {projects.length} · {elev}
          </Kicker>
          <ProjectCard project={projects[panel.index]} />
        </>
      )
    case 'contact':
      return <Contact kicker={`Summit · ${elev}`} />
  }
}
