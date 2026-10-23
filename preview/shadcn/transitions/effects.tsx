import * as React from "react"
import { animate, cubicBezier, type JSAnimation } from "animejs"
import { ArrowUpRight, Check, Heart, ImageIcon, Menu, RotateCcw, Search, Sparkles, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useMotionDemo } from "./hooks"
import type { TransitionDemoProps } from "./types"

import { ImageOpenTilt } from "./pro-image"
import { DeleteWithSmokyDissolve } from "./pro-smoke"
import { ConfettiBurst } from "./pro-confetti"
export { ImageOpenTilt, DeleteWithSmokyDissolve, ConfettiBurst }

// These examples are independently authored from the public interaction demos.
// Their visuals consume the project's semantic tokens and official shadcn primitives.
const artwork = "/docs/transition-assets/sample-artwork.svg"
const hintClass = "sc-tr-effects-hint sc:m-0 sc:max-w-[42ch] sc:text-muted-foreground sc:text-center sc:[font-size:.8125rem] sc:leading-[1.7]"
type MotionStyle = React.CSSProperties & Record<`--${string}`, string | number>

function Demo({ stopped, children, className }: { stopped: boolean; children: React.ReactNode; className?: string }) {
  return <div className={cn("sc-tr-effects-demo sc:[--effects-ease:cubic-bezier(.22,_1,_.36,_1)] sc:flex sc:min-w-0 sc:w-full sc:min-h-[260px] sc:p-[24px_12px] sc:flex-col sc:items-center sc:justify-center sc:gap-6 sc:[&[data-stopped='true']_*]:animate-none! sc:[&[data-stopped='true']_*]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::before]:animate-none! sc:[&[data-stopped='true']_*::before]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::after]:animate-none! sc:[&[data-stopped='true']_*::after]:[transition-duration:0ms]! sc:[&[data-stopped='true']_.sc-tr-effects-avatar-button]:[transform:none] sc:[&[data-stopped='true']_.sc-tr-effects-tilt-card]:[transform:none] sc:motion-reduce:[&_*]:animate-none! sc:motion-reduce:[&_*]:[transition-duration:0ms]! sc:motion-reduce:[&_*::before]:animate-none! sc:motion-reduce:[&_*::before]:[transition-duration:0ms]! sc:motion-reduce:[&_*::after]:animate-none! sc:motion-reduce:[&_*::after]:[transition-duration:0ms]! sc:at-most-440:p-[20px_4px]", className)} data-stopped={stopped}>{children}</div>
}

function Reset({ onClick, children = "重置演示" }: { onClick: () => void; children?: React.ReactNode }) {
  return <Button variant="ghost" size="sm" onClick={onClick}><RotateCcw data-icon="inline-start" />{children}</Button>
}

const team = [
  { name: "陈可", initials: "CK", role: "产品设计" },
  { name: "李然", initials: "LR", role: "前端开发" },
  { name: "林夏", initials: "LX", role: "体验研究" },
  { name: "周予", initials: "ZY", role: "品牌设计" },
  { name: "王宁", initials: "WN", role: "产品经理" },
  { name: "许知", initials: "XZ", role: "质量工程" },
]

export function AvatarGroupHover(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [active, setActive] = React.useState(-1)
  const [selected, setSelected] = React.useState(-1)
  React.useEffect(() => { setActive(-1); setSelected(-1) }, [replayKey])
  return <Demo stopped={stopped}>
    <div className="sc-tr-effects-avatar-stage sc:grid sc:min-h-22 sc:[place-items:center] sc:[&[data-hovering='true']_.sc-tr-effects-avatar-button]:[transition-timing-function:var(--effects-ease)] sc:[&[data-hovering='true']_.sc-tr-effects-avatar-count]:[transition-timing-function:var(--effects-ease)]" data-hovering={active >= 0} onPointerLeave={() => setActive(-1)}>
      <AvatarGroup className="sc-tr-effects-avatar-group sc:items-center sc:gap-0 sc:p-[20px_8px_0]">
        {team.map((member, index) => {
          const distance = active < 0 ? 9 : Math.abs(index - active)
          return <Button key={member.initials} variant="ghost" size="icon-lg"
            className="sc-tr-effects-avatar-button sc:relative sc:ms-[-7px] sc:p-0 sc:rounded-full sc:[transform:translateY(var(--avatar-lift,_0))_scale(var(--avatar-scale,_1))] sc:[transition:transform_320ms_cubic-bezier(.34,_3.85,_.64,_1)] sc:[&:first-child]:ms-0 sc:[&_[data-slot='avatar']]:[box-shadow:0_0_0_2px_var(--background)] sc:[&[aria-pressed='true']_[data-slot='avatar']]:[box-shadow:0_0_0_2px_var(--primary)] sc:[&:focus-visible]:[outline:2px_solid_var(--ring)] sc:[&:focus-visible]:[outline-offset:4px] sc:motion-reduce:[transform:none]! sc:at-most-440:ms-[-10px]" aria-label={`查看${member.name}，${member.role}`}
            aria-pressed={selected === index} onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)} onBlur={() => setActive(-1)}
            onClick={() => { setSelected(index); setActive(index) }}
            style={{ "--avatar-lift": stopped || active < 0 ? "0px" : `${-4 * .45 ** distance}px`, "--avatar-scale": stopped ? 1 : distance === 0 ? 1.05 : 1 } as MotionStyle}>
            <Avatar size="lg"><AvatarFallback>{member.initials}</AvatarFallback></Avatar>
          </Button>
        })}
        <span className="sc-tr-effects-avatar-count sc:grid sc:size-9 sc:ms-[-6px] sc:[place-items:center] sc:rounded-full sc:bg-secondary sc:text-secondary-foreground sc:[box-shadow:0_0_0_2px_var(--background)] sc:[font-size:12px] sc:font-semibold sc:[transform:translateY(var(--avatar-lift,_0))] sc:[transition:transform_320ms_cubic-bezier(.34,_3.85,_.64,_1)] sc:at-most-440:size-[30px]" aria-label="还有两位成员" style={{ "--avatar-lift": stopped || active < 0 ? "0px" : `${-4 * .45 ** Math.abs(6 - active)}px` } as MotionStyle}>+2</span>
      </AvatarGroup>
    </div>
    <p className={hintClass} aria-live="polite">{selected >= 0 ? `${team[selected].name} · ${team[selected].role}` : "悬停、聚焦或点击头像查看成员"}</p>
  </Demo>
}

export function ThreeDTilt(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [tilted, setTilted] = React.useState(false)
  const surface = React.useRef<HTMLDivElement>(null)
  const resetPointer = () => {
    surface.current?.style.setProperty("--tilt-x", "0deg")
    surface.current?.style.setProperty("--tilt-y", "0deg")
    surface.current?.style.setProperty("--glare-opacity", "0")
    surface.current?.removeAttribute("data-tracking")
  }
  React.useEffect(() => { setTilted(false); resetPointer() }, [replayKey, stopped])
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (stopped || event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    event.currentTarget.setAttribute("data-tracking", "true")
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 40}deg`)
    event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 40}deg`)
    event.currentTarget.style.setProperty("--glare-x", `${x * 100}%`)
    event.currentTarget.style.setProperty("--glare-y", `${y * 100}%`)
    event.currentTarget.style.setProperty("--glare-opacity", ".32")
  }
  return <Demo stopped={stopped}>
    <div ref={surface} className="sc-tr-effects-tilt-scene sc:[--tilt-x:0deg] sc:[--tilt-y:0deg] sc:[--glare-x:50%] sc:[--glare-y:50%] sc:[--glare-opacity:0] sc:w-[min(100%,_300px)] sc:perspective-[1000px] sc:[&:is([data-tracking='true'],[data-tilted='true'])_.sc-tr-effects-tilt-card]:[transition-duration:400ms] sc:[&[data-tilted='true']_.sc-tr-effects-tilt-card]:[transform:rotateX(-8deg)_rotateY(13deg)] sc:[&[data-tilted='true']_.sc-tr-effects-tilt-card::after]:opacity-18" data-tilted={tilted}
      onPointerMove={move} onPointerLeave={resetPointer}>
      <Card className="sc-tr-effects-tilt-card sc:relative sc:min-h-[185px] sc:gap-4 sc:overflow-hidden sc:[transform:rotateX(var(--tilt-x))_rotateY(var(--tilt-y))] sc:transform-3d sc:[transition:transform_1000ms_var(--effects-ease)] sc:[&::after]:absolute sc:[&::after]:inset-0 sc:[&::after]:rounded-[inherit] sc:[&::after]:[background:radial-gradient(ellipse_at_var(--glare-x)_var(--glare-y),_var(--primary-foreground),_transparent_65%)] sc:[&::after]:opacity-[var(--glare-opacity)] sc:[&::after]:pointer-events-none sc:[&::after]:[content:''] sc:[&::after]:[transition:opacity_300ms_var(--effects-ease)] sc:[&_[data-slot='card-footer']]:justify-between sc:[&_[data-slot='card-footer']]:gap-3 sc:[&_[data-slot='card-footer']]:[font-size:12px] sc:[&_[data-slot='card-footer']]:text-muted-foreground sc:motion-reduce:[transform:none]!">
        <CardHeader><CardDescription>COHESION STUDIO</CardDescription><CardTitle>数字体验通行证</CardTitle></CardHeader>
        <CardContent><Sparkles aria-hidden="true" className="sc-tr-effects-pass-symbol sc:size-7 sc:text-primary" /></CardContent>
        <CardFooter><span>设计 · 协作 · 创造</span><span>2026</span></CardFooter>
      </Card>
    </div>
    <Button variant="outline" size="sm" aria-pressed={tilted} onClick={() => setTilted((value) => !value)}>{tilted ? "恢复平面" : "体验倾斜"}<ArrowUpRight data-icon="inline-end" /></Button>
    <p className={hintClass}>指针跟随倾斜与光泽；触屏可点击体验</p>
  </Demo>
}

export function CardStackHover(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [expanded, setExpanded] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [selected, setSelected] = React.useState(1)
  React.useEffect(() => { setExpanded(false); setHovered(false); setSelected(1) }, [replayKey])
  return <Demo stopped={stopped}>
    <div className="sc-tr-effects-stack sc:relative sc:w-[min(100%,_360px)] sc:h-[185px] sc:perspective-[850px] sc:[&[data-expanded='true']_.sc-tr-effects-stack-card]:[translate:calc((var(--stack-index)_-_1)_*_64px)_0] sc:[&[data-expanded='true']_.sc-tr-effects-stack-card]:[rotate:calc((var(--stack-index)_-_1)_*_12deg)] sc:[&[data-expanded='true']_.sc-tr-effects-stack-card]:opacity-100 sc:[&[data-expanded='true']_.sc-tr-effects-stack-card]:[transition-duration:410ms,_410ms,_610ms,_410ms,_240ms] sc:[&[data-expanded='true']_.sc-tr-effects-stack-card]:[transition-timing-function:cubic-bezier(.31,_1.84,_.64,_1),_cubic-bezier(.31,_1.84,_.64,_1),_var(--effects-ease),_cubic-bezier(.31,_1.84,_.64,_1),_ease] sc:[&[data-expanded='true']_.sc-tr-effects-stack-card[aria-pressed='true']]:[scale:1.04] sc:at-most-440:[&[data-expanded='true']_.sc-tr-effects-stack-card]:[translate:calc((var(--stack-index)_-_1)_*_57px)_0] sc:at-most-440:[&[data-expanded='true']_.sc-tr-effects-stack-card]:[rotate:calc((var(--stack-index)_-_1)_*_10deg)]" data-expanded={expanded || hovered} data-selected={selected}
      onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setHovered(false) }}>
      {[0, 1, 2].map((index) => <Button key={index} variant="outline" className="sc-tr-effects-stack-card sc:absolute sc:left-[calc(50%_-_64px)] sc:top-[15px] sc:flex sc:w-32 sc:h-[150px] sc:p-[7px] sc:flex-col sc:gap-[10px] sc:[transform-origin:50%_110%] sc:[translate:calc((var(--stack-index)_-_1)_*_9px)_0] sc:[rotate:calc((var(--stack-index)_-_1)_*_6deg)] sc:[scale:1] sc:opacity-50 sc:[transition:translate_360ms_cubic-bezier(.34,_1.5,_.64,_1),_rotate_360ms_cubic-bezier(.34,_1.5,_.64,_1),_scale_610ms_var(--effects-ease),_opacity_360ms_cubic-bezier(.34,_1.5,_.64,_1),_box-shadow_240ms_ease] sc:[&[aria-pressed='true']]:opacity-100 sc:[&_span]:[font-size:12px] sc:[&[aria-pressed='true']]:[box-shadow:0_0_0_2px_var(--primary),_0_12px_24px_color-mix(in_oklab,_var(--foreground)_10%,_transparent)] sc:[&:focus-visible]:[outline:2px_solid_var(--ring)] sc:[&:focus-visible]:[outline-offset:4px]"
        aria-label={`选择设计稿 ${index + 1}`} aria-pressed={selected === index}
        onClick={() => { setExpanded(true); setSelected(index) }} style={{ "--stack-index": index } as MotionStyle}>
        <img src={artwork} alt="" className="sc-tr-effects-stack-art sc:object-[var(--stack-art-position)] sc:w-full sc:h-25 sc:rounded-[calc(var(--radius)_-_4px)] sc:object-cover" style={{ "--stack-art-position": `${index * 45}% center` } as MotionStyle} />
        <span>设计稿 {index + 1}</span>
      </Button>)}
    </div>
    <Button variant="outline" size="sm" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? "收起卡组" : "展开卡组"}</Button>
    <p className={hintClass} aria-live="polite">已选择设计稿 {selected + 1}</p>
  </Demo>
}

/** Drag coordinates are direct input; only the settling interpolation uses Anime.js. */
export function DragDropWithPhysics(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [placed, setPlaced] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const [over, setOver] = React.useState(false)
  const card = React.useRef<HTMLButtonElement>(null)
  const zone = React.useRef<HTMLDivElement>(null)
  const motion = React.useRef<JSAnimation | null>(null)
  const track = React.useRef<{ id: number; x: number; y: number; time: number; vx: number; vy: number; dx: number; dy: number } | null>(null)
  const reset = React.useCallback(() => {
    motion.current?.cancel()
    motion.current = null
    track.current = null
    setDragging(false); setOver(false); setPlaced(false)
    if (card.current) card.current.style.transform = "translate(0px, 0px) rotate(0deg) scale(1)"
  }, [])
  React.useEffect(() => { reset(); return () => { motion.current?.cancel(); track.current = null } }, [replayKey, reset])
  React.useEffect(() => {
    if (!stopped) return
    motion.current?.cancel()
    motion.current = null
    track.current = null
    setDragging(false); setOver(false)
    if (card.current) card.current.style.transform = "translate(0px, 0px) rotate(0deg) scale(1)"
  }, [stopped])
  const pointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (placed || event.button !== 0) return
    motion.current?.cancel()
    event.currentTarget.setPointerCapture(event.pointerId)
    const transform = new DOMMatrixReadOnly(getComputedStyle(event.currentTarget).transform)
    track.current = { id: event.pointerId, x: event.clientX - transform.m41, y: event.clientY - transform.m42, time: event.timeStamp, vx: 0, vy: 0, dx: transform.m41, dy: transform.m42 }
    setDragging(true)
  }
  const pointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = track.current
    if (!current || current.id !== event.pointerId) return
    const dx = Math.max(-150, Math.min(150, event.clientX - current.x))
    const dy = Math.max(-150, Math.min(150, event.clientY - current.y))
    const delta = Math.max(1, event.timeStamp - current.time)
    current.vx = (dx - current.dx) / delta
    current.vy = (dy - current.dy) / delta
    current.dx = dx; current.dy = dy; current.time = event.timeStamp
    event.currentTarget.style.transform = `translate(${dx}px, ${dy}px) rotate(${stopped ? 0 : Math.max(-12, Math.min(12, current.vx * 4))}deg) scale(${stopped ? 1 : 1.05})`
    const target = zone.current?.getBoundingClientRect()
    if (target) setOver(event.clientX > target.left && event.clientX < target.right && event.clientY > target.top && event.clientY < target.bottom)
  }
  const release = (event: React.PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const current = track.current
    if (!current || current.id !== event.pointerId) return
    track.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setDragging(false); setOver(false)
    const target = zone.current?.getBoundingClientRect()
    const inside = !cancelled && target && event.clientX > target.left && event.clientX < target.right && event.clientY > target.top && event.clientY < target.bottom
    if (inside) { setPlaced(true); event.currentTarget.style.transform = "translate(0px, 0px) rotate(0deg)"; return }
    if (stopped) { event.currentTarget.style.transform = "translate(0px, 0px) rotate(0deg)"; return }
    // Match the public preview's direct, 500ms damped return. Input velocity
    // drives the held tilt; releasing does not add a second outward flight.
    motion.current = animate(event.currentTarget, {
      translateX: 0, translateY: 0, rotate: 0, scale: 1,
      duration: 500, ease: cubicBezier(.34, 1.56, .64, 1),
    })
  }
  return <Demo stopped={stopped}>
    <div className="sc-tr-effects-drag-stage sc:relative sc:w-[min(100%,_380px)] sc:h-50">
      <div ref={zone} className="sc-tr-effects-drop-zone sc:absolute sc:left-[14%] sc:top-[77px] sc:flex sc:size-29 sc:items-center sc:justify-center sc:flex-col sc:gap-[10px] sc:[border:1px_dashed_var(--border)] sc:rounded-lg sc:bg-muted sc:text-muted-foreground sc:[font-size:12px] sc:[transition:background_150ms_ease,_border-radius_400ms_var(--effects-ease),_transform_400ms_var(--effects-ease),_border-color_150ms_ease] sc:[&_>_svg]:size-[22px] sc:[&[data-over='true']]:border-primary sc:[&[data-over='true']]:bg-accent sc:[&[data-over='true']]:[transform:scale(1.06)] sc:[&[data-placed='true']]:[border-style:solid] sc:[&[data-placed='true']]:border-border sc:[&[data-placed='true']]:[transform:none] sc:[&_img]:block sc:[&_img]:size-full sc:[&_img]:rounded-[inherit] sc:[&_img]:object-cover sc:[&_img]:animate-[sc-tr-effects-drop-reveal_400ms_ease-in-out_both]" data-over={over} data-placed={placed}>
        {placed ? <img src={artwork} alt="已放入的品牌几何图形" /> : <><ImageIcon aria-hidden="true" /><span>将图片拖到这里</span></>}
      </div>
      {!placed && <Button ref={card} variant="outline" className="sc-tr-effects-draggable sc:absolute sc:right-[12%] sc:top-[5px] sc:size-22 sc:p-0 sc:[touch-action:none] sc:cursor-grab sc:rounded-lg sc:[&_img]:size-full sc:[&_img]:rounded-[inherit] sc:[&_img]:pointer-events-none sc:[&_img]:object-cover sc:[&_img]:[user-select:none] sc:[&[data-dragging='true']]:cursor-grabbing sc:[&[data-dragging='true']]:[box-shadow:0_15px_26px_color-mix(in_oklab,_var(--foreground)_16%,_transparent)]" data-dragging={dragging}
        aria-label="将示例图片放入目标区域" onPointerDown={pointerDown} onPointerMove={pointerMove}
        onPointerUp={(event) => release(event)} onPointerCancel={(event) => release(event, true)}
        onClick={(event) => { if (event.detail === 0) setPlaced(true) }}>
        <img src={artwork} alt="" draggable={false} />
      </Button>}
    </div>
    <div className="sc-tr-effects-actions sc:flex sc:flex-wrap sc:items-center sc:justify-center sc:gap-2">
      <Button variant="outline" size="sm" disabled={placed} onClick={() => { motion.current?.cancel(); track.current = null; setDragging(false); setOver(false); setPlaced(true) }}>放入示例图片</Button>
      <Reset onClick={reset} />
    </div>
    <p className={hintClass} aria-live="polite">{placed ? "图片已放入，可重置后再次拖拽" : "支持拖拽，也可用键盘激活“放入示例图片”"}</p>
  </Demo>
}

export function LikeButton(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [liked, setLiked] = React.useState(false)
  const [burst, setBurst] = React.useState(0)
  React.useEffect(() => { setLiked(false); setBurst(0) }, [replayKey])
  return <Demo stopped={stopped}>
    <div className="sc-tr-effects-like-wrap sc:relative">
      <Button variant={liked ? "secondary" : "outline"} aria-pressed={liked} className="sc-tr-effects-like sc:relative sc:[&_svg]:[transition:fill_150ms_var(--effects-ease),_color_150ms_var(--effects-ease)] sc:[&[data-liked='true']_svg]:[fill:var(--primary)] sc:[&[data-liked='true']_svg]:text-primary sc:[&[data-liked='true']_svg]:animate-[sc-tr-effects-heart-pop_350ms_cubic-bezier(.34,_1.96,_.64,_1)]" data-liked={liked}
        onClick={() => { setLiked((value) => !value); if (!liked) setBurst((value) => value + 1) }}>
        <Heart key={`heart-${burst}`} data-icon="inline-start" aria-hidden="true" />{liked ? "已喜欢" : "喜欢"}<span className="sc-tr-effects-like-count sc:min-w-[3ch] sc:tabular-nums">{liked ? 129 : 128}</span>
      </Button>
      {!stopped && liked && burst > 0 && <span key={burst} className="sc-tr-effects-heart-burst sc:absolute sc:left-6 sc:top-1/2 sc:size-[1px] sc:pointer-events-none sc:[&_i]:absolute sc:[&_i]:size-[3px] sc:[&_i]:rounded-full sc:[&_i]:bg-primary sc:[&_i]:animate-[sc-tr-effects-heart-particle_var(--particle-duration)_ease-out_var(--particle-delay)_both] sc:[&_i:nth-child(3n)]:bg-chart-2" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--particle-x": `${Math.cos(index / 8 * Math.PI * 2) * (15 + index % 3 * 3)}px`, "--particle-y": `${Math.sin(index / 8 * Math.PI * 2) * (15 + index % 3 * 3)}px`, "--particle-delay": `${index % 4 * 18}ms`, "--particle-duration": `${550 + index % 3 * 55}ms` } as MotionStyle} />)}</span>}
    </div>
    <p className={hintClass} aria-live="polite">{liked ? "已加入喜欢，可再次点击取消" : "点击喜欢，查看心形填充与粒子反馈"}</p>
  </Demo>
}

export function LearnMoreHover(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [expanded, setExpanded] = React.useState(false)
  React.useEffect(() => { setExpanded(false) }, [replayKey])
  const id = React.useId()
  return <Demo stopped={stopped}>
    <Button variant="outline" className="sc-tr-effects-learn sc:gap-4 sc:[&:is(:hover,:focus-visible,[aria-expanded='true'])_.sc-tr-effects-learn-arrow_svg]:[transform:translateX(2px)] sc:[&:is(:hover,:focus-visible,[aria-expanded='true'])_.sc-tr-effects-chevron-top]:[transform:rotate(8deg)] sc:[&:is(:hover,:focus-visible,[aria-expanded='true'])_.sc-tr-effects-chevron-bottom]:[transform:rotate(-8deg)]" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded((value) => !value)}>
      {expanded ? "收起说明" : "了解更多"}<span className="sc-tr-effects-learn-arrow sc:relative sc:inline-block sc:size-[18px] sc:[&_svg]:absolute sc:[&_svg]:inset-[1px] sc:[&_svg]:size-4 sc:[&_svg]:[transition:transform_350ms_var(--effects-ease)] sc:[&_path]:[transform-box:view-box] sc:[&_path]:[transform-origin:9.5px_8px] sc:[&_path]:[transition:transform_350ms_var(--effects-ease)]" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path className="sc-tr-effects-chevron-top" d="M6 4.5 9.5 8" /><path className="sc-tr-effects-chevron-bottom" d="M9.5 8 6 11.5" /></svg></span>
    </Button>
    <div id={id} className="sc-tr-effects-learn-reveal sc:grid sc:[grid-template-rows:0fr] sc:w-[min(100%,_320px)] sc:opacity-0 sc:[transition:grid-template-rows_300ms_var(--effects-ease),_opacity_200ms_ease] sc:[&_p]:min-h-0 sc:[&_p]:overflow-hidden sc:[&_p]:m-0 sc:[&_p]:text-muted-foreground sc:[&_p]:[font-size:.8125rem] sc:[&_p]:leading-[1.8] sc:[&_p]:text-center sc:[&[data-open='true']]:[grid-template-rows:1fr] sc:[&[data-open='true']]:opacity-100" data-open={expanded} aria-hidden={!expanded}>
      <p>将悬停反馈同时提供给键盘焦点；触屏通过点击展开内容。</p>
    </div>
  </Demo>
}

export function CheckboxCheck(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [checked, setChecked] = React.useState(false)
  const id = React.useId()
  React.useEffect(() => { setChecked(false) }, [replayKey])
  return <Demo stopped={stopped}>
    <FieldGroup className="sc-tr-effects-control-field sc:max-w-[310px]"><Field orientation="horizontal">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => setChecked(value === true)} className="sc-tr-effects-checkbox sc:[transition:background-color_150ms_var(--effects-ease),_border-color_150ms_var(--effects-ease),_box-shadow_150ms_var(--effects-ease)] sc:[&[data-state='checked']_svg]:animate-[sc-tr-effects-check-appear_150ms_var(--effects-ease)_both] sc:[&[data-state='checked']_svg_path]:[stroke-dasharray:24] sc:[&[data-state='checked']_svg_path]:[stroke-dashoffset:0] sc:[&[data-state='checked']_svg_path]:animate-[sc-tr-effects-check-draw_350ms_var(--effects-ease)_both] sc:[&[data-state='checked']_svg_polyline]:[stroke-dasharray:24] sc:[&[data-state='checked']_svg_polyline]:[stroke-dashoffset:0] sc:[&[data-state='checked']_svg_polyline]:animate-[sc-tr-effects-check-draw_350ms_var(--effects-ease)_both]" />
      <FieldContent><FieldLabel htmlFor={id}>通知我</FieldLabel><FieldDescription>{checked ? "已开启项目更新通知" : "接收项目更新与协作消息"}</FieldDescription></FieldContent>
    </Field></FieldGroup>
  </Demo>
}

export function ToggleTransition(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [checked, setChecked] = React.useState(false)
  const [interacted, setInteracted] = React.useState(false)
  const id = React.useId()
  React.useEffect(() => { setChecked(false); setInteracted(false) }, [replayKey])
  return <Demo stopped={stopped}>
    <FieldGroup className="sc-tr-effects-control-field sc:max-w-[310px]"><Field orientation="horizontal">
      <FieldContent><FieldLabel htmlFor={id}>自动同步</FieldLabel><FieldDescription>{checked ? "更改会自动同步到工作空间" : "仅在手动保存时同步"}</FieldDescription></FieldContent>
      <Switch id={id} checked={checked} data-interacted={interacted} onCheckedChange={(value) => { setInteracted(true); setChecked(value) }} className="sc-tr-effects-switch sc:[&_[data-slot='switch-thumb']]:[transition:translate_350ms_cubic-bezier(.34,_1.35,_.64,_1)] sc:[&[data-interacted='true'][data-state='checked']_[data-slot='switch-thumb']]:animate-[sc-tr-effects-switch-on_350ms_cubic-bezier(.34,_1.35,_.64,_1)_both] sc:[&[data-interacted='true'][data-state='unchecked']_[data-slot='switch-thumb']]:animate-[sc-tr-effects-switch-off_350ms_cubic-bezier(.34,_1.35,_.64,_1)_both]" />
    </Field></FieldGroup>
  </Demo>
}

const searchText = "让每次状态变化清晰可见"
export function InputClearWithDissolve(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [value, setValue] = React.useState(searchText)
  const [dissolving, setDissolving] = React.useState("")
  const [revision, setRevision] = React.useState(0)
  const host = React.useRef<HTMLDivElement>(null)
  const id = React.useId()
  const reset = () => { setValue(searchText); setDissolving(""); setRevision((version) => version + 1) }
  React.useEffect(reset, [replayKey])
  React.useEffect(() => {
    if (!dissolving) return
    if (stopped) { setDissolving(""); return }
    const timer = window.setTimeout(() => setDissolving(""), 850)
    return () => window.clearTimeout(timer)
  }, [dissolving, revision, stopped])
  const clear = () => {
    if (!value) return
    setRevision((version) => version + 1)
    setDissolving(stopped ? "" : value)
    setValue("")
    host.current?.querySelector("input")?.focus()
  }
  return <Demo stopped={stopped}>
    <div ref={host} className="sc-tr-effects-input-demo sc:w-[min(100%,_350px)]">
      <FieldGroup><Field><FieldLabel htmlFor={id}>搜索动效</FieldLabel>
        <div className="sc-tr-effects-dissolve-wrap sc:relative">
          <InputGroup><InputGroupAddon><Search aria-hidden="true" /></InputGroupAddon>
            <InputGroupInput id={id} value={value} onChange={(event) => { setValue(event.target.value); setDissolving("") }} placeholder={dissolving ? "" : "输入搜索内容"} />
            <InputGroupAddon align="inline-end"><InputGroupButton aria-label="清空搜索内容" size="icon-xs" disabled={!value} onClick={clear}><X aria-hidden="true" /></InputGroupButton></InputGroupAddon>
          </InputGroup>
          {dissolving && <React.Fragment key={revision}><span className="sc-tr-effects-dissolve-text sc:absolute sc:inset-[0_38px_0_34px] sc:flex sc:items-center sc:overflow-hidden sc:whitespace-pre sc:text-foreground sc:pointer-events-none sc:[font-size:14px] sc:animate-[sc-tr-effects-dissolve-text_280ms_var(--effects-ease)_both]" aria-hidden="true">{dissolving}</span><span className="sc-tr-effects-dissolve-placeholder sc:absolute sc:inset-[0_38px_0_34px] sc:flex sc:items-center sc:overflow-hidden sc:whitespace-pre sc:pointer-events-none sc:[font-size:14px] sc:text-muted-foreground sc:animate-[sc-tr-effects-dissolve-placeholder_280ms_var(--effects-ease)_both]" aria-hidden="true">输入搜索内容</span><span className="sc-tr-effects-dissolve-glow sc:absolute sc:inset-[auto_16px_0_34px] sc:h-[9px] sc:pointer-events-none sc:[background:radial-gradient(ellipse_at_20%_100%,_color-mix(in_oklab,var(--primary)_28%,transparent),transparent_24%),_radial-gradient(ellipse_at_55%_100%,_color-mix(in_oklab,var(--primary)_20%,transparent),transparent_30%),_radial-gradient(ellipse_at_80%_100%,_color-mix(in_oklab,var(--primary)_24%,transparent),transparent_18%)] sc:animate-[sc-tr-effects-dissolve-glow_800ms_ease-out_both]" aria-hidden="true" /></React.Fragment>}
        </div>
        <FieldDescription>文字向下模糊消散，占位提示随即进入，保留输入焦点。</FieldDescription>
      </Field></FieldGroup>
    </div>
    <Reset onClick={reset}>恢复示例文字</Reset>
  </Demo>
}

export function ErrorStateShake(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [value, setValue] = React.useState("")
  const [invalid, setInvalid] = React.useState(false)
  const [revision, setRevision] = React.useState(0)
  const [saved, setSaved] = React.useState(false)
  const id = React.useId()
  const errorId = `${id}-error`
  React.useEffect(() => { setValue(""); setInvalid(false); setRevision(0); setSaved(false) }, [replayKey])
  return <Demo stopped={stopped}>
    <form className="sc-tr-effects-error-form sc:w-[min(100%,_350px)] sc:flex sc:flex-col sc:items-stretch sc:gap-6 sc:[&_>_[data-slot='button']]:self-start sc:[&_[data-slot='field-error']]:animate-[sc-tr-effects-error-reveal_280ms_ease-out_both]" noValidate onSubmit={(event) => { event.preventDefault(); const failed = value.trim().length < 2; setInvalid(failed); setSaved(!failed); setRevision((version) => version + 1); if (failed) event.currentTarget.querySelector("input")?.focus() }}>
      <FieldGroup><Field data-invalid={invalid}>
        <FieldLabel htmlFor={id}>工作空间名称</FieldLabel>
        <div data-shake={invalid && !stopped} className="sc-tr-effects-shake-target sc:[&[data-shake='true']]:animate-[var(--shake-animation,_sc-tr-effects-error-shake)_280ms_linear_both]" style={{ "--shake-animation": revision % 2 ? "sc-tr-effects-error-shake" : "sc-tr-effects-error-shake-repeat" } as MotionStyle}><Input id={id} value={value} onChange={(event) => { setValue(event.target.value); setInvalid(false); setSaved(false) }} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} placeholder="至少输入 2 个字符" /></div>
        {invalid ? <FieldError id={errorId}>名称至少需要 2 个字符，请补充后重试。</FieldError> : <FieldDescription>{saved ? "名称已通过验证。" : "留空提交可查看错误反馈。"}</FieldDescription>}
      </Field></FieldGroup>
      <Button type="submit">验证名称</Button>
    </form>
  </Demo>
}

export function IconSwap(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => { setOpen(false) }, [replayKey])
  return <Demo stopped={stopped}>
    <Button variant="outline" size="icon-lg" className="sc-tr-effects-icon-button" aria-label={open ? "切换为菜单图标" : "切换为关闭图标"} aria-pressed={open} onClick={() => setOpen((value) => !value)}>
      <span className="sc-tr-effects-icon-swap sc:relative sc:inline-block sc:size-5 sc:[&_svg]:absolute sc:[&_svg]:inset-0 sc:[&_svg]:size-5 sc:[&_svg]:[transition:transform_250ms_ease-in-out,_opacity_250ms_ease-in-out,_filter_250ms_ease-in-out] sc:[&_svg:last-child]:opacity-0 sc:[&_svg:last-child]:[transform:scale(.25)] sc:[&_svg:last-child]:[filter:blur(2px)] sc:[&[data-open='true']_svg:first-child]:opacity-0 sc:[&[data-open='true']_svg:first-child]:[transform:scale(.25)] sc:[&[data-open='true']_svg:first-child]:[filter:blur(2px)] sc:[&[data-open='true']_svg:last-child]:opacity-100 sc:[&[data-open='true']_svg:last-child]:[transform:scale(1)] sc:[&[data-open='true']_svg:last-child]:[filter:blur(0)]" data-open={open} aria-hidden="true"><Menu /><X /></span>
    </Button>
    <p className={hintClass} aria-live="polite">{open ? "关闭图标" : "菜单图标"} · 点击切换</p>
  </Demo>
}

export function GetProButton(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [active, setActive] = React.useState(false)
  React.useEffect(() => { setActive(false) }, [replayKey])
  return <Demo stopped={stopped}>
    <span className="sc-tr-effects-pro-rim sc:relative sc:inline-flex sc:rounded-[calc(var(--radius)_+_2px)] sc:p-[2px] sc:isolate sc:[&::before]:absolute sc:[&::before]:inset-[-2px] sc:[&::before]:rounded-[inherit] sc:[&::before]:[background:radial-gradient(ellipse_at_15%_20%,_var(--primary),_transparent_60%),_radial-gradient(ellipse_at_85%_70%,_var(--chart-2),_transparent_60%),_radial-gradient(ellipse_at_50%_0%,_var(--chart-3),_transparent_60%)] sc:[&::before]:[background-size:180%_180%] sc:[&::before]:opacity-35 sc:[&::before]:[filter:blur(1px)] sc:[&::before]:[content:''] sc:[&::before]:[transition:opacity_250ms_ease,_filter_350ms_ease] sc:[&::after]:absolute sc:[&::after]:inset-[-6px] sc:[&::after]:-z-1 sc:[&::after]:rounded-[inherit] sc:[&::after]:[background:radial-gradient(ellipse_at_10%_50%,_var(--primary),_transparent_60%),_radial-gradient(ellipse_at_90%_50%,_var(--chart-2),_transparent_60%)] sc:[&::after]:opacity-0 sc:[&::after]:[filter:blur(6px)] sc:[&::after]:[content:''] sc:[&::after]:[transition:opacity_250ms_ease] sc:[&:is(:hover,:focus-within,[data-active='true'])::before]:opacity-100 sc:[&:is(:hover,:focus-within,[data-active='true'])::before]:[filter:saturate(1.2)] sc:[&:is(:hover,:focus-within,[data-active='true'])::before]:animate-[sc-tr-effects-pro-flow_5000ms_ease-in-out_infinite] sc:[&:is(:hover,:focus-within,[data-active='true'])::after]:opacity-45 sc:[&:is(:hover,:focus-within,[data-active='true'])::after]:animate-[sc-tr-effects-pro-orbit_4000ms_linear_infinite] sc:[&:is(:hover,:focus-within,[data-active='true'])_.sc-tr-effects-pro-button::before]:opacity-20" data-active={active}>
      <Button className="sc-tr-effects-pro-button sc:relative sc:min-w-38 sc:overflow-hidden sc:isolate sc:[&_>_span]:relative sc:[&_>_svg]:relative sc:[&::before]:absolute sc:[&::before]:inset-0 sc:[&::before]:rounded-[inherit] sc:[&::before]:[background:radial-gradient(ellipse_at_30%_-20%,_var(--chart-2),_transparent_70%),_radial-gradient(ellipse_at_100%_120%,_var(--chart-3),_transparent_65%)] sc:[&::before]:opacity-0 sc:[&::before]:pointer-events-none sc:[&::before]:[content:''] sc:[&::before]:[transition:opacity_300ms_ease]" aria-pressed={active} onClick={() => setActive((value) => !value)}>
        {active ? <Check data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}<span>{active ? "已体验 Pro 效果" : "体验 Pro 按钮"}</span>
      </Button>
    </span>
    <p className={hintClass} aria-live="polite">{active ? "光泽效果已激活，再次点击恢复" : "悬停、聚焦或点击，光泽从边沿汇入"}</p>
  </Demo>
}

export const effectsDemos: Record<string, React.ComponentType<TransitionDemoProps>> = {
  "avatar-group-hover": AvatarGroupHover,
  "3d-tilt": ThreeDTilt,
  "card-stack-hover": CardStackHover,
  "drag-drop-with-physics": DragDropWithPhysics,
  "image-open-tilt": ImageOpenTilt,
  "like-button": LikeButton,
  "learn-more-hover": LearnMoreHover,
  "checkbox-check": CheckboxCheck,
  toggle: ToggleTransition,
  "input-clear-with-dissolve": InputClearWithDissolve,
  "error-state-shake": ErrorStateShake,
  "icon-swap": IconSwap,
  "confetti-burst": ConfettiBurst,
  "delete-with-smoky-dissolve": DeleteWithSmokyDissolve,
  "get-pro-button": GetProButton,
}
