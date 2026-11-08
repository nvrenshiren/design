# 局部主题修复与 shadcn/ui 补齐

日期：2026-10-19。

> 后续更正：本文保留补齐 shadcn/ui 时的实现与测试事实。用户随后指出黑白预设的色系与既有动效不符合整套品牌要求；主题已在官方 Neutral 基础上映射 COHESION 品牌角色，变量数量和动效范围也已调整。2026-10-19 后续的 Tailwind 接入见[迁移记录](tailwind-migration-2026-10-19.md)，当前静态镜像与源码一致性见[2026-11-03 一致性审计](design-system-consistency-audit-2026-11-03.md)。本文的 26 项结果不作为后续改动的验收结论。

用户验收指出两个问题：深色页面中浅色卡片的按钮配色错误；设计系统只有 Ant Design，缺少 shadcn/ui 的实际展示。本次沿用已有视觉方向，补齐真实实现与可复跑回归。

## 局部主题串色

Ant Design 的子 ConfigProvider 默认合并父级的组件覆盖。全局暗色主题配置了 `Button.primaryColor = #141414`；浅色示例虽更换了主题算法，却没有取消继承，因而得到浅绿底上的深色文字。只检查独立生成的 token 无法发现这一运行时合并问题。

概览中的两个固定主题样例现在显式使用 `inherit: false`，保留各自的 App 消息上下文，并继续显式传入密度和减少动效。浅色主按钮为 `#167C4B` 配白字，深色主按钮为 `#519F77` 配 `#141414`。常规只调整局部 token 的子主题仍可按需继承，主题工厂的全局行为没有被扩大修改。

回归检查直接读取编译页面的计算样式，覆盖父浅／深 × 舒适／紧凑 × 子浅／深，以及按钮默认、悬停、按下、次操作、Tag 和消息。该检查能发现原有继承错误，而非仅断言源码中写了 `inherit: false`。

## 两套真实组件体系

- 导航与概览分别提供 Ant Design 和 shadcn/ui 入口，工程接入也分别说明。
- shadcn/ui 采用官方 `@shadcn` registry，CLI 4.22.0，`new-york / neutral / Radix`。21 个组件以源码形式安装，保留官方 variants，并针对现有 React 18 补齐必要的 ref 兼容。
- `theme/shadcn-tokens.json` 记录 32 个语义／圆角变量的浅深预设与来源；生成器导出独立作用域 CSS，并支持不写入文件的 `--check`。
- shadcn 页面提供预设与 token、组件与状态、产品组合三个页签，包含真实校验、保存、Dialog、AlertDialog、Select、菜单、加载和空状态。
- shadcn 使用官方 Neutral 预设。Ant Design 的绿色配置与 compactAlgorithm 保留在自己的体系，页面明确说明二者的区别。

## 样式、浮层与动效隔离

Ant Design reset 与 Tailwind preflight 在同一文档中存在层叠冲突。shadcn 预览现在使用开放 ShadowRoot：Tailwind 标准基础、utility 和页面布局只注入对应 ShadowRoot；Dialog、Select、菜单等 Portal 也留在同一局部主题内。

Chromium 对 ShadowRoot 中的 CSS `@property` 注册支持有差异，可能导致 Tailwind 的边框、阴影与焦点环初值缺失。构建脚本从实际编译结果提取注册属性，在局部最低层提供初值，保持官方 utility 和状态的优先级。当前覆盖 41 个属性，未向主文档注册变量，也没有逐组件补写皮肤。

普通仅使用 shadcn/ui 的产品可按官方方式接入全局 Tailwind；ShadowRoot 是本双体系预览的集成边界。它不改变官方组件本身的布局与状态预设。

## 复跑

```sh
pnpm build
pnpm check
pnpm test:browser --screenshots
```

首次使用时按需执行 `pnpm exec playwright install chromium`。测试默认启动临时本地服务，结果写入 `.impeccable/review/shadcn-theme-validation.json`。场景数据为本地演示，不涉及业务后端或原生平台实现。

## 验证结果

`pnpm build`、`pnpm check` 通过；Ant Design 536 token × 4 模式及 408 颜色配对维持通过，shadcn JSON 与生成 CSS 一致。

`node scripts/verify-preview.mjs --screenshots`：26 项检查全部通过，浏览器运行错误为 0。检查含 8 种嵌套主题组合、18 种浅深／视口／页签组合、32 个 shadcn 变量，以及表单、浮层焦点、Portal 主题、加载暂停与 Ant Design 路由隔离。视口包含 320、375、1440px，另记录 1166px 用户环境截图。对比 CSS 颜色时按数值等价处理 OKLCH 百分比及序列化差异，避免把压缩格式误判为主题值变化。

独立 token 检查不代表实际继承和层叠一定正确。本次新增的 DOM 计算样式检查同时覆盖边框、阴影、选中态和按钮前景／背景，针对用户验收暴露的问题提供可复跑证据；仍不替代全平台、屏幕阅读器与生产业务验收。

独立审阅结论为 **ship**。审阅者逐张查看 9 张本轮截图并核对实现与 26 项既有行为记录，确认两项验收问题得到修复，未列出阻碍本轮交付的实质问题。审阅范围不扩展为所有组件、所有浏览器或辅助技术的认证。

公开代表截图：[shadcn/ui 预设入口](redesign-assets/shadcn-user-1166.png)、[真实组件与状态](redesign-assets/shadcn-components-desktop.png)、[局部浅深主题修复](redesign-assets/nested-themes-dark-desktop.png)。原始审阅与完整行为记录保存在本地 `.impeccable/review/`，不作为预览站公开资源。
