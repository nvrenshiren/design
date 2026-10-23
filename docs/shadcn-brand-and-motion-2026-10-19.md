# shadcn/ui 品牌主题与组件动效修正

日期：2026-10-19。

用户指出“之前的组件动效以及 shadcn/ui 的色系配置不对”。本次按整套公司设计系统共用品牌语义的要求修正：官方预设作为基础，保留可追溯原值；实际组件使用 COHESION 品牌主题。同时恢复既有动效参考的可查阅性，并修正暂停状态下有限动画的行为。

## 色系来源与生成链

此前将 shadcn/ui 的官方 Neutral 黑白预设当作最终品牌成品，导致同一设计系统的主操作、焦点和选中态分属不同色系。当前生成链为：

1. `theme/shadcn-preset.json` 保留官方 new-york / neutral 浅深原值、基础半径、来源和组件列表。
2. `theme/cohesion-theme.json` 维护两套体系共享的品牌配置；`theme/create-theme.mjs` 运行官方算法及既有可读性修正。
3. `theme/create-shadcn-theme.mjs` 将共享结果映射到 shadcn 语义角色，保留其余 Neutral 基础。
4. `scripts/generate-shadcn-tokens.mjs` 同时生成 `theme/shadcn-tokens.json` 与 `preview/shadcn/tokens.css`；`--check` 仅校验，不写入文件。

当前每模式有 41 个语义／圆角变量。新增的状态角色用于实体主操作、链接三态和危险操作配对；不是用 Token 数量与 Ant Design 做一一对应。

## 品牌角色与组件边界

- 主操作默认、悬停、按下各用独立不透明颜色；浅色按钮配白字，深色亮绿色按钮配深色文字。
- 链接独立读取 `link`、`link-hover`、`link-active`，不以按钮透明度近似文字状态。
- 选中背景与文字、焦点、侧栏主操作与强调、表面和图表角色从共享配置派生。
- `destructive` 承担可读错误文字与边界；`destructive-solid`、前景及 hover／active 承担实体危险操作。危险文字和按钮背景分别配对。
- Button／Badge 保留官方比例和 variants，状态改读品牌变量；输入及操作焦点采用实色环与背景间隔。Radix 的弹层、键盘和焦点行为保持。
- 字体、间距、默认控件尺寸、圆角和阴影继续来自 shadcn／Tailwind 基础；Ant Design 的 compactAlgorithm 不套用到 shadcn。

Logo 图形与 `#42A136`、`#B1C640`、`#17A4BD` 保持不变。品牌角色通过语义配置维护，不把 Logo 原色直接替代正文或功能状态。

## ShadowRoot 内的键盘焦点

新增键盘路径检查发现 Radix 的部分辅助函数读取 `document.activeElement`。在本预览的开放 ShadowRoot 中，该值是宿主元素，而不是当前聚焦的菜单项，导致菜单 Home／方向键停在末项。

`scripts/radix-shadow-focus.mjs` 在构建时对 roving-focus、menu、focus-scope 的指定版本做局部适配，沿开放 ShadowRoot 读取实际焦点；它校验依赖版本与替换次数，升级不匹配会中断构建，要求重新审查。适配不修改安装包、浏览器原型或普通 DOM 行为。普通全局 Tailwind 产品无需复制这一预览专用边界。

## 动效修正

全局暂停与系统减少动效应让循环静止，并让有限出入场立即完成。此前只设置 `animation-play-state: paused` 可能将 Dialog 固定在透明的首帧；现在有限动画的时长和延迟归零，保留最终可见状态并允许 Radix Presence 完成卸载。

组件动效参考目录恢复原库全部 **27 类**：15 个 JavaScript 控制器与 12 个 CSS 片段。独立 iframe 舞台一次只挂载一个参考，可选择、操作和重放；浅深主题语义通过变量传入，不让原参考样式覆盖两套基础组件。

ThinkingOrb 已补齐 **9 种智能状态**，BorderBeam 已补齐 **5 种预设**。局部暂停服从全局偏好，切换与卸载清理循环和控制器；本轮专项检查确认全部预设可以实际挂载，暂停后仍能读取状态。

## 复跑与验证结果

```sh
node scripts/generate-antd-tokens.mjs --check
node scripts/generate-shadcn-tokens.mjs --check
pnpm build
pnpm check
pnpm test:browser
pnpm test:brand
pnpm test:motion
```

当前最新构建的常规浏览器回归为 **26／26 通过**，包括每模式 41 个变量；`pnpm check` 通过。

新增品牌回归为 **18／18 通过**，浏览器运行错误为 0，覆盖生成链与实际角色值、主操作／危险操作三态、链接、焦点、选中项、菜单 Home／End／方向键及 Escape 返回、Select Escape 返回。

动效专项为 **38／38 通过**，浏览器运行错误为 0。覆盖正常 Dialog 动画仍保留、浅深主题下暂停的 Dialog／AlertDialog／菜单可见并可关闭、运行时切换系统减少动效、Ant Design 暂停时的 Modal／Drawer、27 类参考暂停后的最终状态、播放中暂停与恢复、全部 9 种 Orb／5 种 Beam 实际挂载，以及 320px 无页面横向溢出。三套回归合计 **82 项通过、0 项失败**，三份记录的浏览器运行错误均为 0。已测主按钮、危险按钮与链接的三态文字对比度均达到 4.5:1，最低已测值为 4.513:1。

本轮批量记录 9 张截图，公开代表视图为 [shadcn 深色组件](redesign-assets/brand-shadcn-dark-desktop.png)、[shadcn 手机浅色组件](redesign-assets/brand-shadcn-light-mobile.png) 与 [完整动效入口](redesign-assets/brand-motion-desktop.png)。原始测试与截图清单位于本地 `.impeccable/review/`，不作为预览站公开下载。

独立审阅结论为 **ship**，无待修复的实质问题。审阅者逐张查看本轮 9 张截图，核对当前源码和全部 82 项行为记录；本轮检测结果为空。公开图片已带来源信息，文档内 11 张图片的来源扫描均无缺失。原始独立报告为 `.impeccable/review/brand-motion-finish-review.md`，仅供本地复核。

上一轮的 [局部主题与 shadcn 补齐记录](theme-isolation-and-shadcn-2026-10-19.md) 保留其历史结果和截图，其中的黑白预设与 32 个变量不代表当前品牌主题。当前检查只覆盖所记录的 Web 场景，不扩展为所有平台或辅助技术认证。
