import * as React from "react"
import { ArrowUpRight, X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Button } from "@/components/ui/button"
import { Dialog, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMotionDemo } from "./hooks"
import type { TransitionDemoProps } from "./types"

const artwork = "/docs/transition-assets/sample-artwork.svg"
const sliceCount = 48
type ImagePhase = "idle" | "prepared" | "opening" | "open" | "closing"
type ImageStyle = React.CSSProperties & Record<`--${string}`, string | number>

/**
 * Independently authored from the rendered public preview. CSS interpolates
 * the shared-image projection and its continuous curved texture; JavaScript
 * only measures geometry, hands off states and snapshots interrupted motion.
 */
export function ImageOpenTilt(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [phase, setPhase] = React.useState<ImagePhase>("idle")
  const trigger = React.useRef<HTMLButtonElement>(null)
  const content = React.useRef<HTMLDivElement>(null)
  const imagePlane = React.useRef<HTMLDivElement>(null)
  const depth = React.useRef<HTMLDivElement>(null)
  const slices = React.useRef<(HTMLSpanElement | null)[]>([])
  const phaseRef = React.useRef<ImagePhase>("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const frame = React.useRef<number | null>(null)

  const updatePhase = React.useCallback((next: ImagePhase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const cancelHandoff = React.useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current)
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    timer.current = null
    frame.current = null
  }, [])

  const finishClose = React.useCallback(() => {
    cancelHandoff()
    updatePhase("idle")
    setDialogOpen(false)
  }, [cancelHandoff, updatePhase])

  // This rect is measured before projection transforms. Source and enlarged
  // image share an aspect ratio so the return never stretches its texture.
  const measureProjection = React.useCallback(() => {
    const element = imagePlane.current
    const origin = trigger.current?.getBoundingClientRect()
    if (!element || !origin || !element.offsetWidth || !element.offsetHeight) return
    const target = element.getBoundingClientRect()
    const parent = element.closest<HTMLDivElement>(".sc-tr-effects-image-dialog")
    if (!parent) return
    // The plane's layout box stays fixed while only its child is projected.
    parent.style.setProperty("--sc-image-x", `${origin.left + origin.width / 2 - target.left - target.width / 2}px`)
    parent.style.setProperty("--sc-image-y", `${origin.top + origin.height / 2 - target.top - target.height / 2}px`)
    parent.style.setProperty("--sc-image-scale", String(origin.width / element.offsetWidth))
    parent.style.setProperty("--sc-image-width", `${element.offsetWidth}px`)
    parent.style.setProperty("--sc-image-bend", `${element.offsetWidth * .034}px`)
  }, [])

  const snapshotCurve = React.useCallback(() => {
    // A mid-flight close starts at the exact displayed curve rather than the
    // keyframe's fully-open default; the projection is a reversible transition.
    for (const slice of slices.current) {
      if (!slice) continue
      slice.style.setProperty("--sc-slice-from", getComputedStyle(slice).transform)
    }
    if (depth.current) depth.current.style.setProperty("--sc-depth-from", getComputedStyle(depth.current).transform)
  }, [])

  const beginClose = React.useCallback(() => {
    if (phaseRef.current === "idle" || phaseRef.current === "closing") return
    cancelHandoff()
    if (stopped) { finishClose(); return }
    measureProjection()
    snapshotCurve()
    updatePhase("closing")
    timer.current = setTimeout(finishClose, 350)
  }, [cancelHandoff, finishClose, measureProjection, snapshotCurve, stopped, updatePhase])

  const beginOpen = React.useCallback(() => {
    if (dialogOpen && phaseRef.current !== "closing") return
    cancelHandoff()
    if (dialogOpen) {
      // Reversing an exit keeps the live CSS transform. Only the pulse is
      // replaced, using the current per-strip matrices as its starting pose.
      snapshotCurve()
      updatePhase("opening")
      timer.current = setTimeout(() => updatePhase("open"), 450)
      return
    }
    updatePhase(stopped ? "open" : "prepared")
    setDialogOpen(true)
  }, [cancelHandoff, dialogOpen, snapshotCurve, stopped, updatePhase])

  const mountPlane = React.useCallback((element: HTMLDivElement | null) => {
    imagePlane.current = element
    if (!element || phaseRef.current !== "prepared") return
    measureProjection()
    // Commit the source pose once, then let CSS own every interpolated frame.
    // A Portal may mount after the parent's layout effect, so this handoff is
    // attached to the actual plane mount instead of the parent open update.
    element.getBoundingClientRect()
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      updatePhase("opening")
      timer.current = setTimeout(() => updatePhase("open"), 450)
    })
  }, [measureProjection, updatePhase])

  React.useEffect(() => {
    if (!stopped) return
    cancelHandoff()
    if (phaseRef.current === "closing") finishClose()
    else if (phaseRef.current !== "idle") updatePhase("open")
  }, [stopped, cancelHandoff, finishClose, updatePhase])

  React.useEffect(() => {
    finishClose()
    return cancelHandoff
  }, [replayKey, finishClose, cancelHandoff])

  React.useEffect(() => {
    if (!dialogOpen) return
    const resize = () => {
      measureProjection()
      // A viewport change resolves to a stable image instead of continuing
      // a projection toward geometry that no longer exists.
      if (phaseRef.current === "closing") finishClose()
      else { cancelHandoff(); updatePhase("open") }
    }
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [dialogOpen, measureProjection, finishClose, cancelHandoff, updatePhase])

  return <div className="sc-tr-effects-demo sc:[--effects-ease:cubic-bezier(.22,_1,_.36,_1)] sc:flex sc:min-w-0 sc:w-full sc:min-h-[260px] sc:p-[24px_12px] sc:flex-col sc:items-center sc:justify-center sc:gap-6 sc:[&[data-stopped='true']_*]:animate-none! sc:[&[data-stopped='true']_*]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::before]:animate-none! sc:[&[data-stopped='true']_*::before]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::after]:animate-none! sc:[&[data-stopped='true']_*::after]:[transition-duration:0ms]! sc:[&[data-stopped='true']_.sc-tr-effects-avatar-button]:[transform:none] sc:[&[data-stopped='true']_.sc-tr-effects-tilt-card]:[transform:none] sc:motion-reduce:[&_*]:animate-none! sc:motion-reduce:[&_*]:[transition-duration:0ms]! sc:motion-reduce:[&_*::before]:animate-none! sc:motion-reduce:[&_*::before]:[transition-duration:0ms]! sc:motion-reduce:[&_*::after]:animate-none! sc:motion-reduce:[&_*::after]:[transition-duration:0ms]! sc:at-most-440:p-[20px_4px] sc-pro-image-demo sc:[&[data-image-open='true']_.sc-tr-effects-image-trigger_>_*]:invisible sc:[&[data-image-open='true']_.sc-tr-effects-image-trigger]:shadow-none" data-stopped={stopped} data-image-open={dialogOpen}>
    <Dialog open={dialogOpen} onOpenChange={(next) => next ? beginOpen() : beginClose()}>
      <DialogTrigger asChild>
        <Button ref={trigger} variant="ghost" className="sc-tr-effects-image-trigger sc:relative sc:block sc:w-33 sc:h-22 sc:p-0 sc:overflow-hidden sc:rounded-[10px] sc:[transition:box-shadow_180ms_ease] sc:[&_>_img]:block sc:[&_>_img]:size-full sc:[&_>_img]:object-cover sc:[&_>_img]:pointer-events-none sc:[&:focus-visible]:[outline:2px_solid_var(--ring)] sc:[&:focus-visible]:[outline-offset:4px] sc:[&:is(:hover,:focus-visible)]:[box-shadow:0_5px_12px_color-mix(in_oklab,_var(--foreground)_12%,_transparent)]" aria-label="放大查看品牌图形">
          <img src={artwork} alt="" draggable={false} />
          <span className="sc-tr-effects-image-open-label sc:absolute sc:inset-[auto_5px_5px] sc:inline-flex sc:gap-1 sc:items-center sc:justify-center sc:rounded-[4px] sc:p-[3px_4px] sc:bg-background sc:text-foreground sc:[font-size:.6875rem] sc:leading-[1.4] sc:[&_svg]:size-3"><ArrowUpRight aria-hidden="true" />放大查看</span>
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="sc-pro-image-overlay sc:animate-none! sc:opacity-100 sc:[transition:opacity_200ms_ease] sc:[&:is([data-image-phase='prepared'],[data-image-phase='closing'])]:opacity-0 sc:[&[data-stopped='true']]:opacity-100 sc:[&[data-stopped='true']]:[transition:none]" data-stopped={stopped} data-image-phase={phase} />
        <DialogPrimitive.Content ref={content} data-slot="dialog-content"
          className="sc:fixed sc:top-1/2 sc:left-1/2 sc:z-50 sc:outline-none sc-tr-effects-image-dialog sc:[--sc-image-width:440px] sc:[--sc-image-bend:14.96px] sc:[--sc-image-radius:16px] sc:[--sc-image-ease:cubic-bezier(.22,_1,_.36,_1)] sc:[--sc-image-duration:450ms] sc:flex sc:w-[min(440px,_calc(100vw_-_48px))] sc:p-0 sc:flex-col sc:gap-5 sc:[transform:translate(-50%,_-50%)] sc:bg-transparent sc:border-0 sc:shadow-none sc:text-foreground sc:animate-none! sc:[transition:none]! sc:[&[data-image-phase='prepared']_:is(.sc-pro-image-heading,.sc-pro-image-caption)]:opacity-0 sc:[&[data-image-phase='prepared']_:is(.sc-pro-image-heading,.sc-pro-image-caption)]:pointer-events-none sc:[&[data-image-phase='closing']_:is(.sc-pro-image-heading,.sc-pro-image-caption)]:opacity-0 sc:[&[data-image-phase='closing']_:is(.sc-pro-image-heading,.sc-pro-image-caption)]:pointer-events-none sc:[&[data-image-phase='opening']_:is(.sc-pro-image-heading,.sc-pro-image-caption)]:[transition-delay:100ms] sc:[&[data-image-phase='prepared']_.sc-pro-image-projection]:[transform:translate3d(var(--sc-image-x,_0px),_var(--sc-image-y,_0px),_0)_scale(var(--sc-image-scale,_.3))] sc:[&[data-image-phase='closing']_.sc-pro-image-projection]:[transform:translate3d(var(--sc-image-x,_0px),_var(--sc-image-y,_0px),_0)_scale(var(--sc-image-scale,_.3))] sc:[&[data-image-phase='prepared']_.sc-pro-image-projection]:[transition:none] sc:[&[data-image-phase='closing']]:[--sc-image-duration:350ms] sc:[&[data-image-phase='closing']]:[--sc-image-ease:cubic-bezier(.34,_1.25,_.64,_1)] sc:[&[data-image-phase='closing']]:[--sc-image-radius:32px] sc:[&:is([data-image-phase='prepared'],[data-image-phase='opening'],[data-image-phase='closing'])_.sc-pro-image-warp]:visible sc:[&:is([data-image-phase='prepared'],[data-image-phase='opening'],[data-image-phase='closing'])_.sc-tr-effects-image-open]:opacity-0 sc:[&[data-image-phase='prepared']]:[--sc-image-radius:32px] sc:[&[data-image-phase='prepared']_.sc-pro-image-depth]:[transform:translateZ(-70px)] sc:[&[data-image-phase='opening']_.sc-pro-image-depth]:animate-[sc-pro-image-depth-open_450ms_linear_both] sc:[&[data-image-phase='opening']_.sc-pro-image-slice]:animate-[sc-pro-image-bend-open_450ms_linear_both] sc:[&[data-image-phase='closing']_.sc-pro-image-depth]:animate-[sc-pro-image-depth-close_350ms_linear_both] sc:[&[data-image-phase='closing']_.sc-pro-image-slice]:animate-[sc-pro-image-bend-close_350ms_linear_both] sc:[&:is([data-image-phase='opening'],[data-image-phase='closing'])_:is(.sc-pro-image-projection,.sc-pro-image-depth,.sc-pro-image-slice)]:[will-change:transform] sc:[&[data-stopped='true']_.sc-pro-image-projection]:[transform:none]! sc:[&[data-stopped='true']_.sc-pro-image-projection]:animate-none! sc:[&[data-stopped='true']_.sc-pro-image-projection]:[transition:none]! sc:[&[data-stopped='true']_.sc-pro-image-depth]:[transform:none]! sc:[&[data-stopped='true']_.sc-pro-image-depth]:animate-none! sc:[&[data-stopped='true']_.sc-pro-image-depth]:[transition:none]! sc:[&[data-stopped='true']_.sc-pro-image-warp]:hidden! sc:[&[data-stopped='true']_.sc-tr-effects-image-open]:opacity-100! sc:[&[data-stopped='true']_.sc-tr-effects-image-open]:[transition:none]! sc:[&[data-stopped='true']_:is(.sc-pro-image-heading,.sc-pro-image-caption)]:opacity-100! sc:[&[data-stopped='true']_:is(.sc-pro-image-heading,.sc-pro-image-caption)]:[transition:none]! sc:motion-reduce:[&_.sc-pro-image-projection]:[transform:none]! sc:motion-reduce:[&_.sc-pro-image-projection]:animate-none! sc:motion-reduce:[&_.sc-pro-image-projection]:[transition:none]! sc:motion-reduce:[&_.sc-pro-image-depth]:[transform:none]! sc:motion-reduce:[&_.sc-pro-image-depth]:animate-none! sc:motion-reduce:[&_.sc-pro-image-depth]:[transition:none]! sc:motion-reduce:[&_.sc-pro-image-warp]:hidden! sc:motion-reduce:[&_.sc-tr-effects-image-open]:opacity-100! sc:[@media(max-height:_550px)]:w-[min(360px,_calc(100vw_-_48px),_calc((100dvh_-_150px)_*_1.5))] sc:[@media(max-height:_550px)]:gap-3"
          data-stopped={stopped} data-image-phase={phase}>
          <div className="sc-pro-image-heading sc:flex sc:items-center sc:justify-between sc:gap-4 sc:p-[16px_16px_16px_20px] sc:rounded-lg sc:bg-popover sc:text-popover-foreground sc:[box-shadow:0_8px_22px_color-mix(in_oklab,_var(--foreground)_10%,_transparent)] sc:[&_[data-slot='dialog-description']]:m-[7px_0_0] sc:opacity-100 sc:[transition:opacity_160ms_ease] sc:[@media(max-height:_550px)]:p-3">
            <div><DialogTitle>品牌几何图形</DialogTitle>
              <DialogDescription>连续曲面连接缩略图与完整画面。</DialogDescription></div>
            <Button variant="ghost" size="icon" onClick={beginClose} aria-label="关闭图片"><X aria-hidden="true" /></Button>
          </div>
          <div ref={mountPlane} className="sc-tr-effects-image-perspective sc:relative sc:w-full sc:[aspect-ratio:3_/_2]">
            <div className="sc-pro-image-projection sc:absolute sc:inset-0 sc:perspective-[900px] sc:[transform:translate3d(0,_0,_0)_scale(1)] sc:[transform-origin:50%_50%] sc:[transition:transform_var(--sc-image-duration)_var(--sc-image-ease)] sc:transform-3d">
              <div ref={depth} className="sc-pro-image-depth sc:size-full sc:[transform:none] sc:transform-3d">
                <button type="button" className="sc-pro-image-surface sc:relative sc:block sc:size-full sc:p-0 sc:border-0 sc:bg-transparent sc:text-inherit sc:cursor-zoom-out sc:[-webkit-tap-highlight-color:transparent] sc:[&::before]:absolute sc:[&::before]:inset-0 sc:[&::before]:rounded-[var(--sc-image-radius)] sc:[&::before]:[box-shadow:0_12px_28px_color-mix(in_oklab,_var(--foreground)_16%,_transparent)] sc:[&::before]:[content:''] sc:[&::before]:[transition:border-radius_var(--sc-image-duration)_var(--sc-image-ease)] sc:[&:focus-visible]:[outline:2px_solid_var(--ring)] sc:[&:focus-visible]:[outline-offset:6px] sc:[&:focus-visible]:rounded-[16px]" aria-label={phase === "closing" ? "重新展开图片" : "缩小图片"}
                  onClick={() => phaseRef.current === "closing" ? beginOpen() : beginClose()}>
                  <img src={artwork} alt="绿色、黄绿和青色组成的逐科品牌几何图形" className="sc-tr-effects-image-open sc:block sc:size-full sc:max-h-none sc:object-cover sc:rounded-[var(--sc-image-radius)]" draggable={false} />
                  <span className="sc-pro-image-warp sc:absolute sc:inset-0 sc:block sc:invisible sc:pointer-events-none" aria-hidden="true" style={{ "--sc-image-artwork": `url("${artwork}")` } as ImageStyle}>
                    {Array.from({ length: sliceCount }, (_, index) => {
                      const x = (index + .5) / sliceCount * 2 - 1
                      return <span key={index} ref={(element) => { slices.current[index] = element }} className="sc-pro-image-slice sc:absolute sc:left-[calc(var(--sc-slice-index)_*_100%_/_48)] sc:top-0 sc:block sc:w-[calc(100%_/_48_+_4px)] sc:h-full sc:overflow-hidden sc:[transform-origin:0_0] sc:[&::before]:absolute sc:[&::before]:top-0 sc:[&::before]:left-[calc(var(--sc-slice-index)_*_var(--sc-image-width)_/_-48)] sc:[&::before]:w-[var(--sc-image-width)] sc:[&::before]:h-full sc:[&::before]:rounded-[var(--sc-image-radius)] sc:[&::before]:[background-image:var(--sc-image-artwork)] sc:[&::before]:[background-size:var(--sc-image-width)_calc(var(--sc-image-width)_*_2_/_3)] sc:[&::before]:[background-position:0_0] sc:[&::before]:bg-no-repeat sc:[&::before]:[content:''] sc:[&::before]:[transition:border-radius_var(--sc-image-duration)_var(--sc-image-ease)]"
                        style={{ "--sc-slice-index": index, "--sc-slice-curve": x * x,
                          "--sc-slice-angle": `${Math.atan(.034 * 4 * x) * 180 / Math.PI}deg` } as ImageStyle} />
                    })}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <p className="sc-pro-image-caption sc:opacity-100 sc:[transition:opacity_160ms_ease] sc:m-0 sc:p-[7px_12px] sc:self-center sc:rounded-lg sc:bg-popover sc:text-muted-foreground sc:[font-size:.8125rem] sc:text-center">点击画面收起，或按 Escape 关闭</p>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
    <p className="sc-tr-effects-hint sc:m-0 sc:max-w-[42ch] sc:text-muted-foreground sc:text-center sc:[font-size:.8125rem] sc:leading-[1.7]">点击图片，体验从缩略图展开的连续曲面</p>
  </div>
}
