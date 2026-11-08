# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

逐科 COHESION 的产品、设计与研发团队，共同维护跨业务视觉和交互的一致性。设计系统供未来的管理后台、C 端产品、服务体验和商业项目参考，覆盖视觉风格、组件选择、页面组合、交互与动效；客户品牌项目按项目约定沿用客户自己的品牌资产。

## Product Purpose

建立公司级可复用设计语言，覆盖全局品牌规则、基础组件、产品组合模式及动效。逐科自有产品应共享明确而有辨识度的 COHESION 品牌特征，同时针对管理后台、C 端和商业页面保留适合各自任务的布局与内容表达；客户品牌项目复用设计方法，不默认覆盖客户品牌。成功意味着同一套规则能在多业务场景中保持清晰、专业、现代且可用，并能通过真实交互预览验证。

## Operating Context

仓库当前提供静态 Web 文档与预览、CSS/JSON token、React 参考封装、动效参考源码以及静态拷贝分发包。规范覆盖 PC Web、H5、小程序与 APP，实际原生组件及平台转换器尚未实现。

## Capabilities and Constraints

- 保持可静态部署的交付方式，保留旧 token 别名兼容；源码可拆分并预编译，不把现有 dist 当成可清空构建目录。
- 提供可操作示例与浅深主题、响应式布局、键盘操作和减少动效支持。
- 真实产品案例、客户数量、性能指标及原生实现不得虚构。演示数据需明确标示。
- 用户于 2026-10-19 确认以多业务通用为基线，采用直接代码设计与浏览器验证。
- 用户进一步明确以 Ant Design / shadcn 等成熟设计系统的预设 token 为基础，并要求两套体系都可见。文档分别展示 Ant Design v6 与 shadcn/ui 的真实组件和预设，不把一种体系的示例标记为另一种。
- 用户随后纠正 shadcn/ui 色系与既有组件动效：官方预设是基础，两套体系仍需共享 COHESION 品牌语义；既有动效参考与品牌预设应可完整查阅，暂停时保留可见的最终状态。
- 用户要求参考 Transitions.dev 的整个 Transitions 目录，在 shadcn/ui 中分类实现，并明确包括 Pro 公开演示的自主实现；不访问或复制付费私有源码。
- 新增动效优先采用 CSS3；需要脚本补间时优先 Anime.js。React 状态、事件和定时状态交接不等同于脚本逐帧动画。
- 用户继续要求重点细化 Pro 的图片展开、烟雾消散与彩屑，优先贴近公开预览的轨迹和材质；保留 shadcn 语义、品牌配色及 CSS3 优先策略，明确 Canvas 自主近似与实际性能观测的边界。
- 用户明确要求全系统自有样式迁移至 Tailwind；文档、shadcn、Transitions、原参考和品牌基础样式已完成迁移，正式主题、Logo、组件与行为保留，未引入 UnoCSS，也未把旧选择器搬进规则对象或 `@apply`。
- 用户进一步要求整个设计系统不再使用手写原生 CSS，并评估 UnoCSS 与现有 Tailwind 方案的选型。当前页面、组件、Transitions 与既有动效参考中的自有布局和状态样式已迁入 Tailwind；静态关键帧由正式插件生成，彩屑运行时通过结构化 CSSOM 添加关键帧。Tailwind 编译产物、第三方组件样式与 Token 快照仍是必要的生成／运行资源；迁移范围、工具链和分构建验证见 `docs/tailwind-migration-2026-10-19.md`。不把旧选择器或 CSS 字符串移入配置后宣称完成迁移。

## Brand Commitments

- 保留 COHESION / 逐科名称及现有 Logo 图形。
- Logo 三色固定为 #42A136、#B1C640、#17A4BD。
- 用户授权对其余全局、组件和动画进行全面重设计，以体现互联网公司的专业与现代审美。

## Evidence on Hand

- theme/cohesion-theme.json 为品牌定制入口，theme/create-theme.mjs 共用官方算法与可读性扩展；tokens/tokens.css 和 tokens/tokens.json 为派生产物，tokens/sync-tokens.mjs 提供兼容校验入口。
- theme/shadcn-preset.json 保留 shadcn/ui 官方 new-york / neutral 原值；theme/create-shadcn-theme.mjs 映射共享品牌配置，theme/shadcn-tokens.json 为品牌主题生成快照。组件源码在 preview/shadcn/，由 components.json 记录官方 CLI 配置。Tailwind 和 Portal 在独立 ShadowRoot 作用域运行。
- reference/ 与 vendor/ 包含可运行的品牌动效参考。
- preview/shadcn/transitions/ 提供 43 项自主 React 扩展和六类用途目录，基础源码组件共 27 个；42 项 CSS3、1 项 CSS3 配合 Anime.js 4.5.0。新增扩展复用 shadcn 主题及交互，历史 27 项参考仍在原动效页独立维护。来源与接入见 docs/shadcn-transitions-2026-10-19.md。
- pro-image、pro-smoke、pro-confetti 为三项独立 CSS3 模块，effects 保留兼容导出；迁移前 Pro 版本 433 项／12 张截图与 ship、公共 ConfigProvider 状态稳定性诊断保留历史范围，见 docs/pro-transitions-refinement-2026-10-19.md。
- 自有样式现在由 doc:/tw:/sc:/mr:/bb:/cb: 六类 Tailwind 工具类编译；63 静态动效为正式插件关键帧，彩屑用结构化 CSSOM/adopted sheet，响应断点为正式有序 at-most-N 插件。旧 10 个选择器 CSS 已删除。确认构建 433 项通过，最终断点构建另有 180 项专项通过，均无失败／浏览器错误；不得合称同构建 613。18 张截图已有来源；新的五节独立终审 ship、0 实质待修复，范围见 docs/tailwind-migration-2026-10-19.md。
- docs/design-system-audit-2026-10-19.md 记录 v1.1 历史修复；当前接入以 README.md 和 DESIGN.md 为准。

## Product Principles

1. 逐科自有产品共享 COHESION 品牌核心；客户品牌项目默认继承规则与方法，保留客户身份。
2. 产品场景按用户任务、内容密度和平台组合，不强制使用同一种页面模板。
3. 组件必须有明确用途、真实行为和可理解状态；每个产品选择合适的主要组件体系并保持一致。
4. 品牌识别与功能语义分别维护，装饰不能替代信息或状态表达。
5. 规范、预览与分发保持可验证的一致性。
