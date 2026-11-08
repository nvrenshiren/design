# Pro 动效细化：图片展开、烟雾消散与彩屑

日期：2026-10-19。本轮在既有 43 项 Transitions 的基础上，继续细化三项 Pro 公开演示的运动轨迹、材质连续性与交互。三项均采用自主 CSS3 实现，React 负责状态、几何测量和必要的轨迹预计算，没有新增逐帧脚本引擎或依赖。品牌配置、Logo 三色、27 个 shadcn 基础组件和每模式 41 个主题变量保持不变。

**本记录的迁移前 Pro 构建曾有 433 项通过、0 失败／浏览器错误、12 张截图及独立 `ship`，0 项实质待修复。** 此后已执行全系统 Tailwind 迁移；当前接入已在下节同步，迁移验证状态另见 [Tailwind 迁移记录](tailwind-migration-2026-10-19.md)。本页 433 项与截图只证明迁移前版本，更早 407 项也保留其历史范围。

## 来源与观测方法

仅操作 [图片展开](https://transitions.dev/detail.html?t=image-open-tilt)、[烟雾消散](https://transitions.dev/detail.html?t=delete-with-smoky-dissolve)、[彩屑反馈](https://transitions.dev/detail.html?t=confetti-burst) 的公开 Preview。通过独立 Chromium 记录 DOM 几何、computed style、CSSAnimation 时间和公开 Canvas 的可见像素；没有打开 recipe／代码页、登录 Pro 或读取付费私有源码。

CSS 的精确时长与缓动可直接记录；Canvas 的位移、透明度和随机彩屑只是本次采样的可见结果，不能据此宣称获得私有算法。采样使用实际经过的时间，截图可能另有调用延迟。局部确定性截图通过暂停／定位浏览器 CSSAnimation 获得，仅为质量检查，不是产品运行机制。

## 三项具体改进

### 图片展开 · Image open tilt

| 项目 | 公开预览观测 | 本轮实现 |
| --- | --- | --- |
| 进入 | 缩略图 66×48，展开 220×160，比例约 `.3`；450ms `cubic-bezier(.22,1,.36,1)` | 读取真实缩略图和目标矩形，从原位投影到弹窗图像；桌面保持 `.3` 比例，440px 最大宽度，使用自有 3:2 图形 |
| 深度与曲面 | 初始 `translateZ(-70px)`，经过约 `-28px` 后归零；图像纹理与轮廓一起弯曲 | 48 条共享整图坐标的 CSS 纹理列，位移与切线倾斜组成连续曲面；稳定后交回一张普通图像 |
| 收回 | 350ms `cubic-bezier(.34,1.25,.64,1)`，轻微回缩越界后落定 | 点击图像、关闭按钮、外部或 Escape 沿原路径收回；提前关闭／再次展开从当前画面继续，减少姿态跳变 |
| 指针与语义 | 本轮开态移动指针及边角点击未观测到 `rotateX/rotateY` | 移除缺乏观察依据的 hover 旋转；保留 Radix Dialog 的标题、焦点保护、Escape 和关闭后焦点返回 |

首次打开的 Portal 起点测量曾落在元素挂载之前，已改为从图像平面的挂载回调准备源矩形，先提交真实起点再进入 CSS 过渡。功能断言成功不能代替这一空间起点检查。

另对弯曲中间帧进行白／黑背景对照，定位到列边缘的透明抗锯齿接缝；列重叠由 `.85px` 调整为 **4 个源图像像素**，保留同一整图尺寸与坐标。相同诊断场景的 25,984 个内部像素不再随背景变化；这只证明该接缝场景，不能外推所有缩放、像素密度或设备。

这是对公开 Canvas 曲面的 CSS 近似；品牌矢量图、3:2 比例与可访问 Dialog 是明确适配，不宣称逐像素一致。系统／用户暂停时打开的图像直接落定为可读平面，关闭立即完成。

### 烟雾消散 · Delete with smoky dissolve

公开预览的照片持续保持一个整体，在约 0.5 秒中逐步柔化、顺时针转动约 3°，并下移至原图高度的约 20%；不是分别旋转的大碎片。采样透明度约为：64ms `.952`、110ms `.865`、196ms `.679`、311ms `.389`、511ms `.021`。

本轮改为 **540ms 连续整图消散**：一张语义图像与一层预先挂载的整图位移背景交接，CSS 驱动渐进模糊、透明度、3° 转动与 32.8px 下沉，后者对应本地 164px 图像高度的 20%。局部 SVG 位移场固定为 `5.2px`，只服务这项烟化材质，没有独立运动的 SVG 原语或额外装饰颗粒。

已去掉细分网格造成的棋盘纹与首次挂载开销。最终观察中无 576 个粒子元素，启动与 CSS 时间线的差约为 12ms；旧尝试约 87ms。上述数值来自当前执行宿主的单次 Chromium 观测，不是跨设备性能承诺。0ms 与原图仅记录到边缘光栅差异，不写作“像素完全相同”。

`animationend` 决定“已移除”的状态交接，780ms 定时器仅在外部 CSS 或浏览器没有发出结束事件时兜底。恢复／重放取消旧交接，暂停与减少动效直接完成移除，并保留状态播报及还原操作。自有平涂 SVG 与原照片的细节材质不同；静态 SVG 位移加 CSS 交接近似持续变化的 Canvas 场，不复制其私有噪声算法。

### 彩屑完成反馈 · Confetti burst

公开预览是覆盖整个舞台的雨幕，纸片分别碰到按钮或底面；约 1 秒已有纸片到达底面，约 1.6–2.4 秒多数停在表面，随机一轮约 3–4 秒清空。此前固定 48 片汇向中部、共用回弹时点的轨迹已替换。

本轮根据真实舞台与按钮矩形，在每次交互时预计算 **38–88 片**有界轨迹，再交给 CSS3 播放。各片具有不同的开始位置、释放延迟、速度、重力、横向摆动、空气阻力、碰撞回弹和自转；按钮外的纸片继续下落，按钮边缘的纸片可滑落到底面，不会被强制吸向中心。准确碰撞节点与约 66.7ms 轨迹节点共同组成 CSS 关键帧。

小纸片使用双面颜色、Z 自转、Y 翻面和少量 X 倾角；最后一次低能量碰撞后再经过 80–170ms 折平，随后驻留并各自淡出，约 3–4 秒完成。颜色只读取现有 `primary`、`chart-2`、`chart-3` 及背景角色。重复点击替换当前一组，重放创建新组；暂停、减少动效、隐藏、舞台离屏和尺寸变化清理整组图层及样式。

CSS 轨迹是自主近似，不会逐片复现随机 Canvas 路径。响应式舞台及中文按钮的相对宽度不同，手机按钮自然接住更多纸片。迁移前 Pro 桌面观察的一组动态样式约 **368KB**、强制样式解析约 **13.1ms**，这保留为旧机制的历史观测；当前已改为结构化 frames 经 CSSOM/adopted sheet，不能沿用旧数值或据此宣称更快。真实低性能手机尚未验证，不声称全设备 60fps 或无成本运行。

## 模块与接入

| 组件 | 直接导入模块 | 当前样式来源 |
| --- | --- | --- |
| `ImageOpenTilt` | `@/transitions/pro-image` | JSX `sc:` 工具类与正式静态关键帧 |
| `DeleteWithSmokyDissolve` | `@/transitions/pro-smoke` | JSX `sc:` 工具类与正式静态关键帧 |
| `ConfettiBurst` | `@/transitions/pro-confetti` | JSX `sc:` 工具类与结构化 `MotionStyles` |

三项从 `effects.tsx` 分拆为独立模块，`effects.tsx` 保留兼容导出及原有画廊映射；目录与复制用法改为直接模块。组件数量仍为 43，其中 42 项 CSS3，拖放一项配合 Anime.js 4.5.0；这三项不新增 Anime.js 依赖。

```tsx
import { ImageOpenTilt } from "@/transitions/pro-image"

export function Example() {
  return <ImageOpenTilt stopped={false} replayKey={0} />
}
```

复制所需模块、`hooks.ts`、`types.ts` 及引用的 shadcn 基础组件，让 Tailwind 扫描源码，并接入 `@theme` 语义映射、variant 与 `motion.config.mjs`／正式关键帧插件及 `theme/tailwind-breakpoints.mjs` 的有序含边界变体；不再导入已删除的组件 CSS。彩屑需 `lib/motion-styles.tsx`，通过实例 CSSOM/adopted sheet 播放有限 frames。图片需部署自有图形并同步源码路径。API 保持 `TransitionDemoProps { stopped: boolean; replayKey: number }`，系统减少动效与页面隐藏由 Hook 处理；局部／全局暂停及离屏由画廊传入。完整当前接入见 [迁移记录](tailwind-migration-2026-10-19.md)。

## Pro 构建验证（迁移前历史）

```sh
pnpm build
pnpm check
pnpm test:pro
pnpm test:transitions
pnpm test:browser
pnpm test:brand
pnpm test:motion
```

该迁移前构建的 `pnpm build` 与 `pnpm check` 通过；当时脚本报告预览 JS 为 1671.6kB。以下五组检查均针对该轮最终整合构建，报告均无浏览器运行错误：

| 检查 | 通过 | 失败 | 覆盖重点 |
| --- | --- | --- | --- |
| `test:pro` | 26 | 0 | 三项实际几何、曲面／材质中间帧、碰撞分流、交互中断、浅深主题、窄屏、键盘和减少动效 |
| `test:transitions` | 325 | 0 | 43 项真实挂载、状态、参数与键盘／浮层回归 |
| `test:browser` | 26 | 0 | 页面、局部主题与双体系隔离 |
| `test:brand` | 18 | 0 | 品牌语义、实体操作三态、链接与焦点 |
| `test:motion` | 38 | 0 | 原 27 项动效参考及 Orb／Beam 预设 |
| 合计 | **433** | **0** | 当前记录的 Chromium Web 场景 |

检查减少动效时还发现一处公共状态缺陷：Ant Design 首次由正常动效切到 `motion: false` 会插入上下文 Provider，导致文档 Shell 子树重建。本轮通过**公开 `ConfigProvider`** 的固定外层动效边界与内层 `inherit: false` 真实主题，让结构保持稳定；没有使用 Ant Design 内部 API 或新增第三方补丁。实测首次暂停、恢复和系统减少动效后，同一 Input 的未保存值继续存在，同一打开的图片 Dialog 直接落定；Ant Design 正常 200／300ms 动画及 motion token 的 true／false 切换也保持有效。这份附加诊断为 `pro-official-motion-boundary-validation.json`，`passed: true`、`errors: []`，不另加到上述 433 项数量。

### 本轮截图与设计检测

已保存 **12 张**当前构建截图：1440×1200 桌面与 375×1800 手机，各含浅／深主题和三项效果。为明确呈现材质中间态，QA 将图片定位到 75ms、烟雾 180ms、彩屑 650ms；只有检查脚本操作 CSSAnimation，产品仍由 CSS 自行播放。

| 组件 | 浅色桌面 | 深色桌面 | 浅色手机 | 深色手机 |
| --- | --- | --- | --- | --- |
| 图片连续曲面 | [查看](transition-assets/pro-refinement-image-light-desktop.png) | [查看](transition-assets/pro-refinement-image-dark-desktop.png) | [查看](transition-assets/pro-refinement-image-light-mobile.png) | [查看](transition-assets/pro-refinement-image-dark-mobile.png) |
| 连续整图烟化 | [查看](transition-assets/pro-refinement-smoke-light-desktop.png) | [查看](transition-assets/pro-refinement-smoke-dark-desktop.png) | [查看](transition-assets/pro-refinement-smoke-light-mobile.png) | [查看](transition-assets/pro-refinement-smoke-dark-mobile.png) |
| 双面纸片雨幕 | [查看](transition-assets/pro-refinement-confetti-light-desktop.png) | [查看](transition-assets/pro-refinement-confetti-dark-desktop.png) | [查看](transition-assets/pro-refinement-confetti-light-mobile.png) | [查看](transition-assets/pro-refinement-confetti-dark-mobile.png) |

截图均已嵌入 Origin 来源信息，内部清单为 `pro-refinement-captures.json`。公开目录来源扫描为 **32 张栅格图、0 张缺失来源**，包含历史 20 张与本轮 12 张，不代表本轮新拍 32 张。本轮只运行一次设计检测，原始 **4 项**发现均是未改动标本已有的局部弹性：头像组、卡片堆叠、喜欢按钮与开关；逐项意图记录在 `pro-refinement-detector-resolution.json`，机械待修复项为 **0**。烟雾中局部静态位移场另有明确材质用途记录，不扩展为全局装饰颗粒例外；不将检测写作“零发现”。

### 独立终审

新的独立审阅已完成，五节报告 `.impeccable/review/pro-refinement-finish-review.md` 判定 **`ship`，0 项实质待修复**。审阅者实际逐张查看全部 12 张当前截图，以及三项官网／本地对应阶段图像；核对公开观测、源码／目录／兼容入口、433 项既有结果、Origin 来源、四项检测意图和公开 `ConfigProvider` 稳定性证据。该只读审阅没有另启浏览器、重跑测试、截图或 detector。

结论限于记录的 Chromium Web 场景和自主 CSS 近似；真实低性能手机、多浏览器、全部像素密度及完整辅助技术覆盖仍为有限验证，不能外推全设备 60fps、私有算法或逐像素一致。局部原始证据保存在 `.impeccable/review/pro-image-refinement.json`、`pro-smoke-refinement.json`、`pro-confetti-refinement.json`；这些内部文件和终审报告不作为静态站公开下载。

本轮只覆盖实际记录的 Chromium Web 场景。历史入口见 [43 项官网逐项核对](transitions-fidelity-2026-10-19.md) 与 [最初 43 项实现记录](shadcn-transitions-2026-10-19.md)。
