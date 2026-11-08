# shadcn 组件与交互动效核对

日期：2026-11-03。核查对象为 COHESION 品牌下的 shadcn 基础组件、组件与状态页、产品组合页，以及 43 项 Transitions 扩展。核对主题工厂、JSON/CSS Token、组件源码和 Chromium 实际渲染；Transitions 的行为测试覆盖浅深主题与 320/375px 窄屏。

## 结论

配色和交互整体符合预期。Neutral 表面保留 shadcn 的克制和层级，品牌绿用于主要动作、链接、选中、焦点与加载进度；危险操作单独使用红色语义。浅色/深色 Token 由同一主题工厂生成，41 个角色与公开 CSS、JSON 快照一致。未发现基础组件使用互相冲突的品牌色或状态色。

基础 Button、Input、Switch、Checkbox、Tabs、Select、Dialog、AlertDialog、DropdownMenu、Tooltip 与 Toast 的交互反馈保持轻量；画廊中的强视觉效果独立展示，避免把 3D、扫光或粒子效果强加给常规业务控件。页面的浅色全局氛围与组件内部白色/中性色表面层级兼容，菜单选中和键盘焦点能被清楚识别。

## 配色核对

| 检查项 | 结果 |
| --- | --- |
| 浅色主色 | `#167C4B`；白字默认态对比度 5.225:1，hover 4.558:1，active 8.520:1 |
| 深色主色 | `#519F77` 配 `#141414` 前景；默认态 5.768:1，hover 7.429:1，active 4.513:1 |
| 危险操作 | 浅色默认/hover/active 分别 4.525/4.523/4.618:1；深色为 4.529/4.533/6.135:1 |
| 链接与菜单选中 | 浅色链接三态最低 4.958:1，菜单选中 4.513:1；深色链接三态最低 4.542:1，菜单选中 4.550:1 |
| 焦点与选择 | 输入焦点使用不透明品牌环；Checkbox、Switch 使用主色和匹配前景；错误状态另有红色边界、文案和提示 |
| 主题镜像 | 每模式 41 个语义变量；工厂、快照、公开 JSON、ShadowRoot CSS 与实际渲染一致 |

最低项达到当前检查阈值 4.5:1，但余量不大；后续调品牌色时需继续运行实际渲染对比检查，不能只看源色值。

## 交互与动效核对

- Select 弹层在触发器下方对齐起始边，宽度与触发器匹配；选中项和键盘焦点都有品牌色提示。浅深主题下 Portal 都继承正确的作用域，Escape 关闭后焦点回到触发器。
- Dialog 与 AlertDialog 居中显示，遮罩与内容层次清楚；表单错误保留焦点并显示文字，Escape 关闭后恢复焦点。页面滚动锁定没有造成主体宽度收缩。
- Button、Input、Switch、Checkbox、Tabs 的状态色来自语义角色；常规状态动效克制。全局暂停和系统减少动效能够停止持续动画，同时保留可读最终状态；恢复后动效可继续播放。
- 43 项 Transitions 是独立参考样例，不是要求业务页面默认启用的动效清单。浅深主题和窄屏下均可挂载、重放、暂停并保持内容可读；交互结果不依赖动画是否播放。
- Pro 图像展开、烟化和粒子效果在浅深主题下可真实操作；可打断、可恢复，减少动效时直接到达静态结果。

## 修复

- Token 搜索框曾将 Tailwind 样式文本误写进 `id`，造成包含空格和冒号的无效标识；现已改为 `sc-token-search-input`，并保留正确的关联标签。
- Token 搜索、禁用空间标识、产品更新开关、发布渠道组，以及产品设置页的每周开关和订阅组，其可见辅助说明此前未全部通过 `aria-describedby` 关联；现已补齐引用并加入浏览器回归检查。

## 验证

```text
pnpm build          passed (preview/app.js 1924.9 kB)
pnpm check          passed (generated themes and bundle current)
pnpm check:styles   passed
pnpm test:brand     passed (19 checks)
pnpm test:browser   passed (26 checks)
pnpm test:motion    passed (38 checks)
pnpm test:transitions passed (325 checks)
pnpm test:pro       passed (26 checks)
git diff --check    passed
```

五组浏览器专项共 434 项检查，0 失败、0 浏览器运行错误。Markdown 链接检查及组件源码检查也通过。

本次截图抽查与自动回归使用本机 Chromium；没有在 Safari、Firefox、真实移动设备或低性能设备上验证。4.5:1 对比度检查也不等于完整 WCAG 认证。
