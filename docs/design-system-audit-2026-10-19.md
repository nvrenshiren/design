# COHESION 设计系统审查与修复记录

日期：2026-10-19 · 修复版本：v1.1.0

> 历史记录：本文描述 v1.1.0 的审查结果。后续 v2.0 已采用 Ant Design 预设、正式主题工厂与预编译静态资源；本文的 CSS 事实源、CDN 运行方式、原生 dialog 和旧 token 数量不再代表当前实现。当前接入请阅读 [README](../README.md)。

本轮覆盖根规范、跨端规范、三层 token、交互预览、参考动效源码以及 `dist/` 分发包。沿用现有品牌与视觉方向，重点解决错误规范、语义混淆和真实交互缺陷。

## 结论

原系统的主要风险是多个“事实源”之间不一致：CSS、JSON、预览配置、深色覆盖和分发副本分别维护；文档又将部分尚未实现的工程能力写成已经可用。其结果是设计师看到的色阶、开发者引用的 token 和用户实际得到的主题可能不同。

本轮将 CSS token 保持为正式来源，预览复用分发 preset，补齐浅深色语义与组件状态，并提供同步校验。已修复检查中确认的功能缺陷。系统仍是设计规范、静态预览与组件参考包，不能由本次检查推导为已经完成全平台生产组件库。

## 已修复的问题

P1 表示影响使用、接入或可访问性的主要问题；P2 表示规范一致性与可维护性问题。

| 优先级 | 原问题与影响 | 修复结果 | 主要文件 |
|---|---|---|---|
| P1 | CSS、JSON、Tailwind 配置、深色覆盖及分发副本各自维护，主题值不一致 | 完整 CSS 交换快照、主题变量 preset、同步脚本与镜像检查；取消大量覆盖工具类的硬编码深色规则 | `tokens/`、`index.html`、`dist/` |
| P1 | 中性色阶整体错位，neutral-50 显示白色，neutral-900 漏失 | 色板直接读取正式 primitive token；说明 50–900 实际为 10 级 | `index.html` |
| P1 | Logo 资产绿/灰与 UI 功能色含义混用 | 校正资产色；区分品牌填充、品牌文字、按钮前景；README 提供迁移说明 | `tokens/tokens.css`、`README.md` |
| P1 | 危险按钮白字配 red-500 仅约 3.96:1；部分警告、信息、占位文字及深色文字不达标 | 危险实底改用专用配对；文字、功能浅底、控件边界与焦点色分别校验；预览色卡、徽标、头像及渐变示例补充可读前景 | token、预览、preset |
| P1 | 子容器切主题时，组件别名可能仍使用根主题已解析的值 | 在每个主题作用域重新声明语义与组件别名；同时支持 light 内嵌 dark 与反向嵌套 | `tokens/tokens.css` |
| P1 | 初次访问立即保存主题，导致“跟随系统”实际上失效 | 仅保存明确选择；默认响应系统变化；支持恢复跟随与跨标签同步 | 预览、`dist/react/hooks.jsx` |
| P1 | 固定侧栏与居中正文重叠，窄屏缺少完整目录 | 独立布局列、sticky 导航、移动端折叠目录、跳转主要内容链接 | `index.html` |
| P1 | 弹窗关闭后内部按钮仍能被 Tab 聚焦；缺少 Escape、焦点归还及确认行为 | 预览改用原生 dialog，补齐标题、说明、取消、确认反馈与焦点恢复 | `index.html` |
| P1 | 复选框 label 与舞台事件冒泡可能双重切换；部分演示仅鼠标可用 | 原生 checkbox；舞台重放按钮；命名开关/图标按钮；页签方向键及菜单键盘操作 | `index.html` |
| P1 | 菜单无真实可聚焦选项、隐藏选项仍暴露或被舞台裁切；实验主题菜单没有动作 | 补齐展开状态、选项动作、外部关闭与反馈；实验菜单改为明确的本地视图演示 | `index.html` |
| P1 | 分发 transitions.js 将独立片段直接拼接，重复 const 导致整文件语法错误 | 隔离片段，提供显式 mount/destroy API；补齐事件与计时器清理、clear 输入/焦点行为和 success 状态 | `vendor/`、`reference/build-transitions.cjs` |
| P1 | Orb 暂停后恢复会跳时相，缺少页面隐藏、无观察器和资源失败回退 | 源码与分发封装补齐暂停时钟、可见性、减少动效、错误与清理；预览也停止离屏/隐藏调度 | `reference/thinking-orbs/`、`dist/react/ThinkingOrb.jsx`、预览 |
| P1 | Beam 淡出期间重激活竞态、子元素 animationend 干扰、减少动效时效果消失 | 修复状态反转、事件目标过滤、静态帧与清理；分发使用应用同一 React 实例 | `reference/border-beam/`、vendor、分发封装 |
| P2 | focus 被描述为与 active/hover 互斥的状态，容易让按下时焦点环消失 | 将焦点视为独立可叠加指示，禁用/loading 控制操作能力，hover/active 控制表面 | README、预览 |
| P2 | H5 被写成可用 rpx、APP 字体写 dp，安全区被写成固定值，桌面窄屏强制横滚 | 明确 CSS px/rem、375px 逻辑稿到 rpx 的适用范围、Android sp、运行时安全区和响应式布局 | `README.md`、`platforms.md`、预览 |
| P2 | JSON 宣称 DTCG、原生/小程序生成器及透明度修饰宣称直接可用，但仓库未提供 | 明确自有快照格式、尚未实现的生成步骤、Tailwind v3 变量色透明度边界和真实加载方式 | 根/分发 README、JSON |
| P2 | 缓动小球只竖直运行并移出舞台，与“沿曲线往返”解释不符 | 绘图标明时间/进度；横向同距同速比较，曲线参数对齐正式缓动 token | `index.html` |
| P2 | “Pro”自实现示例与原始组件混淆，查看源码指向第三方作者主页；版本号不一致 | 标明适配演示与实验边界；链接到真实接入规范；统一 v1.1.0 | 预览、README |
| P2 | 无 IntersectionObserver 时内容保持隐藏；持续动画无法暂停；拖动取消后可能残留状态 | 正文默认可见；提供暂停/减少动效；拖动补齐 pointer cancel/lost capture、方向键与 Escape | 预览、分发封装 |

## 验证证据

- `node tokens/sync-tokens.mjs --check`：115 个原始 token、每主题 63 个语义 token、78 个组件 token；变量依赖无缺失/循环；106 组关键对比度通过；JSON 与分发 token 镜像一致。
- `node scripts/sync-preview.mjs --check`：根预览共享样式与分发 CSS 一致。
- vendor 与 `dist/js`、动效 CSS 镜像逐个哈希一致；分发 JS、preset 和生成脚本的 Node 语法检查通过。
- React/JSX 编译、参考 TypeScript 与动效打包验证通过；测试依赖置于系统临时目录，没有新增项目依赖。
- Chromium 验证 320、375、1280、1440 CSS px 四个宽度的浅色/深色组合；8 组均无整页横向溢出，未捕获控制台或页面脚本错误。
- 验证弹窗关闭时的焦点排除、Escape、焦点归还和 Tab 限域；菜单方向键/End/Escape/外部关闭；checkbox 标签及空格各切换一次；拖动方向键/Escape；减少动效时成功状态仍可见。
- 核查局部深色主题按钮真实计算值：背景 `#56A34A`、前景 `#0F270D`；浅色主要按钮 `#2F7A28` 配白字，危险按钮 `#CC3636` 配白字。
- 对占位符额外检查 `::placeholder` 计算值，防止 Tailwind Preflight 覆盖正式 token。

代表截图：[手机浅色](audit-assets/components-mobile-light.png)、[桌面深色](audit-assets/components-desktop-dark.png)。

自动文字扫描针对实色表面；渐变/Canvas、屏幕阅读器实际播报、实体触摸设备与原生平台不能由该扫描替代。本轮没有宣称通过完整 WCAG 认证或原生设备验收。

## 后续接入边界

1. 生产 Web 项目应使用包管理器锁定依赖并编译 JSX/CSS。目前预览仍加载 React、Tailwind Play CDN、Babel 及外部字体，依赖联网。
2. iOS、Android、Flutter、小程序需在真实接入项目实现并测试 token 类型/单位转换和原生组件；仓库目前提供规范及 CSS 快照。
3. 实验动效用于选型参考，正式业务仍需按实际任务配置性能预算、状态文案与平台降级。

## 维护入口

```powershell
node tokens/sync-tokens.mjs
node tokens/sync-tokens.mjs --check
node scripts/sync-preview.mjs
node scripts/sync-preview.mjs --check
node reference/build-transitions.cjs
```

修改正式来源后更新分发镜像，再运行检查。原始色样本、渐变实验、缓动对照及品牌装饰不按普通业务界面的外观规则机械删除；自动设计检测器对此类演示的提示已人工复核。

审查参考：[Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)、[WCAG 文字对比度说明](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)。
