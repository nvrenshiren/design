# 自有样式迁移到 Tailwind CSS

日期：2026-10-19。用户明确要求将整套设计系统的自有样式迁移到 Tailwind；本轮已执行代码迁移，覆盖文档站、shadcn 组件与 Transitions、原 27 项动效参考、BorderBeam 和可选基础／ThinkingOrb 样式。品牌、Logo 三色、语义主题、43 项扩展、27 个 shadcn 基础组件与既有交互／动画参数保留。

**代码迁移与修复已完成：确认构建 433 项回归通过，最终断点／接入说明构建另有 180 项专项通过，均 0 失败／浏览器错误；两组属于不同构建，不能合称同一构建全套 613 项。** 已保存 18 张有来源的新截图，新的独立终审判定 **`ship`，0 项实质待修复**。此前 407 项／15 张与 Pro 433 项／12 张终审仅证明各自迁移前版本。

## 样式来源与编译边界

| 范围 | 维护位置 | 编译／运行方式 |
| --- | --- | --- |
| 文档基础、外壳及 Ant Design 演示布局 | `preview/foundation.tailwind.css` 的 `doc:` 基线与 JSX 的 `tw:` 工具类；`preview/tailwind.css` 为显式布局入口 | 合并输出 `preview/tailwind.generated.css`；`doc:` 保留低权重非分层默认规则，重要 `tw:` 工具类负责显式组件／布局，Ant Design 官方 reset 与 CSS-in-JS 保留 |
| shadcn 基础组件、文档内容及 43 项 Transitions | 源码中的 `sc:` 工具类；`preview/shadcn.css` 的 `@theme`、`@custom-variant` 和来源声明 | Tailwind 编译后通过 `CSSStyleSheet`／`adoptedStyleSheets` 放入开放 ShadowRoot；Portal 保留同主题作用域 |
| 63 个静态动效关键帧 | `preview/shadcn/transitions/motion.config.mjs` 的结构化配置 | `theme/tailwind-motion.mjs` 正式插件仅生成 `@keyframes`；布局、状态与响应式规则仍在 JSX 工具类中 |
| 按舞台几何变化的彩屑轨迹 | `pro-confetti.tsx` 的有限轨迹数据；`preview/shadcn/lib/motion-styles.tsx` | `MotionStyles` 使用结构化 frames，经 CSSOM 写入实例拥有的 adopted sheet；浏览器 CSS3 插值，卸载／重放清理 |
| 原 27 项动效参考 | `reference/transitions/classes.mjs` 的 `mr:` 类组合与 `motions.mjs` 动效配置 | Tailwind 生成 `vendor/motion-reference.css` 和兼容的 `vendor/transitions.css`，原入口与行为保留 |
| BorderBeam | `reference/border-beam/classes.ts` 的 `bb:` 工具类及有类型的动效模型 | Tailwind 样式编入独立品牌参考资源，保持预设和生命周期 |
| 可选基础样式与 ThinkingOrb | `styles/cohesion-base.classes.mjs` 的 `cb:` 类组合；`styles/cohesion-base.css` 为 Tailwind 入口 | `scripts/sync-preview.mjs` 生成 `dist/css/cohesion-base.css` 与类模块镜像；消费者加载编译样式并应用类组合 |

本轮没有新增依赖，没有引入 UnoCSS。自有普通选择器的样式已写入使用处的工具类；没有把整组旧规则藏进新的 `rules` 对象、`@apply` 或插件来冒充迁移。静态关键帧属于动画配置，动态几何、索引与状态派生值通过 CSS 自定义属性传入。生成 CSS、主题变量、第三方官方样式及结构化动效关键帧仍然存在，不能将本轮描述为“不再使用 CSS”。

## 删除的旧自有样式入口

本轮移除 10 个旧自有选择器样式文件，迁移清单对应约 1041 个选择器：文档 2 个文件／490 个，shadcn 8 个文件／551 个。该数值是迁移清单中的原规则统计，不是运行时元素数、工具类数或测试数。

```text
preview/styles.css
preview/components-showcase.css
preview/shadcn-showcase.css
preview/shadcn/transitions/gallery.css
preview/shadcn/transitions/layout.css
preview/shadcn/transitions/feedback.css
preview/shadcn/transitions/effects.css
preview/shadcn/transitions/pro-image.css
preview/shadcn/transitions/pro-smoke.css
preview/shadcn/transitions/pro-confetti.css
```

这些路径不再是当前接入方式。`ds-*`、`sc-tr-*` 等既有 DOM hook 可为测试与语义定位保留，不能据此推断其对应旧 CSS 仍需加载。构建与静态资源清单同步到新的生成入口；不手工修改生成 CSS 或 JS。

## 当前源码接入

Transitions 组件的 `TransitionDemoProps { stopped: boolean; replayKey: number }`、三项 Pro 独立模块和 `effects.tsx` 兼容导出不变。复制所需组件、`hooks.ts`、`types.ts`、所用 shadcn 基础组件及图形资源，将源码加入应用 Tailwind 扫描范围；接入 `@theme` 语义映射、`motion.config.mjs`／`theme/tailwind-motion.mjs` 静态关键帧插件及 `theme/tailwind-breakpoints.mjs` 响应式 variant。无需导入已删除的同名组件 CSS，画廊复制提示也已同步。

```tsx
import { ImageOpenTilt } from "@/transitions/pro-image"

export function Example() {
  return <ImageOpenTilt stopped={false} replayKey={0} />
}
```

图片采用原有自有 SVG 路径；需要在目标应用部署对应资源并同步引用。彩屑还需 `lib/motion-styles.tsx`，它在 Document 或 ShadowRoot 中为本实例添加有限关键帧并清理；组件不再拼接或渲染 `<style>` 字符串。拖放仍需要现有 Anime.js 4.5.0，通知仍需要 Sonner 2.0.8；这些不是本轮新增依赖。

本仓库实际使用 **6 个前缀**：`doc:` 是低权重基础，`tw:` 是重要显式布局／组件工具类，`sc:`／`mr:`／`bb:`／`cb:` 分别隔离对应组件与参考。复制到采用其他前缀的产品时，正式 Tailwind 配置与源码类名须同步，不要同时运行另一套 UnoCSS 或复制文档外壳。单一 shadcn 产品通常使用自己的全局 Tailwind，双体系预览的 ShadowRoot 不是产品必需结构。

响应式规则采用正式 `tailwind-breakpoints.mjs` 插件，从宽到窄注册 12 个含边界的 `at-most-N` 变体：1250、1199、1100、1023、1000、900、767、700、500、480、440、360px；5 个有关 Tailwind 入口引用它。较窄规则在多个条件同时成立时继续覆盖较宽规则，避免原 arbitrary 媒体变体的排序改变。`doc:` 基线入口不需要这些响应式变体。

基础／Orb 的分发不能只加载旧类名：先加载 `dist/css/cohesion-base.css`，再从 `dist/css/cohesion-base.classes.mjs` 读取并应用类组合；详见 [分发接入说明](../dist/README.md)。原 27 项参考使用预编译 `mr:` 样式，保持历史 hook DOM 兼容；新 Transitions 仍是直接挂载的 React 组件。

## 旧版基线与当前验证

```sh
pnpm build
pnpm check
pnpm check:styles
pnpm test:browser
pnpm test:brand
pnpm test:motion
pnpm test:transitions
pnpm test:pro
pnpm test:breakpoints
```

`pnpm check` 与 `pnpm check:styles` 已在最终构建通过。源码约束覆盖 **6 个正式指令入口、10 个退役选择器 CSS 不再存在、80 个组件／配置源文件**；主题快照、编译产物和第三方内部样式有各自边界。

迁移前已真实保存 **24 份 DOM／计算样式快照与 16 张 PNG**：6 条路由（overview、Ant Design、shadcn、Transitions、patterns、motion）× 浅／深主题 × 桌面／手机；截图为全部 12 个桌面状态与 overview／shadcn 的 4 个手机状态，不能写作所有 24 个状态均有截图。采样通过冻结的迁移前资源集运行，旧 `preview/app.js` SHA-256 为：

```text
c8d5546cb56ce88657cbf47b941c49a305d4890aadc3b06b4e0f4f580bbe37e1
```

内部基线为 `.impeccable/review/tailwind-baseline-render-manifest.json`，不是重新构建当前源码后声称的“旧截图”。确认轮完成同范围 **24 份 DOM／16 张 PNG** 对照，清单为 `tailwind-after-render-manifest.json`，该轮 JS SHA-256 为 `7fde0262d9e3565ff2613900817d817542a17a90616d1dadc400d8b37e119b66`。没有横向溢出页或 ShadowRoot 语义角色变化；差异记录保留原始序列化与几何值，不能写成逐像素完全一致。

### 回归与修复的构建范围

首轮迁移回归为 **430／433 项通过，3 项失败**：浅深 Accordion 的原生旋转与局部 scaleY 叠加，以及旧输入清空参考没有保留预期播放状态。这些原始结果保留在 `tailwind-first-round/` 与确认总表，没有覆盖成首轮全过。实际对照还发现全局链接基线覆盖 Ant Design 锚点按钮前景、手机页签背景从 72px 缩成 36px、FieldDescription 顶部间距变化，均已修复。

确认构建 `7fde0262…19b66` 完成以下整批回归，报告均无浏览器运行错误：

| 检查 | 通过 | 失败 |
| --- | ---: | ---: |
| Transitions | 325 | 0 |
| 常规页面 | 26 | 0 |
| 品牌 | 18 | 0 |
| 原动效／品牌预设 | 38 | 0 |
| Pro | 26 | 0 |
| 确认构建合计 | **433** | **0** |

确认轮对照仍发现 **375px 的画廊筛选由原单列 335px 变为双列**，属于媒体规则排序回归。最终修正改为上述正式 `at-most-N` 插件，并同步画廊接入说明。最终构建 JS 为 **1896.6kB**、`app.css` **2.8kB**，完整 SHA-256 为：

```text
f9afd88531a25ebcc0791fc3bfd4ee81252bc5f76016b34854d58b9e6372310b
```

该最终构建另跑 `test:breakpoints`：**18 个宽度 × 2 主题 × 5 属性 = 180 项通过，0 失败、0 浏览器错误**。范围包括 375px 单列 335px、500／501px 精确边界、767／768px 页签、外壳内边距、主区域分栏及溢出。内部报告为 `tailwind-breakpoint-validation.json`；它是已知级联缺陷的专项确认，没有在最终构建重跑上述整批 433 项。因此只分别报告 433 与 180，不将二者表述为同一构建全部 613 项。

以上尺寸不代表所有样式合计或性能提升。文档工具类另有生成表，shadcn 样式嵌入 JS，旧参考与品牌资源有独立文件；不能只比较 `app.css` 就宣称整体变小。

### 当前公开截图与来源

本轮公开 **18 张**：确认构建 16 张与最终构建 375px 画廊浅深 2 张，全部嵌入 Origin。桌面 1440×1200，手机 375×1800。公开目录来源扫描为 **50 张、0 缺失**，其中历史 32 张加本轮 18 张，不能写成本轮新拍 50 张。

| 场景 | 浅色 | 深色 |
| --- | --- | --- |
| 确认桌面概览 | [查看](transition-assets/tailwind-after-overview-light-desktop.png) | [查看](transition-assets/tailwind-after-overview-dark-desktop.png) |
| 确认桌面 Ant Design | [查看](transition-assets/tailwind-after-antd-light-desktop.png) | [查看](transition-assets/tailwind-after-antd-dark-desktop.png) |
| 确认桌面 shadcn | [查看](transition-assets/tailwind-after-shadcn-light-desktop.png) | [查看](transition-assets/tailwind-after-shadcn-dark-desktop.png) |
| 确认桌面 Transitions | [查看](transition-assets/tailwind-after-transitions-light-desktop.png) | [查看](transition-assets/tailwind-after-transitions-dark-desktop.png) |
| 确认桌面场景 | [查看](transition-assets/tailwind-after-patterns-light-desktop.png) | [查看](transition-assets/tailwind-after-patterns-dark-desktop.png) |
| 确认桌面动效 | [查看](transition-assets/tailwind-after-motion-light-desktop.png) | [查看](transition-assets/tailwind-after-motion-dark-desktop.png) |
| 确认手机概览 | [查看](transition-assets/tailwind-after-overview-light-mobile.png) | [查看](transition-assets/tailwind-after-overview-dark-mobile.png) |
| 确认手机 shadcn | [查看](transition-assets/tailwind-after-shadcn-light-mobile.png) | [查看](transition-assets/tailwind-after-shadcn-dark-mobile.png) |
| 最终手机单列筛选 | [查看](transition-assets/tailwind-final-gallery-light-mobile.png) | [查看](transition-assets/tailwind-final-gallery-dark-mobile.png) |

### 设计检测与独立终审

本轮只运行 **1 次 detector，原始 218 项**：6 项 layout-transition 为正则跨过工具类后误读较后媒体 max-width／height；3 项文字渐变与 2 项弹性属于用户要求保留的原参考标本；207 项颜色是已有 BorderBeam 品牌实验 palette 数据，40 场景模型等价检查证明其仍为原参考，未新增常规产品主题色。逐项处理见 `tailwind-detector-resolution.json`，**机械待修复 0 项**；不写作“零发现”。

新的五节独立报告 `.impeccable/review/tailwind-finish-review.md` 已完成，结论为 **`ship`，0 项实质待修复**。审阅者实际逐张查看全部 18 张本轮截图和 4 张冻结基线代表图，逐文件核对 18 张 Origin；核对源码编译链、433／180 的不同构建范围、来源目录和 218 项检测处置。该只读审阅没有另开浏览器、重跑构建／测试、截图、来源扫描或 detector。内部运行报告与终审原文不作为静态站公开下载；本文公开截图与范围摘要可直接查阅。

迁移记录遵循既有边界：只对实际 Chromium Web 场景给出结论，不将一次桌面或模拟手机观测外推真实低性能设备、全部浏览器、完整辅助技术或稳定帧率。动效继续优先 CSS3，需要动态脚本补间时优先 Anime.js。
