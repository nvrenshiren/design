import * as React from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMotionDemo } from "./hooks"
import type { TransitionDemoProps } from "./types"
import { MotionStyles, type MotionFrames } from "../lib/motion-styles"

type Frame = { time: number; x: number; y: number; turn: number; flip: number; pitch: number }
type Paper = { width: number; height: number; color: number; round: boolean; frames: Frame[]; fadeAt: number; endAt: number; landing: "button" | "floor" }
type Burst = { name: string; papers: Paper[]; frames: MotionFrames; duration: number; width: number; height: number }
type Geometry = { width: number; height: number; buttonLeft: number; buttonRight: number; buttonTop: number }

// Independently authored from the public Canvas preview. Physics is calculated
// once per interaction; CSS plays the resulting bounded trajectories, without
// a JavaScript frame loop or an animation-library dependency.
function randomSequence(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0
    return value / 4294967296
  }
}

function makePaper(index: number, count: number, geometry: Geometry, random: () => number): Paper {
  const { width, height, buttonLeft, buttonRight, buttonTop } = geometry
  const scale = height / 460
  const paperWidth = 2.2 + random() * 2.1
  const paperHeight = index % 5 === 0 ? paperWidth : 3.8 + random() * 2.7
  const delay = random() * 110
  const gravity = (500 + random() * 360) * scale
  const drag = .4 + random() * .55
  const flutter = 9 + random() * 19
  const phase = random() * Math.PI * 2
  const restitution = .19 + random() * .19
  let x = 5 + ((index + .18 + random() * .64) / count) * (width - 10)
  let y = -8 - random() * 165 * scale
  let velocityX = (random() - .5) * 62
  let velocityY = (65 + random() * 300) * scale
  let spin = (random() < .5 ? -1 : 1) * (90 + random() * 170)
  let turn = random() * 180
  let flip = random() * 180
  const flipSpeed = (random() < .5 ? -1 : 1) * (210 + random() * 320)
  const pitch = (random() - .5) * 40
  let settled = false
  let landing: Paper["landing"] = "floor"
  let bounceCount = 0
  let lastRecorded = -1
  const frames: Frame[] = [{ time: 0, x, y, turn, flip, pitch }, { time: delay, x, y, turn, flip, pitch }]
  const step = 1 / 120
  for (let tick = 1; tick <= 324; tick++) {
    const t = tick * step
    const previousY = y
    const previousX = x
    if (!settled) {
      velocityX += Math.sin(t * (5.3 + index % 4 * .27) + phase) * flutter * step
      velocityX *= Math.exp(-drag * step)
      velocityY += gravity * step
      velocityY *= Math.exp(-(.11 + index % 3 * .035) * step)
      x += velocityX * step
      y += velocityY * step
      turn += spin * step
      flip += flipSpeed * step
      if (x < 4 || x > width - 4) {
        x = Math.max(4, Math.min(width - 4, x))
        velocityX *= -.32
      }
      // A narrow paper face crosses the measured button top; pieces beyond
      // its physical edge continue to the floor instead of snapping inward.
      const buttonSurface = buttonTop - paperHeight * .42
      const floorSurface = height - paperHeight * .43 - 1
      const onButton = x > buttonLeft + 3 && x < buttonRight - 3
      const crossesButton = velocityY > 0 && onButton && previousY <= buttonSurface && y >= buttonSurface
      const crossesFloor = velocityY > 0 && y >= floorSurface
      if (crossesButton || crossesFloor) {
        landing = crossesButton ? "button" : "floor"
        const surface = crossesButton ? buttonSurface : floorSurface
        const impactTime = (surface - previousY) / Math.max(.001, y - previousY)
        x = previousX + (x - previousX) * Math.max(0, Math.min(1, impactTime))
        y = surface
        frames.push({ time: delay + (t - step + step * impactTime) * 1000, x, y, turn, flip, pitch })
        velocityY *= -restitution
        velocityX *= crossesButton ? .73 : .56
        spin *= -.38
        bounceCount += 1
        if (Math.abs(velocityY) < 15 || bounceCount > 4) {
          settled = true
        }
      }
    }
    if (tick % 8 === 0 || settled && lastRecorded < tick - 1) {
      frames.push({ time: delay + t * 1000, x, y, turn, flip, pitch })
      lastRecorded = tick
    }
    if (settled) {
      // The last low-energy collision still takes a moment to fold flat;
      // snapping directly to its resting face would read as a missing frame.
      frames.push({ time: delay + t * 1000 + 80 + random() * 90, x, y, turn: turn + (random() - .5) * 10, flip: Math.round(flip / 180) * 180 + (random() - .5) * 22, pitch: pitch * .4 })
      break
    }
  }
  const final = frames[frames.length - 1]
  const fadeAt = Math.max(2580 + random() * 610, final.time + 100)
  const endAt = fadeAt + 300 + random() * 350
  frames.push({ ...final, time: fadeAt }, { ...final, time: endAt })
  return { width: paperWidth, height: paperHeight, color: index % 3, round: index % 7 === 0, frames, fadeAt, endAt, landing }
}

function makeBurst(name: string, geometry: Geometry, seed: number): Burst {
  const random = randomSequence(seed)
  const count = Math.max(38, Math.min(88, Math.round(geometry.width / 6)))
  const papers = Array.from({ length: count }, (_, index) => makePaper(index, count, geometry, random))
  const frames: MotionFrames = {}
  papers.forEach((paper, index) => {
    frames[`${name}-${index}`] = Object.fromEntries(paper.frames.map((frame) => {
      const percentage = (frame.time / paper.endAt * 100).toFixed(3)
      const opacity = frame.time >= paper.endAt ? 0 : 1
      return [`${percentage}%`, {
        transform: `translate3d(${(frame.x - paper.width / 2).toFixed(2)}px,${(frame.y - paper.height / 2).toFixed(2)}px,0) rotateZ(${frame.turn.toFixed(1)}deg) rotateY(${frame.flip.toFixed(1)}deg) rotateX(${frame.pitch.toFixed(1)}deg)`,
        opacity,
      }]
    }))
  })
  return { name, papers, frames, duration: Math.max(...papers.map(paper => paper.endAt)), width: geometry.width, height: geometry.height }
}

export function ConfettiBurst(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const revision = React.useRef(0)
  const previousReplay = React.useRef(replayKey)
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const [burst, setBurst] = React.useState<Burst | null>(null)
  const [celebrations, setCelebrations] = React.useState(0)
  const clear = React.useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
    setBurst(null)
  }, [])
  const celebrate = React.useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
    revision.current += 1
    setCelebrations(value => value + 1)
    if (stopped || !stageRef.current || !buttonRef.current) { setBurst(null); return }
    const stage = stageRef.current.getBoundingClientRect()
    const button = buttonRef.current.getBoundingClientRect()
    const next = makeBurst(`sc-pro-confetti-${id}-${revision.current}`, {
      width: stage.width,
      height: stage.height,
      buttonLeft: button.left - stage.left,
      buttonRight: button.right - stage.left,
      buttonTop: button.top - stage.top,
    }, revision.current * 619 + 431)
    setBurst(next)
    timer.current = setTimeout(() => { setBurst(null); timer.current = null }, Math.ceil(next.duration) + 80)
  }, [id, stopped])

  React.useEffect(() => {
    if (previousReplay.current === replayKey) return
    previousReplay.current = replayKey
    celebrate()
  }, [replayKey, celebrate])
  React.useEffect(() => { if (stopped) clear() }, [stopped, clear])
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let previous = stage.getBoundingClientRect()
    const observer = new ResizeObserver(() => {
      const next = stage.getBoundingClientRect()
      if (Math.abs(next.width - previous.width) > .5 || Math.abs(next.height - previous.height) > .5) clear()
      previous = next
    })
    observer.observe(stage)
    return () => { observer.disconnect(); if (timer.current !== null) clearTimeout(timer.current) }
  }, [clear])

  return <div className="sc-tr-effects-demo sc:[--effects-ease:cubic-bezier(.22,_1,_.36,_1)] sc:flex sc:min-w-0 sc:w-full sc:min-h-[260px] sc:p-[24px_12px] sc:flex-col sc:items-center sc:justify-center sc:[&[data-stopped='true']_*]:animate-none! sc:[&[data-stopped='true']_*]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::before]:animate-none! sc:[&[data-stopped='true']_*::before]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::after]:animate-none! sc:[&[data-stopped='true']_*::after]:[transition-duration:0ms]! sc:[&[data-stopped='true']_.sc-tr-effects-avatar-button]:[transform:none] sc:[&[data-stopped='true']_.sc-tr-effects-tilt-card]:[transform:none] sc:motion-reduce:[&_*]:animate-none! sc:motion-reduce:[&_*]:[transition-duration:0ms]! sc:motion-reduce:[&_*::before]:animate-none! sc:motion-reduce:[&_*::before]:[transition-duration:0ms]! sc:motion-reduce:[&_*::after]:animate-none! sc:motion-reduce:[&_*::after]:[transition-duration:0ms]! sc:at-most-440:p-[20px_4px] sc-tr-pro-confetti-demo sc:gap-4 sc:[&_.sc-tr-effects-confetti-stage]:relative sc:[&_.sc-tr-effects-confetti-stage]:flex sc:[&_.sc-tr-effects-confetti-stage]:w-[min(100%,_520px)] sc:[&_.sc-tr-effects-confetti-stage]:h-[300px] sc:[&_.sc-tr-effects-confetti-stage]:min-h-0 sc:[&_.sc-tr-effects-confetti-stage]:items-center sc:[&_.sc-tr-effects-confetti-stage]:justify-center sc:[&_.sc-tr-effects-confetti-stage]:overflow-hidden sc:[&_.sc-tr-effects-confetti-stage]:isolate sc:[&_.sc-tr-effects-confetti-stage]:[contain:layout_paint] sc:[&_.sc-tr-effects-confetti-stage_>_[data-slot='button']]:relative sc:[&_.sc-tr-effects-confetti-stage_>_[data-slot='button']]:z-1 sc:[&[data-stopped='true']_.sc-tr-pro-confetti-papers]:hidden sc:at-most-440:[&_.sc-tr-effects-confetti-stage]:h-[260px]" data-stopped={stopped}>
    <div ref={stageRef} className="sc-tr-effects-confetti-stage" data-confetti-phase={burst ? "running" : "idle"}>
      <Button ref={buttonRef} onClick={celebrate}><Sparkles data-icon="inline-start" />庆祝完成</Button>
      {burst && !stopped && <span key={burst.name} className="sc-tr-effects-confetti sc-tr-pro-confetti-papers sc:absolute sc:inset-0 sc:z-2 sc:perspective-[700px] sc:pointer-events-none sc:motion-reduce:hidden" aria-hidden="true" data-particle-count={burst.papers.length} data-button-landings={burst.papers.filter(paper => paper.landing === "button").length}>
        <MotionStyles frames={burst.frames} />
        {burst.papers.map((paper, index) => <i key={index} className="sc-tr-pro-confetti-piece sc:[animation-name:var(--paper-animation)] sc:[animation-duration:var(--paper-duration)] sc:w-[var(--paper-width)] sc:h-[var(--paper-height)] sc:absolute sc:left-0 sc:top-0 sc:block sc:text-primary sc:[transform-origin:center] sc:transform-3d sc:[animation-timing-function:linear] sc:[animation-fill-mode:both] sc:[will-change:transform,_opacity] sc:[&[data-color='1']]:text-chart-2 sc:[&[data-color='2']]:text-chart-3 sc:[&_>_b]:absolute sc:[&_>_b]:inset-0 sc:[&_>_b]:block sc:[&_>_b]:rounded-[.35px] sc:[&_>_b]:bg-current sc:[&_>_b]:backface-hidden sc:[&_>_b:last-child]:[background:color-mix(in_oklab,_currentColor_80%,_var(--background))] sc:[&_>_b:last-child]:[transform:rotateY(180deg)_translateZ(.1px)] sc:[&[data-round='true']_>_b]:rounded-[35%]" data-color={paper.color} data-round={paper.round} data-landing={paper.landing} style={{ "--paper-animation": `${burst.name}-${index}`, "--paper-duration": `${paper.endAt}ms`, "--paper-width": `${paper.width}px`, "--paper-height": `${paper.height}px` } as React.CSSProperties}><b /><b /></i>)}
      </span>}
    </div>
    <p className="sc-tr-effects-hint sc:m-0 sc:max-w-[42ch] sc:text-muted-foreground sc:text-center sc:[font-size:.8125rem] sc:leading-[1.7]" aria-live="polite">{celebrations > 0 ? `已完成第 ${celebrations} 次庆祝` : "点击触发彩屑，轻盈飘落并在按钮与底面停留"}</p>
  </div>
}
