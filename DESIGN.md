---
name: "COHESION 逐科设计系统"
description: "以 Ant Design 6.6.6 与 shadcn/ui 官方基础映射共享 COHESION 品牌，为内容、工具与服务提供可复用的 Web 设计规范。"
colors:
  primary: "#167c4b"
  primary-hover: "#2d8558"
  primary-active: "#0b5735"
  primary-bg: "#ecefed"
  primary-border: "#6ca383"
  text: "rgba(0,0,0,0.88)"
  text-secondary: "rgba(0,0,0,0.65)"
  text-tertiary: "rgba(0,0,0,0.541)"
  placeholder: "rgba(0,0,0,0.541)"
  layout: "#f5f5f5"
  container: "#ffffff"
  elevated: "#ffffff"
  border: "#d9d9d9"
  divider: "#f0f0f0"
  success-text: "#368011"
  warning-text: "#96670c"
  error-text: "#ca3d3f"
  info-text: "#1369e2"
  dark-primary: "#519f77"
  dark-text: "rgba(255,255,255,0.85)"
  dark-layout: "#000000"
  dark-container: "#141414"
  dark-elevated: "#1f1f1f"
  logo-green: "#42A136"
  logo-lime: "#B1C640"
  logo-cyan: "#17A4BD"
  shadcn-background: "#ffffff"
  shadcn-foreground: "oklch(0.145 0 0)"
  shadcn-primary: "#167c4b"
  shadcn-primary-foreground: "#fff"
  shadcn-border: "oklch(0.922 0 0)"
  shadcn-ring: "#167c4b"
  shadcn-dark-primary: "#519f77"
  shadcn-dark-primary-foreground: "#141414"
  shadcn-primary-hover: "#2d8558"
  shadcn-primary-active: "#0b5735"
  shadcn-accent: "#ecefed"
  shadcn-accent-foreground: "#167c4b"
  shadcn-link: "#167c4b"
  shadcn-link-hover: "#3e7c5a"
  shadcn-link-active: "#0b5735"
  shadcn-destructive: "#ca3d3f"
  shadcn-destructive-solid: "#d54042"
  shadcn-destructive-foreground: "#fff"
typography:
  heading1: {"fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n'Noto Color Emoji'", "fontSize": "38px", "fontWeight": 600, "lineHeight": 1.2105263157894737}
  heading3: {"fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n'Noto Color Emoji'", "fontSize": "24px", "fontWeight": 600, "lineHeight": 1.3333333333333333}
  body: {"fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n'Noto Color Emoji'", "fontSize": "14px", "fontWeight": 400, "lineHeight": 1.5714285714285714}
  label: {"fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n'Noto Color Emoji'", "fontSize": "12px", "fontWeight": 400, "lineHeight": 1.6666666666666667}
  code: {"fontFamily": "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace", "fontSize": "12px", "fontWeight": 400}
  shadcn-body: {"fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'", "fontSize": "16px", "fontWeight": 400, "lineHeight": 1.5}
  shadcn-control: {"fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'", "fontSize": "14px", "fontWeight": 500, "lineHeight": 1.4285714285714286}
rounded: {"sm": "4px", "default": "6px", "lg": "8px", "shadcn-base": "10px", "shadcn-control": "8px", "shadcn-card": "14px"}
spacing: {"paddingXXS": "4px", "paddingXS": "8px", "paddingSM": "12px", "padding": "16px", "paddingLG": "24px", "paddingXL": "32px", "marginXXL": "48px"}
components:
  button-primary: {"backgroundColor": "{colors.primary}", "textColor": "{colors.container}", "typography": "{typography.body}", "rounded": "{rounded.default}", "padding": "0 15px", "height": "32px"}
  button-primary-hover: {"backgroundColor": "{colors.primary-hover}"}
  button-primary-active: {"backgroundColor": "{colors.primary-active}"}
  button-primary-dark: {"backgroundColor": "{colors.dark-primary}", "textColor": "{colors.dark-container}", "rounded": "{rounded.default}", "height": "32px"}
  button-default: {"backgroundColor": "{colors.container}", "textColor": "{colors.text}", "typography": "{typography.body}", "rounded": "{rounded.default}", "padding": "0 15px", "height": "32px"}
  input-default: {"backgroundColor": "{colors.container}", "textColor": "{colors.text}", "typography": "{typography.body}", "rounded": "{rounded.default}", "padding": "4px 11px", "height": "32px"}
  tag-default: {"backgroundColor": "{colors.layout}", "textColor": "{colors.text}", "typography": "{typography.label}", "rounded": "{rounded.sm}", "padding": "0 7px"}
  surface-panel: {"backgroundColor": "{colors.container}", "textColor": "{colors.text}", "rounded": "{rounded.lg}", "padding": "{spacing.paddingLG}"}
  navigation-current: {"backgroundColor": "{colors.primary-bg}", "textColor": "{colors.primary}", "typography": "{typography.body}", "rounded": "{rounded.default}", "padding": "10px 15px"}
  shadcn-button-primary: {"backgroundColor": "{colors.shadcn-primary}", "textColor": "{colors.shadcn-primary-foreground}", "typography": "{typography.shadcn-control}", "rounded": "{rounded.shadcn-control}", "padding": "8px 16px", "height": "36px"}
  shadcn-button-primary-hover: {"backgroundColor": "{colors.shadcn-primary-hover}"}
  shadcn-button-primary-active: {"backgroundColor": "{colors.shadcn-primary-active}"}
  shadcn-button-outline: {"backgroundColor": "{colors.shadcn-background}", "textColor": "{colors.shadcn-foreground}", "typography": "{typography.shadcn-control}", "rounded": "{rounded.shadcn-control}", "padding": "8px 16px", "height": "36px"}
  shadcn-input: {"textColor": "{colors.shadcn-foreground}", "typography": "{typography.shadcn-body}", "rounded": "{rounded.shadcn-control}", "padding": "4px 12px", "height": "36px"}
  shadcn-card: {"backgroundColor": "{colors.shadcn-background}", "textColor": "{colors.shadcn-foreground}", "rounded": "{rounded.shadcn-card}", "padding": "24px"}
---

# Design System: COHESION 逐科

## Overview

**Creative North Star: "专业、现代、多业务通用"**

COHESION 逐科面向内容、工具与服务共用一套清晰、熟悉的界面语言。基础组件保持成熟产品 UI 的比例和操作预期；品牌保留原有 Logo 与固定三色，Ant Design 与 shadcn/ui 的主操作、选中、焦点和相关状态共同读取 COHESION 品牌语义。各业务按任务组织信息和布局。

两套实现分别采用真实 Ant Design 6.6.6 的 defaultAlgorithm、darkAlgorithm、compactAlgorithm，以及 shadcn/ui 的 new-york / neutral / Radix 源码组件与 Tailwind 4.3.3。各自字体、间距、圆角、控件高度、阴影和交互保留官方基础；品牌角色通过正式主题工厂统一派生，shadcn 的官方 Neutral 原值单独保留。系统字体是已确认的基础选择。

**Key Characteristics:**

- 双体系可见：Ant Design 与 shadcn/ui 分别提供真实组件、预设与接入入口。
- 可追溯基础：两套体系共享品牌来源，运行时主题、CSS 与摘要可追溯到配置、工厂和官方源码。
- 多业务共用：内容、工具与服务共享规则，按任务组合页面。
- 可控反馈：状态同时使用文字与视觉反馈，动效可暂停。

头部仅摘录常用 token，不作为独立配置入口。未加前缀的既有键保持 Ant Design `light`／`comfortable` 语义，`dark-` 来自 `dark`；`shadcn-` 键摘录 COHESION 浅深主题。Ant Design 源为 [theme/cohesion-theme.json](theme/cohesion-theme.json) 与 `theme/create-theme.mjs`；[tokens/tokens.json](tokens/tokens.json) 保存完整快照，由 `scripts/generate-antd-tokens.mjs` 维护（536 token × 4 模式）。shadcn 官方基础保存在 [theme/shadcn-preset.json](theme/shadcn-preset.json)，`theme/create-shadcn-theme.mjs` 将共享品牌角色映射为每模式 41 个语义／圆角变量；`scripts/generate-shadcn-tokens.mjs` 同时生成 [theme/shadcn-tokens.json](theme/shadcn-tokens.json) 快照与 CSS。官方 CLI（4.22.0）、配置与适配记录在其中和 `components.json`，配置 style 为 `new-york`，Tailwind 4 实际解析 registry 为 `new-york-v4`。调整后同步摘要。

[公开重设计记录](docs/design-system-redesign-2026-10-19.md) 保存 `ship` 终审结论、56 个组合、27 项通过的交互检查及 20 张截图的覆盖范围。代表视图见 [桌面概览](docs/redesign-assets/overview-desktop.png)、[手机概览](docs/redesign-assets/overview-mobile.png) 与 [深色组件](docs/redesign-assets/components-dark.png)。原始本地证据 `.impeccable/review/finish-review.md`、`.impeccable/review/browser-review-final.json` 不部署，不作为公共下载链接。

[上一轮局部主题与 shadcn 记录](docs/theme-isolation-and-shadcn-2026-10-19.md) 保存当时独立 `ship` 结论、26 项回归通过、0 个浏览器运行错误及 9 张截图的审阅范围，包含当时的 32 个变量。其截图和黑白预设属于历史版本，不能证明后续品牌主题和动效修正已通过；当前实现与验证状态见[品牌主题与动效修正](docs/shadcn-brand-and-motion-2026-10-19.md)。

上一轮品牌与动效修正已获独立 **ship** 结论：当时构建的常规（26 项）、品牌（18 项）和动效（38 项）回归共（82 项）通过，三份记录均无浏览器运行错误，`pnpm check` 通过。独立审阅逐张查看该轮（9 张）截图并核对源码；代表视图见 [shadcn 深色组件](docs/redesign-assets/brand-shadcn-dark-desktop.png)、[手机浅色组件](docs/redesign-assets/brand-shadcn-light-mobile.png)、[完整动效入口](docs/redesign-assets/brand-motion-desktop.png)。结论限于当时已记录的 Chromium Web 场景，不外推为完整 WCAG 或原生平台认证；本地报告为 `.impeccable/review/brand-motion-finish-review.md`。

首轮扩充完整（43 项）shadcn Transitions 交互的历史记录：新增回归（305 项）通过，原常规／品牌／动效（82 项）在当时构建重跑通过，共（387 项）、0 失败、0 浏览器运行错误，`pnpm check` 通过。已捕获（10 张）浅深、桌面、手机与关键交互证据，代表视图见 [浅色画廊](docs/transition-assets/native-transitions-light-desktop.png)、[深色画廊](docs/transition-assets/native-transitions-dark-desktop.png)、[手机画廊](docs/transition-assets/native-transitions-light-mobile.png)、[拖放](docs/transition-assets/native-transitions-drag.png)、[卡片扇出](docs/transition-assets/native-transitions-pro-stack.png)。独立终审结论为 **ship**，无实质待修复问题；审阅逐张核对全部（10 张）截图、43 项源码映射、CSS3／Anime.js、主题、控制与来源边界，并确认 5 项局部动效例外理由成立。结论限于当前已记录的 Chromium Web 范围，报告为 `.impeccable/review/native-transitions-finish-review.md`；详细范围见 [Transitions 实现记录](docs/shadcn-transitions-2026-10-19.md)。

上一轮按照官网逐个操作（43 项）公开演示，修正页面大位移、面板方向、头像进出曲线、矩阵相位和图片 Portal 缓动失效等差异。[逐项核对表](docs/transitions-fidelity-2026-10-19.md) 保留每项来源、观察时长与缓动、修正摘要和 shadcn／品牌适配边界。该历史构建的 Transitions（325 项）和常规／品牌／历史动效（82 项）共（407 项）通过，0 失败、0 浏览器运行错误，`pnpm check` 通过，捕获（15 张）截图并嵌入来源；设计检测（9 项）局部弹性提示均记录意图。独立终审初次仅指出目录三处旧说明合为（1 项）fix，同步后 Verdict Pass 确认（1/1 项）解决、0 项剩余，判定 **ship**。原 fix 与最终 verdict 完整保留；407 项与 15 张证据仅证明该历史版本。

迁移前 Pro 版本已细化图片展开、烟雾消散与彩屑，用连续曲面、540ms 整图柔化与真实表面碰撞改善材质；来源与近似边界见 [Pro 记录](docs/pro-transitions-refinement-2026-10-19.md)。当时（433 项）检查通过、0 失败／浏览器错误，（12 张）截图有来源，单次 detector（4 项）既有局部弹性／0 机械待修复，独立报告 `.impeccable/review/pro-refinement-finish-review.md` 判定 ship、0 实质待修复。该结论只证明迁移前 Chromium Web 范围，保留为历史。

当前自有样式已全系统迁移至 Tailwind，普通布局／状态在工具类，静态关键帧由正式插件生成，彩屑用结构化 CSSOM/adopted sheet；主题、Logo、组件与行为保留。真实冻结旧基线为（24 份）DOM／计算样式及（16 张）PNG。确认构建（7fde0262…19b66）的（433 项）回归全过，对照后仍发现375px筛选列级联回归，最终通过有序 `at-most-N` 插件修复；最终构建（f9afd885…2310b）另有（180 项）断点专项全过，均0失败／浏览器错误，不合称同构建613项。现有（18 张）本轮来源截图，单次detector原始（218 项）均逐项归类、0机械待修复。新的五节报告 `.impeccable/review/tailwind-finish-review.md` 实际审阅（18 张）本轮图及（4 张）冻结基线代表，逐文件核对Origin、构建范围和源码编译链，判定 **ship，0项实质待修复**；审阅没有另开浏览器、重跑构建／测试／截图或detector。当前实现、检测意图和不同构建范围见 [迁移记录](docs/tailwind-migration-2026-10-19.md)，历史407／433与ship仅证明各自旧版。

## Colors

### Primary

Ant Design 主绿色用于操作、链接、选中态与焦点。浅色使用 `primary` 及其状态，深色使用 `dark-primary` 及该模式派生状态。浅色种子为 `#167C4B`，深色种子为 `#5CB889`；深色最终主色见头部 `dark-primary`。种子经过官方算法与可读性修正，不能当作组件最终值。

`colorPrimaryBg`／`Border` 负责选中背景和边界，`colorPrimaryText*` 负责主色文字，`colorLink*` 负责链接。成功、警告、错误、信息各自使用 `colorSuccess*`、`colorWarning*`、`colorError*`、`colorInfo*`，并配合图标和明确文案；头部仅摘录其文字色。

shadcn 的 `primary`／`primary-foreground` 读取共享品牌主按钮配对，hover／active 使用独立、不透明状态色；链接读取 `link` 三态，避免以主按钮透明度近似文字状态。`accent`／`accent-foreground`、`ring` 和侧栏对应角色读取同一品牌派生结果；`secondary`、`muted` 保留官方中性基础。`destructive` 用于可读的错误文字和边界，`destructive-solid`／`destructive-foreground` 及 hover／active 专供实体危险操作；两类配对分别维护。图表首色跟随品牌主色，其他图表角色来自共享官方色族。官方 Neutral 原值仅作为基础与对照，不作为当前品牌成品。

### Neutral

Ant Design 容器、画布、浮层分别读取 `colorBgContainer`、`colorBgLayout`、`colorBgElevated`；主要、辅助、次级文字读取 `colorText`、`colorTextSecondary`、`colorTextTertiary`。RGBA 值保留原格式，与实际背景一起判断。控件边界和内容分隔分别读取 `colorBorder` 与 `colorBorderSecondary`。shadcn 对应使用 `background`、`card`、`popover` 及各自 `*-foreground`，边框、输入边界与焦点分别使用 `border`、`input`、`ring`；深色透明边界必须与实际表面一起判断。

### Brand assets and modes

`logo-green`、`logo-lime`、`logo-cyan` 固定为现有 Logo 三色；图形与 COHESION／逐科名称保留。资产色不随主题改变，不新增界面语义；品牌实验可选择性使用三色。

Ant Design 模式：

| 模式 | 官方算法顺序 | 主题／密度 |
| --- | --- | --- |
| `light` | `defaultAlgorithm` | 浅色／舒适 |
| `dark` | `darkAlgorithm` | 深色／舒适 |
| `compact` | `defaultAlgorithm` → `compactAlgorithm` | 浅色／紧凑 |
| `darkCompact` | `darkAlgorithm` → `compactAlgorithm` | 深色／紧凑 |

各模式最后运行 `cohesionAccessibilityAlgorithm`，只修正未达阈值的可读文字、链接、占位符、主按钮／危险按钮与主色填充配对；占位符别名由工厂集中配置。生成器检查 408 个配对，正文阈值（4.5:1）、焦点阈值（3:1），禁用与装饰内容排除在正文阈值之外。这是限定配对检查，不是完整 WCAG 认证。

深色主按钮的 `Button.primaryColor` 使用官方深色容器色（`#141414`），接入时必须保留组件配置。概览固定浅深样例通过 `ConfigProvider` 的 `inherit: false` 建立完整独立主题，同时显式传入 `compact`／`stopped` 并保留局部 `App` 消息上下文；否则父级深色按钮文字会泄漏到浅色样例。仅调整局部 token 的普通子主题仍可按需继承。CSS 消费者在同一作用域设置 `data-theme` 与 `data-density`，读取 `--ant-token-*`；旧别名仅作兼容。

shadcn 仅有 `light`／`dark` 主题，通过局部 `data-shadcn-theme` 切换，完整变量由同一工厂生成 JSON 与 CSS。Ant Design 的四模式与 408 配对检查不等同于 shadcn 的运行时验证。

**The Source Rule.** 修改各体系的主题源后重新生成对应派生产物与文档摘要；页面和分发包不手写另一套基础 token。

**The Semantic Color Rule.** Logo 资产色只承担品牌识别；正文、链接、主操作与成功、警告、错误、信息状态读取各自语义 token。

## Typography

界面与正文采用头部的官方系统字体栈，代码使用 `typography.code`；中文按系统字体回退。以尺寸、字重、行高与留白建立层级，不额外加载展示字体。金额和表格数据可使用等宽数字。

舒适模式的 `fontSizeHeading1…5` 为（38／30／24／20／16px），正文与辅助文字为（14／12px）；紧凑模式对应（32／26／20／16／14px）与（12／10px）。标题强字重读取 `fontWeightStrong`（600），精确行高读取对应 `lineHeight*`；舒适正文／辅助行盒为（22／20px）。正式 CSS 名称为 `--ant-token-font-size-heading1`，没有 `heading-1`。

shadcn 作用域采用 Tailwind 官方系统无衬线字体、正文（16px／1.5），默认按钮为中等字重（14px／20px）；Input 窄屏为（16px），从（48rem）起为（14px）。具体标题由源码组合决定，不套用 Ant Design 的标题或紧凑字号阶梯。

长文左对齐，建议行宽（65–75 字符），必要说明和错误完整显示。移动输入结合设备与缩放验证可读性，不用紧凑辅助字号承载关键操作。文档标题存在局部响应式调整，不改变全局阶梯。

## Layout

Ant Design 间距基于官方 `sizeUnit`（4px）与 `padding*`／`margin*`；头部摘录舒适模式常用步长，紧凑模式由算法联动调整。`controlHeightSM`／`controlHeight`／`controlHeightLG` 在舒适模式为（24／32／40px），紧凑模式为（21／28／35px）；紧凑默认高度为 28px。触控目标另行保证命中区域，文档手机页头为至少 44px。

shadcn 沿用 Tailwind 间距与源码默认尺寸：Button 和 Input 默认高（36px），Button 默认内边距（8px 16px），含图标时横向缩至（12px）；Card 垂直内边距、分区横向内边距与分区间隔为（24px）。全局紧凑开关只调整 Ant Design；shadcn 页明确保留官方默认比例。两套控件都需另行验证触控命中区域。

各业务按任务选择网格和密度，保持分组、对齐与可伸缩区域；长表格使用局部滚动。以下仅是 `preview/src/` JSX 工具类维护的文档外壳：固定页头（64px）、桌面侧栏（228px）、含内边距的主内容最大宽度（1264px），默认内边距（32px 48px 80px）。最大宽度（1023px）时侧栏收纳到 Drawer；最大宽度（767px）时主内容改为（24px 20px 56px），多栏重排。其他局部响应点服务具体示例；这些外壳尺寸与 Ant Design 组件断点都不强制所有业务页面采用。

## Elevation & Depth

常态内容层级依靠表面、留白与分隔线；Ant Design 菜单、提示、Modal 和 Drawer 使用官方浮层背景与组件阴影，深色同样由算法派生。`boxShadow`、`boxShadowSecondary`、`boxShadowTertiary` 的精确值保存在快照和 sidecar 扩展。

shadcn 使用源码中的细边框、Card 轻阴影、Input／outline Button 的微阴影和 Dialog 浮层阴影；数值来自 Tailwind 官方主题，局部主题通过表面与前景变量配对。不把 Ant Design 阴影覆盖到 shadcn 组件。

**The Depth Rule.** 内容区优先用表面、留白与分隔线组织；菜单、对话框和抽屉的前后关系使用官方浮层 token。

## Shapes

Ant Design 控件采用轻圆角，默认、小型与容器半径来自 `borderRadius`／`borderRadiusSM`／`borderRadiusLG`，见头部 `rounded`。普通描边读取 `lineWidth`（1px）与语义边框色，键盘焦点保留可见轮廓和偏移。头像、开关等服从真实组件形态；移动演示外框、Logo 曲线与品牌光效属于局部表现。

shadcn 基础 `radius` 为（0.625rem）；默认根字号下为（10px），Button／Input 使用基础值减（2px），Card 使用基础值加（4px），分别见 `shadcn-control` 与 `shadcn-card`。Badge 保留完整胶囊形状；不将其统一成 Ant Design 半径。

## Components

主站使用 `ConfigProvider`、真实 Ant Design 组件、官方 `antd/dist/reset.css` 与运行时 CSS-in-JS，通过 `createCohesionTheme({ mode, compact, reducedMotion })` 接入。文档自有布局由 JSX 中的 `tw:` 工具类维护，`preview/tailwind.css` 编译为 `preview/tailwind.generated.css`。可选基础／Orb 的 `styles/cohesion-base.css` 是 `cb:` Tailwind 入口，消费者加载 `dist/css/cohesion-base.css` 并应用 `cohesion-base.classes.mjs` 的类组合，不再自动重置全局页面。接入见 [分发说明](dist/README.md)。

shadcn/ui 的 27 个真实基础源码组件位于 `preview/shadcn/components/ui`，通过官方 CLI 获取，保留 variants；本地适配包括 `sc:` 前缀、React 18 的 Button／Input／Textarea `forwardRef`、Field／Card 前缀选择器和作用域 Portal。新增 Accordion、Collapsible、Avatar、InputGroup、Progress、Sonner 供交互扩展组合；Sonner（2.0.8）的主题从当前作用域读取，样式也注入相同 ShadowRoot。该预览是可查阅与接入的参考，现有 `dist` 主要分发 Ant Design 主题与历史参考，并非双体系生产组件包。shadcn 源码保留上游 MIT 声明；项目自身许可证尚未确定。

- **Buttons：** 主按钮突出当前任务，默认按钮承接次要操作。默认按钮的横向内边距由 `paddingContentHorizontal - lineWidth` 推导，垂直内边距为 0；hover／active 读取对应状态，loading／disabled 使用真实组件，深色保留工厂中的文字配对。
- **Inputs / Fields：** 默认输入采用容器、边界与可读占位符；hover 使用主色悬停边界，focus 使用主色边界与 `controlOutline`。校验和错误就近说明，占位符不替代标签；头部尺寸摘要来自官方输入组件 token。
- **Tags / Containers：** 普通 Tag 展示分类与元信息，不自动具备筛选行为；语义 Tag 用文字说明状态。`surface-panel` 对应文档静态内容容器，不要求每个内容区使用卡片。
- **Navigation / Overlays：** 默认项使用辅助文字，当前项采用主色与浅填充，并标记 `aria-current`。Modal／Drawer 关闭后恢复焦点；共享 `useFocusReturn` 同时处理状态边沿和关闭回调，进入动画中按 Escape 仍归还有效触发器；移动导航选路后聚焦主要内容。

shadcn 页以“预设与 token／组件与状态／产品组合／Transitions 动效”四个页签展示真实交互：Button 包含主、outline、secondary、ghost、link 与危险 variants；Button／Badge 的实体状态读取品牌变量，Input 等控件保留清晰的实色焦点环（3px）和背景间隔（2px），错误使用 `aria-invalid` 与文字。Radix 负责 Dialog、AlertDialog、Select、DropdownMenu、Tooltip 等交互与焦点；场景为本地演示，偏好示例可保存到 localStorage。

Transitions 扩展位于 `preview/shadcn/transitions/`，包括（43 项）独立编写的 React 组件。它们参考 [Transitions.dev 的公开演示](https://transitions.dev/detail.html?t=card-resize)，含（32 项）Free 与（11 项）Pro 公开演示的自主实现，不复制其 recipe 或付费源码，也不声明为 shadcn/ui 官方组件。六类用途为布局与导航、浮层与通知、输入与操作、反馈与智能状态、数字与文本、视觉与交互；同一画廊可搜索、筛选、重放、暂停和深链定位，舞台只挂载当前真实组件，没有 iframe。组件复用现有语义颜色、尺寸、圆角及 Radix 规则。

**The CSS First Rule.** 新增动效能用 CSS3 时优先采用过渡或关键帧；需要动态脚本补间时优先 Anime.js，状态与输入事件由 React 负责。

当前（42 项）扩展使用 CSS3；拖放落位通过 CSS3 配合 Anime.js（4.5.0）直接跟随指针，未放入时按公开观察的（500ms）弹性曲线直接归位，放入后图像（400ms）显现，提供键盘替代。外部 API 为 `TransitionDemoProps { stopped: boolean; replayKey: number }`：暂停保留可见结果，replayKey 变化触发对应示例的下一次演示。共同 Hook 监听系统减少动效和页面隐藏，画廊另管理局部／全局暂停与舞台离屏；卸载时清理定时器、监听和脚本动画。组件动效各自表达状态关系，不要求统一为基础控件的 150ms；进出、错峰及多阶段节奏按 [43 项官网对照](docs/transitions-fidelity-2026-10-19.md) 逐项维护。Panel／Accordion 将视觉插值放在内部 motion 层，避免 Radix 尺寸测量阶段临时关闭过渡；Tooltip 采用官方 `disableHoverableContent` 保持跨按钮提示连续，Accordion 局部清除默认旋转后使用 scaleY 形变。接入源码、CSS 与依赖见 [README](README.md#transitions-交互扩展)。

Pro 的图片、烟雾、彩屑分别位于 `pro-image.tsx`、`pro-smoke.tsx`、`pro-confetti.tsx`，使用 `sc:` 工具类，`effects.tsx` 保留兼容导出；同名旧 CSS 已移除。图片保留（48 列）、（450ms）展开／（350ms）收回与 Dialog 焦点；烟雾保留（540ms）连续材质柔化、转动、下沉和结束事件交接；彩屑保留（38–88 片）预计算轨迹及约（3–4 秒）尾段，改由 `MotionStyles` 将结构化 frames 写入实例拥有的 CSSOM/adopted sheet。静态（63 组）关键帧位于 `motion.config.mjs`，正式 Tailwind 插件只生成 keyframes，不代替 JSX 布局工具类。三项品牌图形与 Canvas 近似边界保持，当前接入见 [迁移记录](docs/tailwind-migration-2026-10-19.md)。

双体系预览在开放 ShadowRoot 内注入 Tailwind preflight、utility 与 shadcn 布局；浮层 Portal 保留在同一作用域，避免 Ant Design reset、Tailwind 基础与局部主题互相覆盖。构建器从实际（41 个）`@property` 自动生成最低 `properties` 层初值，以保留边框、阴影、焦点环及状态优先级。普通单体系 shadcn 产品可按官方方式使用全局 Tailwind，无需复制文档站的 ShadowRoot 包装。

文档 Shell 使用公开 `ConfigProvider` 的固定外层动效边界与内层 `inherit: false` 真实主题，避免 Ant Design 首次 `motion: false` 引入 Provider 时重建整棵子树。首次暂停／恢复和系统减少动效已实测保留同一输入的未保存值与同一图片 Dialog；正常（200／300ms）动效及 token 切换有效。此为双体系文档状态稳定性适配，不使用 Ant Design 内部 API 或新增依赖补丁，也不改变普通产品的官方主题接入方式。

Radix 的 roving-focus、menu 与 focus-scope 在本预览构建中读取开放 ShadowRoot 内的实际焦点，修复 `document.activeElement` 只返回宿主时菜单 Home／方向键停在末项的问题。适配在 `scripts/radix-shadow-focus.mjs` 校验上游精确版本与替换位置；不修改安装包、浏览器原型或普通 DOM 行为。

Ant Design 普通交互使用官方 `motionDurationFast`／`Mid`／`Slow`（100／200／300ms）与对应缓动，组件沿用各自 motion token。全局暂停和系统 `prefers-reduced-motion` 同时控制 `motion:false`、过渡与无限循环，包括 loading 图标、Spin、Skeleton 和品牌动效；文字与结果持续可见。动效不承载唯一信息。

shadcn 保留 Tailwind 默认状态过渡（150ms）及源码浮层动效；局部 `stopped` 通过 `data-motion="paused"` 让循环静止，将有限动画的时长与延迟归零并完成，关闭过渡。系统减少动效采用相同的静态结果原则。Dialog 进入与退出都需完成，不能冻结透明首帧或阻止 Presence 卸载；焦点环和错误状态持续可见。

动效页保留原库全部（27 类）历史组件参考，包含（15 个）JavaScript 控制器与（12 个）CSS 片段；一次只挂载一个隔离 iframe 舞台，可选择、操作和重放。参考通过语义变量适应浅深主题，不覆盖两套基础组件的内置状态；新增 43 项 shadcn 扩展不依赖这些历史 iframe 或控制器。

品牌实验默认收起、选择性使用：ThinkingOrb 提供完整（9 种）智能状态，BorderBeam 提供完整（5 种）预设，用于有意义的强调；常规等待优先使用标准加载。实验局部暂停服从全局暂停，切换和卸载清理控制器与循环，不改变组件基础。当前移动示例是响应式 Web；原生 APP、小程序组件及平台转换器尚未实现。

`.impeccable/design.json` 的两套 HTML／CSS 标本仅供规范面板在 shadow DOM 展示静态外观，变量附有默认值。它们不提供 React 状态、业务校验、路由、弹层或焦点管理，生产界面使用真实组件。

## Do's and Don'ts

### Do:

- Do 分别通过 createCohesionTheme 或 create-shadcn-theme 的生成变量接入对应体系，保持共享品牌来源与各自官方比例。
- Do 在浅深主题下保留任务结构、状态意义和操作层级；Ant Design 两种密度服从其官方算法。
- Do 为固定独立主题样例隔离 ConfigProvider 继承，并让 shadcn 浮层留在相同主题作用域。
- Do 给表单提供可理解的标签、校验与恢复方式；给图标操作提供可访问名称。
- Do 为触控场景单独保证命中区域，并验证窄屏、键盘、焦点恢复和减少动效。
- Do 在新增交互动效中先采用 CSS3，需要动态脚本补间时优先 Anime.js；保留可见状态与键盘替代。
- Do 明示演示数据与品牌实验的边界，并在真实产品接入后验证其设备与辅助技术范围。

### Don't:

- Don't 用 Logo 三色直接替代正文、链接、表单状态或主按钮语义。
- Don't 将深色种子当成最终派生主色，或省略深色 Button.primaryColor 的配对。
- Don't 把官方 Neutral 原值误写成当前品牌成品，也不要把 Ant Design 的 compactAlgorithm、reset 或组件尺寸套到 shadcn。
- Don't 逐页重设字体、圆角、色阶或控件高度，以免绕过官方算法和统一修正。
- Don't 将文档站外壳、静态标本或移动 Web 演示当作所有业务和原生平台的强制模板。
- Don't 仅用颜色或动画传达结果，也不要在暂停或系统减少动效时继续运行循环。
- Don't 将自主 Transitions 扩展标记为官方 Pro 源码，或将历史参考 iframe 当成 shadcn 组件实现。
- Don't 将现有对比度与浏览器检查表述为完整 WCAG 符合性或全部平台实现。
