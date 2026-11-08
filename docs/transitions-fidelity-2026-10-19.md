# Transitions 43 项动效逐项核对

日期：2026-10-19。范围：官网 43 项公开演示逐项操作与本地自主实现修正。**该轮统一构建共 407 项回归通过、0 失败、0 浏览器运行错误，捕获 15 张新截图；独立终审最终结论为 ship。首轮 387 项及其 ship 结论另保留为历史。**

本文保留全量核对版本的观察与证据。图片展开、烟雾消散和彩屑在后续继续细化，后续构建 433 项检查、12 张截图及独立 ship 的范围见 [Pro 动效细化](pro-transitions-refinement-2026-10-19.md)；下表对应三项的旧参数及上述 407 项／15 张证据不代替后续构建结果。

当前又已执行全系统 Tailwind 迁移，普通样式在 JSX 工具类、静态动画在正式关键帧插件，动态彩屑采用结构化 CSSOM。当前复制接入不再导入同名组件 CSS，详见 [Tailwind 迁移与接入](tailwind-migration-2026-10-19.md)；上述 407／433 项与 ship 不代表迁移构建已验证。

## 核对方法与精度

本轮分别操作了全部 43 个 [Transitions.dev](https://transitions.dev/detail.html?t=card-resize) 公开详情演示：12 项布局／浮层、16 项反馈／文本、15 项视觉／输入。通过独立 Chromium 读取渲染后的 computed style、`getAnimations()` 时长与关键帧，并实际触发点击、悬停、离开、拖放、重复打开与关闭；不是只核对目录名称或静态截图。布局项做两轮交互采样，反馈项观察约 5 秒状态交接，Canvas 效果追加观察消散尾段。

下表的明确 CSS 时长、曲线和关键帧来自浏览器运行值；带“约／采样”的 JS、Canvas 时长存在浏览器调度误差。未公开为 CSS 曲线的部分不推断为精确上游实现，独立 CSS3 近似会在适配列说明。没有读取 recipe 源码页、付费私有源码或受限素材。Pro 表示公开演示的自主实现，不表示获取了上游 Pro 源码或官方授权。

**缓动记法：** `E = cubic-bezier(.22,1,.36,1)`。其他曲线在对应项完整列出；时长均为毫秒，`blur` 与位移均为 CSS 像素。

全部组件继续使用真实 shadcn/ui／Radix 基础、现有尺寸与圆角和 COHESION 语义色；中文文案、成员首字母、自主品牌图形保留。Logo 的 `#42A136`、`#B1C640`、`#17A4BD` 不变。所有项目共同遵循暂停、系统减少动效、页面隐藏和舞台离屏的控制边界，停下时保留可读结果；本表只逐项列额外适配。

## 主要修复

- 页面交接由 ±110% 整页横滑改为官网的 ±8px、250ms 和轻模糊；面板由左右扩栏改为自底部半高上移，进入 400ms、退出 350ms。
- 菜单与对话框去除官网没有的附加位移／模糊，分别还原进出节奏；提示补齐 80ms 首次延迟与 160ms 跨触发器连续移动。
- 头像组分开进入与退出曲线，抬升从 18px 缩至 4px；矩阵从四种近似同一 pulse 改为四种不同相位、固定点及空角结构。
- 修复图片 Portal 未继承局部缓动变量而导致动画未运行的问题；补齐 450ms 展开、350ms 关闭与指针倾斜。
- Spinner、数字与状态文字保留旧节点完成退出；彩屑改为上方落下并衰减回弹，删除效果改为细粒子近场消散。
- 运行时核对进一步发现 Radix 的尺寸测量阶段会临时关闭自身过渡，导致 Panel／Accordion 虽然声明正确参数却跳过动画；改由内部 motion 层承接，实测恢复 400／350ms 面板进出和 250ms Grid 展开。提示采用官方 `disableHoverableContent`，解除 grace polygon 对相邻触发器 hover 的阻挡；折叠箭头局部清除 Tailwind 的 `rotate: 180deg`，避免与 `scaleY(-1)` 叠加后方向错误。

## 43 项逐项对照

“官网观察／行为”记录参照，“本轮修正”保留各模块的实际修正摘要；“适配边界”说明哪些差异为真实组件、品牌或中文语义保留，不作逐像素一致声明。

### 布局与导航（6 项）

| 组件与来源 | 官网时长与缓动／本地近似 | 官网观察与匹配行为 | 本轮修正 | shadcn／品牌适配边界 |
| --- | --- | --- | --- | --- |
| [卡片尺寸 · Card resize](https://transitions.dev/detail.html?t=card-resize)<br>Free | 尺寸双向 300ms；`E` | Animate在220×112与154×128之间可反复切换；宽收窄同时内容变高。 | 300ms(.22,1,.36,1)同步尺寸；修正内容显隐相位，保留内容卡展开语义。 | 保留完整shadcn Card和真实中文详情；“展开详情”由268px扩至384px，宽度比1.43与参考相同。真实内容型展开的宽度方向与官网骨架示意相反，明确属于产品语义适配。 |
| [面板展开 · Panel reveal](https://transitions.dev/detail.html?t=panel-reveal)<br>Free | 进入 400ms／退出 350ms；`E` | 面板相对自身高度从下方50%上移到0；blur2→0、opacity0→1；关闭反向。实测187px高，closed translateY121.5→open28，差93.5px。 | 修正左右扩栏为半高向上揭示，400/350ms并同步blur2。 修复Radix测量清零导致的直接跳变。 | 复用真实Radix Collapsible、完整Card内容；关闭内容inert和aria-hidden；中文高度随内容变化，轨迹保持50%比例。内部 motion 层避开 Radix 尺寸测量时的过渡禁用，实际运行 400/350ms。 |
| [页面切换 · Page side-by-side](https://transitions.dev/detail.html?t=page-side-by-side)<br>Free | 前进、返回均 250ms；`E` | 前页0→-8px，后页+8→0；两页opacity交叉、blur0/3交接；返回反向。 | 将±110%整页横滑改为官网±8px/blur3的250ms交接。 | 保留真实表单、资产选择、前后页inert及焦点交接，不引入虚假交易。 |
| [页签滑动 · Tabs sliding](https://transitions.dev/detail.html?t=tabs-sliding)<br>Free | 共享标记的位置与宽度 250ms；`E` | 同一pill在Plan/Debug/Ask之间移动并按51/65/47px文字宽度伸缩，250ms。 | 共享pill改250ms；中文等长标签保留等宽shadcn Tabs。 | 三个中文名称均2字并带等尺寸图标，保持shadcn等宽Tabs规格；此处pill无需人为制造不同宽度。原生roving focus保留。 |
| [菜单形变 · Dropdown menu morph](https://transitions.dev/detail.html?t=dropdown-menu-morph)<br>Free | 表面进 350ms／出 250ms；内容显隐 200ms、水平移动 350ms；关闭回位 700ms。表面进入 `cubic-bezier(.34,1.25,.64,1)`，其余 `E` | 圆按钮40px展开为183×172面，菜单内容从右40px/scale.97/blur2交接；按钮向左40px淡出。关闭后35%处对角5px后回位。 | 把裁切替换为350/250ms表面形变，恢复40px内容交接及700ms小幅回位。 | 菜单仍为真实Radix DropdownMenu；尺寸改为shadcn36px触发器和208×168菜单，圆角由preset决定。 |
| [折叠内容 · Accordion](https://transitions.dev/detail.html?t=accordion)<br>Free | 内容与箭头双向 250ms；`E` | grid0fr↔1fr，内容opacity/blur2同步，chevron用scaleY(-1)形变而非旋转。 | 改为250ms grid行过渡、blur2与chevron垂直翻转。 独立内部grid层确保真实高度插值。 | 保留真正Accordion的键盘和aria语义；关闭的forceMount内容inert/aria-hidden。内部 motion 层恢复真实 250ms Grid 过渡；局部 rotate:0 消除 Tailwind 旋转与 scaleY 叠加。 |

### 浮层与通知（5 项）

| 组件与来源 | 官网时长与缓动／本地近似 | 官网观察与匹配行为 | 本轮修正 | shadcn／品牌适配边界 |
| --- | --- | --- | --- | --- |
| [下拉菜单 · Menu dropdown](https://transitions.dev/detail.html?t=menu-dropdown)<br>Free | 进入 250ms／退出 150ms；`E` | 以顶部中心原点scale .97→1进入，关闭scale1→.99并淡出，无blur、无Y偏移。 | 菜单250/150ms、.97入/.99出；移除额外上移和模糊。 | 保留真实Radix DropdownMenu的箭头/Home/Enter/Escape、外点关闭及触发器焦点恢复；按真实锚点决定原点。 |
| [对话框进出 · Modal open/close](https://transitions.dev/detail.html?t=modal-open-close)<br>Free | 进入 250ms／退出 150ms；`E` | 中心scale .96↔1+opacity，无blur。 | 对话框250/150ms、scale.96，去掉官网没有的模糊。 | 官网是局部骨架示意，本地使用真实shadcn Dialog、语义标题、焦点圈闭和背景遮罩。 |
| [提示显隐 · Tooltip open/close](https://transitions.dev/detail.html?t=tooltip-open-close)<br>Free | 首次延迟 80ms、进入 150ms、跨触发器移动 160ms、退出 50ms；显隐 `ease-out`，几何 `E` | 首次80ms延迟、scale.98与opacity；跨按钮160ms同一视觉提示位置/宽度旅行，移出50ms。 | 补80ms延迟、150ms入口、160ms跨按钮旅行和50ms退出。 修复焦点与悬停交接被grace polygon阻断。 | 继续由每个Radix Tooltip持有其trigger、aria-describedby、Portal、焦点与dismiss；仅跨实例共享几何。采用官方 disableHoverableContent，避免 grace polygon 拦截相邻 hover。 |
| [通知进出 · Toast open/close](https://transitions.dev/detail.html?t=toast-open-close)<br>Free | 进入 350ms／退出 250ms；`E` | 16px向上、scale.97→1、blur2→0、opacity同步。 | Sonner通知改350/250ms、16px/.97/blur2，同步进出相位。 | 保留Sonner真实通知语义、撤销/关闭、局部Toaster和主题隔离，duration无限以便逐项检查。 |
| [横幅堆叠 · Banner stacking](https://transitions.dev/detail.html?t=banner-stacking)<br>Free | 新增及层次变化 350ms、最旧层退出 250ms；`E` | 初始3层；新横幅从60px/scale.97/blur2上移进入。每层-12px，scale1/.94/.88、opacity1/.6/.36、blur0/1/2；最旧第4层250ms继续上移12px淡出。 | 还原三层12px深度、透明度/模糊与60px入口，补250ms最旧层退出。 | 使用真实Alert和关闭按钮；仅顶层可聚焦/交互，背景层inert。动画中可短暂4层，稳定3层。 |

### 输入与操作（9 项）

| 组件与来源 | 官网时长与缓动／本地近似 | 官网观察与匹配行为 | 本轮修正 | shadcn／品牌适配边界 |
| --- | --- | --- | --- | --- |
| [加号菜单 · Gooey plus menu](https://transitions.dev/detail.html?t=gooey-plus-menu)<br>Pro 公开演示 | 扇出 350ms、错峰 0/40/80ms；收回 250ms；图标进 180ms、延迟 120/160/200ms，出 120ms；加号 250ms；关闭回位 700ms。扇出 `cubic-bezier(.34,1.56,.64,1)`、收回 `E`、旋转 `ease-in-out` | 液体分为(-54,-34)/(0,-64)/(54,-34)扇形；入场逐个40ms；关闭无stagger，并700ms在30%下沉5px再回位。 | 恢复350ms弹性扇形、40ms错峰、紧凑几何及700ms液体回位。 | 保留SVG goo滤镜的自主几何实现、真实Button/Collapsible和Escape焦点恢复；用品牌primary语义，不复制Pro源配方。 |
| [错误轻震 · Error state shake](https://transitions.dev/detail.html?t=error-state-shake)<br>Free | 摇动与错误显现均 280ms；摇动 `linear`，文案／边界 `ease-out` | 水平 0→右 6px（28.57%）→左 6px（57.14%）→右 4px（78.57%）→0；错误持续到修正。 | 错误摇动缩为280ms线性四拍，先右6px再左6px，错误文案同步显现且可重复触发。 | 保留真实表单校验、aria-invalid、描述关联及错误后焦点；不使用一次性装饰错误。 |
| [输入消散 · Input clear with dissolve](https://transitions.dev/detail.html?t=input-clear-with-dissolve)<br>Free | 文字／占位提示采样约 200–350ms 完成、余光 1000ms 前消失；清除按钮透明度 150ms。本地文字 280ms `E`、余光 800ms；JS 轨迹不认定精确 CSS 曲线 | 整行旧文字向下 12px、blur2 并淡出，占位提示从上方 12px 同步进入，底边短暂余光消散；焦点保留。 | 搜索清空改为整行向下12px模糊消散，占位提示同步进入，替代方向和节奏不符的逐字上飘。 | 保留 InputGroup/InputGroupInput、可用清除按钮、原输入焦点；主题primary用于残光，无脚本逐帧动画。 |
| [勾选描画 · Checkbox check](https://transitions.dev/detail.html?t=checkbox-check)<br>Free | 底色／边框 150ms；勾线进入 350ms／取消 150ms；`E` | 底色先变，勾线较慢描画；取消时移除原生选中指示。 | 复选框底色150ms、勾线350ms，保持原生键盘和label行为。 | 复用真实 Radix Checkbox、Field、键盘Space和label关联；保留组件原生取消勾选。 |
| [开关回弹 · Toggle](https://transitions.dev/detail.html?t=toggle)<br>Free | 开／关均 350ms；`cubic-bezier(.34,1.35,.64,1)` | 滑块 55% 时越过终点 1px、80% 时回到终点，随后静止；没有挤压变形。 | 开关统一350ms，保留1px轻回弹；移除此前过强的挤压与多次振荡。 | 按shadcn默认thumb尺寸计算终点，不照搬官网14.66px固定行程。 |
| [收藏反馈 · Like button](https://transitions.dev/detail.html?t=like-button)<br>Free | 填充 150ms `E`；轻压 350ms `cubic-bezier(.34,1.96,.64,1)`；粒子采样约 545–683ms、延迟 0–63ms，`ease-out` | 心形轻压至 .82 再回位；8 颗粒子短程移动约 14–24px；取消喜欢只恢复填充。 | 喜欢按钮从夸张放大改为350ms轻压回弹；粒子缩回近距离8颗，填充150ms。 | 保留品牌primary代替官网粉红及真实计数/pressed状态。 |
| [链接响应 · Learn more hover](https://transitions.dev/detail.html?t=learn-more-hover)<br>Free | 350ms；`E` | 保持同一个 chevron，整体右移 2px，上下两笔分别旋转 ±8°，不切换为另一种箭头。 | 了解更多保留同一枚箭头，350ms移动2px并张开上下两笔，移除不符官网的图标交叉淡化。 | 保留 Button、焦点同等反馈及触屏点击展开说明，不改变组件品牌。 |
| [图标替换 · Icon swap](https://transitions.dev/detail.html?t=icon-swap)<br>Free | 缩放／透明度／模糊均 250ms；`ease-in-out` | 菜单／关闭图标交叉淡化，scale 1↔.25、blur 0↔2px，不旋转。 | 图标切换还原250ms ease-in-out，仅缩放、模糊和透明度，去掉多余70°旋转。 | 保留可聚焦真实 Button 和动态aria-label。 |
| [彩屑完成反馈 · Confetti burst](https://transitions.dev/detail.html?t=confetti-burst)<br>Pro 公开演示 | Canvas 采样：500–1000ms 下落、3000ms 仍有少量、4000ms 清空；无精确 CSS 曲线。本地 3400–4100ms，分段加速下落及衰减回弹 | 彩屑从舞台上方落下，碰到按钮后回弹、停留再消失；追加 2/3/4s 观察确认尾段。 | 彩屑改为从上方落下，接触按钮后两次衰减弹跳，并在约4秒内消失；不再从按钮向上发射。 | 用自主 CSS3 关键帧替代 Canvas 物理，保证有限、可重放的演示；保留品牌／图表语义色与真实按钮交互，不声称完整物理模拟。 |

### 反馈与智能状态（7 项）

| 组件与来源 | 官网时长与缓动／本地近似 | 官网观察与匹配行为 | 本轮修正 | shadcn／品牌适配边界 |
| --- | --- | --- | --- | --- |
| [消息角标 · Notification badge](https://transitions.dev/detail.html?t=notification-badge)<br>Free | 外层位移 260ms／内层缩放 500ms／透明度 400ms／退出 180ms；`E`、`cubic-bezier(.34,1.36,.64,1)`、`cubic-bezier(.4,0,.2,1)` | 徽标外层260ms从左下到位，内层500ms scale(0→1)/blur(2→0)、400ms透明度；默认退出计算值180ms。 | 徽标拆为260ms位移和500ms弹性缩放，透明度400ms，已读时执行180ms退出。 | 仍用品牌 primary Badge，与官网灰色视觉不同；保留新增通知、已读的产品行为。 |
| [完成描画 · Success check](https://transitions.dev/detail.html?t=success-check)<br>Free | 圆盘显现、旋转、位移各 500ms；勾线延迟 80ms、绘制 500ms；`E` 与 `cubic-bezier(.34,1.35,.64,1)` | 圆盘500ms旋转80deg至0、blur10至0与淡入，同时40px弹性上移；勾线延迟80ms，绘制500ms。 | 成功勾改为500ms旋转/40px上移与模糊，勾线延迟80ms绘制。 | 官网绿色成功圆盘映射为品牌语义 primary；保留本地操作成功说明。 |
| [骨架交接 · Skeleton loader and reveal](https://transitions.dev/detail.html?t=skeleton-loader-and-reveal)<br>Free | 单次骨架脉冲 1000ms；内容交叉揭示 400ms；`ease-in-out` | 骨架先执行1000ms透明度1→.5→1单次脉冲；随后骨架与真实内容400ms透明度、blur2交叉揭示，不移动位置。 | 骨架改为1秒单次呼吸后400ms交叉去模糊，隐藏骨架停止动画。 | 保留真实shadcn Skeleton、中文成员与已就绪Badge，而非复制官网头像素材。 |
| [加载转完成 · Spinner to check morph](https://transitions.dev/detail.html?t=spinner-to-check-morph)<br>Pro 公开演示 | 环 900ms 旋转、约 175ms 消隐；实心盘 350ms 显现；上抬约 250ms／回落 300ms；勾线延迟 230ms、绘制 600ms。`linear`、`cubic-bezier(.34,1.35,.64,1)`、`E` | 900ms线性旋转环；触发后环约175ms消隐、实心盘350ms显现；图形上移3px约250ms后回落300ms；勾线600ms、延迟230ms。 | Spinner改为环、实心盘、勾线同节点交接，保留900ms旋转与600ms延迟描边。 | 官网公开演示触发完成后约2秒自动重置；本地保留任务完成态供读屏与检查，重放重新运行；550ms上下运动用独立CSS关键帧近似其两段弹性，未声称私有算法一致。 |
| [思考状态 · Thinking states](https://transitions.dev/detail.html?t=thinking-states)<br>Free | 状态间隔约 2000ms；高光 2000ms `linear`；文字退出／进入各 150ms `ease-in-out` | 每约2000ms交接思考文案，文字高光2秒匀速循环；旧文案上移8px/blur2退出150ms，新文案下8px进入150ms。 | 思考文案恢复2秒高光与状态间隔，补齐150ms退/进，移除图标摇动。 | 保留中文三状态、状态Badge和最终完成态；官网可无限Play循环，本地按任务完成结束并可重放。 |
| [矩阵加载 · Matrix dot loader](https://transitions.dev/detail.html?t=matrix-dot-loader)<br>Free | 四种模式均 1200ms `ease-in-out`；扫描列间 120ms、闪烁相位间 75ms、环绕点间 150ms、脉冲内外差 192ms | 四种均1200ms、15%峰值/45%归位，只改变点颜色；scan列间120ms；twinkle75ms离散相位；orbit外圈8点150ms、内4静止；pulse内4零延迟、外圈192ms，圆形布局四角空位。 | 矩阵恢复4种真实相位结构：1200ms周期、120ms扫描列间隔、150ms环绕、192ms内外脉冲差。 | 官网并列显示四种，本地选择一种并提供切换图案按钮，便于单独查看；twinkle相位顺序独立生成，75ms间隔与1200ms周期保持一致。 |
| [图像生成交接 · Image generation placeholder](https://transitions.dev/detail.html?t=image-generation-placeholder)<br>Pro 公开演示 | 784 点独立周期 1260–1540ms、负相位约 −6s 至 0；揭示 650ms；点阵 `ease-in-out`、揭示 `E` | 28×28共784个点以不同1.26–1.54s周期与约-6s至0的负相位缩放/透明度呼吸；Play进入加载、Reveal触发650ms opacity/blur3交叉揭示。 | 图像占位恢复784点异步呼吸与显式揭示，650ms去模糊，保留自主品牌图像。 | 结果继续使用项目自主几何SVG而非官网照片，点的负相位用稳定公式生成，避免每次渲染随机跳变。 |

### 数字与文本（8 项）

| 组件与来源 | 官网时长与缓动／本地近似 | 官网观察与匹配行为 | 本轮修正 | shadcn／品牌适配边界 |
| --- | --- | --- | --- | --- |
| [数字更新 · Number pop-in](https://transitions.dev/detail.html?t=number-pop-in)<br>Free | 数位交换 500ms、变化位错峰 70ms；`cubic-bezier(.34,1.45,.64,1)` | 点击后只替换变化的数字，旧字向上8px模糊退出，新字从下8px进入，变化数字依次70ms错峰；小数点与未变化位保持稳定。 | 实测500ms、70ms错峰；改为仅变化数位上下交换，保留小数点与中断后的最新值。 | 中文示例保留65.78与每次增加11.14；重放可演示首次进入，官网默认静态等待按钮。 |
| [滚动计数 · Spinning counter](https://transitions.dev/detail.html?t=spinning-counter)<br>Free | 卷轴 1400ms、列间错峰 180ms；`cubic-bezier(.16,1,.3,1)` | 数字竖直卷轴到目标值，1400ms减速，列间180ms错峰，无持续blur。 | 计数卷轴改为1400ms、列间180ms错峰，恢复官方减速曲线。 | 本地显示三个示例计数位并每次增加37；官网从单个0扩至目标位数，保留本地计数器内容尺寸。 |
| [状态文字切换 · Text states swap](https://transitions.dev/detail.html?t=text-states-swap)<br>Free | 退出 150ms＋进入 150ms；`ease-in-out` | 旧文本向上4px/blur2退出150ms；交换内容后新文本从下4px进入150ms。 | 实测150ms退出+150ms进入；补齐旧文本离场与4px上下交接。 | 官网按钮逐条切换；本地保留三状态自动演示与一次重放，状态间隔1000ms，单次换文案节奏按实测还原。 |
| [分组文字呈现 · Texts reveal](https://transitions.dev/detail.html?t=texts-reveal)<br>Free | 单行 500ms、第二行延迟 40ms；`E` | 两行从下12px、blur3、透明度0进入；单行500ms，第二行仅延迟40ms。 | 两行文字改为500ms、40ms轻错峰，位移12px、模糊3px。 | 中文内容与主题字号保留；以相同节奏而非复制英文文案。 |
| [文字扫光 · Shimmer text](https://transitions.dev/detail.html?t=shimmer-text)<br>Free | 2000ms 持续循环；`linear` | 点击Play后文字高光从右向左循环，2000ms linear；Stop后停止，文本仍可读。 | 文字流光改为2秒匀速循环，显式停止后保留可读文字。 | 高光色映射foreground/primary/muted-foreground，减少动效使用纯色可读文字。 |
| [流动文字色彩 · Pro gradient text](https://transitions.dev/detail.html?t=pro-gradient-text)<br>Pro 公开演示 | 色相周期 4000ms `linear`＋多层位置周期 5000ms `ease-in-out`；本地将全色相变化适配为品牌色变化 | 公开演示同时运行4秒全色相旋转与5秒多层渐变位置循环，文字本体不位移。 | 渐变恢复4秒/5秒双层节奏；全色相旋转适配为品牌色变化。 | 品牌约束优先：不复制官网彩虹hue-rotate(-360deg)，也不把此效果应用于产品标题，仅为可停止的独立示例。 |
| [推理进度 · Reasoning stream](https://transitions.dev/detail.html?t=reasoning-stream)<br>Free | 滚动 500ms，官网首步约 0.9s、后续间隔约 1.4s；`E`；本地首步 1.4s | 窄窗口中摘要按行段向上推进；实际transform过渡500ms，首次约0.9s启动，后续观测间隔约1.4s；上下边缘渐隐。 | 推理摘要改为500ms滚动、约1.4秒间隔，缩短单步距离并补齐边缘淡化。 | 本地中文摘要为三组，每组两行，适配字体行高，不复制官网英语长段落与循环重复内容；首步在1.4s而非官网约0.9s。 |
| [流式文字 · Streaming text](https://transitions.dev/detail.html?t=streaming-text)<br>Free | 单词显现 350ms、相邻启动约 60–71ms（中位约 64ms）；本地错峰 65ms；`E` | 逐词出现，每词350ms opacity/blur1，文本无位移；41词观察到相邻启动约60–71ms（中位约64ms）。 | 流式文字改为350ms淡入与1px轻模糊，词间65ms，取消上移。 | 中文按词组展示，12组，因此总时长短于官网41个英文词；词级节奏遵循公开采样。 |

### 视觉与交互（8 项）

| 组件与来源 | 官网时长与缓动／本地近似 | 官网观察与匹配行为 | 本轮修正 | shadcn／品牌适配边界 |
| --- | --- | --- | --- | --- |
| [头像组响应 · Avatar group hover](https://transitions.dev/detail.html?t=avatar-group-hover)<br>Free | 进入／回位均 320ms；进入 `E`，退出 `cubic-bezier(.34,3.85,.64,1)` | 当前头像抬高 4px、放大至 1.05；邻居响应按每个索引距离乘 .45 衰减，末尾 +2 也参与。 | 头像进入320ms平稳减速，退出320ms弹性回位；将过大的18px抬升还原为4px，并补齐邻居衰减。 | 保留真实 Avatar + Button、焦点与点击成员选择，替换官网人物照片为成员首字母。 |
| [指针倾斜 · 3D tilt](https://transitions.dev/detail.html?t=3d-tilt)<br>Free | 跟手 400ms、离开复位 1000ms、光泽 300ms；`E` | 跟随指针约 ±20°，透视 1000px；离开后缓慢回到平面并隐藏光泽。 | 3D卡片跟手400ms、离开1000ms，光泽300ms；修正原先统一180ms导致的生硬复位。 | 保留品牌通行证 Card 内容和触屏体验按钮；颜色来自主题语义。 |
| [卡片扇出 · Card stack hover](https://transitions.dev/detail.html?t=card-stack-hover)<br>Pro 公开演示 | 扇出 410ms／回收 360ms／主卡缩放 610ms；分别 `cubic-bezier(.31,1.84,.64,1)`、`cubic-bezier(.34,1.5,.64,1)`、`E` | 后卡静止时半透明，悬停横向扇出；主卡放大至 1.04；进入和退出使用不同节奏。 | 卡组展开410ms、收回360ms，主卡独立610ms放大；补回后卡半透明和较紧的扇出关系。 | 三张真实可聚焦 Button 保留选择状态；使用自有品牌图形；小屏扇出57px避免溢出。 |
| [拖放落位 · Drag & drop with physics](https://transitions.dev/detail.html?t=drag-drop-with-physics)<br>Pro 公开演示 | 80×60px 测试拖动后：平移归位 500ms，旋转／缩放约 462–491ms；目标反馈 150ms、图像淡入 400ms。归位 `cubic-bezier(.34,1.56,.64,1)`、反馈 `ease`、淡入 `ease-in-out` | 按住放大约 1.05；公开预览响应拖动速度；未放入目标时直接一次回弹，接受后图像淡入固定目标。 | 拖拽放手直接500ms弹回，去掉额外向外投射；放入后目标保持原位，图片400ms显现。 | 指针输入直接映射；脚本补间只用 Anime.js。保留键盘放入、取消、重置和暂停清理。 |
| [图像倾斜展开 · Image open tilt](https://transitions.dev/detail.html?t=image-open-tilt)<br>Pro 公开演示 | 展开 450ms `E`；静止／关闭交互 350ms `cubic-bezier(.34,1.25,.64,1)` | 公开预览从 scale .3 到 1、圆角 32 到 16、深度 −70→−28→0，并用 Canvas 弯曲平面及指针倾斜。 | 修复Portal未继承曲线导致图片动画根本未运行；展开450ms、关闭350ms，补回指针倾斜并适配Radix弹层。 | 采用真实 Radix Dialog 承担焦点、Escape、标题和触屏关闭；品牌矢量图替换照片。CSS3 深度/倾斜表达原 canvas 弯曲的空间连续性，不声称像素级形变一致。 |
| [图像消散 · Delete with smoky dissolve](https://transitions.dev/detail.html?t=delete-with-smoky-dissolve)<br>Pro 公开演示 | Canvas 采样约 200ms 扩散、500ms 内清空；无精确 CSS 曲线。本地粒子 420ms `ease-out`、错峰 0–54ms，540ms 完成 | 图像化成大量邻近小碎片，轻微下移约 6px、转动约 2°，没有长距离坠落。 | 删除从24大碎片坠落改为192细粒子近场烟化，约0.5秒结束，去除不符官网的85px下坠。 | 独立CSS3粒子扩散，使用自有品牌图形；保留演示恢复、状态播报及减少动效直接完成。 |
| [按钮边沿光泽 · Get Pro button](https://transitions.dev/detail.html?t=get-pro-button)<br>Pro 公开演示 | 悬停外部光晕 4000ms `linear`、内部流光 5000ms `ease-in-out`；离开停止 | 悬停才启动多层流动光与周围光晕，闲置时不运行这两组循环。 | Pro按钮补齐4秒外部光晕与5秒内部流光节奏，退出即停，并固定品牌色相。 | 保持primary前景对比和固定品牌色；用空间流光替代官网hue-rotate色相循环，避免离开品牌色系。 |
| [波纹工作状态 · Organic shimmer](https://transitions.dev/detail.html?t=organic-shimmer)<br>Pro 公开演示 | 对角扫动 3000ms 循环；`ease-out` | 方形占位中一条有机边界由左上向右下扫过，3000ms ease-out持续循环；Stop/Play控制。 | 流光恢复方形占位与3秒对角扫动；CSS独立曲面替代公开演示中的噪声位移。 | 官网以公开SVG噪声位移构成有机边界；本地独立采用CSS渐变曲面遮罩，保留行进方向/周期，边缘形状不作像素级相同声明。 |

## 统一构建验证

本轮已在最终编译产物上重跑以下检查，均无浏览器控制台异常或未捕获运行错误：

| 检查 | 通过 | 失败 | 覆盖与本地证据 |
| --- | ---: | ---: | --- |
| Transitions | 325 | 0 | 43 项浅深主题、320／375px 窄屏、暂停／重放／减少动效、真实浮层和键盘；补充 Panel／Accordion 实际中间帧、提示跨按钮、头像分段曲线等参数检查；`transitions-validation.json` |
| 常规页面与嵌套主题 | 26 | 0 | 本轮重跑；`shadcn-theme-validation.json` |
| 共享品牌与键盘 | 18 | 0 | 本轮重跑；`shadcn-brand-validation.json` |
| 历史动效与品牌预设 | 38 | 0 | 本轮重跑；`motion-regression.json` |
| 合计 | 407 | 0 | 四份记录均无浏览器运行错误 |

上述 JSON 为本地 `.impeccable/review/` 证据，不作为公共下载链接。`pnpm build` 与 `pnpm check` 均通过，正式预览 JavaScript 的构建输出为 1657.9kB。官网 43 项的行为观察与上表回归分别说明参照依据和本地实际执行，二者不能相互替代。

### 当前截图

本轮捕获 15 张 Chromium 截图，清单保存在本地 `fidelity-transitions-captures.json`；公开副本均位于 `docs/transition-assets/`。桌面为 1440px 宽、手机为 375px 宽，另记录 1264×712 的实际用户视口及 10 个关键交互状态。

| 视图 | 公开证据 |
| --- | --- |
| 浅色桌面 | [画廊与当前演示](transition-assets/fidelity-transitions-light-desktop.png) |
| 深色桌面 | [品牌深色画廊](transition-assets/fidelity-transitions-dark-desktop.png) |
| 浅色手机 | [375px 选择器与演示](transition-assets/fidelity-transitions-light-mobile.png) |
| 深色手机 | [375px 深色演示](transition-assets/fidelity-transitions-dark-mobile.png) |
| 实际用户视口 | [1264×712 画廊](transition-assets/fidelity-transitions-user-1264.png) |
| 面板揭示 | [纵向连续展开](transition-assets/fidelity-transitions-panel.png) |
| 页面交接 | [短距离页面切换](transition-assets/fidelity-transitions-page.png) |
| 折叠内容 | [内容与箭头状态](transition-assets/fidelity-transitions-accordion.png) |
| 页签 | [共享选中标记](transition-assets/fidelity-transitions-tabs.png) |
| 暂停对话框 | [可读与可关闭状态](transition-assets/fidelity-transitions-dialog-paused.png) |
| 通知 | [当前作用域的通知](transition-assets/fidelity-transitions-toast.png) |
| 矩阵反馈 | [独立相位结构](transition-assets/fidelity-transitions-feedback.png) |
| 图像生成 | [揭示后的品牌图像](transition-assets/fidelity-transitions-image-reveal.png) |
| 拖放 | [固定目标与落位结果](transition-assets/fidelity-transitions-drag.png) |
| 卡组 | [主卡与后卡扇出](transition-assets/fidelity-transitions-pro-stack.png) |

15 张新截图均已嵌入 Origin 来源信息。对公开截图目录 `docs/transition-assets/` 的检查为 20 张栅格图、0 张缺失来源信息；20 包含此前 5 张，不代表本轮新拍 20 张。

### 检测与独立终审

本轮只运行一次设计检测，原始报告有 **9 项 bounce 提示**，没有表述为零发现。它们分别涉及头像回位、卡组扇出、图片的进入／回收、喜欢轻压、开关微回弹、成功圆盘和 Spinner 完成交接，均是用户点名参考的局部有界弹性。`fidelity-transitions-detector-resolution.json` 逐条记录 9 项意图和适用范围，机械待修复项为 0；这些例外不扩展到全局产品控件。

**独立终审最终结论为 ship。** 初始五节报告 `transitions-fidelity-finish-review.md` 判定 fix，唯一实质问题是目录三处说明仍沿用旧机制。已将输入消散、彩屑和文字扫光说明同步到实际动效；随后 `pnpm build` 与 `pnpm check` 再次通过。独立 Verdict Pass（`transitions-fidelity-finish-verdict.md`）确认 1/1 项已解决、0 项剩余，并判定 ship。原 fix 报告保留，作为完整审阅历史。三处纯说明更改没有改变 UI、动效参数、状态交接或主题，因此已审阅的 407 项功能／动画检查与 15 张截图范围保持有效；Verdict Pass 仅只读复核对应文案，没有重新运行浏览器、测试、截图或检测。

复现命令及源码接入 API 沿用 [shadcn Transitions 实现记录](shadcn-transitions-2026-10-19.md)。本轮保留 43 项扩展、27 个基础源码组件、每模式 41 个 shadcn 变量，42 项 CSS3、1 项 CSS3 配合 Anime.js。

验证范围限于实际记录的 Chromium Web 场景；Canvas 弯曲、物理模拟及噪声边界的自主 CSS 实现具有明确近似边界。
