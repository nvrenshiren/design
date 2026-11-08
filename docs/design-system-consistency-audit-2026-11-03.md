# COHESION 设计系统一致性审计

日期：2026-11-03。范围覆盖项目内 16 份 Markdown（含本报告）、主题源与生成快照、shadcn 基础源码、Transitions 目录、Tailwind 样式来源，以及运行中的本地预览。历史日期报告继续保留各自原始验证范围。

## 结论

共享主题源与 Token 生成物内部一致，组件目录、分类数量与预览页一致；抽查的浅深主题、Select、AlertDialog 和 Card resize 交互正常。修复了概览产品范围、历史报告的“当前”措辞、工作台旧视觉 brief，以及 `PRODUCT.md` 对 Tailwind 迁移状态的前后矛盾。Ant Design 补丁版本差距已升级并重新生成主题快照；升级后六组浏览器回归全部通过，共 613 项检查、0 失败、0 浏览器运行错误。

抽查的图标、Tailwind、Anime.js、Radix 与 Sonner 版本和 npm registry 当前版本一致。对 shadcn 官方组件源码仍未做“当前 registry 与本地改动逐文件”的上游差异同步；本仓库记录的是 2026-10-19 获取的源码快照。真实低性能设备、多浏览器和原生端不属于此次本地浏览器验证范围。

## 审计结果

| 范围 | 结果 |
| --- | --- |
| Markdown | 16 份项目文档；相对文件链接目标均存在 |
| Ant Design Token | `pnpm check` 确认 536 个 Token × 4 模式、408 组限定对比度配对、减少动效值和 CSS／JSON 镜像一致 |
| shadcn Token | 每模式 41 个语义／圆角变量；JSON 与 ShadowRoot CSS 匹配共享品牌源 |
| 组件与动效 | 27 个 shadcn 基础组件；Transitions 目录显示 43／43 项，六类数量为 6／5／9／7／8／8 |
| 依赖版本抽查 | `antd@6.6.8`、`@ant-design/icons@6.3.4`、`tailwindcss@4.3.3`、`animejs@4.5.0`、`radix-ui@1.8.1`、`sonner@2.0.8` 与核对时 npm registry 当前版本一致 |
| 自有视觉色 | 源码中 9 个显式 HEX 值均属于品牌 Logo、主色、品牌高光或深青品牌背景；没有发现与语义 Token 冲突的任意新色阶 |
| 生成和静态检查 | `pnpm build`、`pnpm check`、`pnpm check:styles` 与 `git diff --check` 通过 |
| 浏览器回归 | 6 组专项共 613 项检查，0 失败、0 浏览器运行错误；覆盖断点、基础页面、品牌、动效、43 项 Transitions 及商业效果 |
| 本地视觉抽查 | 概览浅深画布、shadcn Select、AlertDialog 与 Card resize 状态可见；43 项 Transitions 均通过自动化挂载与播放状态检查 |

## 发现与处理

### P1 · Ant Design 补丁版本落后（已修复）

审计时发现 `package.json`、`theme/cohesion-theme.json`、Token 快照以及 README／分发说明锁定 `antd@6.6.6`，低于官方发布的 6.6.8。6.6.7 修复生产构建 React 版本导出、卸载后延迟更新、Select 弹层内容继承表单校验状态等问题；6.6.8 修复 Modal／Popconfirm 回调和 Modal Token 样式等问题。见 [Ant Design 官方发布记录](https://github.com/ant-design/ant-design/releases)。

现已按精确版本将依赖更新到 `antd@6.6.8`，同步 `theme/cohesion-theme.json`、重新生成主题与分发快照，并重建预览。生成器报告 536 个 Token × 4 模式与 408 组对比度配对；升级后全套六组浏览器回归均通过，因此未发现版本升级导致的组件或视觉 Token 回归。

### P2 · shadcn CLI 版本是获取快照时的记录

`theme/shadcn-preset.json` 记录 CLI 4.22.0 与获取日期 2026-10-19。官方发布页随后列出 shadcn 4.23.0（2026-10-27），见 [shadcn/ui 官方发布记录](https://github.com/shadcn-ui/ui/releases)。CLI 不在运行依赖中，且 4.22.0 是源码获取的历史出处，不代表组件会自动跟随上游更新。`DESIGN.md` 已明确此版本为快照来源记录。若要同步组件，应逐文件审查上游差异并保留本地 ShadowRoot、React 18 与品牌适配；不应仅改元数据版本号。

### P2 · 文档与入口内容有陈旧的产品范围表述（已修复）

- `preview/src/views/Overview.jsx` 与 `index.html` 的概览说明此前仍把“内容、工具、服务”说成产品范围，与 `PRODUCT.md`／`DESIGN.md` 中的管理后台、C 端、商业展示三类产品定位不一致。现已同步首页主文案和搜索／分享元描述，并将交互样例标签从“预览产品类型”改为“预览业务场景”。
- `.impeccable/surfaces/index-html.md` 仍要求沿用旧方向，并把历史场景当成产品家族；现已改为服从 `PRODUCT.md`／`DESIGN.md` 的当前定位，补上浅深画布要求，并修复 “The63” 拼写。
- `DESIGN.md` 之前把 10 月 19 日的品牌与动效报告指作当前状态；`docs/shadcn-brand-and-motion-2026-10-19.md` 也写有“当前最新构建”。现已标为历史记录，指向后续迁移记录和本报告。`docs/theme-isolation-and-shadcn-2026-10-19.md` 的后续记录链接已同步。
- `README.md` 的组件清单将“本轮增加”留在长期说明中；现已改为当前组件集合描述，并说明 Tailwind 项目与非 Tailwind CSS Token 接入的适用范围。
- `index.html` 的搜索／分享描述仍列出旧的“内容、工具与服务”；现已与当前三类产品表达同步。
- `PRODUCT.md` 将全系统 Tailwind 迁移继续描述为“目标、提出后尚未迁移”，与当前已经完成的样式迁移记录矛盾；现已按当前实现及正式迁移记录改写，并说明生成 CSS、第三方样式与 Token 快照仍是必要产物。

### 视觉抽查结论

- 浅色页面有全局浅薄荷画布、细网格、青／绿装饰光晕与连接场素材；深色也有对应低亮度构图。此前关于“浅色没有全局背景与修饰素材”的描述不再符合当前页面。
- Select 的弹层锚定触发器，`align="start"` 左边界一致，弹层宽度约多 2px，属于边框盒差异。打开时 `body` 仍为 1265px，Radix 报告移除滚动条宽度 15px；AlertDialog 打开时页面主体同样保持 1265px，未观察到页面收缩。
- AlertDialog 可用 Escape／保留按钮关闭，焦点返回触发控件。Card resize 可展开详情并呈现稳定内容。上述为本地浏览器抽查，不替代自动化回归或 43 项逐项验收。

## 验证与限制

已运行：

```text
pnpm build          passed (preview/app.js 1924.5 KiB; app.css 2.8 kB)
pnpm check          passed (Ant Design 6.6.8; 536 tokens × 4 modes; 408 contrast pairs)
pnpm check:styles   passed
pnpm test:breakpoints passed (180 checks; 0 failed)
pnpm test:browser   passed (26 checks; 0 failed)
pnpm test:brand     passed (18 checks; 0 failed)
pnpm test:motion    passed (38 checks; 0 failed)
pnpm test:transitions passed (325 checks; 0 failed)
pnpm test:pro       passed (26 checks; 0 failed)
git diff --check    passed
```

浏览器回归合计 613 项，运行于升级后的当前工作树；六组为独立专项，覆盖断点、基础页面、品牌、动效、Transitions 与商业效果。另以 `pnpm view <package> version` 对照图标、样式与动效依赖版本，抽查版本均与 registry 相符。Token 工厂报告的 408 组对比度是限定配对检查，不等于完整 WCAG 或全部辅助技术认证。

本次检查确认的是仓库内部规范、生成文件、当前浏览器交互与历史验证记录之间的一致性。仍未核查 shadcn 源码与上游 registry 的逐文件差异；真实低性能设备、多浏览器和原生端也仍需在各自环境验证。
