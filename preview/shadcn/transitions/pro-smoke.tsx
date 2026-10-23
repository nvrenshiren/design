import * as React from "react"
import { ImageIcon, RotateCcw, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMotionDemo } from "./hooks"
import type { TransitionDemoProps } from "./types"

const artwork = "/docs/transition-assets/sample-artwork.svg"
const dissolveDuration = 540

// Independently authored from the public preview's rendered pixels, not its recipe.
// The image remains a continuous material. A pre-mounted displaced image gently
// takes over before the whole image softens, turns 3deg and sinks by 20% height.
export function DeleteWithSmokyDissolve(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [phase, setPhase] = React.useState<"ready" | "dissolving" | "removed">("ready")
  const [run, setRun] = React.useState(0)
  const filterId = `sc-tr-smoke-${React.useId().replace(/:/g, "")}`
  const restore = React.useCallback(() => {
    setRun(value => value + 1)
    setPhase("ready")
  }, [])

  React.useEffect(restore, [replayKey, restore])
  React.useEffect(() => {
    if (phase !== "dissolving") return
    if (stopped) {
      setPhase("removed")
      return
    }
    // animationend owns the state handoff; the timeout only protects against an
    // external stylesheet removing the animation or a browser dropping its event.
    const fallback = window.setTimeout(() => setPhase("removed"), dissolveDuration + 240)
    return () => window.clearTimeout(fallback)
  }, [phase, stopped, run])

  return <div className="sc-tr-effects-demo sc:[--effects-ease:cubic-bezier(.22,_1,_.36,_1)] sc:flex sc:min-w-0 sc:w-full sc:min-h-[260px] sc:p-[24px_12px] sc:flex-col sc:items-center sc:justify-center sc:gap-6 sc:[&[data-stopped='true']_*]:animate-none! sc:[&[data-stopped='true']_*]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::before]:animate-none! sc:[&[data-stopped='true']_*::before]:[transition-duration:0ms]! sc:[&[data-stopped='true']_*::after]:animate-none! sc:[&[data-stopped='true']_*::after]:[transition-duration:0ms]! sc:[&[data-stopped='true']_.sc-tr-effects-avatar-button]:[transform:none] sc:[&[data-stopped='true']_.sc-tr-effects-tilt-card]:[transform:none] sc:motion-reduce:[&_*]:animate-none! sc:motion-reduce:[&_*]:[transition-duration:0ms]! sc:motion-reduce:[&_*::before]:animate-none! sc:motion-reduce:[&_*::before]:[transition-duration:0ms]! sc:motion-reduce:[&_*::after]:animate-none! sc:motion-reduce:[&_*::after]:[transition-duration:0ms]! sc:at-most-440:p-[20px_4px] sc-tr-pro-smoke-demo sc:[&[data-stopped='true']_.sc-tr-pro-smoke-material]:animate-none" data-stopped={stopped}>
    <svg className="sc-tr-pro-smoke-definitions sc:absolute sc:overflow-hidden sc:pointer-events-none" width="0" height="0" aria-hidden="true" focusable="false">
      <defs><filter id={filterId} x="-16" y="-16" width="196" height="196" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".045 .06" numOctaves="2" seed="7" result="flow" />
        <feDisplacementMap in="SourceGraphic" in2="flow" scale="5.2" xChannelSelector="R" yChannelSelector="G" />
      </filter></defs>
    </svg>
    <div className="sc-tr-effects-delete-stage sc:relative sc:size-41 sc:[&[data-phase='dissolving']_.sc-tr-pro-smoke-material]:animate-[sc-tr-pro-smoke-material_540ms_linear_both] sc:[&[data-phase='dissolving']_.sc-tr-pro-smoke-material]:[will-change:transform,_opacity,_filter] sc:[&[data-phase='dissolving']_.sc-tr-pro-smoke-source]:animate-[sc-tr-pro-smoke-source_540ms_linear_both] sc:[&[data-phase='dissolving']_.sc-tr-pro-smoke-displaced]:animate-[sc-tr-pro-smoke-displace_540ms_linear_both] sc:motion-reduce:[&[data-phase='dissolving']_.sc-tr-pro-smoke-material]:animate-none" data-phase={phase}>
      {phase !== "removed" && <div key={run} className="sc-tr-effects-delete-image sc:relative sc:size-full sc:[&_>_img]:block sc:[&_>_img]:size-full sc:[&_>_img]:rounded-lg sc:[&_>_img]:object-cover sc-tr-pro-smoke-material"
        onAnimationEnd={event => {
          if (event.target === event.currentTarget && event.animationName === "sc-tr-pro-smoke-material") setPhase("removed")
        }}>
        <img className="sc-tr-pro-smoke-source" src={artwork} alt="可移除的示例品牌图形" />
        <div className="sc-tr-pro-smoke-displaced sc:[filter:var(--smoke-filter)] sc:absolute sc:inset-0 sc:rounded-lg sc:[background:url('/docs/transition-assets/sample-artwork.svg')_center_/_cover_no-repeat] sc:opacity-0 sc:pointer-events-none sc:motion-reduce:hidden" aria-hidden="true" style={{ "--smoke-filter": `url(#${filterId})` } as React.CSSProperties} />
        <Button variant="secondary" size="icon-sm" aria-label="移除示例图片"
          className="sc-tr-effects-delete-action sc:absolute sc:top-2 sc:right-2 sc:[&[aria-disabled='true']]:pointer-events-none" aria-disabled={phase === "dissolving"}
          onClick={() => { if (phase === "ready") setPhase(stopped ? "removed" : "dissolving") }}>
          <Trash2 aria-hidden="true" />
        </Button>
      </div>}
      {phase === "removed" && <div className="sc-tr-effects-removed sc:flex sc:size-full sc:flex-col sc:items-center sc:justify-center sc:gap-[14px] sc:text-muted-foreground sc:[font-size:.8125rem] sc:[&_>_svg]:size-7">
        <ImageIcon aria-hidden="true" /><span>示例图片已移除</span><Badge variant="secondary">演示数据</Badge>
      </div>}
    </div>
    <Button variant="ghost" size="sm" onClick={restore}><RotateCcw data-icon="inline-start" />还原示例图片</Button>
    <p className="sc-tr-effects-hint sc:m-0 sc:max-w-[42ch] sc:text-muted-foreground sc:text-center sc:[font-size:.8125rem] sc:leading-[1.7]" aria-live="polite">{phase === "ready"
      ? "点击图片右上角，体验轻微下沉的柔化消散"
      : phase === "dissolving" ? "正在移除示例图片" : "只改变本次演示，可随时还原"}</p>
  </div>
}
