# shadcn Transitions 交互扩展

日期：2026-10-19。本记录保留需求、目录与历史实现证据，当前接入已同步为 Tailwind 工具类与结构化关键帧；本轮迁移验证状态见 [Tailwind 迁移记录](tailwind-migration-2026-10-19.md)。此前 407／433 项和各轮 ship 仅证明对应迁移前构建。

## 需求与来源

用户要求浏览 [Transitions.dev / Card resize](https://transitions.dev/detail.html?t=card-resize)，将其 Transitions 目录的交互实现并归入 shadcn/ui；范围明确包括 Pro 公开演示的自主实现。随后确认动画优先使用 CSS3，需要脚本动画时优先使用 [Anime.js](https://animejs.com/documentation)。Logo 图形与三色、现有共享 COHESION 品牌主题保持不变。

本轮清点公开目录共 43 项：32 项 Free、11 项 Pro 公开演示。实现根据可见行为自主编写 React、CSS 和局部 Anime.js 补间，不复制上游 transition recipe，不访问或复制付费私有源码。公开行为参考为 **Transitions.dev by Jakub Antalik**；本项目新增代码称为 COHESION 的 shadcn 交互扩展，不称官方 shadcn 组件、官方 Pro 产品或上游源码移植。来源清单保存在本地 `.impeccable/review/transitions-source-inventory.json`。

上游 [Transitions.dev License](https://github.com/Jakubantalik/transitions.dev/blob/main/LICENSE) 与 shadcn/ui 的 MIT 许可分别适用其对应资源，不相互替代。本轮不把整套上游库或其私有素材重打包。既有 `vendor/` 和 `reference/` 的历史参考仍按各自来源维护，新增 43 项实现不加载它们。

## 入口与分类

入口为 **组件体系 → shadcn/ui → Transitions 动效**，也可直接打开：

- [卡片尺寸](http://127.0.0.1:8766/#shadcn?tab=transitions&item=card-resize)
- [拖放落位](http://127.0.0.1:8766/#shadcn?tab=transitions&item=drag-drop-with-physics)

目录支持中英文名称、用途和基础组件搜索，按用途筛选，窄屏使用组件选择器。选中项写入 `#shadcn?tab=transitions&item=<id>`；可重放关键状态或局部暂停。舞台每次仅挂载当前真实 React 组件，直接运行在相同 ShadcnScope 中，不使用 iframe。

| 本地用途分类 | 数量 | 交互 |
| --- | ---: | --- |
| 布局与导航 | 6 | 卡片尺寸、面板展开、页面切换、页签滑动、菜单形变、折叠内容 |
| 浮层与通知 | 5 | 下拉菜单、对话框进出、提示显隐、通知进出、横幅堆叠 |
| 输入与操作 | 9 | 加号菜单、错误轻震、输入消散、勾选描画、开关回弹、收藏反馈、链接响应、图标替换、彩屑完成反馈 |
| 反馈与智能状态 | 7 | 消息角标、完成描画、骨架交接、加载转完成、思考状态、矩阵加载、图像生成交接 |
| 数字与文本 | 8 | 数字更新、滚动计数、状态文字切换、分组文字呈现、文字扫光、流动文字色彩、推理进度、流式文字 |
| 视觉与交互 | 8 | 头像组响应、指针倾斜、卡片扇出、拖放落位、图像倾斜展开、图像消散、按钮边沿光泽、波纹工作状态 |

公开站点使用 Essential／AI／Effects／Texts 及其复合标签；本地为便于产品团队查找，按上述六种用途重新归类。来源等级仍逐项保留在目录元数据，分类不表示付费源码已获取。

## 实现方式

42 项使用 CSS3 transition／keyframes，包括尺寸、Grid 内容展开、位移、透明度、描线、模糊、裁切、局部颜色与错开节奏。React 管理事件、组件状态和有限状态交接；CSS 完成这些状态之间的视觉插值，不引入另一套脚本补间库。

`drag-drop-with-physics` 使用 CSS3 配合 Anime.js 4.5.0。拖动坐标直接来自 Pointer Events；未放入目标时以 `animate()` 按公开观察的 500ms 弹性曲线直接归位，删除此前多余的向外投射阶段；放入后目标保持原位，图像在 400ms 内显现。指针取消、暂停、重放和卸载会终止残留动画，另保留键盘可用的放入与重置入口。它是有边界的动态落位示例，不宣称为通用物理引擎。

基础 shadcn 源码由 21 个扩至 27 个，新增官方 Accordion、Collapsible、Avatar、InputGroup、Progress、Sonner，保持 new-york／neutral 基础、Radix 规则和共享品牌角色。Sonner 2.0.8 的 Toaster 读取当前主题上下文，其 CSS 注入同一 ShadowRoot，避免通知样式或主题漏到 Ant Design。当前精确依赖与锁文件同步，未增加 `next-themes`。

每个扩展保留真实 Button、Field、Input、Checkbox、Switch、Card、Tabs、Dialog、DropdownMenu、Tooltip 等组件的语义、默认比例与焦点规则；动效只增加局部状态表现。Logo 固定三色及 `theme/cohesion-theme.json` 不变，shadcn 仍由主题工厂生成每模式 41 个语义／圆角变量。

## 官网逐项核对与修正

首轮完整实现之后，用户要求逐个核对 43 项的节奏、缓动及交互。本轮已逐项操作官网公开演示，并记录运行时 computed style、动画关键帧和状态时间线；完整的来源链接、时长、曲线、修正摘要和适配边界见 [43 项逐项对照表](transitions-fidelity-2026-10-19.md#43-项逐项对照)。CSS 参数与 Canvas／JS 观察范围分别标注，不以目录完整或行为回归通过代替动效还原证据。

主要修正包括：页面由 ±110% 整页位移改为 ±8px 的 250ms 交接，面板由左右扩栏改为半高向上揭示；菜单、对话框、提示和横幅恢复各自的进出节奏；头像区分进入与退出曲线，矩阵恢复四种不同的相位结构；修复图片 Portal 未继承缓动变量而导致动画失效的问题；数字、文字与 Spinner 补齐旧状态退出和同节点交接。最终运行验证还修复 Radix 测量阶段跳过 Panel／Accordion 过渡的问题，由内部 motion 层执行真实 400／350ms 与 250ms；提示采用官方 `disableHoverableContent` 解除邻近 hover 阻挡，折叠箭头清除叠加的 Tailwind 旋转。

shadcn 的真实组件尺寸、Radix 键盘／焦点行为、中文业务内容、共享品牌角色均保留。Canvas 弯曲、噪声边界、物理粒子以自主 CSS3 近似表现；表格明确这些差异，未声明像素级或私有算法一致。本轮最终构建的 Transitions 325 项、常规 26 项、品牌 18 项、历史动效 38 项均通过，共 407 项、0 失败、0 浏览器运行错误，`pnpm check` 通过；15 张新截图已保存并嵌入来源信息。独立终审初次提出目录三处旧说明这一项 fix；同步文案后 `pnpm build`／`pnpm check` 再通过，Verdict Pass 确认 1/1 已解决、0 剩余，最终结论为 **ship**。原 fix 报告保留；纯文案没有改变已验证的 UI 或动效参数。首轮 387 项及其 ship 结论仅描述当时构建。

## 源码与接入 API

```text
preview/shadcn/transitions/catalog.ts     43 项目录、六类用途、来源等级和模块映射
preview/shadcn/transitions/types.ts       TransitionDemoProps / Entry / Category
preview/shadcn/transitions/hooks.ts       系统减少动效、页面隐藏的共同控制
preview/shadcn/transitions/gallery.tsx    搜索、筛选、深链、重放和局部暂停
preview/shadcn/transitions/layout.tsx     12 项布局、浮层及操作组合
preview/shadcn/transitions/feedback.tsx   16 项反馈与文本组合
preview/shadcn/transitions/effects.tsx    12 项视觉、输入及拖放，兼容导出三项 Pro
preview/shadcn/transitions/pro-image.tsx  图片连续展开
preview/shadcn/transitions/pro-smoke.tsx  连续整图消散
preview/shadcn/transitions/pro-confetti.tsx 预计算彩屑轨迹
preview/shadcn/transitions/motion.config.mjs  63 组静态关键帧
preview/shadcn/lib/motion-styles.tsx      动态结构化 CSSOM 关键帧
theme/tailwind-motion.mjs                正式 Tailwind 关键帧插件
preview/shadcn.css                      @theme / variant / source / plugin 入口
```

源码模块用于维护依赖与实现；画廊按产品用途分类，两者无须一一对应。目录会检查总数、唯一 ID 和实际组件映射，缺项直接报错。

所有导出示例采用同一接口：

```ts
interface TransitionDemoProps {
  stopped: boolean
  replayKey: number
}
```

`stopped` 保留交互结果并减少动效；`replayKey` 变化触发该示例定义的重放动作，不要求替换组件实例。共有 Hook 会进一步合并系统 `prefers-reduced-motion` 和页面隐藏状态。画廊合并全局暂停、局部暂停与舞台离屏，用户恢复局部演示不会越过全局或系统偏好。有限出入场需完成到可见结果，循环停止，弹层仍可关闭并归还焦点。

产品接入时复制所需实现模块、`types.ts`、`hooks.ts` 和引用的 shadcn 基础组件，把源码纳入 Tailwind 扫描并接入语义 `@theme`、variant 与 `motion.config.mjs`／正式关键帧插件及 `theme/tailwind-breakpoints.mjs` 的有序含边界变体；普通样式在 JSX 的 `sc:` 工具类中，不再导入已删除的同名组件 CSS。彩屑还需 `lib/motion-styles.tsx`，将结构化 frames 写入本实例 adopted sheet，重放／卸载时清理；图形需部署自有资源路径。拖放仍需 `animejs@4.5.0`，通知仍需 `sonner@2.0.8`，没有本轮新增依赖。前缀、源码别名与编译配置需一致，普通产品无需复制文档 ShadowRoot。完整接入与当前验证见 [迁移记录](tailwind-migration-2026-10-19.md)。

## 与历史动效的关系

原动效页的 27 类参考继续保留，包含 15 个 JavaScript 控制器与 12 个 CSS 片段，使用隔离 iframe 以避免旧样式冲突。品牌实验仍保留 ThinkingOrb 的 9 状态与 BorderBeam 的 5 预设。本轮 43 项是新增的 shadcn 原生 React 组合，不以旧 iframe 充当实现，也不改变其历史记录。

## 官网核对验证（迁移前历史）

本轮验证与 15 张当前截图统一见 [逐项核对记录的验证部分](transitions-fidelity-2026-10-19.md#统一构建验证)，本轮设计检测原始为 9 项局部弹性提示，已逐项说明意图，机械待修复项为 0；独立终审在目录说明同步后最终判定 **ship**，初次 fix 与最终 verdict 均保留。407 项检查及 15 张截图的适用范围不变，纯文案后构建与一致性检查再次通过。下节保留首轮历史，不作为本轮结果。

## 首轮实现验证（历史）

复现入口：

```sh
pnpm build
pnpm check
pnpm test:transitions
pnpm test:browser
pnpm test:brand
pnpm test:motion
```

首轮实现时曾在当时构建完成以下检查，新增验证与既有范围分开统计；本表不代表后续官网核对修正的最新结果：

| 检查 | 通过 | 失败 | 本地证据 |
| --- | ---: | ---: | --- |
| 新增 Transitions | 305 | 0 | `.impeccable/review/transitions-validation.json` |
| 常规页面与嵌套主题重跑 | 26 | 0 | `.impeccable/review/shadcn-theme-validation.json` |
| 共享品牌与键盘路径重跑 | 18 | 0 | `.impeccable/review/shadcn-brand-validation.json` |
| 历史动效与品牌预设重跑 | 38 | 0 | `.impeccable/review/motion-regression.json` |
| 合计 | 387 | 0 | 四份记录均无浏览器运行错误 |

`pnpm build` 与 `pnpm check` 通过。新增检查覆盖全部 43 项在浅深主题中的实际挂载、重放、暂停后的可读状态与恢复，以及 320／375px 窄屏；还检查搜索、分类、空结果、深链、组件切换、真实浮层与通知、键盘操作和减少动效。原有 82 项在首轮构建中已重跑，不能仅援引此前的历史结果。

截图清单 `.impeccable/review/native-transitions-captures.json` 保存 10 张当时 Chromium 截图，包括浅深桌面／手机、暂停对话框、拖放、反馈、页签、通知及 Pro 公开演示对应的自主卡片扇出。以下 5 张作为公共证据保存在 `docs/transition-assets/`：

- [浅色桌面画廊](transition-assets/native-transitions-light-desktop.png)
- [深色桌面画廊](transition-assets/native-transitions-dark-desktop.png)
- [浅色手机画廊](transition-assets/native-transitions-light-mobile.png)
- [拖放落位](transition-assets/native-transitions-drag.png)
- [卡片扇出](transition-assets/native-transitions-pro-stack.png)

截图来源信息已嵌入；首轮对整个 `docs/` 的检查结果为 16 张栅格图、0 张缺失来源信息，其中包含旧轮图像，不代表 16 张均为首轮新截图。

首轮只运行一次设计检测。原始报告 `.impeccable/review/native-transitions-detector.json` 有 5 项，均对应用户明确点名的局部交互表现：头像组与卡片扇出的弹性缓动、文字扫光与流动文字色彩、卡片尺寸的 300ms 宽度插值。它们以 5 处精确的 `impeccable-disable-next-line` 注释记录原因，并在 `.impeccable/review/native-transitions-detector-resolution.json` 逐项说明；这些例外只作用于对应示例，不扩展为产品全局规范。检测结果不能表述为 0 项。

首轮独立终审已完成，结论为 **ship**，无实质待修复问题。原始报告为 `.impeccable/review/native-transitions-finish-review.md`，包含 persistence、fidelity、ceiling、material_fixes、keep 五部分；审阅者逐张查看当时全部 10 张截图，核对 43 项目录与组件映射、CSS3／Anime.js 的实现分工、主题与控制边界、来源归属及现有 387 项真实回归证据，确认上述 5 项局部例外有依据。审阅没有另行运行浏览器、测试、截图或 detector，也未把现有记录扩大为新的设备认证。

验证范围为当时 Chromium Web 预览；即使回归通过，也不扩大为完整 WCAG、所有设备或原生平台认证。
