import * as React from "react"
import { ArrowUpRight, Check, Copy, Pause, Play, RotateCcw, Search } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Field, FieldGroup, FieldLabel } from "../components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../components/ui/empty"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { TRANSITIONS, TRANSITION_CATEGORIES } from "./catalog"
import { layoutDemos } from "./layout"
import { feedbackDemos } from "./feedback"
import { effectsDemos } from "./effects"
import type { TransitionDemoProps } from "./types"
import { useShadcnTheme } from "../scope"

const demos: Record<string, React.ComponentType<TransitionDemoProps>> = { ...layoutDemos, ...feedbackDemos, ...effectsDemos }
for (const entry of TRANSITIONS) if (!demos[entry.id]) throw new Error(`Missing Transitions component: ${entry.id}`)

function readSelected() {
  const id = new URLSearchParams(location.hash.split("?")[1] || "").get("item")
  return TRANSITIONS.some(entry => entry.id === id) ? id! : "card-resize"
}

export function TransitionsGallery({ stopped = false }: { stopped?: boolean }) {
  const mode = useShadcnTheme()
  const [selected, setSelected] = React.useState(readSelected)
  const [category, setCategory] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [replayKey, setReplayKey] = React.useState(0)
  const [localPaused, setLocalPaused] = React.useState(false)
  const [onscreen, setOnscreen] = React.useState(true)
  const [copied, setCopied] = React.useState(false)
  const stage = React.useRef<HTMLDivElement>(null)
  const copiedTimer = React.useRef<ReturnType<typeof setTimeout>>()
  const entry = TRANSITIONS.find(item => item.id === selected) || TRANSITIONS[0]
  const Demo = demos[entry.id]
  const filtered = TRANSITIONS.filter(item => (category === "all" || item.category === category) &&
    `${item.title} ${item.englishTitle} ${item.description} ${item.primitive}`.toLowerCase().includes(query.trim().toLowerCase()))
  const paused = stopped || localPaused || !onscreen
  const example = `import { ${entry.exportName} } from "@/transitions/${entry.module}"\n\nexport function Example() {\n  return <${entry.exportName} stopped={false} replayKey={0} />\n}`
  const indexSurfaceClasses = mode === "light"
    ? "sc:rounded-[16px] sc:border sc:[border-color:color-mix(in_srgb,var(--border)_58%,transparent)] sc:[background:color-mix(in_srgb,var(--muted)_38%,transparent)] sc:p-3"
    : "sc:[border-right:1px_solid_var(--border)] sc:pr-6 sc:at-most-1199:pr-[18px] sc:at-most-900:[border-right:0] sc:at-most-900:[border-bottom:1px_solid_var(--border)] sc:at-most-900:p-[0_0_20px]"
  const stageSurfaceClasses = mode === "light"
    ? "sc:rounded-[14px] sc:[border-color:color-mix(in_srgb,var(--border)_58%,transparent)] sc:[background:radial-gradient(ellipse_at_15%_0%,_color-mix(in_srgb,var(--chart-2)_9%,transparent),_transparent_48%),radial-gradient(ellipse_at_95%_100%,_color-mix(in_srgb,var(--chart-3)_8%,transparent),_transparent_44%),color-mix(in_srgb,var(--muted)_65%,var(--background))]"
    : "sc:rounded-lg sc:border-border sc:bg-muted"

  React.useEffect(() => {
    const update = () => { setSelected(readSelected()); setReplayKey(0) }
    addEventListener("hashchange", update)
    addEventListener("popstate", update)
    return () => { removeEventListener("hashchange", update); removeEventListener("popstate", update); clearTimeout(copiedTimer.current) }
  }, [])

  React.useEffect(() => {
    if (!stage.current) return
    const observer = new IntersectionObserver(([state]) => setOnscreen(state.isIntersecting), { rootMargin: "80px" })
    observer.observe(stage.current)
    return () => observer.disconnect()
  }, [])

  function select(id: string) {
    setSelected(id)
    setReplayKey(0)
    setCopied(false)
    history.replaceState(null, "", `#shadcn?tab=transitions&item=${id}`)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(example)
      setCopied(true)
      clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch { setCopied(false) }
  }

  return (
    <div className="sc-tr-gallery sc:flex sc:flex-col sc:gap-7 sc:pt-6 sc:min-w-0 sc:at-most-500:gap-6" data-transitions-gallery>
      <div className="sc-section-intro">
        <h2>让交互有清楚的来处与去向</h2>
        <p>43 项交互扩展，参考 Transitions.dev 公开演示，以 shadcn/ui 组件和逐科语义主题独立实现。选择一个组件，直接操作或重放关键状态。</p>
      </div>
      <div className="sc-tr-workbench sc:grid sc:[grid-template-columns:240px_minmax(0,1fr)] sc:gap-8 sc:items-start sc:min-w-0 sc:at-most-1199:[grid-template-columns:210px_minmax(0,1fr)] sc:at-most-1199:gap-6 sc:at-most-900:[grid-template-columns:minmax(0,1fr)] sc:at-most-900:gap-7">
        <aside className={`sc-tr-index sc:min-w-0 ${indexSurfaceClasses}`} aria-label="Transitions 组件目录">
          <FieldGroup className="sc-tr-filters sc:gap-[18px] sc:at-most-900:grid sc:at-most-900:[grid-template-columns:repeat(2,minmax(0,1fr))] sc:at-most-900:gap-4 sc:at-most-500:[grid-template-columns:minmax(0,1fr)]">
            <Field>
              <FieldLabel htmlFor="sc-tr-search">查找组件</FieldLabel>
              <Input id="sc-tr-search" type="search" placeholder="名称、用途或基础组件" value={query} onChange={event => setQuery(event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="sc-tr-category">按用途分类</FieldLabel>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="sc-tr-category" className="sc:w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectGroup>
                  <SelectItem value="all">全部组件 · {TRANSITIONS.length}</SelectItem>
                  {TRANSITION_CATEGORIES.map(group => <SelectItem key={group.id} value={group.id}>{group.title} · {TRANSITIONS.filter(item => item.category === group.id).length}</SelectItem>)}
                </SelectGroup></SelectContent>
              </Select>
            </Field>
            <Field className="sc-tr-mobile-picker sc:hidden sc:at-most-900:flex sc:at-most-900:[grid-column:1/-1]">
              <FieldLabel htmlFor="sc-tr-component">当前组件</FieldLabel>
              <Select value={entry.id} onValueChange={select}>
                <SelectTrigger id="sc-tr-component" className="sc:w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectGroup>{(filtered.length ? filtered : TRANSITIONS).map(item => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="sc-tr-list sc:max-h-[660px] sc:overflow-y-auto sc:overscroll-contain sc:[scrollbar-width:thin] sc:[scrollbar-color:var(--border)_transparent] sc:mt-6 sc:pr-[5px] sc:[&_[data-slot=button].sc-tr-index-item]:justify-between sc:[&_[data-slot=button].sc-tr-index-item]:w-full sc:[&_[data-slot=button].sc-tr-index-item]:h-auto sc:[&_[data-slot=button].sc-tr-index-item]:min-h-14 sc:[&_[data-slot=button].sc-tr-index-item]:text-left sc:[&_[data-slot=button].sc-tr-index-item]:p-[9px_10px] sc:[&_[data-slot=button].sc-tr-index-item]:whitespace-normal sc:at-most-900:hidden" aria-label="组件列表">
            {TRANSITION_CATEGORIES.map(group => {
              const items = filtered.filter(item => item.category === group.id)
              return items.length > 0 && <section key={group.id} className="sc-tr-list-group sc:flex sc:flex-col sc:gap-1 sc:mb-6 sc:[&_h3]:flex sc:[&_h3]:items-center sc:[&_h3]:justify-between sc:[&_h3]:[font-size:12px] sc:[&_h3]:text-muted-foreground sc:[&_h3]:font-medium sc:[&_h3]:m-[0_0_6px] sc:[&_h3]:pl-[10px] sc:[&_h3_span]:tabular-nums">
                <h3>{group.title}<span>{items.length}</span></h3>
                {items.map(item => <Button key={item.id} variant="ghost" className="sc-tr-index-item sc:[&[aria-current=true]]:bg-accent sc:[&[aria-current=true]]:text-accent-foreground sc:[&_small]:block sc:[&_small]:[font-size:11px] sc:[&_small]:leading-[1.5] sc:[&_small]:text-muted-foreground sc:[&_small]:font-normal sc:[&_small]:mt-[3px]" aria-current={selected === item.id ? "true" : undefined} onClick={() => select(item.id)}>
                  <span>{item.title}<small>{item.englishTitle}</small></span>
                  {selected === item.id && <Check data-icon="inline-end" />}
                </Button>)}
              </section>
            })}
          </div>
          {!filtered.length && <Empty className="sc-tr-empty sc:p-[24px_0]"><EmptyHeader><EmptyMedia variant="icon"><Search /></EmptyMedia><EmptyTitle>没有匹配的组件</EmptyTitle><EmptyDescription>换个名称或用途，或查看完整目录。</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={() => { setQuery(""); setCategory("all") }}>清除筛选</Button></EmptyContent></Empty>}
          <p className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65] sc-tr-count sc:mt-[18px]! sc:pl-[10px] sc:tabular-nums sc:at-most-900:mt-3! sc:at-most-900:p-0" aria-live="polite">{filtered.length} / {TRANSITIONS.length} 项组件</p>
        </aside>
        <div className="sc-tr-detail sc:flex sc:flex-col sc:gap-5 sc:min-w-0">
          <header className="sc-tr-detail-heading sc:flex sc:items-start sc:justify-between sc:gap-4 sc:[&_h3]:[font-size:28px] sc:[&_h3]:leading-[1.4] sc:[&_h3]:m-[3px_0_4px] sc:[&_>_.sc-inline]:justify-end sc:[&_>_.sc-inline]:pt-[6px] sc:at-most-900:[&_h3]:[font-size:24px] sc:at-most-500:flex-col sc:at-most-500:gap-[10px] sc:at-most-500:[&_>_.sc-inline]:justify-start sc:at-most-500:[&_>_.sc-inline]:p-0">
            <div><h3>{entry.title}</h3><p className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">{entry.englishTitle}</p></div>
            <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-wrap sc:flex-wrap"><Badge variant="secondary">{entry.engine}</Badge><Badge variant="outline">{entry.primitive}</Badge></div>
          </header>
          <p className="sc-tr-description sc:[font-size:14px] sc:leading-[1.75] sc:max-w-[70ch] sc:text-muted-foreground">{entry.description}</p>
          <div className="sc-tr-toolbar sc:flex sc:items-center sc:justify-between sc:flex-wrap sc:gap-3 sc:at-most-500:items-start sc:at-most-500:[&_>_.sc-inline]:gap-[6px]">
            <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-wrap sc:flex-wrap">
              <Button variant="outline" onClick={() => setReplayKey(value => value + 1)}><RotateCcw data-icon="inline-start" />重放交互</Button>
              <Button variant="ghost" aria-pressed={localPaused} disabled={stopped} onClick={() => setLocalPaused(value => !value)}>{paused ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}{paused ? "恢复演示动效" : "暂停演示动效"}</Button>
            </div>
            <span className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]" role="status">{paused ? "减少动效，保留状态变化" : "按需播放，可重复操作"}</span>
          </div>
          <div ref={stage} className={`sc-tr-stage sc:min-w-0 sc:min-h-[390px] sc:grid sc:items-center sc:justify-items-center sc:p-8 sc:border sc:isolate sc:relative sc:[&_>_*]:max-w-full sc:[&_>_*]:min-w-0 sc:[&_img]:max-w-full sc:[&[data-motion-stopped]_*]:[animation-duration:0s]! sc:[&[data-motion-stopped]_*]:[animation-delay:0s]! sc:[&[data-motion-stopped]_*]:[transition-duration:0s]! sc:[&[data-motion-stopped]_*]:[transition-delay:0s]! sc:[&[data-motion-stopped]_*::before]:[animation-duration:0s]! sc:[&[data-motion-stopped]_*::before]:[animation-delay:0s]! sc:[&[data-motion-stopped]_*::before]:[transition-duration:0s]! sc:[&[data-motion-stopped]_*::before]:[transition-delay:0s]! sc:[&[data-motion-stopped]_*::after]:[animation-duration:0s]! sc:[&[data-motion-stopped]_*::after]:[animation-delay:0s]! sc:[&[data-motion-stopped]_*::after]:[transition-duration:0s]! sc:[&[data-motion-stopped]_*::after]:[transition-delay:0s]! sc:at-most-1199:p-6 sc:at-most-500:min-h-[340px] sc:at-most-500:p-[20px_12px] ${stageSurfaceClasses}`} data-transition-demo={entry.id} data-motion-stopped={paused || undefined}>
            <Demo key={entry.id} stopped={paused} replayKey={replayKey} />
          </div>
          <section className="sc-tr-usage sc:flex sc:flex-col sc:gap-3 sc:pt-[6px] sc:[&_h3]:m-0 sc:[&_h3]:[font-size:16px] sc:[&_pre]:m-0 sc:[&_pre]:overflow-x-auto sc:[&_pre]:p-[18px_20px] sc:[&_pre]:[font-size:12px] sc:[&_pre]:leading-[1.8] sc:[&_pre]:rounded-[calc(var(--radius)_-_2px)] sc:[&_pre]:text-foreground sc:[&_pre]:bg-muted sc:[&_code]:[overflow-wrap:anywhere] sc:at-most-500:[&_pre]:p-[14px]" aria-labelledby="sc-tr-usage-heading">
            <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-spread sc:justify-between sc-wrap sc:flex-wrap"><h3 id="sc-tr-usage-heading">在产品中使用</h3><Button variant="ghost" size="sm" onClick={copy}>{copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}{copied ? "已复制" : "复制示例"}</Button></div>
            <pre><code>{example}</code></pre>
            <p className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">组件源码位于 <code>preview/shadcn/transitions/{entry.module}.tsx</code>，配合共享 Tailwind 配置与动效插件使用。<code>stopped</code> 保留可见的最终状态；增加 <code>replayKey</code> 可再次演示。</p>
          </section>
          <Alert><Check /><AlertTitle>沿用相同的组件规范</AlertTitle><AlertDescription>使用语义 Token、真实按钮与字段，以及 Radix 浮层和焦点行为。简单变化优先使用 CSS3，动态拖拽落位使用 Anime.js；全局暂停和系统减少动效同时生效。</AlertDescription></Alert>
          <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-wrap sc:flex-wrap sc-tr-source sc:justify-between"><Button variant="link" asChild><a href={`https://transitions.dev/detail.html?t=${entry.id}`} target="_blank" rel="noreferrer">查看原始交互 <ArrowUpRight data-icon="inline-end" /></a></Button><span className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">{entry.sourceTier === "pro-preview" ? "依据 Pro 公开演示自主实现" : "依据公开交互自主实现"}</span></div>
        </div>
      </div>
    </div>
  )
}
