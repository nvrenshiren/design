import * as React from "react"
import {
  ArrowLeftIcon, ArrowRightIcon, BellIcon, CheckIcon, ChevronDownIcon,
  CopyIcon, DownloadIcon, EllipsisIcon, FileIcon, FolderIcon, LayersIcon,
  LinkIcon, MailIcon, PlusIcon, SettingsIcon, Share2Icon, XIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Accordion as AccordionPrimitive, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Toaster } from "@/components/ui/sonner"
import { useMotionDemo } from "./hooks"
import type { TransitionDemoProps } from "./types"

// Replay changes the interactive state without replacing the component instance.
// This keeps interruption, Radix focus restoration, and CSS transitions intact.
function useReplay(replayKey: number, replay: () => void) {
  const previous = React.useRef(replayKey)
  const callback = React.useRef(replay)
  callback.current = replay
  React.useEffect(() => {
    if (previous.current !== replayKey) {
      previous.current = replayKey
      callback.current()
    }
  }, [replayKey])
}

function MotionFrame({ stopped, className, children, ...props }: React.ComponentProps<"div"> & { stopped: boolean }) {
  return <div {...props} className={cn("sc-tr-layout-frame sc:flex sc:flex-col sc:items-center sc:justify-center sc:gap-5 sc:min-w-0 sc:w-full sc:[&[data-motion-stopped='true']_*]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']_*]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']_*]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']_*]:[transition-delay:0s]! sc:[&[data-motion-stopped='true']_*::before]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']_*::before]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']_*::before]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']_*::before]:[transition-delay:0s]! sc:[&[data-motion-stopped='true']_*::after]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']_*::after]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']_*::after]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']_*::after]:[transition-delay:0s]! sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!", className)} data-motion-stopped={stopped}>{children}</div>
}

function useClosingSettle(open: boolean, stopped: boolean) {
  const previous = React.useRef(open)
  const [settling, setSettling] = React.useState(false)
  React.useEffect(() => {
    if (stopped || open) setSettling(false)
    else if (previous.current) setSettling(true)
    previous.current = open
  }, [open, stopped])
  return [settling, () => setSettling(false)] as const
}

export function CardResize(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [expanded, setExpanded] = React.useState(false)
  const contentId = React.useId()
  useReplay(replayKey, () => setExpanded(value => !value))
  return <MotionFrame stopped={stopped}>
    <Card className="sc-tr-layout-resize-card sc:w-[min(100%,_268px)] sc:[transition:width_300ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-expanded='true']]:w-[min(100%,_384px)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-expanded={expanded}>
      <CardHeader>
        <CardTitle>设计系统更新</CardTitle>
        <CardDescription>统一基础，让团队协作更顺畅。</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary"><LayersIcon data-icon="inline-start" />版本 2.0</Badge>
        <div id={contentId} className="sc-tr-layout-resize-reveal sc:grid sc:[grid-template-rows:0fr] sc:opacity-0 sc:[transition:grid-template-rows_300ms_cubic-bezier(.22,1,.36,1),_opacity_300ms_cubic-bezier(.22,1,.36,1)] sc:[&_>_div]:min-h-0 sc:[&_>_div]:overflow-hidden sc:[&_p]:pt-4 sc:[&[data-expanded='true']]:[grid-template-rows:1fr] sc:[&[data-expanded='true']]:opacity-100 sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-expanded={expanded} aria-hidden={!expanded}>
          <div><p className="sc-tr-layout-copy sc:m-0 sc:text-muted-foreground sc:[font-size:14px] sc:leading-[1.7] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">品牌色、组件规范与交互状态已经同步，产品团队可以使用同一套基础开始设计。</p></div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls={contentId}>
          {expanded ? "收起详情" : "展开详情"}<ChevronDownIcon data-icon="inline-end" className="sc-tr-layout-resize-chevron sc:[transition:transform_200ms_ease-out] sc:[&[data-expanded='true']]:[transform:rotate(180deg)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-expanded={expanded} />
        </Button>
      </CardFooter>
    </Card>
  </MotionFrame>
}

const menuActions = [
  { label: "复制链接", Icon: LinkIcon },
  { label: "下载文件", Icon: DownloadIcon },
  { label: "分享给团队", Icon: Share2Icon },
]

export function MenuDropdown(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [open, setOpen] = React.useState(false)
  const [result, setResult] = React.useState("选择一个操作，查看菜单收起。")
  useReplay(replayKey, () => setOpen(value => !value))
  return <MotionFrame stopped={stopped}>
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild><Button variant="outline">项目操作<ChevronDownIcon data-icon="inline-end" className="sc-tr-layout-menu-chevron sc:[transition:transform_180ms_ease-out] sc:[&[data-open='true']]:[transform:rotate(180deg)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-open={open} /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="sc-tr-layout-dropdown sc:min-w-[208px] sc:[&[data-state='open']]:animate-[sc-tr-layout-menu-in_250ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-state='closed']]:animate-[sc-tr-layout-menu-out_150ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-motion-stopped='true']]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']]:[transition-delay:0s]! sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-motion-stopped={stopped}>
        <DropdownMenuLabel>设计资源</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>{menuActions.map(({ label, Icon }) => <DropdownMenuItem key={label} onSelect={() => setResult(`已选择：${label}`)}><Icon />{label}</DropdownMenuItem>)}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <p role="status" className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{result}</p>
  </MotionFrame>
}

export function ModalOpenClose(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [open, setOpen] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  useReplay(replayKey, () => setOpen(value => !value))
  return <MotionFrame stopped={stopped}>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline">打开对话框</Button></DialogTrigger>
      <DialogContent className="sc-tr-layout-modal sc:[&[data-state='open']]:animate-[sc-tr-layout-modal-in_250ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-state='closed']]:animate-[sc-tr-layout-modal-out_150ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-motion-stopped='true']]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']]:[transition-delay:0s]! sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-motion-stopped={stopped}>
        <DialogHeader><DialogTitle>保存当前版本</DialogTitle><DialogDescription>保存这次组件配置，供团队后续复用。</DialogDescription></DialogHeader>
        <p className="sc-tr-layout-copy sc:m-0 sc:text-muted-foreground sc:[font-size:14px] sc:leading-[1.7] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">对话框从中心进入，背景淡出让当前任务获得明确的焦点。</p>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">取消</Button></DialogClose>
          <Button onClick={() => { setSaved(true); setOpen(false) }}>保存版本</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <p role="status" className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{saved ? "版本已保存。" : "支持 Escape 关闭，并将焦点返回打开按钮。"}</p>
  </MotionFrame>
}

export function PanelReveal(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [open, setOpen] = React.useState(false)
  useReplay(replayKey, () => setOpen(value => !value))
  return <MotionFrame stopped={stopped} className="sc-tr-layout-wide sc:max-w-[480px] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
    <Collapsible open={open} onOpenChange={setOpen} className="sc-tr-layout-panel-specimen sc:flex sc:flex-col sc:items-center sc:gap-4 sc:w-full sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
      <div className="sc-tr-layout-panel-viewport sc:relative sc:w-full sc:h-[300px] sc:overflow-hidden sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
        <CollapsibleContent forceMount className="sc-tr-layout-panel-content sc:absolute sc:inset-x-0 sc:top-[10px] sc:min-w-0 sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-hidden={!open} {...(!open ? { inert: "" } : {})}>
          <Card className="sc-tr-layout-panel-card sc:w-full sc-tr-layout-panel-motion sc:opacity-0 sc:[transform:translateY(50%)] sc:[filter:blur(2px)] sc:[transition:opacity_350ms_cubic-bezier(.22,1,.36,1),_transform_350ms_cubic-bezier(.22,1,.36,1),_filter_350ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-open='true']]:opacity-100 sc:[&[data-open='true']]:[transform:translateY(0)] sc:[&[data-open='true']]:[filter:blur(0)] sc:[&[data-open='true']]:[transition-duration:400ms] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-open={open}>
            <CardHeader><CardTitle>项目概览</CardTitle><CardDescription>查看项目内容与最近活动。</CardDescription></CardHeader>
            <CardContent><div className="sc-tr-layout-panel-detail sc:flex sc:flex-col sc:items-start sc:gap-3 sc:min-w-0 sc:[&_>_svg]:text-primary sc:[&_>_svg]:size-7 sc:[&_p]:m-0 sc:[&_p]:text-left sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><FolderIcon aria-hidden="true" /><p>品牌设计资源</p><Separator /><p className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">组件规范已更新</p></div></CardContent>
            <CardFooter><Badge variant="secondary">刚刚同步</Badge></CardFooter>
          </Card>
        </CollapsibleContent>
      </div>
      <CollapsibleTrigger asChild><Button variant="outline">{open ? "收起活动面板" : "展开活动面板"}<ChevronDownIcon data-icon="inline-end" className="sc-tr-layout-panel-arrow sc:[transition:transform_220ms_ease-out] sc:[&[data-open='true']]:[transform:rotate(180deg)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-open={open} /></Button></CollapsibleTrigger>
    </Collapsible>
  </MotionFrame>
}

const assets = [
  { name: "Ethereum", ticker: "ETH" },
  { name: "Avalanche", ticker: "AVAX" },
  { name: "BNB", ticker: "BNB" },
]

export function PageSideBySide(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [page, setPage] = React.useState(0)
  const [asset, setAsset] = React.useState(assets[0])
  const [amount, setAmount] = React.useState("10")
  const [complete, setComplete] = React.useState(false)
  const inputId = React.useId()
  const pageOneTitle = React.useId()
  const pageTwoTitle = React.useId()
  const backButton = React.useRef<HTMLButtonElement>(null)
  const assetButtons = React.useRef<Array<HTMLButtonElement | null>>([])
  const previousPage = React.useRef(page)
  useReplay(replayKey, () => { setPage(value => 1 - value); setComplete(false) })
  React.useEffect(() => {
    if (previousPage.current === page) return
    previousPage.current = page
    // The outgoing page becomes inert immediately; move focus into the active
    // page rather than leaving it inside an off-screen interactive surface.
    if (page === 1) backButton.current?.focus({ preventScroll: true })
    else assetButtons.current[assets.indexOf(asset)]?.focus({ preventScroll: true })
  }, [page, asset])
  return <MotionFrame stopped={stopped}>
    <Card className="sc-tr-layout-pages-card sc:w-[min(100%,_380px)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
      <CardHeader><CardTitle>转账演示</CardTitle><CardDescription>前进与返回始终保持相反方向。</CardDescription></CardHeader>
      <CardContent>
        <div className="sc-tr-layout-page-viewport sc:relative sc:w-full sc:h-[254px] sc:overflow-hidden sc:[&[data-page='1']_.sc-tr-layout-page-first]:[transform:translateX(-8px)] sc:[&[data-page='1']_.sc-tr-layout-page-first]:opacity-0 sc:[&[data-page='1']_.sc-tr-layout-page-first]:[filter:blur(3px)] sc:[&[data-page='1']_.sc-tr-layout-page-second]:[transform:translateX(0)] sc:[&[data-page='1']_.sc-tr-layout-page-second]:opacity-100 sc:[&[data-page='1']_.sc-tr-layout-page-second]:[filter:blur(0)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-page={page}>
          <section className="sc-tr-layout-page sc:absolute sc:inset-0 sc:flex sc:flex-col sc:items-stretch sc:gap-4 sc:[transition:transform_250ms_cubic-bezier(.22,1,.36,1),_opacity_250ms_cubic-bezier(.22,1,.36,1),_filter_250ms_cubic-bezier(.22,1,.36,1)] sc:[&_p]:m-0 sc-tr-layout-page-first sc:[transform:translateX(0)] sc:opacity-100 sc:[filter:blur(0)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-labelledby={pageOneTitle} aria-hidden={page !== 0} {...(page !== 0 ? { inert: "" } : {})}>
            <p id={pageOneTitle}>选择资产</p>
            <div className="sc-tr-layout-asset-list sc:flex sc:flex-col sc:gap-[10px] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{assets.map((item, index) => <Button key={item.ticker} ref={node => { assetButtons.current[index] = node }} variant="ghost" className="sc-tr-layout-asset sc:flex sc:justify-start sc:w-full sc:[&_>_:last-child]:ml-auto sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" onClick={() => { setAsset(item); setPage(1); setComplete(false) }}><span>{item.name}</span><Badge variant="outline">{item.ticker}</Badge><ArrowRightIcon data-icon="inline-end" /></Button>)}</div>
          </section>
          <section className="sc-tr-layout-page sc:absolute sc:inset-0 sc:flex sc:flex-col sc:items-stretch sc:gap-4 sc:[transition:transform_250ms_cubic-bezier(.22,1,.36,1),_opacity_250ms_cubic-bezier(.22,1,.36,1),_filter_250ms_cubic-bezier(.22,1,.36,1)] sc:[&_p]:m-0 sc-tr-layout-page-second sc:[transform:translateX(8px)] sc:opacity-0 sc:[filter:blur(3px)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-labelledby={pageTwoTitle} aria-hidden={page !== 1} {...(page !== 1 ? { inert: "" } : {})}>
            <div className="sc-tr-layout-page-heading sc:flex sc:items-center sc:gap-[10px] sc:[&_>_:last-child]:ml-auto sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><Button ref={backButton} variant="ghost" size="icon" aria-label="返回选择资产" onClick={() => setPage(0)}><ArrowLeftIcon /></Button><p id={pageTwoTitle}>{asset.name}</p><Badge variant="outline">{asset.ticker}</Badge></div>
            <FieldGroup><Field><FieldLabel htmlFor={inputId}>演示金额</FieldLabel><Input id={inputId} value={amount} onChange={event => { setAmount(event.target.value); setComplete(false) }} inputMode="decimal" /><FieldDescription>可用余额 66.11 · 仅用于交互演示</FieldDescription></Field></FieldGroup>
            <Button disabled={!Number.isFinite(Number(amount)) || Number(amount) <= 0 || Number(amount) > 66.11} onClick={() => setComplete(true)}>{complete ? <CheckIcon data-icon="inline-start" /> : <ArrowRightIcon data-icon="inline-start" />}{complete ? "演示完成" : "确认演示"}</Button>
          </section>
        </div>
      </CardContent>
      <CardFooter><p className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" role="status">{complete ? "转账交互演示已完成。" : `步骤 ${page + 1} / 2`}</p></CardFooter>
    </Card>
  </MotionFrame>
}

const tabItems = [
  { value: "plan", label: "计划", Icon: FileIcon, description: "梳理目标，安排下一步工作。" },
  { value: "debug", label: "调试", Icon: SettingsIcon, description: "定位问题，验证每一个交互状态。" },
  { value: "ask", label: "提问", Icon: MailIcon, description: "补充上下文，让团队更快达成共识。" },
]

export function TabsSliding(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [value, setValue] = React.useState("plan")
  const index = tabItems.findIndex(item => item.value === value)
  useReplay(replayKey, () => setValue(previous => tabItems[(tabItems.findIndex(item => item.value === previous) + 1) % tabItems.length].value))
  return <MotionFrame stopped={stopped}>
    <Tabs value={value} onValueChange={setValue} className="sc-tr-layout-tabs sc:w-[min(100%,_356px)] sc:items-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
      <TabsList aria-label="工作模式" className="sc-tr-layout-tabs-list sc:relative sc:w-full sc:grid sc:[grid-template-columns:repeat(3,minmax(0,1fr))] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" style={{ "--sc-tr-tab-index": index } as React.CSSProperties}>
        <span className="sc-tr-layout-tabs-indicator sc:pointer-events-none sc:absolute sc:[inset-block:3px] sc:left-[3px] sc:w-[calc((100%_-_6px)/3)] sc:bg-accent sc:rounded-[calc(var(--radius)_-_2px)] sc:[transform:translateX(calc(var(--sc-tr-tab-index)_*_100%))] sc:[box-shadow:0_1px_2px_color-mix(in_oklab,var(--foreground)_8%,transparent)] sc:[transition:transform_250ms_cubic-bezier(.22,1,.36,1)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-hidden="true" />
        {tabItems.map(({ value: tabValue, label, Icon }) => <TabsTrigger key={tabValue} value={tabValue} className="sc-tr-layout-tabs-trigger sc:relative sc:[&[data-state='active']]:bg-transparent sc:[&[data-state='active']]:shadow-none sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><Icon />{label}</TabsTrigger>)}
      </TabsList>
      {tabItems.map(item => <TabsContent key={item.value} value={item.value} className="sc-tr-layout-tab-panel sc:w-full sc:min-h-19 sc:text-center sc:[&_p]:m-[18px_0_0] sc:[&_p]:text-muted-foreground sc:[&_p]:[font-size:14px] sc:[&_p]:leading-[1.65] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><p>{item.description}</p></TabsContent>)}
    </Tabs>
  </MotionFrame>
}

export function TooltipOpenClose(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const [result, setResult] = React.useState("悬停或聚焦按钮，查看操作提示。")
  const replayTimer = React.useRef<ReturnType<typeof setTimeout>>()
  const triggers = React.useRef<Array<HTMLButtonElement | null>>([])
  const lastTip = React.useRef<{ index: number; center: number; width: number; time: number }>()
  const [travel, setTravel] = React.useState<{ fromX: number; fromWidth: number } | null>(null)
  const tips = [{ label: "复制", tip: "复制链接", Icon: CopyIcon }, { label: "分享", tip: "分享给团队", Icon: Share2Icon }, { label: "更多", tip: "更多操作", Icon: EllipsisIcon }]
  const showTip = (index: number) => {
    const rect = triggers.current[index]?.getBoundingClientRect()
    const previous = lastTip.current
    const center = rect ? rect.x + rect.width / 2 : 0
    setTravel(previous && previous.index !== index && Date.now() - previous.time < 600
      ? { fromX: previous.center - center, fromWidth: previous.width } : null)
    setOpenIndex(index)
  }
  useReplay(replayKey, () => {
    clearTimeout(replayTimer.current)
    showTip(openIndex === null ? 0 : (openIndex + 1) % tips.length)
    replayTimer.current = setTimeout(() => setOpenIndex(null), 1400)
  })
  React.useEffect(() => () => clearTimeout(replayTimer.current), [])
  return <MotionFrame stopped={stopped}>
    <TooltipProvider delayDuration={80} skipDelayDuration={600} disableHoverableContent>
      <div className="sc-tr-layout-toolbar sc:flex sc:justify-center sc:flex-wrap sc:gap-2 sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{tips.map(({ label, tip, Icon }, index) => <Tooltip key={label} open={openIndex === index} onOpenChange={open => {
        clearTimeout(replayTimer.current)
        if (open) showTip(index)
        else {
          if (lastTip.current?.index === index) lastTip.current.time = Date.now()
          setOpenIndex(current => current === index ? null : current)
        }
      }}>
        <TooltipTrigger asChild><Button ref={node => { triggers.current[index] = node }} variant="outline" onClick={() => setResult(`已选择：${label}`)}><Icon data-icon="inline-start" />{label}</Button></TooltipTrigger>
        <TooltipContent side="top" sideOffset={8} className="sc-tr-layout-tooltip sc:whitespace-nowrap sc:[&[data-state='delayed-open']]:animate-[sc-tr-layout-tooltip-in_150ms_ease-out] sc:[&[data-state='instant-open']]:animate-[sc-tr-layout-tooltip-in_150ms_ease-out] sc:[&[data-travelling='true'][data-state='instant-open']]:animate-[sc-tr-layout-tooltip-travel_160ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-travelling='true'][data-state='delayed-open']]:animate-[sc-tr-layout-tooltip-travel_160ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-state='closed']]:animate-[sc-tr-layout-tooltip-out_50ms_ease-out] sc:[&[data-motion-stopped='true']]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']]:[transition-delay:0s]! sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-travelling={!!travel} data-motion-stopped={stopped} style={{ "--sc-tr-tip-from-x": `${travel?.fromX ?? 0}px`, "--sc-tr-tip-from-width": `${travel?.fromWidth ?? 0}px` } as React.CSSProperties}>
          <span ref={node => {
            if (!node || openIndex !== index) return
            const popup = node.parentElement!
            // Keep Radix ownership of anchoring, focus, aria-describedby and
            // dismissal; only bridge the geometry between consecutive tips.
            const width = node.offsetWidth + 24
            popup.style.setProperty("--sc-tr-tip-to-width", `${width}px`)
            const rect = triggers.current[index]?.getBoundingClientRect()
            lastTip.current = { index, center: rect ? rect.x + rect.width / 2 : 0, width, time: Date.now() }
          }}>{tip}</span>
        </TooltipContent>
      </Tooltip>)}</div>
    </TooltipProvider>
    <p role="status" className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{result}</p>
  </MotionFrame>
}

export function DropdownMenuMorph(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [open, setOpen] = React.useState(false)
  const [settling, finishSettle] = useClosingSettle(open, stopped)
  const [result, setResult] = React.useState("按钮沿原点展开为菜单。")
  useReplay(replayKey, () => setOpen(value => !value))
  return <MotionFrame stopped={stopped}>
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="打开资源操作菜单" className="sc-tr-layout-morph-trigger sc:[transition:transform_350ms_cubic-bezier(.22,1,.36,1),_opacity_200ms_cubic-bezier(.22,1,.36,1),_filter_200ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-open='true']]:opacity-0 sc:[&[data-open='true']]:[transform:translateX(-40px)] sc:[&[data-open='true']]:[filter:blur(2px)] sc:[&_>_svg]:[transition:transform_350ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-open='true']_>_svg]:[transform:rotate(45deg)] sc:[&[data-settling='true']]:animate-[sc-tr-layout-morph-settle_700ms_linear] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-open={open} data-settling={settling} onAnimationEnd={event => { if (event.animationName === "sc-tr-layout-morph-settle") finishSettle() }}><PlusIcon /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" sideOffset={-36} className="sc-tr-layout-morph-content sc:w-[208px] sc:h-42 sc:overflow-hidden sc:[transform-origin:top_left] sc:[&[data-state='open']]:animate-[sc-tr-layout-morph-in_350ms_cubic-bezier(.34,1.25,.64,1)] sc:[&[data-state='closed']]:animate-[sc-tr-layout-morph-out_250ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-state='open']_.sc-tr-layout-morph-body]:animate-[sc-tr-layout-morph-item-in_350ms_cubic-bezier(.22,1,.36,1),_sc-tr-layout-morph-body-in_200ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-state='closed']_.sc-tr-layout-morph-body]:animate-[sc-tr-layout-morph-body-out_200ms_cubic-bezier(.22,1,.36,1)_both] sc:[&[data-motion-stopped='true']]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']]:[transition-delay:0s]! sc:[&[data-motion-stopped='true']_*]:[animation-duration:0s]! sc:[&[data-motion-stopped='true']_*]:[animation-delay:0s]! sc:[&[data-motion-stopped='true']_*]:[transition-duration:0s]! sc:[&[data-motion-stopped='true']_*]:[transition-delay:0s]! sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-motion-stopped={stopped}>
        <div className="sc-tr-layout-morph-body sc:w-[198px] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><DropdownMenuLabel>资源操作</DropdownMenuLabel><DropdownMenuSeparator />
          <DropdownMenuGroup>{menuActions.map(({ label, Icon }) => <DropdownMenuItem key={label} onSelect={() => setResult(`已选择：${label}`)}><Icon />{label}</DropdownMenuItem>)}</DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
    <p role="status" className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{result}</p>
  </MotionFrame>
}

export function AccordionTransition(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [value, setValue] = React.useState("")
  const [notifications, setNotifications] = React.useState(true)
  const switchId = React.useId()
  useReplay(replayKey, () => setValue(previous => previous ? "" : "appearance"))
  return <MotionFrame stopped={stopped}>
    <AccordionPrimitive type="single" collapsible value={value} onValueChange={setValue} className="sc-tr-layout-accordion sc:w-[min(100%,_380px)] sc:[&_[data-slot='accordion-trigger']_>_svg]:[rotate:0deg]! sc:[&_[data-slot='accordion-trigger']_>_svg]:[transition:transform_250ms_cubic-bezier(.22,1,.36,1)] sc:[&_[data-slot='accordion-trigger'][data-state='open']_>_svg]:[transform:scaleY(-1)] sc:[&_[data-slot='accordion-content']]:animate-none sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
      <AccordionItem value="appearance">
        <AccordionTrigger><span className="sc-tr-layout-accordion-heading sc:flex sc:items-center sc:gap-[10px] sc:[&_>_svg]:size-4 sc:[&_>_svg]:text-muted-foreground sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><SettingsIcon aria-hidden="true" />外观与通知</span></AccordionTrigger>
        <AccordionContent forceMount className="sc-tr-layout-accordion-shell sc:pb-0 sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-hidden={!value} {...(!value ? { inert: "" } : {})}>
          <div className="sc-tr-layout-accordion-grid sc:grid sc:[grid-template-rows:0fr] sc:[transition:grid-template-rows_250ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-open='true']]:[grid-template-rows:1fr] sc:[&[data-open='true']_>_.sc-tr-layout-accordion-inner]:opacity-100 sc:[&[data-open='true']_>_.sc-tr-layout-accordion-inner]:[filter:blur(0)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-open={!!value}><div className="sc-tr-layout-accordion-inner sc:min-h-0 sc:overflow-hidden sc:opacity-0 sc:[filter:blur(2px)] sc:[transition:opacity_250ms_cubic-bezier(.22,1,.36,1),_filter_250ms_cubic-bezier(.22,1,.36,1)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
            <div className="sc-tr-layout-accordion-body sc:flex sc:flex-col sc:gap-4 sc:pb-4 sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><p className="sc-tr-layout-copy sc:m-0 sc:text-muted-foreground sc:[font-size:14px] sc:leading-[1.7] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">沿用当前页面的品牌主题，减少重复设置。</p><Separator /><div className="sc-tr-layout-preference sc:flex sc:items-center sc:justify-between sc:gap-4 sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><label htmlFor={switchId}>接收版本更新</label><Switch id={switchId} checked={notifications} onCheckedChange={setNotifications} /></div></div>
          </div></div>
        </AccordionContent>
      </AccordionItem>
    </AccordionPrimitive>
  </MotionFrame>
}

export function ToastOpenClose(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const toasterId = React.useId()
  const toastId = `sc-tr-toast-${toasterId}`
  const [visible, setVisible] = React.useState(false)
  const [result, setResult] = React.useState("通知在此区域内展示。")
  const show = React.useCallback(() => {
    setVisible(true)
    toast("变更已保存", {
      id: toastId, toasterId, duration: Infinity, description: "组件配置已同步到当前工作区。", className: "sc-tr-layout-toast-item sc:[&[data-sonner-toast]]:[transition:transform_250ms_cubic-bezier(.22,1,.36,1),_opacity_250ms_cubic-bezier(.22,1,.36,1),_filter_250ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-sonner-toast]]:[filter:blur(0)] sc:[&[data-sonner-toast][data-mounted='true'][data-removed='false']]:[transition-duration:350ms] sc:[&[data-sonner-toast][data-mounted='false']]:[--y:translateY(16px)_scale(.97)] sc:[&[data-sonner-toast][data-removed='true'][data-front='true'][data-swipe-out='false']]:[--y:translateY(16px)_scale(.97)] sc:[&[data-mounted='false']]:[filter:blur(2px)] sc:[&[data-removed='true']]:[filter:blur(2px)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!",
      action: { label: "撤销", onClick: () => { setResult("已撤销本次保存。"); setVisible(false) } },
      onDismiss: () => setVisible(false),
    })
  }, [toastId, toasterId])
  const toggle = () => {
    if (visible) { toast.dismiss(toastId); setVisible(false) }
    else show()
  }
  useReplay(replayKey, toggle)
  React.useEffect(() => () => { toast.dismiss(toastId) }, [toastId])
  return <MotionFrame stopped={stopped}>
    <div className="sc-tr-layout-toast-stage sc:relative sc:w-[min(100%,_416px)] sc:min-h-[190px] sc:flex sc:justify-center sc:pt-3 sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">
      <p className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">状态更新后，轻量确认操作结果。</p>
      <Toaster id={toasterId} position="bottom-center" closeButton visibleToasts={1} toastOptions={{ className: "sc-tr-layout-toast-item sc:[&[data-sonner-toast]]:[transition:transform_250ms_cubic-bezier(.22,1,.36,1),_opacity_250ms_cubic-bezier(.22,1,.36,1),_filter_250ms_cubic-bezier(.22,1,.36,1)] sc:[&[data-sonner-toast]]:[filter:blur(0)] sc:[&[data-sonner-toast][data-mounted='true'][data-removed='false']]:[transition-duration:350ms] sc:[&[data-sonner-toast][data-mounted='false']]:[--y:translateY(16px)_scale(.97)] sc:[&[data-sonner-toast][data-removed='true'][data-front='true'][data-swipe-out='false']]:[--y:translateY(16px)_scale(.97)] sc:[&[data-mounted='false']]:[filter:blur(2px)] sc:[&[data-removed='true']]:[filter:blur(2px)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" }} className="sc-tr-layout-toaster sc:absolute sc:w-[min(356px,calc(100%_-_24px))] sc:bottom-5 sc:left-1/2 sc:right-auto sc:[transform:translateX(-50%)]" />
    </div>
    <Button variant="outline" onClick={toggle}>{visible ? "关闭通知" : "显示通知"}</Button>
    <p role="status" className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{result}</p>
  </MotionFrame>
}

const banners = [
  { title: "组件库已就绪", description: "团队可以使用最新的组件规范。" },
  { title: "品牌主题已更新", description: "浅色与深色主题已保持同步。" },
  { title: "交互配置已保存", description: "当前工作区的设置已经生效。" },
]

export function BannerStacking(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const nextId = React.useRef(3)
  const [items, setItems] = React.useState([{ id: 2, index: 2 }, { id: 1, index: 1 }, { id: 0, index: 0 }])
  const [leaving, setLeaving] = React.useState<Array<{ id: number; index: number; depth: number }>>([])
  const leaveTimers = React.useRef<Array<ReturnType<typeof setTimeout>>>([])
  const retire = (item: { id: number; index: number }, depth: number) => {
    if (stopped) return
    setLeaving(previous => [...previous, { ...item, depth }])
    leaveTimers.current.push(setTimeout(() => setLeaving(previous => previous.filter(candidate => candidate.id !== item.id)), 250))
  }
  const add = () => {
    const id = nextId.current++
    if (items.length === 3) retire(items[2], 2)
    setItems(previous => [{ id, index: id % banners.length }, ...previous].slice(0, 3))
  }
  useReplay(replayKey, add)
  React.useEffect(() => () => leaveTimers.current.forEach(clearTimeout), [])
  React.useEffect(() => { if (stopped) { leaveTimers.current.forEach(clearTimeout); setLeaving([]) } }, [stopped])
  return <MotionFrame stopped={stopped}>
    <div className="sc-tr-layout-banner-stack sc:relative sc:w-[min(100%,_412px)] sc:h-44 sc:pt-[26px] sc:isolate sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-label="通知横幅">
      {items.length === 0 && <p className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">点击“添加横幅”查看堆叠效果。</p>}
      {items.map((item, depth) => <Alert key={item.id} className="sc-tr-layout-banner sc:absolute sc:top-5 sc:left-0 sc:w-full sc:pr-14 sc:[transform:translateY(calc(var(--sc-tr-banner-depth)*-12px))_scale(calc(1_-_var(--sc-tr-banner-depth)*.06))] sc:[transform-origin:bottom_center] sc:opacity-[var(--sc-tr-banner-opacity,1)] sc:[filter:blur(calc(var(--sc-tr-banner-depth)*1px))] sc:z-[calc(3_-_var(--sc-tr-banner-depth))] sc:[transition:transform_350ms_cubic-bezier(.22,1,.36,1),_opacity_350ms_cubic-bezier(.22,1,.36,1),_filter_350ms_cubic-bezier(.22,1,.36,1)] sc:animate-[sc-tr-layout-banner-in_350ms_cubic-bezier(.22,1,.36,1)] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" style={{ "--sc-tr-banner-depth": depth, "--sc-tr-banner-opacity": [1,.6,.36][depth] } as React.CSSProperties} aria-hidden={depth !== 0} {...(depth !== 0 ? { inert: "" } : {})}>
        <BellIcon aria-hidden="true" />
        <AlertTitle>{banners[item.index].title}</AlertTitle>
        <AlertDescription>{banners[item.index].description}</AlertDescription>
        <Button variant="ghost" size="icon" className="sc-tr-layout-banner-close sc:absolute sc:top-[10px] sc:right-[10px] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-label="关闭当前横幅" onClick={() => { retire(item, depth); setItems(previous => previous.filter(candidate => candidate.id !== item.id)) }}><XIcon /></Button>
      </Alert>)}
      {leaving.map(item => <Alert key={`leaving-${item.id}`} className="sc-tr-layout-banner sc:absolute sc:top-5 sc:left-0 sc:w-full sc:pr-14 sc:[transform:translateY(calc(var(--sc-tr-banner-depth)*-12px))_scale(calc(1_-_var(--sc-tr-banner-depth)*.06))] sc:[transform-origin:bottom_center] sc:opacity-[var(--sc-tr-banner-opacity,1)] sc:[filter:blur(calc(var(--sc-tr-banner-depth)*1px))] sc:z-[calc(3_-_var(--sc-tr-banner-depth))] sc:[transition:transform_350ms_cubic-bezier(.22,1,.36,1),_opacity_350ms_cubic-bezier(.22,1,.36,1),_filter_350ms_cubic-bezier(.22,1,.36,1)] sc-tr-layout-banner-leaving sc:pointer-events-none sc:animate-[sc-tr-layout-banner-out_250ms_cubic-bezier(.22,1,.36,1)_both] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" style={{ "--sc-tr-banner-depth": item.depth, "--sc-tr-banner-opacity": item.depth >= 2 ? .36 : 1, "--sc-tr-banner-leave-scale": (1 - (item.depth + 1)*.06)/(1 - item.depth*.06) } as React.CSSProperties} aria-hidden="true" inert=""><BellIcon aria-hidden="true" /><AlertTitle>{banners[item.index].title}</AlertTitle><AlertDescription>{banners[item.index].description}</AlertDescription></Alert>)}
    </div>
    <Button variant="outline" onClick={add}><PlusIcon data-icon="inline-start" />添加横幅</Button>
  </MotionFrame>
}

const gooeyActions = [
  { label: "创建文件", Icon: FileIcon },
  { label: "创建文件夹", Icon: FolderIcon },
  { label: "邀请成员", Icon: MailIcon },
]

export function GooeyPlusMenu(props: TransitionDemoProps) {
  const { stopped, replayKey } = useMotionDemo(props)
  const [open, setOpen] = React.useState(false)
  const [settling, finishSettle] = useClosingSettle(open, stopped)
  const [result, setResult] = React.useState("展开快捷操作。")
  const trigger = React.useRef<HTMLButtonElement>(null)
  const filterId = `sc-tr-gooey-${React.useId().replace(/:/g, "")}`
  useReplay(replayKey, () => setOpen(value => !value))
  return <MotionFrame stopped={stopped}>
    <Collapsible open={open} onOpenChange={setOpen} className="sc-tr-layout-gooey sc:relative sc:w-[min(100%,_260px)] sc:h-[186px] sc:[&[data-open='true']_.sc-tr-layout-gooey-trigger_>_svg]:[transform:rotate(45deg)] sc:[&[data-open='true']_.sc-tr-layout-gooey-action]:[transform:translate(var(--sc-tr-gooey-x),var(--sc-tr-gooey-y))] sc:[&[data-open='true']_.sc-tr-layout-gooey-action]:[transition-duration:350ms] sc:[&[data-open='true']_.sc-tr-layout-gooey-action]:[transition-timing-function:cubic-bezier(.34,1.56,.64,1)] sc:[&[data-open='true']_.sc-tr-layout-gooey-action]:[transition-delay:calc(var(--sc-tr-gooey-index)*40ms)] sc:[&[data-open='true']_.sc-tr-layout-gooey-blob]:[transform:translate(var(--sc-tr-gooey-x),var(--sc-tr-gooey-y))] sc:[&[data-open='true']_.sc-tr-layout-gooey-blob]:[transition-duration:350ms] sc:[&[data-open='true']_.sc-tr-layout-gooey-blob]:[transition-timing-function:cubic-bezier(.34,1.56,.64,1)] sc:[&[data-open='true']_.sc-tr-layout-gooey-blob]:[transition-delay:calc(var(--sc-tr-gooey-index)*40ms)] sc:[&[data-open='true']_.sc-tr-layout-gooey-action_>_svg]:opacity-100 sc:[&[data-open='true']_.sc-tr-layout-gooey-action_>_svg]:[filter:blur(0)] sc:[&[data-open='true']_.sc-tr-layout-gooey-action_>_svg]:[transition-duration:180ms] sc:[&[data-open='true']_.sc-tr-layout-gooey-action_>_svg]:[transition-delay:calc(120ms_+_var(--sc-tr-gooey-index)*40ms)] sc:[&[data-open='false']_.sc-tr-layout-gooey-action]:pointer-events-none sc:[&[data-settling='true']_.sc-tr-layout-gooey-trigger]:animate-[sc-tr-layout-gooey-settle_700ms_linear] sc:[&[data-settling='true']_.sc-tr-layout-gooey-liquid]:animate-[sc-tr-layout-gooey-settle_700ms_linear] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" data-open={open} data-settling={settling} onAnimationEnd={event => { if (event.animationName === "sc-tr-layout-gooey-settle") finishSettle() }} onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); trigger.current?.focus() } }}>
      <svg aria-hidden="true" className="sc-tr-layout-gooey-defs sc:absolute sc:size-0 sc:pointer-events-none sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><defs><filter id={filterId} x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" /></filter></defs></svg>
      <div aria-hidden="true" className="sc-tr-layout-gooey-liquid sc:[filter:var(--gooey-filter)] sc:absolute sc:inset-0 sc:pointer-events-none sc:[contain:paint] sc:overflow-visible sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" style={{ "--gooey-filter": `url(#${filterId})` } as React.CSSProperties}><span className="sc-tr-layout-gooey-center sc:absolute sc:left-[calc(50%_-_18px)] sc:bottom-2 sc:size-9 sc:rounded-full sc:bg-primary sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" />{gooeyActions.map((action, index) => <span key={action.label} className="sc-tr-layout-gooey-blob sc:absolute sc:left-[calc(50%_-_18px)] sc:bottom-2 sc:size-9 sc:rounded-full sc:bg-primary sc:[--sc-tr-gooey-x:calc((var(--sc-tr-gooey-index)_-_1)*54px)] sc:[--sc-tr-gooey-y:-34px] sc:[transform:translate(0,0)] sc:[transition:transform_250ms_cubic-bezier(.22,1,.36,1)] sc:[&:nth-child(3)]:[--sc-tr-gooey-y:-64px] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" style={{ "--sc-tr-gooey-index": index } as React.CSSProperties} />)}</div>
      <CollapsibleContent forceMount className="sc-tr-layout-gooey-actions sc:absolute sc:inset-0 sc:pointer-events-none sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" aria-hidden={!open} {...(!open ? { inert: "" } : {})}>
        {gooeyActions.map(({ label, Icon }, index) => <Button key={label} size="icon" aria-label={label} className="sc-tr-layout-gooey-action sc:absolute sc:left-[calc(50%_-_18px)] sc:bottom-2 sc:rounded-full sc:pointer-events-auto sc:[--sc-tr-gooey-x:calc((var(--sc-tr-gooey-index)_-_1)*54px)] sc:[--sc-tr-gooey-y:-34px] sc:[transform:translate(0,0)] sc:[transition:transform_250ms_cubic-bezier(.22,1,.36,1)] sc:[&:nth-child(2)]:[--sc-tr-gooey-y:-64px] sc:[&_>_svg]:opacity-0 sc:[&_>_svg]:[filter:blur(2px)] sc:[&_>_svg]:[transition:opacity_120ms_ease,_filter_120ms_ease] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!" style={{ "--sc-tr-gooey-index": index } as React.CSSProperties} onClick={() => { setResult(`已选择：${label}`); setOpen(false); trigger.current?.focus() }}><Icon /></Button>)}
      </CollapsibleContent>
      <CollapsibleTrigger asChild><Button ref={trigger} size="icon" aria-label={open ? "收起快捷操作" : "展开快捷操作"} className="sc-tr-layout-gooey-trigger sc:absolute sc:left-[calc(50%_-_18px)] sc:bottom-2 sc:rounded-full sc:[&_>_svg]:[transition:transform_250ms_ease-in-out] sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!"><PlusIcon /></Button></CollapsibleTrigger>
    </Collapsible>
    <p role="status" className="sc-tr-layout-note sc:m-0 sc:text-muted-foreground sc:[font-size:.8125rem] sc:leading-[1.6] sc:text-center sc:motion-reduce:[animation-duration:0s]! sc:motion-reduce:[animation-delay:0s]! sc:motion-reduce:[transition-duration:0s]! sc:motion-reduce:[transition-delay:0s]!">{result}</p>
  </MotionFrame>
}

export const layoutDemos: Record<string, React.ComponentType<TransitionDemoProps>> = {
  "card-resize": CardResize,
  "menu-dropdown": MenuDropdown,
  "modal-open-close": ModalOpenClose,
  "panel-reveal": PanelReveal,
  "page-side-by-side": PageSideBySide,
  "tabs-sliding": TabsSliding,
  "tooltip-open-close": TooltipOpenClose,
  "dropdown-menu-morph": DropdownMenuMorph,
  accordion: AccordionTransition,
  "toast-open-close": ToastOpenClose,
  "banner-stacking": BannerStacking,
  "gooey-plus-menu": GooeyPlusMenu,
}
