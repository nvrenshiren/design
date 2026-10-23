import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight, Bell, CircleCheck, FileCheck2, FolderCheck,
  Pause, Play, RotateCcw, Sparkles,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Spinner } from "../components/ui/spinner";
import { useMotionDemo } from "./hooks";
import type { TransitionDemoProps } from "./types";

/** Independently authored demos. Public behavior reference: Transitions.dev, Jakub Antalik.
 * Motion is CSS-owned; React only selects states. No upstream transition source is included. */
function usePlayback(props: TransitionDemoProps, duration = 1100) {
  const { stopped, replayKey } = useMotionDemo(props);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(!stopped);
  const timerRef = useRef<number>();
  const key = `${replayKey}:${run}`;
  useEffect(() => {
    if (stopped) { setPlaying(false); return; }
    setPlaying(true);
    if (Number.isFinite(duration)) timerRef.current = window.setTimeout(() => setPlaying(false), duration);
    return () => window.clearTimeout(timerRef.current);
  }, [stopped, key, duration]);
  return {
    stopped, runKey: key, playing: playing && !stopped,
    play: () => { if (!stopped) setRun(value => value + 1); },
    stop: () => { window.clearTimeout(timerRef.current); setPlaying(false); },
  };
}

/** Keep the departing label mounted through its CSS exit before the new label arrives. */
function SwapText({ value, playing, runKey, thinking = false }: {
  value: string; playing: boolean; runKey: string; thinking?: boolean;
}) {
  const previous = useRef(value);
  const [outgoing, setOutgoing] = useState<string | null>(null);
  useEffect(() => {
    if (!playing) { previous.current = value; setOutgoing(null); return; }
    const old = previous.current;
    previous.current = value;
    if (old === value) return;
    setOutgoing(old);
    const timer = window.setTimeout(() => setOutgoing(null), 320);
    return () => window.clearTimeout(timer);
  }, [value, playing, runKey]);
  const exchanging = playing && outgoing !== null;
  return <span className="sc-tr-feedback-swap-stack sc:[--feedback-swap-distance:4px] sc:relative sc:[display:inline-grid] sc:[&[data-thinking='true']]:[--feedback-swap-distance:8px] sc:[&_>_span]:[grid-area:1_/_1] sc:[&_>_[data-delayed='true']]:[animation-delay:150ms]" data-thinking={thinking}>
    {exchanging && <span key={`out:${outgoing}`} className="sc-tr-feedback-swap-out sc:animate-[sc-tr-feedback-status-out_150ms_ease-in-out_both] sc:pointer-events-none" aria-hidden="true">{outgoing}</span>}
    <span key={`in:${runKey}:${value}`} className={cn("sc-tr-feedback-swap-text sc:[&[data-play='true']]:animate-[sc-tr-feedback-status-in_150ms_ease-in-out_both]", thinking && "sc-tr-feedback-thinking-text sc:[&[data-play='true']]:animate-[sc-tr-feedback-status-in_150ms_ease-in-out_both] sc:[font-size:15px] sc:[&[data-play='true']]:text-transparent sc:[&[data-play='true']]:[background:linear-gradient(100deg,_var(--muted-foreground)_34%,_var(--foreground)_48%,_var(--primary)_51%,_var(--muted-foreground)_63%)] sc:[&[data-play='true']]:[background-size:250%_100%] sc:[&[data-play='true']]:[background-clip:text] sc:[&[data-play='true']]:[-webkit-background-clip:text] sc:[&[data-play='true']]:animate-[sc-tr-feedback-status-in_150ms_ease-in-out_both,_sc-tr-feedback-text-sweep_2000ms_linear_infinite] sc:[&[data-delayed='true']]:[animation-delay:150ms,_0ms]")}
      data-play={playing} data-delayed={exchanging}>{value}</span>
  </span>;
}

function useSteps(playing: boolean, key: string, count: number, gap: number) {
  const [step, setStep] = useState(playing ? 0 : count - 1);
  useEffect(() => {
    if (!playing) { setStep(count - 1); return; }
    setStep(0);
    const timers = Array.from({ length: count - 1 }, (_, index) =>
      window.setTimeout(() => setStep(index + 1), gap * (index + 1)));
    return () => timers.forEach(window.clearTimeout);
  }, [playing, key, count, gap]);
  return playing ? step : count - 1;
}

function DemoFrame({ children, controls, stopped, playing }: {
  children: React.ReactNode; controls: React.ReactNode; stopped: boolean; playing: boolean;
}) {
  return <div className="sc-tr-feedback-root sc:[--feedback-ease:cubic-bezier(.22,_1,_.36,_1)] sc:flex sc:flex-col sc:gap-7 sc:w-full sc:min-w-0 sc:[&[data-stopped='true']_*]:animate-none! sc:[&[data-stopped='true']_*]:[transition:none]! sc:[&[data-stopped='true']_*::before]:animate-none! sc:[&[data-stopped='true']_*::before]:[transition:none]! sc:[&[data-stopped='true']_*::after]:animate-none! sc:[&[data-stopped='true']_*::after]:[transition:none]! sc:motion-reduce:[&_*]:animate-none! sc:motion-reduce:[&_*]:[transition:none]! sc:motion-reduce:[&_*::before]:animate-none! sc:motion-reduce:[&_*::before]:[transition:none]! sc:motion-reduce:[&_*::after]:animate-none! sc:motion-reduce:[&_*::after]:[transition:none]!" data-stopped={stopped} data-running={playing}>
    <div className="sc-tr-feedback-stage sc:min-h-[240px] sc:min-w-0 sc:flex sc:items-center sc:justify-center sc:p-[24px_12px] sc:at-most-480:min-h-[220px] sc:at-most-480:p-[18px_0]">{children}</div>
    <div className="sc-tr-feedback-controls sc:flex sc:flex-wrap sc:gap-[10px] sc:justify-center">{controls}</div>
  </div>;
}

function Replay({ onClick, stopped, label = "重播动效" }: {
  onClick: () => void; stopped: boolean; label?: string;
}) {
  return <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={stopped}>
    <RotateCcw data-icon="inline-start" aria-hidden="true" />{label}
  </Button>;
}

export function NumberPopIn(props: TransitionDemoProps) {
  const playback = usePlayback(props, 850);
  const [number, setNumber] = useState(65.78);
  const [previous, setPrevious] = useState<string | null>(null);
  const value = number.toFixed(2);
  const changedIndices = Array.from(value).flatMap((digit, index) =>
    digit !== "." && (previous === null || previous[index] !== digit) ? [index] : []);
  return <DemoFrame {...playback} controls={<Button type="button" size="sm" onClick={() => {
    setPrevious(value); setNumber(value => value + 11.14); playback.play();
  }}>更新数值<ArrowUpRight data-icon="inline-end" aria-hidden="true" /></Button>}>
    <div className="sc-tr-feedback-number-group sc:flex sc:flex-col sc:items-center sc:gap-[14px] sc:min-w-0">
      <span className="sc-tr-feedback-caption sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.6]">当前数值 · 演示</span>
      <span className="sc-tr-feedback-number sc:[font-size:clamp(42px,_7vw,_68px)] sc:font-semibold sc:leading-[1.2] sc:tabular-nums sc:[letter-spacing:-.035em]" aria-live="polite" aria-atomic="true">
        <span className="sc:sr-only">{value}</span>
        <span key={playback.runKey + value} aria-hidden="true" className="sc-tr-feedback-digit-row sc:inline-flex sc:[&[data-play='true']_>_[data-changed='true']_>_.sc-tr-feedback-digit-new]:animate-[sc-tr-feedback-digit-in_500ms_cubic-bezier(.34,_1.45,_.64,_1)_both] sc:[&[data-play='true']_>_[data-changed='true']_>_.sc-tr-feedback-digit-new]:[animation-delay:calc(var(--feedback-order)_*_70ms)] sc:[&[data-play='true']_.sc-tr-feedback-digit-old]:visible sc:[&[data-play='true']_.sc-tr-feedback-digit-old]:animate-[sc-tr-feedback-digit-out_500ms_cubic-bezier(.34,_1.45,_.64,_1)_both]" data-play={playback.playing}>
          {Array.from(value).map((digit, index) => <span key={index} className="sc-tr-feedback-digit-cell sc:relative sc:[display:inline-grid]"
            data-changed={changedIndices.includes(index)}
            style={{ "--feedback-order": Math.max(0, changedIndices.indexOf(index)) } as React.CSSProperties}>
            <span className="sc-tr-feedback-digit-new sc:block sc:[grid-area:1_/_1]">{digit}</span>
            {playback.playing && previous !== null && previous[index] !== digit && <span className="sc-tr-feedback-digit-old sc:block sc:[grid-area:1_/_1] sc:invisible">{previous[index]}</span>}
          </span>)}
        </span>
      </span>
    </div>
  </DemoFrame>;
}

export function NotificationBadge(props: TransitionDemoProps) {
  const playback = usePlayback(props, 700);
  const [count, setCount] = useState(1);
  return <DemoFrame {...playback} controls={<Button type="button" variant="outline" size="sm" onClick={() => {
    setCount(value => value + 1); playback.play();
  }}>新增通知</Button>}>
    <div className="sc-tr-feedback-notification sc:relative">
      <Button type="button" variant="outline" size="icon-lg" aria-label={`查看 ${count} 条通知`} onClick={() => setCount(0)}>
        <Bell aria-hidden="true" />
      </Button>
      <span key={playback.runKey} className="sc-tr-feedback-notification-position sc:absolute sc:top-[-9px] sc:right-[-12px] sc:[&[data-play='true']]:animate-[sc-tr-feedback-badge-slide_260ms_var(--feedback-ease)_both] sc:[&[data-visible='false']_.sc-tr-feedback-notification-count]:opacity-0 sc:[&[data-visible='false']_.sc-tr-feedback-notification-count]:[transform:scale(0)] sc:[&[data-visible='false']_.sc-tr-feedback-notification-count]:[filter:blur(2px)]"
        data-play={playback.playing && count > 0} data-visible={count > 0} aria-hidden="true">
        <Badge className="sc-tr-feedback-notification-count sc:min-w-6 sc:justify-center sc:[transition:opacity_180ms_cubic-bezier(.4,_0,_.2,_1),_transform_180ms_cubic-bezier(.4,_0,_.2,_1),_filter_180ms_cubic-bezier(.4,_0,_.2,_1)] sc:[&[data-play='true']]:animate-[sc-tr-feedback-badge-scale_500ms_cubic-bezier(.34,_1.36,_.64,_1)_both,_sc-tr-feedback-badge-opacity_400ms_cubic-bezier(.34,_1.36,_.64,_1)_both]" data-play={playback.playing && count > 0}>{count > 99 ? "99+" : count || "1"}</Badge>
      </span>
      <span className="sc:sr-only" role="status">{count ? `${count} 条未读通知` : "通知已读"}</span>
    </div>
  </DemoFrame>;
}

const swapMessages = ["正在处理请求", "正在同步数据", "处理完成"];
export function TextStatesSwap(props: TransitionDemoProps) {
  const playback = usePlayback(props, 2800);
  const step = useSteps(playback.playing, playback.runKey, 3, 1000);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="切换处理状态" />}>
    <div className="sc-tr-feedback-status-line sc:flex sc:items-center sc:justify-center sc:gap-3 sc:[font-size:17px] sc:[&_>_svg]:size-5 sc:[&_>_svg]:[flex:none] sc:[&_>_svg]:text-primary" role="status" aria-live="polite">
      {playback.playing ? <Spinner aria-label="正在处理" /> : <CircleCheck aria-hidden="true" />}
      <SwapText value={swapMessages[step]} playing={playback.playing} runKey={playback.runKey} />
    </div>
  </DemoFrame>;
}

export function SuccessCheck(props: TransitionDemoProps) {
  const playback = usePlayback(props, 900);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="确认完成" />}>
    <div className="sc-tr-feedback-confirm sc:flex sc:flex-col sc:items-center sc:gap-[18px] sc:[font-size:16px] sc:font-medium" role="status">
      <span key={playback.runKey} className="sc-tr-feedback-check-circle sc:grid sc:[place-items:center] sc:size-16 sc:rounded-full sc:text-primary-foreground sc:bg-primary sc:[&_>_svg]:size-9 sc:[&_path]:[stroke:currentColor] sc:[&_path]:[stroke-width:2.5] sc:[&_path]:[stroke-linecap:round] sc:[&_path]:[stroke-linejoin:round] sc:[&_path]:[stroke-dasharray:1] sc:[&_path]:[stroke-dashoffset:0] sc:[&[data-play='true']]:animate-[sc-tr-feedback-check-enter_500ms_var(--feedback-ease)_both,_sc-tr-feedback-check-bob_500ms_cubic-bezier(.34,_1.35,_.64,_1)_both] sc:[&[data-play='true']_path]:animate-[sc-tr-feedback-check-draw_500ms_var(--feedback-ease)_80ms_both]" data-play={playback.playing} aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none"><path d="m8 16 5 5 11-11" pathLength="1" /></svg>
      </span>
      <span>操作成功</span>
    </div>
  </DemoFrame>;
}

export function OrganicShimmer(props: TransitionDemoProps) {
  const playback = usePlayback(props, Infinity);
  return <DemoFrame {...playback} controls={<Button type="button" variant="outline" size="sm" disabled={playback.stopped}
    onClick={playback.playing ? playback.stop : playback.play}>
    {playback.playing ? <Pause data-icon="inline-start" aria-hidden="true" /> : <Play data-icon="inline-start" aria-hidden="true" />}
    {playback.playing ? "停止流光" : "播放流光"}
  </Button>}>
    <div key={playback.runKey} className="sc-tr-feedback-organic sc:relative sc:w-40 sc:[aspect-ratio:1] sc:isolate sc:overflow-hidden sc:rounded-[calc(var(--radius)_+_4px)] sc:bg-muted sc:[&[data-play='true']_.sc-tr-feedback-organic-light]:opacity-100 sc:[&[data-play='true']_.sc-tr-feedback-organic-light]:animate-[sc-tr-feedback-organic-sweep_3000ms_ease-out_infinite]" data-play={playback.playing} role="status" aria-label="有机流光占位演示">
      <span className="sc-tr-feedback-organic-field sc:absolute sc:inset-0 sc:[background:radial-gradient(ellipse_at_25%_70%,_color-mix(in_oklab,_var(--primary)_9%,_var(--muted)),_transparent_65%),_radial-gradient(ellipse_at_80%_15%,_color-mix(in_oklab,_var(--chart-2)_8%,_var(--muted)),_transparent_65%)]" aria-hidden="true" />
      <span className="sc-tr-feedback-organic-light sc:absolute sc:inset-[-90%] sc:pointer-events-none sc:opacity-0 sc:[background:radial-gradient(ellipse_28%_38%_at_39%_42%,_transparent_46%,_var(--muted)_85%),_linear-gradient(135deg,_var(--muted)_32%,_transparent_48%,_transparent_52%,_var(--muted)_68%)] sc:[transform:translate(-36%,_-36%)]" aria-hidden="true" />
    </div>
  </DemoFrame>;
}

export function SkeletonLoaderAndReveal(props: TransitionDemoProps) {
  const playback = usePlayback(props, 1000);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="重新加载内容" />}>
    <div className="sc-tr-feedback-profile-wrap sc:relative sc:w-[min(100%,_380px)] sc:min-h-18" aria-busy={playback.playing}>
      <div className="sc-tr-feedback-profile-skeleton sc:flex sc:items-center sc:gap-[14px] sc:w-full sc:min-h-18 sc:[transition:opacity_400ms_ease-in-out,_filter_400ms_ease-in-out,_visibility_0s_linear] sc:absolute sc:inset-0 sc:[&[data-visible='true']_[data-slot='skeleton']]:animate-[sc-tr-feedback-skeleton-pulse_1000ms_ease-in-out_1] sc:[&[data-visible='false']_[data-slot='skeleton']]:animate-none sc:[&[data-visible='false']]:opacity-0 sc:[&[data-visible='false']]:[filter:blur(2px)] sc:[&[data-visible='false']]:invisible sc:[&[data-visible='false']]:[transition-delay:0s,_0s,_400ms]" aria-hidden="true" data-visible={playback.playing}>
        <Skeleton className="sc:size-11 sc:rounded-full" />
        <div className="sc:flex sc:flex-col sc:gap-2"><Skeleton className="sc:h-3 sc:w-24" /><Skeleton className="sc:h-3 sc:w-36" /></div>
      </div>
      <div className="sc-tr-feedback-profile sc:flex sc:items-center sc:gap-[14px] sc:w-full sc:min-h-18 sc:[transition:opacity_400ms_ease-in-out,_filter_400ms_ease-in-out,_visibility_0s_linear] sc:[&[data-visible='false']]:opacity-0 sc:[&[data-visible='false']]:[filter:blur(2px)] sc:[&[data-visible='false']]:invisible sc:[&_>_div]:flex sc:[&_>_div]:flex-col sc:[&_>_div]:gap-1 sc:[&_>_div]:min-w-0 sc:[&_strong]:[font-size:15px] sc:[&_strong]:font-semibold sc:[&_>_div_>_span]:text-muted-foreground sc:[&_>_div_>_span]:[font-size:12px] sc:[&_>_div_>_span]:leading-[1.5] sc:[&_>_[data-slot='badge']]:ml-auto sc:at-most-480:flex-wrap" data-visible={!playback.playing} aria-hidden={playback.playing}>
        <span className="sc-tr-feedback-profile-avatar sc:size-11 sc:[flex:none] sc:rounded-full sc:grid sc:[place-items:center] sc:bg-secondary sc:text-secondary-foreground sc:[font-size:16px] sc:font-semibold" aria-hidden="true">林</span>
        <div><strong>林沐</strong><span>产品设计 · 项目成员</span></div>
        <Badge variant="secondary">已就绪</Badge>
      </div>
      <span className="sc:sr-only" role="status">{playback.playing ? "正在加载成员信息" : "成员信息加载完成"}</span>
    </div>
  </DemoFrame>;
}

export function TextsReveal(props: TransitionDemoProps) {
  const playback = usePlayback(props, 580);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="重播文字进入" />}>
    <div key={playback.runKey} className="sc-tr-feedback-text-reveal sc:flex sc:flex-col sc:items-center sc:gap-3 sc:text-center sc:[&_>_strong]:[font-size:clamp(23px,_4vw,_30px)] sc:[&_>_strong]:font-semibold sc:[&_>_strong]:[letter-spacing:-.02em] sc:[&_>_strong]:leading-[1.4] sc:[&_>_p]:text-muted-foreground sc:[&_>_p]:[font-size:14px] sc:[&_>_p]:leading-[1.7] sc:[&[data-play='true']_>_strong]:animate-[sc-tr-feedback-rise_500ms_var(--feedback-ease)_both] sc:[&[data-play='true']_>_p]:animate-[sc-tr-feedback-rise_500ms_var(--feedback-ease)_40ms_both]" data-play={playback.playing}>
      <strong>方案已准备就绪</strong><p>从清晰的方向，走向下一次发布。</p>
    </div>
  </DemoFrame>;
}

export function ShimmerText(props: TransitionDemoProps) {
  const playback = usePlayback(props, Infinity);
  return <DemoFrame {...playback} controls={<Button type="button" variant="outline" size="sm" disabled={playback.stopped}
    onClick={playback.playing ? playback.stop : playback.play}>
    {playback.playing ? <Pause data-icon="inline-start" aria-hidden="true" /> : <Play data-icon="inline-start" aria-hidden="true" />}
    {playback.playing ? "停止文字流光" : "播放文字流光"}
  </Button>}>
    <span key={playback.runKey} className="sc-tr-feedback-shimmer-text sc:[font-size:clamp(21px,_4vw,_28px)] sc:font-medium sc:text-foreground sc:[&[data-play='true']]:text-transparent sc:[&[data-play='true']]:[background:linear-gradient(100deg,_var(--muted-foreground)_34%,_var(--foreground)_47%,_var(--primary)_50%,_var(--muted-foreground)_63%)] sc:[&[data-play='true']]:[background-size:250%_100%] sc:[&[data-play='true']]:[background-clip:text] sc:[&[data-play='true']]:[-webkit-background-clip:text] sc:[&[data-play='true']]:animate-[sc-tr-feedback-text-sweep_2000ms_linear_infinite]" data-play={playback.playing}>正在整理灵感</span>
  </DemoFrame>;
}

export function SpinnerToCheckMorph(props: TransitionDemoProps) {
  const playback = usePlayback(props, 600);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="运行演示任务" />}>
    <Card className="sc:w-full sc:max-w-sm">
      <CardHeader><CardTitle>整理项目资源</CardTitle><CardDescription>示例任务，不发送网络请求</CardDescription></CardHeader>
      <CardContent><div className="sc-tr-feedback-task-row sc:flex sc:items-center sc:gap-3 sc:[font-size:14px] sc:min-h-8" role="status">
        <span className="sc-tr-feedback-task-icon sc:grid sc:[place-items:center] sc:size-[30px] sc:[flex:none] sc:text-primary" data-complete={!playback.playing}>
          <span className="sc-tr-feedback-morph sc:size-6 sc:relative sc:grid sc:[place-items:center] sc:[&[data-complete='true']]:animate-[sc-tr-feedback-morph-bob_550ms_cubic-bezier(.34,_1.35,_.64,_1)_both] sc:[&[data-complete='true']_.sc-tr-feedback-morph-ring]:opacity-0 sc:[&[data-complete='true']_.sc-tr-feedback-morph-ring]:animate-none sc:[&[data-complete='true']_.sc-tr-feedback-morph-disc]:opacity-100 sc:[&[data-complete='true']_path]:[stroke-dashoffset:0]" data-complete={!playback.playing} aria-hidden="true">
            <span className="sc-tr-feedback-morph-ring sc:absolute sc:inset-0 sc:[border:2px_solid_var(--border)] sc:[border-top-color:var(--primary)] sc:rounded-full sc:animate-[sc-tr-feedback-morph-spin_900ms_linear_infinite] sc:[transition:opacity_175ms_ease]" />
            <span className="sc-tr-feedback-morph-disc sc:absolute sc:inset-0 sc:bg-primary sc:rounded-full sc:opacity-0 sc:[transition:opacity_350ms_cubic-bezier(.34,_1.35,_.64,_1)]" />
            <svg className="sc-tr-feedback-morph-check sc:size-5 sc:relative sc:text-primary-foreground sc:[&_path]:[stroke:currentColor] sc:[&_path]:[stroke-width:1.8] sc:[&_path]:[stroke-linecap:round] sc:[&_path]:[stroke-linejoin:round] sc:[&_path]:[stroke-dasharray:1] sc:[&_path]:[stroke-dashoffset:1] sc:[&_path]:[transition:stroke-dashoffset_600ms_var(--feedback-ease)_230ms]" viewBox="0 0 20 20" fill="none"><path d="m5 10 3 3 7-7" pathLength="1" /></svg>
          </span>
        </span><span>{playback.playing ? "正在整理 8 组资源" : "8 组资源已整理完成"}</span>
      </div></CardContent>
      <CardFooter><Badge variant="secondary">{playback.playing ? "处理中" : "已完成"}</Badge></CardFooter>
    </Card>
  </DemoFrame>;
}

export function SpinningCounter(props: TransitionDemoProps) {
  const playback = usePlayback(props, 1900);
  const [number, setNumber] = useState(248);
  const digits = String(number).padStart(3, "0");
  return <DemoFrame {...playback} controls={<Button type="button" size="sm" onClick={() => {
    setNumber(value => value >= 985 ? 125 : value + 37); playback.play();
  }}>增加计数</Button>}>
    <div className="sc-tr-feedback-counter sc:flex sc:flex-col sc:items-center sc:gap-[14px] sc:min-w-0" role="status" aria-label={`计数 ${number}`}>
      <span key={playback.runKey + number} className="sc-tr-feedback-reel-group sc:inline-flex sc:[font-size:clamp(42px,_7vw,_64px)] sc:leading-[1.2] sc:font-semibold sc:[letter-spacing:-.035em] sc:tabular-nums sc:[&[data-play='true']_.sc-tr-feedback-reel]:animate-[sc-tr-feedback-reel-spin_1400ms_cubic-bezier(.16,_1,_.3,_1)_both] sc:[&[data-play='true']_.sc-tr-feedback-reel]:[animation-delay:calc(var(--feedback-order)_*_180ms)]" data-play={playback.playing} aria-hidden="true">
        {Array.from(digits).map((digit, index) => <span key={index} className="sc-tr-feedback-reel-window sc:block sc:w-[.68em] sc:h-[1.2em] sc:overflow-hidden">
          <span className="sc-tr-feedback-reel sc:flex sc:flex-col sc:[transform:translateY(calc(var(--feedback-digit)_*_-1.2em))] sc:[&_>_span]:block sc:[&_>_span]:h-[1.2em] sc:[&_>_span]:[flex:none] sc:[&_>_span]:text-center" style={{ "--feedback-digit": 20 + Number(digit), "--feedback-order": index } as React.CSSProperties}>
            {Array.from({ length: 30 }, (_, row) => <span key={row}>{row % 10}</span>)}
          </span>
        </span>)}
      </span>
      <span className="sc-tr-feedback-caption sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.6]">次更新 · 演示计数</span>
    </div>
  </DemoFrame>;
}

export function ProGradientText(props: TransitionDemoProps) {
  const playback = usePlayback(props, Infinity);
  return <DemoFrame {...playback} controls={<Button type="button" variant="outline" size="sm" disabled={playback.stopped}
    onClick={playback.playing ? playback.stop : playback.play}>
    {playback.playing ? <Pause data-icon="inline-start" aria-hidden="true" /> : <Play data-icon="inline-start" aria-hidden="true" />}
    {playback.playing ? "停止渐变流动" : "播放渐变流动"}
  </Button>}>
    <div className="sc-tr-feedback-gradient-wrap sc:flex sc:flex-col sc:items-center sc:gap-[14px] sc:min-w-0">
      <span key={playback.runKey} className="sc-tr-feedback-gradient-text sc:text-primary sc:[font-size:clamp(36px,_7vw,_64px)] sc:leading-[1.3] sc:font-semibold sc:[letter-spacing:-.035em] sc:[&[data-play='true']]:text-transparent sc:[&[data-play='true']]:[background:radial-gradient(ellipse_at_20%_30%,_var(--chart-2),_transparent_60%),_radial-gradient(ellipse_at_80%_70%,_var(--chart-3),_transparent_60%),_linear-gradient(120deg,_var(--primary),_var(--chart-2),_var(--primary))] sc:[&[data-play='true']]:[background-size:180%_180%,_180%_180%,_200%_200%] sc:[&[data-play='true']]:[background-clip:text] sc:[&[data-play='true']]:[-webkit-background-clip:text] sc:[&[data-play='true']]:animate-[sc-tr-feedback-gradient-drift_5000ms_ease-in-out_infinite,_sc-tr-feedback-gradient-tone_4000ms_linear_infinite]" data-play={playback.playing}>专业体验</span>
      <span className="sc-tr-feedback-caption sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.6]">使用当前主题的品牌语义色</span>
    </div>
  </DemoFrame>;
}

const thinkingMessages = ["正在理解目标", "正在比较可行方案", "方案已准备就绪"];
export function ThinkingStates(props: TransitionDemoProps) {
  const playback = usePlayback(props, 6000);
  const step = useSteps(playback.playing, playback.runKey, 3, 2000);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="重播思考状态" />}>
    <div className="sc-tr-feedback-thinking sc:flex sc:items-center sc:justify-center sc:flex-wrap sc:gap-3 sc:min-w-0 sc:[&_>_svg]:size-[21px] sc:[&_>_svg]:[flex:none] sc:[&_>_svg]:text-primary" role="status">
      {playback.playing ? <Sparkles aria-hidden="true" /> : <FolderCheck aria-hidden="true" />}
      <SwapText value={thinkingMessages[step]} playing={playback.playing} runKey={playback.runKey} thinking />
      <Badge variant="secondary">{playback.playing ? "处理中" : "已完成"}</Badge>
    </div>
  </DemoFrame>;
}

const reasoningLines = [
  "先确认目标，再拆解需要完成的任务。",
  "将页面结构与交互状态分别列出。",
  "检查浅色、深色与键盘操作的一致性。",
  "为每个状态选择清晰的视觉反馈。",
  "合并检查结果，准备可执行的方案。",
  "方案已就绪，可以开始下一步。",
];
export function ReasoningStream(props: TransitionDemoProps) {
  const playback = usePlayback(props, 3600);
  const step = useSteps(playback.playing, playback.runKey, 3, 1400);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="重播推理摘要" />}>
    <div className="sc-tr-feedback-reasoning sc:w-[min(100%,_440px)] sc:min-w-0 sc:flex sc:flex-col sc:gap-5">
      <div className="sc-tr-feedback-reasoning-header sc:flex sc:items-center sc:gap-[10px] sc:[font-size:13px] sc:text-muted-foreground sc:[&_>_svg]:size-[17px] sc:[&_>_svg]:[flex:none] sc:[&_>_svg]:text-primary sc:[&_>_[data-slot='badge']]:ml-auto"><FileCheck2 aria-hidden="true" /><span>处理摘要 · 示例内容</span><Badge variant="secondary">{step + 1} / 3</Badge></div>
      <div className="sc-tr-feedback-reasoning-window sc:h-[3.4em] sc:overflow-hidden sc:[font-size:15px] sc:leading-[1.7] sc:[mask-image:linear-gradient(to_bottom,_transparent,_black_12%,_black_82%,_transparent)] sc:at-most-480:[font-size:13px]" aria-hidden="true">
        <div className="sc-tr-feedback-reasoning-track sc:[transform:translateY(calc(var(--feedback-step)_*_-3.4em))] sc:[transition:transform_500ms_var(--feedback-ease)] sc:[&_>_p]:m-0 sc:[&_>_p]:min-h-[1.7em] sc:[&_>_p]:leading-[1.7] sc:[&_>_p]:overflow-hidden sc:[&_>_p]:whitespace-nowrap sc:[&_>_p]:[text-overflow:ellipsis]" style={{ "--feedback-step": step } as React.CSSProperties}>
          {reasoningLines.map(line => <p key={line}>{line}</p>)}
        </div>
      </div>
      <span className="sc:sr-only" role="status">{reasoningLines.slice(step * 2, step * 2 + 2).join(" ")}</span>
    </div>
  </DemoFrame>;
}

const streamWords = ["好的，", "我们可以", "先梳理", "内容结构，", "再补齐", "关键状态。", "通过", "一致的", "组件与动效，", "让每次", "操作反馈", "都清晰可见。"];
export function StreamingText(props: TransitionDemoProps) {
  const playback = usePlayback(props, 1150);
  return <DemoFrame {...playback} controls={<Replay onClick={playback.play} stopped={playback.stopped} label="重播流式文字" />}>
    <div className="sc-tr-feedback-stream sc:flex sc:flex-col sc:items-start sc:w-[min(100%,_440px)] sc:gap-5 sc:[&_>_p]:m-0 sc:[&_>_p]:[font-size:16px] sc:[&_>_p]:leading-[2] sc:[&_>_p_>_span]:inline-block sc:[&_>_p[data-play='true']_>_span]:animate-[sc-tr-feedback-word-in_350ms_var(--feedback-ease)_both] sc:[&_>_p[data-play='true']_>_span]:[animation-delay:calc(var(--feedback-order)_*_65ms)]">
      <Badge variant="secondary">流式输出演示</Badge>
      <p key={playback.runKey} data-play={playback.playing} aria-hidden="true">
        {streamWords.map((word, index) => <span key={word} style={{ "--feedback-order": index } as React.CSSProperties}>{word}</span>)}
      </p>
      <span className="sc:sr-only">{streamWords.join("")}</span>
      <span className="sc:sr-only" role="status">{playback.playing ? "正在显示示例文字" : "示例文字已完整显示"}</span>
    </div>
  </DemoFrame>;
}

const matrixNames = ["扫描", "闪烁", "环绕", "呼吸"];
export function MatrixDotLoader(props: TransitionDemoProps) {
  const playback = usePlayback(props, Infinity);
  const [variant, setVariant] = useState(0);
  return <DemoFrame {...playback} controls={<>
    <Button type="button" variant="outline" size="sm" onClick={() => { setVariant(value => (value + 1) % 4); playback.play(); }}>切换图案：{matrixNames[variant]}</Button>
    <Button type="button" size="sm" disabled={playback.stopped} onClick={playback.playing ? playback.stop : playback.play}>
      {playback.playing ? "停止动画" : "开始动画"}
    </Button>
  </>}>
    <div className="sc-tr-feedback-matrix-wrap sc:flex sc:flex-col sc:items-center sc:gap-[14px] sc:min-w-0" role="status" aria-label={playback.playing ? `${matrixNames[variant]}加载动画演示` : "加载动画已停止"}>
      <div key={playback.runKey + variant} className="sc-tr-feedback-matrix sc:grid sc:[grid-template-columns:repeat(4,_8px)] sc:gap-2 sc:p-3 sc:[&_>_i]:size-2 sc:[&_>_i]:block sc:[&_>_i]:rounded-full sc:[&_>_i]:bg-border sc:[&_>_i[data-gap='true']]:invisible sc:[&[data-play='true']_>_i]:animate-[sc-tr-feedback-dot-scan_1200ms_ease-in-out_infinite] sc:[&[data-play='true']_>_i]:[animation-delay:var(--feedback-delay)] sc:[&[data-play='true'][data-variant='1']_>_i]:[animation-name:sc-tr-feedback-dot-twinkle] sc:[&[data-play='true'][data-variant='2']_>_i]:[animation-name:sc-tr-feedback-dot-orbit] sc:[&[data-play='true'][data-variant='3']_>_i]:[animation-name:sc-tr-feedback-dot-pulse] sc:[&[data-play='true']_>_i[data-static='true']]:animate-none sc:[&[data-play='true']_>_i[data-gap='true']]:animate-none" data-play={playback.playing} data-variant={variant} aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => {
          const row = Math.floor(index / 4), col = index % 4;
          const orbitIndex = [1, 2, 7, 11, 14, 13, 8, 4].indexOf(index);
          const center = (row === 1 || row === 2) && (col === 1 || col === 2);
          const delay = variant === 0 ? col * 120
            : variant === 1 ? ((index * 7 + 3) % 16) * 75
              : variant === 2 ? Math.max(0, orbitIndex) * 150
                : center ? 0 : 192;
          const corner = (row === 0 || row === 3) && (col === 0 || col === 3);
          return <i key={index} data-gap={variant >= 2 && corner} data-static={variant === 2 && center}
            style={{ "--feedback-delay": `${delay}ms` } as React.CSSProperties} />;
        })}
      </div>
      <span className="sc-tr-feedback-caption sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.6]">{matrixNames[variant]} · {playback.playing ? "演示中" : "已停止"}</span>
    </div>
  </DemoFrame>;
}

export function ImageGenerationPlaceholder(props: TransitionDemoProps) {
  const playback = usePlayback(props, Infinity);
  return <DemoFrame {...playback} controls={<Button type="button" variant="outline" size="sm" disabled={playback.stopped}
    onClick={playback.playing ? playback.stop : playback.play}>{playback.playing ? "显示生成结果" : "生成示例图像"}</Button>}>
    <figure className="sc-tr-feedback-image-generation sc:w-[min(100%,_280px)] sc:m-0 sc:flex sc:flex-col sc:gap-[14px] sc:items-center sc:[&_>_figcaption]:[font-size:13px] sc:[&_>_figcaption]:text-muted-foreground sc:[&_>_figcaption]:leading-[1.6]" aria-busy={playback.playing}>
      <div className="sc-tr-feedback-image-frame sc:w-full sc:[aspect-ratio:1] sc:relative sc:overflow-hidden sc:rounded-[calc(var(--radius)_+_4px)] sc:bg-muted sc:[&_>_img]:size-full sc:[&_>_img]:object-cover sc:[&_>_img]:opacity-0 sc:[&_>_img]:[filter:blur(3px)] sc:[&_>_img]:[transition:opacity_650ms_var(--feedback-ease),_filter_650ms_var(--feedback-ease)] sc:[&[data-complete='true']_>_img]:opacity-100 sc:[&[data-complete='true']_>_img]:[filter:blur(0)] sc:[&[data-complete='true']_.sc-tr-feedback-image-dots]:opacity-0 sc:[&[data-complete='true']_.sc-tr-feedback-image-dots]:[filter:blur(3px)] sc:[&[data-complete='true']_.sc-tr-feedback-image-dots_>_i]:animate-none" data-complete={!playback.playing}>
        <div key={playback.runKey} className="sc-tr-feedback-image-dots sc:absolute sc:inset-0 sc:grid sc:[grid-template-columns:repeat(28,_1fr)] sc:gap-1 sc:p-2 sc:items-center sc:justify-items-center sc:[transition:opacity_650ms_var(--feedback-ease),_filter_650ms_var(--feedback-ease)] sc:[&_>_i]:block sc:[&_>_i]:size-[2px] sc:[&_>_i]:rounded-full sc:[&_>_i]:bg-muted-foreground sc:[&_>_i]:opacity-40 sc:[&_>_i]:animate-[sc-tr-feedback-image-dot_var(--feedback-dot-duration)_ease-in-out_infinite] sc:[&_>_i]:[animation-delay:var(--feedback-delay)]" aria-hidden="true">
          {Array.from({ length: 784 }, (_, index) => <i key={index} style={{ "--feedback-delay": `${-((index * 193 + 71) % 6000)}ms`,
            "--feedback-dot-duration": `${1260 + (index * 137) % 280}ms` } as React.CSSProperties} />)}
        </div>
        <img src="/docs/transition-assets/sample-artwork.svg" alt="抽象几何图形生成结果，演示图像" width="240" height="180" />
      </div>
      <figcaption role="status">{playback.playing ? "正在生成示例图像" : "示例图像已生成"}</figcaption>
    </figure>
  </DemoFrame>;
}

export const feedbackDemos: Record<string, React.ComponentType<TransitionDemoProps>> = {
  "number-pop-in": NumberPopIn,
  "notification-badge": NotificationBadge,
  "text-states-swap": TextStatesSwap,
  "success-check": SuccessCheck,
  "organic-shimmer": OrganicShimmer,
  "skeleton-loader-and-reveal": SkeletonLoaderAndReveal,
  "texts-reveal": TextsReveal,
  "shimmer-text": ShimmerText,
  "spinner-to-check-morph": SpinnerToCheckMorph,
  "spinning-counter": SpinningCounter,
  "pro-gradient-text": ProGradientText,
  "thinking-states": ThinkingStates,
  "reasoning-stream": ReasoningStream,
  "streaming-text": StreamingText,
  "matrix-dot-loader": MatrixDotLoader,
  "image-generation-placeholder": ImageGenerationPlaceholder,
};
