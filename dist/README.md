# COHESION 2.0 · 主题与参考资源

这是一套可复制的主题、Token 与品牌动效参考资源。此目录的主题配置对应 **Ant Design 6.6.8**，需要由应用安装并通过 `ConfigProvider` 接入；此目录没有独立打包出一套替代 Ant Design 的完整组件库。

正式配置为源仓库的 `theme/cohesion-theme.json`，主题工厂为 `theme/create-theme.mjs`。Token CSS／JSON 通过 `node scripts/generate-antd-tokens.mjs` 生成，`--check` 校验派生结果与镜像；请从正式来源修改，不直接编辑生成文件。

shadcn/ui 的真实源码和官方 Neutral 预设在源仓库的 `preview/shadcn/` 与 `theme/shadcn-tokens.json`；它通过官方 CLI 接入目标产品，未在本目录重复打包。完整说明见源仓库 README。

## 产品类型与品牌边界

资源可作为管理后台、C 端产品、服务体验与商业展示项目的设计参考。后台优先评估 Ant Design 的数据与任务组件；定制型 C 端页面可评估 shadcn/ui；商业页面按既有技术栈、复杂度和维护能力选择主要组件体系，并在一个产品内保持一致。逐科自有产品沿用 COHESION 识别；客户品牌项目复用语义映射、状态、交互与动效方法，默认保留客户自己的 Logo、品牌色、字体和内容。完整的项目选型、场景组合和跨端适配原则见源仓库 [README](../README.md)、[DESIGN](../DESIGN.md) 与 [跨端适配](../platforms.md)。

## 目录

```text
dist/
├── theme/                          主题配置与运行时工厂
│   ├── cohesion-theme.json
│   ├── create-theme.mjs
│   ├── cohesion-motion.mjs
│   └── tailwind-cohesion-motion.mjs
├── tokens/
│   ├── cohesion-tokens.css         四种模式的变量与旧版兼容别名
│   └── cohesion-tokens.json        官方基线、定制结果、差异与检查记录
├── react/
│   ├── ThinkingOrb.jsx             可选 Canvas 品牌状态
│   ├── BorderBeam.jsx              可选边框光效加载封装
│   └── hooks.jsx                   主题、减少动效与可见性参考 Hook
├── js/
│   ├── orbs-engine.js
│   ├── orbs-presets.js
│   ├── border-beam.js
│   └── transitions.js              历史动效参考编排
├── graphics/
│   └── cohesion-field.svg          可选的静态连接线背景素材
├── css/
│   ├── cohesion-base.css           可选 cb: Tailwind 工具类生成物
│   ├── cohesion-base.classes.mjs   根节点、正文与 Orb 的类组合
│   └── transitions.css             历史动效参考 mr: Tailwind 生成物
└── cohesion-tailwind.preset.js      旧版 Tailwind v3 适配器
```

## Ant Design 接入

把 `theme/` 复制到应用源码目录。预览基线的依赖版本如下；产品应用使用自身的 React 实例，不额外加载预览的 React UMD 文件。

```sh
pnpm add --save-exact antd@6.6.8 @ant-design/icons@6.3.4 react@18.3.1 react-dom@18.3.1
```

```jsx
import React from 'react';
import { App as AntApp, Button, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import { createCohesionTheme } from './cohesion/theme/create-theme.mjs';

function SaveAction() {
  const { message } = AntApp.useApp();
  return <Button type="primary" onClick={() => message.success('更改已保存')}>保存更改</Button>;
}

export default function Product() {
  return (
    <ConfigProvider locale={zhCN} theme={createCohesionTheme({
      mode: 'light',
      compact: false,
      reducedMotion: false,
    })}>
      <AntApp><SaveAction /></AntApp>
    </ConfigProvider>
  );
}
```

`mode` 为 `light | dark`；`compact` 选择官方紧凑算法；`reducedMotion` 对应系统或用户动效偏好。主题工厂不监听系统偏好或替应用持久化选择。可参考 `react/hooks.jsx` 中的 `useCohesionTheme()` 和 `useReducedMotion()`，并在应用根部统一管理。SSR 项目还需处理服务端首屏主题。

组件内通过 `theme.useToken()` 读取当前模式。消息、通知和确认使用 `App.useApp()` 或官方 Hook，以继承主题上下文；具体规则见 [官方主题文档](https://ant.design/docs/react/customize-theme/)。

工厂保留官方字体、字号、间距、控件高度、圆角、阴影与动效预设。定制包括主色／链接种子、固定 Logo 三色、必要的可读性算法修正和深色主按钮前景。最终派生值以当前模式的结果为准。

## CSS 与 JSON

页面和组件通过 Tailwind 工具类消费 Token；非 React 页面同样可以加载变量与预编译工具类：

```html
<html data-theme="light" data-density="comfortable">
  <head>
    <link rel="stylesheet" href="/cohesion/tokens/cohesion-tokens.css">
    <link rel="stylesheet" href="/cohesion/css/cohesion-base.css">
  </head>
</html>
```

```jsx
import { cohesionBaseClasses } from './cohesion/css/cohesion-base.classes.mjs';

// 在使用 Tailwind 的应用内，布局直接使用应用自身的工具类。
<body className={cohesionBaseClasses.body}>
  <main className="rounded-(--ant-token-border-radius-lg) bg-(--ant-token-color-bg-container) p-(--ant-token-padding-lg) text-(--ant-token-color-text)">
    正文内容
  </main>
</body>
```

预编译 `cohesion-base.css` 仅包含 `cb:` 工具类，不会自动重置全局 `body` 或第三方组件。根节点使用 `cohesionBaseClasses.root`，正文使用 `cohesionBaseClasses.body`；应用自己的 Tailwind 类仍由应用构建。

主题由 `data-theme="light|dark"`、密度由 `data-density="comfortable|compact"` 选择。应用同时使用 `ConfigProvider` 和 CSS 导出时，应保持两者模式一致。

## 产品级动效配方

Tailwind v4 项目可在 CSS 入口加载共享动效插件：

```css
@plugin "./cohesion/theme/tailwind-cohesion-motion.mjs";
```

根据场景，在产品源码中按需使用以下类；它们只定义动效，不提供组件布局：

```jsx
<main key={route.id} className="cohesion-motion-page">{page}</main>
<Card className="cohesion-motion-card">...</Card>
<div className="cohesion-motion-dialog-content">...</div>
<span className="cohesion-motion-menu-item" style={{ '--cohesion-motion-delay': '24ms' }}>...</span>
```

页面内容淡入并上移 8px（240ms）；弹窗／抽屉正文轻入（220ms）；菜单与 Select 选项淡入并轻微移动（180ms，短菜单错峰最多 24ms／项、总计不超过 90ms）；可操作卡片在 hover 或 focus-within 时上移 3px。长列表、表格与密集菜单不逐项播放。Select 可用 Ant Design `optionRender` 将选项内容包入 `cohesion-motion-select-option`，并按索引设置错峰延迟。

浏览器系统减少动效会自动静止这些配方。用户级暂停时，应用还应在主题根节点设置 `data-motion="reduced"`；同时将 `reducedMotion: true` 传给 `createCohesionTheme`。卡片会保持原位，出入场直接呈现最终状态。Tailwind v3 项目可把插件作为配置的 `plugins` 项加载；两种版本都由应用已有的 Tailwind 编译，无新增运行时依赖。

## 可选品牌背景素材

`graphics/cohesion-field.svg` 是静态、透明背景的连接线与节点图形，适合放在概览或品牌介绍的画布层。将它作为 `background-image` 并限制在低对比度区域；正文表面、密集数据和功能状态不要叠加纹理。深色主题需降低显示强度，装饰图形不应传达任何状态含义。

CSS 提供变量与旧版 `--color-*`、`--zk-*`、组件别名的兼容映射，不会提供表单验证、焦点管理、键盘操作或完整组件样式。JSON 是本项目的四模式派生快照，不是 DTCG 标准或可直接运行的原生平台资源。

`cohesion-tailwind.preset.js` 保留 Tailwind v3 的旧项目接入方式，需同时加载 Token CSS。它不是本轮预览的样式基础，也没有 Tailwind v4 的专用配置。新 Ant Design 页面应优先使用正式主题，避免把旧别名继续扩展为另一套设计值。

## 可选品牌实验

默认组件使用 Ant Design 的内置反馈与过渡。以下资源只在需要品牌表达的场景中启用，不建议把循环效果扩散到常规表格、表单或操作按钮。

### ThinkingOrb

将 `react/` 与 `css/` 保持相对目录一起放入应用源码，将静态资源复制到站点资源目录。加载预编译 `cb:` 工具类，再按顺序加载无 React 依赖的引擎与预设：

```html
<link rel="stylesheet" href="/cohesion/css/cohesion-base.css">
<script src="/cohesion/js/orbs-engine.js"></script>
<script src="/cohesion/js/orbs-presets.js"></script>
```

```jsx
import { ThinkingOrb } from './cohesion/react/ThinkingOrb.jsx';

<ThinkingOrb
  state="working"
  size={64}
  theme="light"
  paused={false}
  aria-label="正在处理"
/>
```

`.jsx` 由应用构建工具编译。通过 `theme` 传入实际浅深模式，通过 `paused` 传入应用暂停状态。封装同时响应系统减少动效，并在不可见、后台或卸载时停止绘制及清理资源。引擎缺失时保留文字回退，可用 `onError` 接收错误。

### BorderBeam

```jsx
import { BorderBeam } from './cohesion/react/BorderBeam.jsx';

const content = <div className="completion-summary">内容已准备好</div>;
const preview = paused || reducedMotion ? content : (
  <BorderBeam theme="light" bundleUrl="/cohesion/js/border-beam.js">
    {content}
  </BorderBeam>
);
```

加载器先将工程的实际 React 实例桥接给 IIFE，再加载脚本；不要预先通过另一份 React UMD 执行该脚本。部署在子路径时，按实际地址传入 `bundleUrl`。加载期间或失败时保留业务内容，`onError` 可接收失败。

现有封装没有通用 `paused` 或 `motionPaused` 属性。需要应用级暂停时，像示例一样卸载光效并保留静态内容；内置引擎另外处理系统减少动效、可见性与后台状态。容器样式及 CSP 应允许其运行时样式和配置的资源路径。

### 历史 transitions 资源

`css/transitions.css` 与 `js/transitions.js` 是参考编排，不承担完整组件交互与无障碍语义。初始化后需在对应片段卸载时销毁：

```js
const controls = CohesionTransitions.mount('modal', container);
controls.openModal();
// 关闭时调用 controls.closeModal()；卸载时释放：
controls.destroy();
```

片段源码在源仓库 `reference/transitions/snippets.json`，Tailwind 类组合在 `reference/transitions/classes.mjs`。公开下载 `vendor/transitions-snippets.json` 已附带相同工具类，`mount()` 也会为历史 hook DOM 补全类；控制器销毁时释放观察器。时长、缓动及 CSS3 关键帧集中维护，`transitions.css` 是 Tailwind 编译输出。新产品对话框、抽屉与菜单优先使用 Ant Design 对应组件；不要把历史参考 DOM 直接当作完整生产实现。

## 维护与边界

在源仓库运行 `node scripts/generate-antd-tokens.mjs`、`pnpm build`、`pnpm check` 更新与校验。兼容命令 `node tokens/sync-tokens.mjs` 转交同一套生成器。

本目录没有业务后端、Figma 源文件、原生／小程序组件及自动平台转换器。跨端目标以仓库 [`platforms.md`](../platforms.md) 为准。第三方文件沿用对应许可；对外再分发前由维护者确定项目自身许可。
