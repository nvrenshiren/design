# COHESION 逐科设计系统

版本 **2.0.0**。面向内容、工具与服务的公司级设计系统，分别展示 **Ant Design 6.6.6** 与 **shadcn/ui new-york / neutral** 基础上的真实组件和 COHESION 品牌主题，提供主题、交互预览与可追溯的接入资源。

系统沿用成熟组件库已经定义好的排版、尺寸、间距、圆角、层级和交互，在正式主题配置中维护品牌、状态和可读性定制。两套体系共享品牌语义，通过各自的正式主题入口映射到组件；官方预设作为基础保留。产品选定组件体系后，在内部保持一致。

## 内容与使用方式

| 入口 | 内容 |
| --- | --- |
| 概览 | 系统原则、产品组合与统一的设计基础 |
| 色彩与主题 | 固定 Logo 资产色、功能语义色、浅深主题和官方预设对照 |
| 字体与排版 | 正文、标题、辅助信息、数字和长内容的层级 |
| 布局与层级 | 间距、密度、圆角、表面与信息分组 |
| Ant Design 组件 | 操作、输入、导航、反馈和数据展示 |
| shadcn/ui | 基于 Neutral 的 COHESION 浅深主题、真实源码组件、资料偏好产品组合与 43 项 Transitions 扩展 |
| 场景模式 | 内容管理、账号设置、移动服务的可操作组合示例 |
| 动效 | 官方时长与缓动、组件过渡、27 类原有参考、完整品牌预设 |
| 工程接入 | 主题配置、Token 文件与分发资源 |

预览支持浅色、深色、跟随系统与减少动效；紧凑模式属于 Ant Design 的算法，shadcn/ui 保留其默认尺寸并明确说明。场景均为演示数据，没有业务后端；多数状态保留于当前页面，shadcn 的资料偏好会保存在本机 localStorage。

## Ant Design 官方默认与品牌定制

### 保留的官方基础

以下数值来自锁定版本的 `theme.getDesignToken()`。主题算法会根据模式派生完整 Token；紧凑模式使用 `compactAlgorithm`，不会靠一组独立手写值模拟。

| 基础 | Ant Design 6.6.6 默认 |
| --- | --- |
| 正文与辅助文字 | `fontSize: 14`、`fontSizeSM: 12` |
| 标题 | `fontSizeHeading1: 38`、`Heading2: 30`、`Heading3: 24` |
| 字体 | 官方系统字体栈；代码使用 `fontFamilyCode` |
| 控件高度 | 小／默认／大：`24 / 32 / 40` CSS px |
| 间距基准 | `sizeUnit: 4`；具体间距取派生 Token |
| 圆角 | 小／默认／大：`4 / 6 / 8` CSS px |
| 阴影与层级 | 官方 `boxShadow*`、背景与边界角色 |
| 动效时长 | `motionDurationFast / Mid / Slow`：`100 / 200 / 300 ms` |
| 动效缓动 | 官方 `motionEase*` |
| 交互与图标 | Ant Design 组件、`@ant-design/icons` |

这些是组件默认基础，页面构图仍按任务组织。标题层级、内容宽度和分栏应服务阅读与操作；不要求每个页面都使用同一种卡片、固定栅格或统一最大宽度。

### 正式定制

Ant Design 配置入口是 [`theme/cohesion-theme.json`](theme/cohesion-theme.json)，运行时与导出共用 [`theme/create-theme.mjs`](theme/create-theme.mjs)。

| 项目 | 规则 |
| --- | --- |
| Logo 三色 | 固定 `#42A136`、`#B1C640`、`#17A4BD`，用于品牌资产与品牌实验 |
| UI 主色与链接 | 浅色种子 `#167C4B`；深色种子 `#5CB889`；最终状态色由官方算法派生 |
| 功能语义 | 成功、警告、错误、信息保留官方语义家族，不能因主色为绿而合并为同一用途 |
| 可读性 | 在官方算法之后，对未达到配置阈值的正文、占位符、语义文字、实心按钮及主色浅填充做必要修正 |
| 深色主按钮 | `Button.primaryColor` 使用官方深色容器色，与亮主色背景配合 |

Logo 色不直接充当正文、链接和操作状态色。深色种子也不是深色主按钮的最终色值；当前深色派生主色为 `#519f77`，主按钮前景为 `#141414`，实际值以 `getCohesionTokens()` 与生成快照为准。组件覆盖通过 `ConfigProvider.theme.components` 管理，避免另写一套全局 `.ant-*` 数值覆盖。

可读性算法保留可用的原值，只修正失败的组合。脚本检查记录保存在生成快照中；禁用态与纯装饰色有独立用途，不按正文阈值误判。Token 检查不能替代真实页面的键盘、辅助技术、缩放与交互验证。

## shadcn/ui 官方基础与品牌主题

入口为 `#shadcn`，包含“预设与 token”“组件与状态”“产品组合”“Transitions 动效”四个页签。采用官方 `@shadcn` registry、`new-york` 样式、`neutral` 基础与 Radix 交互，组件由 CLI `4.22.0` 加入源码。用户确认两套体系应表达同一品牌，因此当前页面使用 **COHESION 品牌主题**；官方 Neutral 原值单独保留用于溯源和对照。

- [`theme/shadcn-preset.json`](theme/shadcn-preset.json)：完整保留官方 Neutral 浅深预设、尺寸基准和来源。
- `theme/create-shadcn-theme.mjs`：从共享 `theme/cohesion-theme.json` 派生品牌角色，再映射到 shadcn 的语义变量。
- [`theme/shadcn-tokens.json`](theme/shadcn-tokens.json)：每模式 41 个语义／圆角变量的生成快照，不是手工配置入口。
- `preview/shadcn/components/ui/`：27 个官方基础源码组件，保留其 variants；按钮和输入等增加 React 18 ref 兼容。本轮增加 Accordion、Collapsible、Avatar、InputGroup、Progress 和 Sonner。
- `preview/shadcn/transitions/`：43 项自主编写的 React 交互扩展，按用途分类，组合上述基础组件。
- `preview/shadcn.css`：Tailwind 4.3.3 标准基础与语义映射，utility 使用 `sc:` 前缀。
- `preview/foundation.tailwind.css`／`preview/tailwind.css`：`doc:` 低权重基线与 `tw:` 重要显式布局，合并生成 `preview/tailwind.generated.css`。自有普通样式写在工具类，静态动效和有序 `at-most-N` 断点由正式插件维护；[完整迁移与接入](docs/tailwind-migration-2026-10-19.md)。
- `scripts/generate-shadcn-tokens.mjs`：调用主题工厂，同时生成 JSON 快照与 `preview/shadcn/tokens.css`，`--check` 不写入文件。

shadcn/ui 的组件尺寸、排版和交互组合由官方组件源码与 Tailwind 预设共同提供；41 个变量是其语义颜色与圆角层，不与 Ant Design 的 536 个解析 token 强行一一对应。主操作及 hover／active、链接三态、选中背景、焦点、侧栏、表面和图表角色从共享品牌配置派生。危险文字 `destructive` 与实体危险操作 `destructive-solid` 分开，实体操作具有独立前景及三态；Button／Badge 使用不透明状态色，键盘焦点保留实色轮廓。其余中性基础与官方比例保留。

双体系文档采用开放 ShadowRoot 隔离 Tailwind preflight 和 Ant Design reset。Dialog、AlertDialog、Select、菜单与 Tooltip 的 Portal 留在对应作用域，主题与键盘焦点随组件上下文。编译器为 ShadowRoot 中不生效的 Tailwind `@property` 注册补充局部初值；不向全局注册样式。普通 shadcn 产品可按官方方式使用全局 Tailwind，无需照搬文档隔离层。

本预览的 Radix 键盘适配位于 `scripts/radix-shadow-focus.mjs`：构建时让指定上游焦点辅助函数读取 ShadowRoot 内的实际焦点，修复菜单 Home／方向键停在末项的问题；菜单顺序与 Escape 焦点返回均有回归检查。适配校验精确依赖版本及替换次数，升级不匹配会中断构建；不修改安装包或浏览器原型。

在目标产品中使用官方 CLI 添加源码，按框架与 React 版本核查兼容性。预览采用 React 18，已记录相应的 ref 适配；本仓库没有把 shadcn/ui 声称为一个独立版本的运行时组件包。

```sh
pnpm dlx shadcn@4.22.0 init
pnpm dlx shadcn@4.22.0 add @shadcn/button @shadcn/card @shadcn/dialog
```

官方来源：[主题](https://ui.shadcn.com/docs/theming)、[组件接入](https://ui.shadcn.com/docs/installation)。Logo 图形与三色在两套体系下保持一致；`neutral` 是基础来源，实际品牌主题以工厂与生成快照为准。

### Transitions 交互扩展

[打开 Transitions 动效](http://127.0.0.1:8766/#shadcn?tab=transitions&item=card-resize)。本地目录对应 [Transitions.dev 的 43 项公开演示](https://transitions.dev/detail.html?t=card-resize)，包括 32 项 Free 和 11 项 Pro 公开演示的自主实现；这些是 COHESION 扩展，不是 shadcn/ui 官方新增组件或上游 Pro 源码。按“布局与导航、浮层与通知、输入与操作、反馈与智能状态、数字与文本、视觉与交互”六类组织，可搜索、选择、重放、暂停及通过 `item` 深链定位。

按照用户确认的实现顺序，42 项使用 CSS3 过渡／关键帧；拖放落位使用 CSS3，并由 [Anime.js 4.5.0](https://animejs.com/documentation) 以公开观测的 500ms 弹性曲线直接归位，目标内的图像以 400ms 淡入。React 负责状态和事件；交互结果不依赖动画是否运行。全部 43 项直接组合于 shadcn 主题作用域，无 iframe，复用语义颜色、默认尺寸、Radix 浮层与焦点规则；Sonner 2.0.8 的样式及主题也保留在同一作用域。

各导出组件接受 `TransitionDemoProps`：`stopped: boolean` 用于减少动效，`replayKey: number` 的变化用于再次演示。共同 Hook 在独立接入时也监听系统减少动效与页面隐藏；文档画廊另控制舞台离屏和局部／全局暂停。增加 key 会触发组件定义的状态变化，不需要销毁整个组件。

```tsx
import * as React from "react"
import { CardResize } from "@/transitions/layout"

export function Example() {
  const [replayKey, setReplayKey] = React.useState(0)
  return <>
    <CardResize stopped={false} replayKey={replayKey} />
    <button onClick={() => setReplayKey(key => key + 1)}>重放</button>
  </>
}
```

接入时复制所需模块、`hooks.ts`、`types.ts` 及引用的 shadcn 基础组件，让 Tailwind 扫描源码，并接入正式语义映射、variant 与 `motion.config.mjs`／`theme/tailwind-motion.mjs` 关键帧插件，并注册 `theme/tailwind-breakpoints.mjs` 的有序含边界变体。普通样式已在 JSX 的 `sc:` 工具类中，不再导入同名组件 CSS。`effects.tsx` 的拖放依赖现有 Anime.js，`layout.tsx` 的通知依赖 Sonner；图片、烟雾、彩屑分别位于 `pro-image`、`pro-smoke`、`pro-confetti`，保留 `effects` 兼容导出。彩屑还需 `lib/motion-styles.tsx` 的结构化 CSSOM 关键帧支持；图形资源路径应在产品中部署。前缀与配置须一致，普通产品无需复制文档画廊或 ShadowRoot 外壳。当前方式见 [Tailwind 迁移与接入](docs/tailwind-migration-2026-10-19.md)；目录见 [Transitions 实现记录](docs/shadcn-transitions-2026-10-19.md)，历史运动核对与 Pro 细化分别保留各自验证范围。

## 本地运行

需要 Node.js `>=22.13.0` 与仓库锁定的 pnpm `11.6.0`。预览使用 React／ReactDOM `18.3.1`，构建使用 esbuild `0.28.2`。

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm serve --port 8766
```

打开 [本地预览](http://127.0.0.1:8766/)。服务仅监听 `127.0.0.1`；已有服务占用端口时可更换 `--port`。请通过 HTTP 服务访问，主题配置和下载资源不以双击 `index.html` 的方式接入。

```sh
# 修改正式主题配置或算法后，重新生成并验证 Token
node scripts/generate-antd-tokens.mjs
node scripts/generate-shadcn-tokens.mjs

# 修改预览源码后重新构建
pnpm build

# 校验预览构建与生成镜像，命令不会写入文件
pnpm check

# 单独校验主题导出；旧命令 tokens/sync-tokens.mjs 仍可使用
node scripts/generate-antd-tokens.mjs --check
```

## Ant Design React 产品接入

安装与本仓库一致的依赖，把 `theme/` 复制到应用源码中。使用应用自己的 React 实例和构建工具；产品不需要加载本仓库预览的 React UMD 文件。

```sh
pnpm add --save-exact antd@6.6.6 @ant-design/icons@6.3.4 react@18.3.1 react-dom@18.3.1
```

```jsx
import React from 'react';
import { App as AntApp, Button, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import { createCohesionTheme } from './theme/create-theme.mjs';

function Workspace() {
  const { token } = theme.useToken();
  const { message } = AntApp.useApp();
  return (
    <main style={{ padding: token.paddingLG, background: token.colorBgContainer }}>
      <Button type="primary" onClick={() => message.success('更改已保存')}>
        保存更改
      </Button>
    </main>
  );
}

export default function Product() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={createCohesionTheme({
        mode: 'light',
        compact: false,
        reducedMotion: false,
      })}
    >
      <AntApp><Workspace /></AntApp>
    </ConfigProvider>
  );
}
```

`mode` 接受 `light | dark`，`compact` 控制密度，`reducedMotion` 传入应用解析出的系统偏好或用户选择。工厂负责生成主题配置，系统主题监听、偏好持久化和 SSR 首屏策略由应用管理。可参考 `dist/react/hooks.jsx` 中的 `useCohesionTheme()` 与 `useReducedMotion()`。

需要消息、通知或确认对话框时，使用 `App.useApp()` 或官方 Hook，让它们继承当前主题上下文。静态 `message.xxx`、`Modal.xxx` 等方法不一定能读取业务根部的 `ConfigProvider`。主题用法见 [Ant Design 官方说明](https://ant.design/docs/react/customize-theme/)。

## Ant Design Token 导出与自有组件

React 组件内部优先通过 `theme.useToken()` 读取当前上下文。非 React 页面、自有 CSS 组件或跨技术栈交换可使用生成文件：

- [`tokens/tokens.css`](tokens/tokens.css)：官方 Token 的 `--ant-token-*` CSS 变量与旧版 `--color-*`、`--zk-*` 等兼容别名。
- [`tokens/tokens.json`](tokens/tokens.json)：四种模式的官方基线、定制结果、差异与对比度检查记录。
- [`dist/`](dist/README.md)：可复制的主题、Token 和品牌动效参考资源。

```html
<html data-theme="light" data-density="comfortable">
  <head><link rel="stylesheet" href="./tokens/tokens.css"></head>
</html>
```

```css
.product-surface {
  padding: var(--ant-token-padding-lg);
  border-radius: var(--ant-token-border-radius-lg);
  background: var(--ant-token-color-bg-container);
  color: var(--ant-token-color-text);
}
```

生成 CSS 通过 `data-theme="light|dark"` 和 `data-density="comfortable|compact"` 选择模式。它提供变量，不会单独创建 Ant Design 组件、行为或主题监听。JSON 是本项目的派生快照格式，不声明为 DTCG 标准，也不是原生平台资源包。

旧 CSS 别名和 `dist/cohesion-tailwind.preset.js` 为已有项目保留；新 Ant Design 页面优先使用正式主题与官方 Token，不把旧色阶、Tailwind 适配器或演示样式发展为另一套事实源。

## 动效规则

默认组件动效沿用官方 `100 / 200 / 300 ms` 与缓动预设：即时反馈快速、局部变化清晰、较大空间转换平稳。动效解释变化、层级和状态，结果同时通过文字或静态视觉表达。

系统开启减少动态效果或用户暂停时，Ant Design 主题使用 `motion: false`；shadcn 的独立作用域使有限出入场立即完成、循环静止并关闭过渡，避免弹窗冻结在透明首帧；预览同时停止额外的位移、加载旋转和品牌循环。连续动效不自动散布到所有内容区域。

动效页的「组件动效参考」恢复原库全部 **27 类**，包含 15 个 JavaScript 控制器与 12 个 CSS 片段。一次只挂载一个独立 iframe 舞台，可选择、操作和重放；主题语义通过变量传入，原参考样式不覆盖 Ant Design 或 shadcn 组件。

新增的 **43 项 shadcn Transitions 扩展**位于 shadcn/ui 的独立页签，采用 CSS3 优先、动态补间优先 Anime.js 的策略。它们与上述 27 类历史参考入口分别维护；新组件不会加载历史参考 iframe 或控制器。

`ThinkingOrb` 与 `BorderBeam` 收纳在「品牌实验」，分别提供完整 **9 种智能状态**与 **5 种边框预设**，用于确有品牌表达需要的场景。它们是可选参考组件，不改变基础组件的内置行为。局部暂停服从全局偏好，切换与卸载清理循环及控制器。使用资源依赖、暂停与卸载方式见 [`dist/README.md`](dist/README.md)。

## 架构与维护

```text
theme/cohesion-theme.json             品牌、模式、可读性策略的配置入口
theme/create-theme.mjs                Ant Design 算法组合与可读性扩展
theme/shadcn-preset.json              shadcn 官方 Neutral 原值与来源
theme/create-shadcn-theme.mjs         共享品牌到 shadcn 语义角色的映射
theme/shadcn-tokens.json              shadcn COHESION 品牌主题生成快照
preview/shadcn/                      shadcn 源码、主题作用域与生成 CSS
preview/shadcn/transitions/          43 项交互扩展、工具类与结构化动效配置
preview/shadcn.css                   仅注入 ShadowRoot 的 Tailwind 入口
theme/tailwind-motion.mjs            只生成静态 keyframes 的正式插件
theme/tailwind-breakpoints.mjs       从宽到窄、有边界的响应式 variant
scripts/generate-antd-tokens.mjs       派生、检查并导出四种模式
tokens/                              生成的 CSS 与 JSON
preview/src/                         React 预览源码、基础规范与场景示例
preview/foundation.tailwind.css      doc: 低权重默认基线
preview/tailwind.css                 文档 tw: 显式工具类的正式入口
preview/tailwind.generated.css       文档工具类编译产物
preview/app.js + app.css              esbuild 生成的静态预览产物
styles/cohesion-base.css              cb: 工具类编译入口，配合类组合模块
vendor/                              固定版本的 React 与可选品牌动效资源
dist/                                可复制分发文件；不是可清空的构建临时目录
reference/                           品牌动效的参考源码
platforms.md                         跨端适配目标与实现边界
```

预览把 Ant Design 编译进 `app.js`，并桥接已固定的全局 React 实例，避免重复加载 React。组件样式仍由 Ant Design 的运行时样式系统生成；静态预览构建不等同于启用了 Ant Design `zeroRuntime`。

维护时从正式配置、JSX 工具类与结构化动效源码修改，再执行生成、构建和校验。不要直接编辑 Token、`preview/app.js`／`app.css`、`tailwind.generated.css`、`vendor/motion-reference.css` 或分发镜像。可选基础／Orb 需加载编译后的 `dist/css/cohesion-base.css` 并应用 `cohesion-base.classes.mjs` 类组合；详见 [分发说明](dist/README.md)。升级 Ant Design 时同时审查官方默认变化、主题差异、对比度记录、组件行为和四种模式。

设计延续规则见 [`DESIGN.md`](DESIGN.md)，重设计决定见[重设计记录](docs/design-system-redesign-2026-10-19.md)，色系与既有动效修正见[品牌主题与动效记录](docs/shadcn-brand-and-motion-2026-10-19.md)，新增扩展见[Transitions 实现记录](docs/shadcn-transitions-2026-10-19.md)。

## 浏览器回归检查

```sh
# 首次安装浏览器（宿主已有时无需重复）
pnpm exec playwright install chromium
pnpm build
pnpm test:browser --screenshots
pnpm test:brand
pnpm test:motion
pnpm test:transitions
pnpm test:pro
pnpm check:styles
pnpm test:breakpoints
```

检查编译后的真实页面，默认启动临时本地服务。常规检查覆盖父浅／深与舒适／紧凑下的局部浅深主题、主按钮三态、消息上下文、shadcn 三页签与表单／弹层／菜单、窄屏和双体系样式隔离。品牌检查补充共享主题生成链、实体操作三态与链接、可见焦点、选中态和实际键盘路径；动效检查覆盖原有参考、品牌预设和暂停后的状态。结果与可选截图写入 `.impeccable/review/`；`COHESION_PREVIEW_URL` 可指定已运行的预览。此检查补充 token 导出校验，不代替真实辅助技术与设备验收。

`test:transitions` 验证 43 项目录、真实交互及运行参数；`test:pro` 验证三项 Pro 的几何、中间帧和中断。Tailwind 迁移的确认构建（`7fde0262…19b66`）**433 项通过、0 失败／浏览器错误**，并与冻结旧版对照 24 份 DOM／16 张截图。对照仍发现 375px 筛选列级联问题，最终改为正式有序 `at-most-N` 插件；最终构建（`f9afd885…2310b`）另有 **180 项断点专项通过、0 错误**，`check`／`check:styles` 通过。两组来自不同构建，不能合称同构建全套 613 项。本轮共 **18 张**有来源截图；单次 detector 原始 218 项均记录误报／原参考用途，机械待修复 0。新的五节独立报告 `.impeccable/review/tailwind-finish-review.md` 逐张审阅 18 张本轮图与 4 张基线代表，核对构建范围、来源与检测处置，判定 **ship，0 项实质待修复**；未另开浏览器、重测或检测。完整范围见 [迁移记录](docs/tailwind-migration-2026-10-19.md)。

迁移前 Pro 细化版本共 433 项通过、0 失败／浏览器错误、12 张新截图，独立终审 ship；公共 `ConfigProvider` 稳定动效边界的附加诊断也通过。这些是迁移前历史，不能证明新样式实现通过，范围见 [Pro 动效细化](docs/pro-transitions-refinement-2026-10-19.md)。

历史全量核对版本的 Transitions 325 项、常规 26 项、品牌 18 项、历史动效 38 项共 407 项通过，0 失败、0 浏览器运行错误，保存 15 张新截图；目录三处说明修正后独立 Verdict Pass 判定 **ship**，原 fix 报告完整保留。该轮设计检测的 9 项局部弹性提示逐项记录意图。上述检查及截图仅证明当时构建，不代替本轮三项 Pro 改动的验证；详见 [43 项核对记录](docs/transitions-fidelity-2026-10-19.md)。首轮 305／387 项与更早的 ship 也保留在历史实现记录中。

独立嵌套主题示例必须显式设置 `theme: { ...createCohesionTheme(...), inherit: false }`，以免 ConfigProvider 合并父级的组件覆盖。例如，暗色 `Button.primaryColor` 不应传入浅色样例。常规只调整局部 token 的子主题则可继续按需继承。

## 能力边界

当前交付是 Web 设计系统文档、React 预览、主题工厂、CSS／JSON Token 与参考分发资源。它没有独立发布为 npm 组件库，没有附带 Figma 文件、业务后端、原生 APP／小程序组件、平台转换器或经过声明的最低浏览器支持矩阵。

移动服务是响应式 Web 演示。原生和小程序应共享品牌语义与设计意图，并采用各自的布局单位、输入习惯、导航、字体缩放与安全区实现；详见 [`platforms.md`](platforms.md)。

第三方资源的权利按各自随附许可执行。仓库尚未指定独立项目许可证；对外分发前应由维护者确定适用许可。

shadcn/ui 组件源码遵循其 [MIT 许可](vendor/shadcn-ui.LICENSE.txt)，同一许可也随源码保存在 `preview/shadcn/LICENSE.md`；来源为 [shadcn-ui/ui 官方许可](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)。这不改变仓库自身尚未指定的项目许可。
