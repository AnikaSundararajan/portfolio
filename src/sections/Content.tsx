import type { ReactNode } from 'react'
import { about, contact, education, landing, type Job, type Project } from '../content'

export function Blaze({ className = '' }: { className?: string }) {
  return <span className={`blaze ${className}`} aria-hidden="true" />
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="kicker">
      <Blaze />
      {children}
    </p>
  )
}

export function Landing() {
  return (
    <div className="landing">
      <h1 className="landing__name">{landing.name}</h1>
      <p className="landing__tagline">{landing.tagline}</p>
      <p className="landing__motto">
        <em>{landing.motto}</em>
      </p>
    </div>
  )
}

export function About({ kicker }: { kicker?: string }) {
  return (
    <>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2>{about.title}</h2>
      {about.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </>
  )
}

export function Education({ kicker }: { kicker?: string }) {
  return (
    <>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2>{education.title}</h2>
      <h3>{education.school}</h3>
      <p className="muted">{education.program}</p>
      <ul className="degrees">
        {education.degrees.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <p className="badge">{education.classOf}</p>
    </>
  )
}

export function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <article className="waypoint">
      <div className="waypoint__marker" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="waypoint__body">
        <h3>
          {job.company} <span className="muted">· {job.role}</span>
        </h3>
        <p className="waypoint__dates">{job.dates}</p>
        <ul>
          {job.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <Tags tags={job.tags} />
      </div>
    </article>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project">
      <h3>
        {project.href ? (
          <a href={project.href} target="_blank" rel="noreferrer">
            {project.name} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          project.name
        )}
      </h3>
      <p>{project.blurb}</p>
      <Tags tags={project.tags} />
    </article>
  )
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="tags">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

export function Contact({ kicker }: { kicker?: string }) {
  return (
    <>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2>{contact.title}</h2>
      <ul className="contact-links">
        {contact.links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
