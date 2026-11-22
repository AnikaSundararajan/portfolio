import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useCallback, useRef, useState } from 'react'
import { NAV_SECTIONS, PANELS, experience, projects, type PanelDef, type SectionId } from '../content'
import { TrailNav } from '../nav/TrailNav'
import { Scene } from '../scene/Scene'
import { lerp } from '../scene/geometry'
import { DAWN, DAY, MORNING } from '../scene/palette'
import {
  CAM_H,
  CAM_W,
  PEAK,
  TRAIL_TOTAL,
  VIEW_H,
  VIEW_W,
  WIDE_W,
  WORLD_H,
  WORLD_W,
  climberY,
  trailAtY,
} from '../scene/world'
import { Panel } from './Panel'
import { DURATION, MARKERS, PANEL_TIMES, SECTION_TIMES, elevationAt, panelAt } from './timeline'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Scroll distance per timeline unit, in viewport heights. */
const SCROLL_PER_UNIT = 0.9
const INTRO_START_SCALE = 2.6

type Api = {
  goTo: (time: number) => void
  climb: () => void
}

function panelLabel(panel: PanelDef | undefined) {
  if (!panel?.section) return 'Summit'
  const section = NAV_SECTIONS.find((s) => s.id === panel.section)!.label
  if (panel.section === 'experience') return `${section} · ${experience[panel.index].company}`
  if (panel.section === 'projects') return `${section} · ${panel.index + 1}/${projects.length}`
  return section
}

export function ClimbExperience() {
  const root = useRef<HTMLDivElement>(null)
  const api = useRef<Api | null>(null)
  const [panelIndex, setPanelIndex] = useState(0)
  const [introDone, setIntroDone] = useState(false)

  useGSAP(
    () => {
      const el = root.current!
      const q = gsap.utils.selector(el)
      const stage = q('.stage')[0] as HTMLElement
      const world = q('.world')[0] as HTMLElement
      const camera = q('.camera')[0] as HTMLElement
      const wide = q('.layer--wide') as HTMLElement[]
      const walked = el.querySelectorAll<SVGPolylineElement>('.trail__walked')
      const climber = el.querySelector<SVGGElement>('.trail__climber')!
      const altimeter = q('.altimeter__value')[0] as HTMLElement
      const panels = q('.panel') as HTMLElement[]

      if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)

      // Smooth scrolling, driven by GSAP's ticker so Lenis and ScrollTrigger stay in lockstep.
      const lenis = new Lenis({ autoRaf: false, lerp: 0.09 })
      lenis.on('scroll', ScrollTrigger.update)
      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      // ---- Layout: world units -> pixels for the current viewport.
      const dims = { vw: 0, vh: 0, wu: 1, viewH: CAM_H }
      const layout = () => {
        dims.vw = window.innerWidth
        dims.vh = window.innerHeight
        dims.wu = Math.max(dims.vw / CAM_W, dims.vh / CAM_H)
        dims.viewH = dims.vh / dims.wu
        const bu = Math.max(dims.vw / VIEW_W, dims.vh / VIEW_H)
        gsap.set(world, { width: WORLD_W * dims.wu, height: WORLD_H * dims.wu })
        gsap.set(wide, { width: WIDE_W * bu, height: VIEW_H * bu, left: (dims.vw - WIDE_W * bu) / 2 })
      }

      // ---- Camera: climb progress p moves the world and the climber along the trail.
      const cam = { p: 0 }
      const applyCamera = () => {
        const { p } = cam
        const yCenter = lerp(WORLD_H - dims.viewH / 2, PEAK[1] + dims.viewH * 0.1, p)
        gsap.set(world, {
          x: dims.vw / 2 - (WORLD_W / 2) * dims.wu,
          y: dims.vh / 2 - yCenter * dims.wu,
        })
        const at = trailAtY(climberY(p))
        climber.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`)
        const offset = (TRAIL_TOTAL - at.length).toFixed(1)
        walked.forEach((line) => line.setAttribute('stroke-dashoffset', offset))
        altimeter.textContent = elevationAt(p).toLocaleString('en-US')
      }

      layout()
      applyCamera()
      gsap.set(stage, DAWN)

      // ---- Master timeline: one unit per content panel.
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.fromTo(cam, { p: 0 }, { p: 1, duration: DURATION, onUpdate: applyCamera }, 0)
        .fromTo(stage, { ...DAWN }, { ...MORNING, duration: DURATION / 2 }, 0)
        .fromTo(stage, { ...MORNING }, { ...DAY, duration: DURATION / 2, immediateRender: false }, DURATION / 2)
        .fromTo('.layer--sun', { yPercent: 10, xPercent: 0 }, { yPercent: -48, xPercent: -10, duration: DURATION }, 0)
        .fromTo('.layer--clouds', { yPercent: -40, xPercent: 0 }, { yPercent: 75, xPercent: -8, duration: DURATION }, 0)
        .fromTo('.layer--peaks-far', { yPercent: 0 }, { yPercent: 30, duration: DURATION }, 0)
        .fromTo('.layer--ridges', { yPercent: 0 }, { yPercent: 70, duration: DURATION }, 0)
        .fromTo('.layer--foreground', { yPercent: 0 }, { yPercent: 90, duration: 1, ease: 'power1.in' }, 0)

      panels.forEach((panel, i) => {
        if (i === 0) {
          tl.fromTo(panel, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: 0.25 }, 0.6)
          return
        }
        tl.fromTo(panel, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power1.out' }, i + 0.15)
        if (i < panels.length - 1) {
          tl.to(panel, { autoAlpha: 0, y: -50, duration: 0.25, ease: 'power1.in' }, i + 0.8)
        }
      })

      let current = 0
      const st = ScrollTrigger.create({
        trigger: stage,
        pin: true,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * DURATION * SCROLL_PER_UNIT)}`,
        scrub: true,
        animation: tl,
        onUpdate: () => {
          const next = panelAt(tl.time())
          if (next !== current) {
            current = next
            setPanelIndex(next)
          }
        },
      })

      ScrollTrigger.addEventListener('refreshInit', layout)
      ScrollTrigger.addEventListener('refresh', applyCamera)

      api.current = {
        goTo: (time) => {
          const target = st.start + (st.end - st.start) * (time / DURATION)
          const distance = Math.abs(target - window.scrollY) / window.innerHeight
          lenis.scrollTo(target, { duration: gsap.utils.clamp(0.8, 3.2, 0.6 + distance * 0.35) })
        },
        climb: () => {
          const t = tl.time()
          const next = PANEL_TIMES.find((a) => a > t + 0.05)
          if (next !== undefined) api.current?.goTo(next)
        },
      }

      // ---- Intro: foreground trees -> full mountain -> hold -> settle at base.
      lenis.stop()
      const reveal = gsap.utils.clamp(0.26, 1, dims.vh / (WORLD_H * dims.wu))
      const landing = q('.panel--landing .panel__card')
      const intro = gsap.timeline({
        onComplete: () => {
          removeSkip()
          lenis.start()
          setIntroDone(true)
        },
      })
      intro
        .set(camera, { transformOrigin: '50% 100%', scale: INTRO_START_SCALE })
        .set(landing, { autoAlpha: 0, y: 30 })
        .to('.fg__grove--curtain-left', { x: -700, y: 160, duration: 1.4, ease: 'power2.inOut' }, 0.15)
        .to('.fg__grove--curtain-right', { x: 700, y: 160, duration: 1.4, ease: 'power2.inOut' }, 0.15)
        .to(camera, { scale: reveal, duration: 1.5, ease: 'power2.inOut' }, 0.3)
        .to(camera, { scale: 1, duration: 1.3, ease: 'power3.inOut' }, 2.6)
        .to(landing, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.5)
        .to(q('.skip-hint'), { autoAlpha: 0, duration: 0.3 }, 3.6)

      const skip = () => intro.progress(1)
      const onKey = (e: KeyboardEvent) => {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) skip()
      }
      const events = ['pointerdown', 'wheel', 'touchstart'] as const
      events.forEach((type) => window.addEventListener(type, skip, { passive: true }))
      window.addEventListener('keydown', onKey)
      const removeSkip = () => {
        events.forEach((type) => window.removeEventListener(type, skip))
        window.removeEventListener('keydown', onKey)
      }

      return () => {
        removeSkip()
        ScrollTrigger.removeEventListener('refreshInit', layout)
        ScrollTrigger.removeEventListener('refresh', applyCamera)
        gsap.ticker.remove(raf)
        lenis.destroy()
        api.current = null
      }
    },
    { scope: root },
  )

  const active = PANELS[panelIndex].section
  const atSummit = panelIndex === PANELS.length - 1

  const onNavigate = useCallback((id: SectionId) => api.current?.goTo(SECTION_TIMES[id]), [])
  const onClimb = useCallback(() => api.current?.climb(), [])

  return (
    <div className="climb" ref={root}>
      <div className="stage">
        <Scene markers={MARKERS} />
        <div className="panels">
          {PANELS.map((panel, i) => (
            <section
              key={panel.key}
              id={panel.key === 'landing' ? undefined : panel.key}
              className={`panel panel--${panel.key} ${panel.section === 'experience' || panel.section === 'projects' ? 'panel--compact' : ''}`}
              aria-hidden={i !== panelIndex}
            >
              <div className="panel__card">
                <Panel panel={panel} index={i} />
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="altimeter" aria-hidden="true">
        <span className="altimeter__label">Elev.</span> <span className="altimeter__value">1,200</span> ft
      </div>
      {!introDone && <p className="skip-hint">Click or press any key to skip</p>}
      <TrailNav
        hidden={!introDone}
        active={active}
        onNavigate={onNavigate}
        onClimb={onClimb}
        climbLabel={atSummit ? 'You made it' : `Next: ${panelLabel(PANELS[panelIndex + 1])}`}
        atSummit={atSummit}
      />
    </div>
  )
}
