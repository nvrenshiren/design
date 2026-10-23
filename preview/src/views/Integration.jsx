import React from 'react';
import { Alert, Button, Descriptions, Space, Tabs, Tag, Typography } from 'antd';
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import { themeSource } from '../../../theme/create-theme.mjs';
import shadcnPreset from '../../../theme/shadcn-tokens.json';

const example = `import { App, ConfigProvider } from 'antd';
import { createCohesionTheme } from './theme/create-theme.mjs';

<ConfigProvider
  theme={createCohesionTheme({
    mode: 'light',       // light | dark
    compact: false,     // 官方紧凑算法
    reducedMotion: false,
  })}
>
  <App><YourProduct /></App>
</ConfigProvider>`;
function AntDesignIntegration() {
  return <div className="ds-view">
    <Alert type="info" showIcon title="一份主题配置，连接完整系统" description="theme/cohesion-theme.json 记录品牌与可读性定制；create-theme.mjs 组合官方算法。CSS、JSON 快照与真实组件从这一配置派生。" />
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>以成熟预设作为基础</h2><p>使用真实 Ant Design 6.6.6 组件。默认字体、字号、控件尺寸、间距、圆角、阴影与动效来自对应版本的官方体系。</p></div><Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" items={[
      { key: 'library', label: '组件基础', children: 'Ant Design 6.6.6' }, { key: 'react', label: 'React', children: '18.3.1，同一运行实例' }, { key: 'theme', label: '主题', children: 'defaultAlgorithm / darkAlgorithm' }, { key: 'density', label: '密度', children: 'compactAlgorithm 组合' }, { key: 'source', label: '定制配置', children: <code>theme/cohesion-theme.json</code> }, { key: 'logo', label: 'Logo 资产', children: '原始三色保留' },
    ]} /></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>在产品根部提供主题</h2><p>通过 ConfigProvider 统一设置，不在业务代码中覆盖各个组件的内部样式。消息与弹窗使用 App 上下文，确保主题与业务一致。</p></div><div className="ds-code-block tw:bg-[var(--ant-token-color-fill-quaternary)] tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg)] tw:mb-5 tw:overflow-hidden tw:[&_>_div]:p-[12px_20px] tw:[&_>_div]:[border-bottom:1px_solid_var(--ds-line)] tw:[&_>_div]:flex tw:[&_>_div]:justify-between tw:[&_>_div]:[font-size:12px] tw:[&_>_div]:text-[var(--ds-muted)] tw:[&_pre]:p-6 tw:[&_pre]:leading-[1.9]"><div><span>React</span><Typography.Text copyable={{ text: example }}>复制示例</Typography.Text></div><pre><code>{example}</code></pre></div><Space wrap><Button href="./theme/create-theme.mjs" download icon={<DownloadOutlined />}>下载主题入口</Button><Button href="./theme/cohesion-theme.json" download icon={<DownloadOutlined />}>下载定制配置</Button></Space></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>生成值可以被追溯</h2><p>主题配置是入口，生成文件是消费产物。页面中展示的 token 与运行组件遵循同一配置。</p></div><div className="ds-source-flow tw:grid tw:[grid-template-columns:1fr_auto_1fr_auto_1fr] tw:items-center tw:gap-5 tw:p-[28px_24px] tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg)] tw:[&_>_div]:min-w-0 tw:[&_h3]:[font-size:16px] tw:[&_h3]:m-[12px_0_8px] tw:[&_code]:text-[var(--ds-muted)] tw:[&_>_span]:text-[var(--ds-muted)] tw:at-most-767:[grid-template-columns:1fr] tw:at-most-767:gap-5 tw:at-most-767:[&_>_span]:[transform:rotate(90deg)] tw:at-most-767:[&_>_span]:[justify-self:center]"><div><Tag>配置</Tag><h3>品牌与规则</h3><code>cohesion-theme.json</code></div><span aria-hidden="true">→</span><div><Tag>派生</Tag><h3>官方主题算法</h3><code>createCohesionTheme()</code></div><span aria-hidden="true">→</span><div><Tag>消费</Tag><h3>组件与 Token</h3><code>ConfigProvider / CSS / JSON</code></div></div><div className="ds-section-actions tw:flex tw:gap-3 tw:flex-wrap tw:items-center tw:mt-5"><Button href="./tokens/tokens.json" download icon={<DownloadOutlined />}>下载完整 Token 快照</Button><Button href="./tokens/tokens.css" download icon={<DownloadOutlined />}>下载 CSS 变量</Button><Button href="./dist/README.md" icon={<ExportOutlined />}>分发包说明</Button></div></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>可审查的品牌定制</h2><p>这份配置包含 Logo 资产、品牌种子以及统一的可读性调整。调整后的主题属于 COHESION，不被标记为官方原版。</p></div><div className="ds-code-block tw:bg-[var(--ant-token-color-fill-quaternary)] tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg)] tw:mb-5 tw:[&_>_div]:p-[12px_20px] tw:[&_>_div]:[border-bottom:1px_solid_var(--ds-line)] tw:[&_>_div]:flex tw:[&_>_div]:justify-between tw:[&_>_div]:[font-size:12px] tw:[&_>_div]:text-[var(--ds-muted)] tw:[&_pre]:p-6 tw:[&_pre]:leading-[1.9] ds-source-config tw:max-h-[380px] tw:overflow-auto"><pre><code>{JSON.stringify(themeSource, null, 2)}</code></pre></div></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>运行、构建与校验</h2><p>文档自有布局由 tw: 工具类预编译，Ant Design 保留官方 reset 与 CSS-in-JS。静态预览不在浏览器加载 Tailwind 编译器。</p></div><div className="ds-code-block tw:bg-[var(--ant-token-color-fill-quaternary)] tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg)] tw:mb-5 tw:overflow-hidden tw:[&_>_div]:p-[12px_20px] tw:[&_>_div]:[border-bottom:1px_solid_var(--ds-line)] tw:[&_>_div]:flex tw:[&_>_div]:justify-between tw:[&_>_div]:[font-size:12px] tw:[&_>_div]:text-[var(--ds-muted)] tw:[&_pre]:p-6 tw:[&_pre]:leading-[1.9]"><pre><code>{`pnpm install --frozen-lockfile
node scripts/generate-antd-tokens.mjs
node scripts/generate-shadcn-tokens.mjs
node scripts/sync-preview.mjs
pnpm build
pnpm check
pnpm check:styles
pnpm serve`}</code></pre></div><p className="ds-muted tw:[font-size:13px] tw:leading-[1.7] tw:text-[var(--ds-muted)]">默认地址为 http://127.0.0.1:8766。源码与开发文档不作为预览站公开资源。</p></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>跨端共享规则，尊重平台</h2><p>Web 预览与 React 组件已实现。iOS、Android、Flutter 和小程序需要在接入项目完成单位、字体与原生组件转换，并在真实设备验证。</p></div><Space wrap><Button href="./README.md">阅读完整规范</Button><Button href="./platforms.md">查看跨端适配</Button><Button type="link" href="https://ant.design/docs/react/customize-theme-cn/" target="_blank" rel="noopener noreferrer">Ant Design 官方主题文档 <ExportOutlined /></Button></Space></section>
  </div>;
}


const shadcnSetup = `# 在目标产品目录执行，按提示确认框架与预设
pnpm dlx shadcn@4.22.0 init
pnpm dlx shadcn@4.22.0 add @shadcn/button @shadcn/card @shadcn/dialog`;
const shadcnExample = `import { Button } from "@/components/ui/button"

export function Actions() {
  return (
    <div className="flex gap-3">
      <Button variant="default">保存更改</Button>
      <Button variant="outline">次要操作</Button>
    </div>
  )
}`;

function ShadcnIntegration() {
  return <div className="ds-view">
    <Alert type="info" showIcon title="官方基础与逐科品牌主题" description="shadcn/ui 使用 New York / Neutral 基础、Tailwind 样式和 Radix 交互。主操作、焦点、选中及危险状态由共享品牌配置映射为语义变量；组件尺寸独立保留，不套用 compactAlgorithm。" />
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>当前实现与来源</h2><p>本项目保留官方预设与组件 variants，针对当前 React 18 与双体系文档补充兼容和隔离。</p></div><Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} items={[
      { key: 'registry', label: '官方 Registry', children: '@shadcn' },
      { key: 'preset', label: '样式与主题', children: 'new-york / COHESION（Neutral 基础）' },
      { key: 'base', label: '交互基础', children: 'Radix UI' },
      { key: 'cli', label: '源码来源 CLI', children: shadcnPreset.source.cliVersion },
      { key: 'tailwind', label: '样式编译', children: `Tailwind ${shadcnPreset.source.tailwindVersion}` },
      { key: 'theme', label: '主题变量', children: `${Object.keys(shadcnPreset.light).length} 个角色 × light / dark` },
    ]} /></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>源码、主题与生成路径</h2><p>CLI 配置记录在 components.json；源码以 sc: 工具类配合正式主题和 variant 编译。Transitions 静态关键帧由插件生成，产品按自己的构建方式接入。</p></div><div className="ds-table-wrap tw:w-full tw:overflow-x-auto tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg)] tw:at-most-767:mt-4"><table className="ds-token-table tw:w-full tw:[border-collapse:collapse] tw:min-w-[560px] tw:text-left tw:[font-size:13px] tw:[&_th]:p-[14px_20px] tw:[&_th]:[vertical-align:middle] tw:[&_th]:[border-bottom:1px_solid_var(--ds-line)] tw:[&_td]:p-[14px_20px] tw:[&_td]:[vertical-align:middle] tw:[&_td]:[border-bottom:1px_solid_var(--ds-line)] tw:[&_th]:[font-weight:var(--ds-strong)] tw:[&_thead]:bg-[var(--ant-token-color-fill-quaternary)] tw:[&_tbody_th]:font-normal tw:[&_tr:last-child_:is(th,td)]:[border-bottom:0] tw:[&_td:last-child]:text-[var(--ds-muted)]"><thead><tr><th>文件</th><th>职责</th></tr></thead><tbody>
      <tr><th><code>preview/shadcn/components/ui/</code></th><td>官方组件源码及本项目必要适配</td></tr>
      <tr><th><code>theme/shadcn-preset.json</code></th><td>官方 Neutral 基础与来源记录</td></tr>
      <tr><th><code>theme/create-shadcn-theme.mjs</code></th><td>共享逐科品牌角色，保留官方中性基础</td></tr>
      <tr><th><code>theme/shadcn-tokens.json</code></th><td>生成的浅深品牌主题快照，供页面与产品使用</td></tr>
      <tr><th><code>scripts/generate-shadcn-tokens.mjs</code></th><td>生成与检查独立主题 CSS</td></tr>
      <tr><th><code>preview/shadcn.css</code></th><td>Tailwind 标准基础、@theme／variant／source 与 sc: 前缀</td></tr>
      <tr><th><code>preview/shadcn/scope.tsx</code></th><td>adopted stylesheet 与同主题 Portal 边界</td></tr>
      <tr><th><code>theme/tailwind-motion.mjs</code></th><td>从 motion.config.mjs 生成静态关键帧，不代替布局工具类</td></tr>
      <tr><th><code>preview/shadcn/lib/motion-styles.tsx</code></th><td>有限轨迹数据通过 CSSOM／adopted sheet 播放，重放与卸载清理</td></tr>
    </tbody></table></div><div className="ds-section-actions tw:flex tw:gap-3 tw:flex-wrap tw:items-center tw:mt-5"><Button href="./theme/shadcn-tokens.json" download icon={<DownloadOutlined />}>下载 shadcn Token</Button><Button href="./preview/shadcn/tokens.css" download icon={<DownloadOutlined />}>下载作用域变量 CSS</Button><Button href="#shadcn">体验真实组件</Button></div></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>使用官方 CLI 接入产品</h2><p>先安装 new-york、neutral 与 Radix 基础，再应用本项目生成的品牌变量。同步 Button／Badge 的实体 hover、active 和焦点语义适配；仅替换 primary 会保留官方透明度状态，无法得到同样的对比度。</p></div><div className="ds-code-block tw:bg-[var(--ant-token-color-fill-quaternary)] tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg)] tw:mb-5 tw:overflow-hidden tw:[&_>_div]:p-[12px_20px] tw:[&_>_div]:[border-bottom:1px_solid_var(--ds-line)] tw:[&_>_div]:flex tw:[&_>_div]:justify-between tw:[&_>_div]:[font-size:12px] tw:[&_>_div]:text-[var(--ds-muted)] tw:[&_pre]:p-6 tw:[&_pre]:leading-[1.9]"><pre><code>{shadcnSetup}</code></pre></div><div className="ds-code-block tw:bg-[var(--ant-token-color-fill-quaternary)] tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg)] tw:mb-5 tw:overflow-hidden tw:[&_>_div]:p-[12px_20px] tw:[&_>_div]:[border-bottom:1px_solid_var(--ds-line)] tw:[&_>_div]:flex tw:[&_>_div]:justify-between tw:[&_>_div]:[font-size:12px] tw:[&_>_div]:text-[var(--ds-muted)] tw:[&_pre]:p-6 tw:[&_pre]:leading-[1.9]"><div><span>React</span><Typography.Text copyable={{ text: shadcnExample }}>复制示例</Typography.Text></div><pre><code>{shadcnExample}</code></pre></div><p className="ds-muted tw:[font-size:13px] tw:leading-[1.7] tw:text-[var(--ds-muted)]">下载的变量 CSS 使用 .shadcn-scope[data-shadcn-theme="light|dark"]；标准产品也可将同一组值映射到自己的 :root / .dark，并在 @theme 中映射扩展状态变量。本预览的组件源码保存完整适配。复制 Transitions 时让 Tailwind 扫描源码，并接入 motion.config.mjs 与正式关键帧插件；彩屑还需 MotionStyles。不要导入已删除的同名组件 CSS，也不把变量 CSS 当作独立组件库。</p></section>
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10"><div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><h2>双体系预览的隔离边界</h2><p>文档 tw: 与 shadcn sc: 工具类分别编译。shadcn 使用开放 ShadowRoot 的 adopted stylesheet 隔离 preflight；Dialog、Select 和菜单 Portal 留在同主题作用域。</p></div><Alert showIcon type="info" title="产品内保持一种清楚的基础" description="独立使用 shadcn/ui 的产品可按官方全局样式接入，无需复制本预览的 ShadowRoot 包装。当前源码针对 React 18 的按钮和输入 ref 做了兼容；演示数据和资料保存仅发生在本地。" /><div className="ds-section-actions tw:flex tw:gap-3 tw:flex-wrap tw:items-center tw:mt-5"><Button href="https://ui.shadcn.com/docs/theming" target="_blank" rel="noopener noreferrer">官方主题文档 <ExportOutlined /></Button><Button href="https://ui.shadcn.com/docs/installation" target="_blank" rel="noopener noreferrer">官方安装说明 <ExportOutlined /></Button></div></section>
  </div>;
}

export default function IntegrationView() {
  const [system, setSystem] = React.useState('antd');
  return <div className="ds-view"><div className="ds-page-heading tw:max-w-[760px] tw:[&_h1]:m-[0_0_12px] tw:[&_>_p]:m-0 tw:mb-9 tw:[&_h1]:[font-size:var(--ant-token-font-size-heading1,_38px)] tw:[&_h1]:[font-weight:var(--ds-strong)] tw:[&_h1]:leading-[1.23] tw:[&_h1]:mb-4 tw:[&_h1]:[letter-spacing:-.025em] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:max-w-[70ch] tw:[&_>_p]:[font-size:15px] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h1]:[font-size:30px] tw:at-most-767:[&_>_p]:[font-size:14px]"><h1>工程接入</h1><p>选择对应的组件体系，使用各自完整的官方预设。这里分别提供主题来源、源码结构与接入方式。</p></div><Tabs activeKey={system} onChange={setSystem} items={[
    { key: 'antd', label: 'Ant Design', children: <AntDesignIntegration /> },
    { key: 'shadcn', label: 'shadcn/ui', children: <ShadcnIntegration /> },
  ]} /></div>;
}
