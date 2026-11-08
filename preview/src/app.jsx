import React, { useEffect, useRef, useState } from 'react';
import { cn } from 'cn';
import { createRoot } from 'react-dom/client';
import { App as AntApp, Button, ConfigProvider, Divider, Drawer, Dropdown, Input, Modal, Segmented, Tag, Tooltip, theme as antTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ArrowRightOutlined, DesktopOutlined, MenuOutlined, MoonOutlined, PauseOutlined, PlayCircleOutlined, SearchOutlined, SunOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { createCohesionTheme, themeSource } from '../../theme/create-theme.mjs';
import { useCohesionTheme, useReducedMotion } from '../../dist/react/hooks.jsx';
import { NAV, readRoute } from './meta.js';
import { useFocusReturn } from './useFocusReturn.js';
import Overview from './views/Overview.jsx';
import { ColorsView, TypographyView, LayoutView } from './views/Foundations.jsx';
import ComponentsView from './views/Components.jsx';
import PatternsView from './views/Patterns.jsx';
import MotionView from './views/Motion.jsx';
import IntegrationView from './views/Integration.jsx';
import ShadcnView from './views/Shadcn.jsx';

// Seed the official motion boundary on the first render. Ant Design otherwise
// inserts its motion providers only on the first motion:false update, remounting
// every page below it. The isolated inner theme owns the actual motion setting.
const STABLE_MOTION_BOUNDARY = { token: { motion: false } };

function Logo({ compact = false, mode = 'light' }) {
  const image = mode === 'dark' ? '/白色.png' : '/原色.png';
  const size = compact
    ? 'tw:w-[116px] tw:h-[36px]'
    : 'tw:w-[168px] tw:h-[53px] tw:at-most-767:w-[128px] tw:at-most-767:h-10 tw:at-most-360:w-[112px] tw:at-most-360:h-[35px]';
  return <span className={cn('ds-logo tw:inline-flex tw:items-center tw:gap-[9px] tw:whitespace-nowrap tw:leading-[1] tw:at-most-767:gap-[5px]', compact && 'tw:gap-0')}><img className={cn('ds-logo-image tw:block tw:shrink-0 tw:object-cover tw:[object-position:center_42%]', size)} src={image} alt={compact ? '逐科 COHESION' : ''} />{!compact && <><span className="ds-logo-divider tw:w-[1px] tw:h-4 tw:bg-[var(--ds-border)] tw:m-[0_3px] tw:at-most-1023:hidden" aria-hidden="true" /><span className="ds-logo-label tw:[font-size:14px] tw:text-[var(--ds-muted)] tw:at-most-1023:hidden">设计系统</span></>}</span>;
}
function Navigation({ current, onSelect }) {
  return <nav aria-label="设计系统导航" className="ds-navigation tw:[flex:1]">{[...new Set(NAV.map(item => item.group))].map(group => <div className="ds-nav-group tw:mb-[26px]" key={group}><div className="ds-nav-group-title tw:text-[var(--ds-muted)] tw:[font-size:12px] tw:p-[0_16px_9px]">{group}</div>{NAV.filter(item => item.group === group).map(({ id, label, icon: Icon }) => <a key={id} href={`#${id}`} className={cn("ds-nav-item tw:text-[var(--ds-muted)] tw:flex tw:items-center tw:gap-3 tw:p-[10px_15px] tw:rounded-[var(--ant-token-border-radius)] tw:m-[3px_0] tw:[transition:color_.1s,_background-color_.1s] tw:min-h-10 tw:[&_>_.anticon]:[font-size:17px] tw:[&:hover]:bg-[var(--ant-token-color-fill-tertiary)] tw:[&:hover]:text-[var(--ds-ink)] tw:[&.is-current]:bg-[var(--ds-primary-bg)] tw:[&.is-current]:text-[var(--ant-token-color-primary-text)] tw:[&.is-current]:[font-weight:var(--ds-strong)] tw:motion-reduce:[transition:none]", current === id && "is-current")} aria-current={current === id ? 'page' : undefined} onClick={onSelect}><Icon aria-hidden="true" /><span>{label}</span>{current === id && <span className="ds-nav-marker tw:size-[5px] tw:ml-auto tw:rounded-[100%] tw:bg-current" aria-hidden="true" />}</a>)}</div>)}<div className="ds-nav-note tw:p-[10px_15px_20px] tw:mt-9 tw:[&_p]:text-[var(--ds-muted)] tw:[&_p]:[font-size:12px] tw:[&_p]:m-[12px_0_0] tw:[&_p]:leading-[1.8]"><span className="ds-brand-strokes tw:inline-flex tw:gap-1 tw:items-center tw:[&_i]:w-[19px] tw:[&_i]:h-1 tw:[&_i]:rounded-[4px] tw:[&_i]:block tw:[&_i:nth-child(1)]:[background:#42A136] tw:[&_i:nth-child(2)]:[background:#B1C640] tw:[&_i:nth-child(3)]:[background:#17A4BD]" aria-hidden="true"><i /><i /><i /></span><p>把一致做进细节，<br />让体验自然连接。</p></div></nav>;
}
function SearchDialog({ open, onClose }) {
  const [query, setQuery] = useState('');
  const input = useRef(null);
  const filtered = NAV.filter(item => `${item.label}${item.description}${item.id}`.toLowerCase().includes(query.toLowerCase()));
  return <Modal open={open} onCancel={onClose} title="搜索设计系统" footer={null} destroyOnHidden afterOpenChange={visible => { if (visible) { setQuery(''); input.current?.focus(); } }} width={560}>
    <Input ref={input} size="large" prefix={<SearchOutlined />} placeholder="搜索组件、色彩、布局…" aria-label="搜索组件与规范" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); document.querySelector('[data-search-result]')?.focus(); } if (event.key === 'Enter' && filtered[0]) { location.hash = filtered[0].id; onClose(); } }} />
    <div className="ds-search-results tw:flex tw:flex-col tw:gap-1 tw:mt-4 tw:[&_>_a]:flex tw:[&_>_a]:items-center tw:[&_>_a]:gap-4 tw:[&_>_a]:text-[var(--ds-ink)] tw:[&_>_a]:p-3 tw:[&_>_a]:rounded-[6px] tw:[&_>_a:hover]:bg-[var(--ds-primary-bg)] tw:[&_>_a_>_span:not(.anticon)]:[flex:1] tw:[&_strong]:block tw:[&_strong]:[font-size:14px] tw:[&_strong]:font-medium tw:[&_small]:block tw:[&_small]:text-[var(--ds-muted)] tw:[&_small]:mt-[3px] tw:[&_>_p]:p-[24px_12px] tw:[&_>_p]:text-[var(--ds-muted)]">{filtered.length ? filtered.map(item => <a key={item.id} data-search-result href={`#${item.id}`} onClick={onClose}><item.icon /><span><strong>{item.label}</strong><small>{item.description}</small></span><ArrowRightOutlined /></a>) : <p role="status">没有找到相关规范，试试“组件”或“主题”。</p>}</div>
  </Modal>;
}
function ThemeBridge({ mode, compact, stopped }) {
  const { token } = antTheme.useToken();
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.dataset.density = compact ? 'compact' : 'comfortable';
    document.documentElement.dataset.motion = stopped ? 'reduced' : 'standard';
    document.querySelector('meta[name="theme-color"]').content = token.colorBgContainer;
    const canvas = document.getElementById('ds-canvas-atmosphere');
    for (const [role, value] of Object.entries(themeSource.canvasAtmosphere[mode])) canvas?.style.setProperty(`--ds-canvas-${role}`, value);
  }, [mode, compact, stopped, token.colorBgContainer]);
  return null;
}
function Shell({ mode, setTheme, preference, compact, setCompact, paused, setPaused, reduced }) {
  const [route, setRoute] = useState(readRoute), [menuOpen, setMenuOpen] = useState(false), [searchOpen, setSearchOpen] = useState(false);
  const main = useRef(null), initial = useRef(true);
  const menuReturnTarget = useRef(null);
  const afterMenuChange = useFocusReturn(menuOpen, menuReturnTarget);
  useEffect(() => {
    const change = () => { menuReturnTarget.current = main.current; setRoute(readRoute()); setMenuOpen(false); };
    const key = event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value); } };
    window.addEventListener('hashchange', change); window.addEventListener('keydown', key);
    return () => { window.removeEventListener('hashchange', change); window.removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { document.title = `${NAV.find(item => item.id === route.id)?.label || '概览'} · COHESION 设计系统`; if (initial.current) { initial.current = false; return; } window.scrollTo({ top: 0, behavior: 'instant' }); main.current?.focus({ preventScroll: true }); }, [route.id]);
  const modes = [{ key: 'light', label: '浅色主题', icon: <SunOutlined /> }, { key: 'dark', label: '深色主题', icon: <MoonOutlined /> }, { key: 'system', label: '跟随系统', icon: <DesktopOutlined /> }];
  const page = route.id === 'colors' ? <ColorsView mode={mode} compact={compact} /> : route.id === 'typography' ? <TypographyView /> : route.id === 'layout' ? <LayoutView compact={compact} /> : route.id === 'components' ? <ComponentsView category={route.params.get('category')} onCategoryChange={category => { location.hash = `components?category=${category}`; }} /> : route.id === 'shadcn' ? <ShadcnView mode={mode} compact={compact} stopped={paused || reduced} /> : route.id === 'patterns' ? <PatternsView /> : route.id === 'motion' ? <MotionView theme={mode} paused={paused || reduced} /> : route.id === 'integration' ? <IntegrationView /> : <Overview compact={compact} stopped={paused || reduced} />;
  return <>
    <a className="ds-skip tw:fixed tw:left-4 tw:top-[-100px] tw:z-1100 tw:p-[12px_16px] tw:bg-[var(--ds-bg)] tw:rounded-[6px] tw:[&:focus]:top-3" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>跳到主要内容</a>
    <header className="ds-header tw:h-16 tw:flex tw:justify-between tw:items-center tw:p-[0_24px] tw:fixed tw:z-50 tw:inset-[0_0_auto] tw:[border-bottom:1px_solid_var(--ds-line)] tw:[background:color-mix(in_srgb,var(--ds-bg)_91%,transparent)] tw:[backdrop-filter:blur(18px)_saturate(1.08)] tw:gap-5 tw:at-most-1023:px-4 tw:at-most-767:gap-2 tw:at-most-767:[&_.ant-btn]:min-h-11 tw:at-most-767:[&_.ant-btn]:min-w-11 tw:at-most-360:px-2 tw:at-most-360:[&_.ant-btn]:min-w-11"><div className="ds-header-brand tw:flex tw:items-center tw:min-w-0 tw:gap-3 tw:[&_>_a]:flex tw:[&_>_a]:text-[var(--ds-ink)] tw:at-most-767:gap-2"><Button className="ds-mobile-menu tw:hidden tw:at-most-1023:inline-flex" type="text" icon={<MenuOutlined />} aria-label="打开设计系统导航" onClick={event => { menuReturnTarget.current = event.currentTarget; setMenuOpen(true); }} /><a href="#overview" aria-label="COHESION 设计系统首页"><Logo mode={mode} /></a><Tag className="ds-version tw:[font-size:11px] tw:leading-[18px] tw:m-0 tw:at-most-767:hidden">2.0</Tag></div><div className="ds-header-actions tw:flex tw:items-center tw:gap-2 tw:at-most-767:gap-0">
      <Button type="text" className="ds-search-button tw:text-[var(--ds-muted)] tw:gap-[10px] tw:[&_kbd]:ml-4 tw:[&_kbd]:p-[1px_5px] tw:[&_kbd]:[border:1px_solid_var(--ds-line)] tw:[&_kbd]:rounded-[4px] tw:[&_kbd]:text-[var(--ds-muted)] tw:[&_kbd]:[font-size:10px] tw:at-most-1250:[&_kbd]:hidden tw:at-most-767:[&_kbd]:hidden" icon={<SearchOutlined />} onClick={() => setSearchOpen(true)}><span className="ds-search-label tw:at-most-767:hidden">搜索规范与组件</span><kbd>Ctrl K</kbd></Button><Divider orientation="vertical" className="ds-header-divider tw:at-most-767:hidden" />
      <Segmented className="ds-density-control tw:at-most-767:hidden" size="small" aria-label="界面密度" value={compact ? 'compact' : 'comfortable'} options={[{ label: '舒适', value: 'comfortable' }, { label: '紧凑', value: 'compact' }]} onChange={value => setCompact(value === 'compact')} />
      <Tooltip title={preference === 'system' ? '主题：跟随系统' : `主题：${mode === 'light' ? '浅色' : '深色'}`}><Dropdown menu={{ items: modes.map((item, index) => ({ ...item, className: 'cohesion-motion-menu-item', style: { '--cohesion-motion-delay': `${index * 20}ms` } })), selectedKeys: [preference], onClick: ({ key }) => setTheme(key) }} trigger={['click']}><Button type="text" icon={mode === 'dark' ? <MoonOutlined /> : <SunOutlined />} aria-label="选择主题" /></Dropdown></Tooltip>
      <Tooltip title={reduced ? '系统已启用减少动效' : paused ? '恢复动效' : '暂停动效'}><Button type="text" icon={paused || reduced ? <PlayCircleOutlined /> : <PauseOutlined />} aria-label={paused ? '恢复动效' : '暂停动效'} aria-pressed={paused || reduced} onClick={() => setPaused(value => !value)} disabled={reduced} /></Tooltip>
    </div></header>
    <aside className="ds-sidebar tw:fixed tw:top-16 tw:bottom-0 tw:left-0 tw:w-[228px] tw:p-[28px_16px_24px] tw:flex tw:flex-col tw:[border-right:1px_solid_var(--ds-line)] tw:[background:color-mix(in_srgb,var(--ds-bg)_91%,transparent)] tw:[backdrop-filter:blur(18px)_saturate(1.08)] tw:overflow-y-auto tw:[scrollbar-width:thin] tw:at-most-1023:hidden"><Navigation current={route.id} /><div className="ds-sidebar-footer tw:[font-size:12px] tw:text-[var(--ds-muted)] tw:p-[20px_15px_0] tw:[border-top:1px_solid_var(--ds-line)] tw:[&_small]:block tw:[&_small]:m-[5px_0_0_12px] tw:[&_small]:[font-size:11px]"><span className="ds-online-dot tw:inline-block tw:size-[5px] tw:rounded-full tw:bg-[var(--ds-primary)] tw:mr-[7px] tw:[vertical-align:2px]" />Ant Design · shadcn/ui<small>各自预设，共享品牌</small></div></aside>
    <Drawer open={menuOpen} afterOpenChange={afterMenuChange} onClose={() => setMenuOpen(false)} title={<Logo compact mode={mode} />} placement="left" size={280} destroyOnHidden><Navigation current={route.id} onSelect={() => { menuReturnTarget.current = main.current; setMenuOpen(false); }} /><Segmented aria-label="移动端界面密度" value={compact ? 'compact' : 'comfortable'} options={[{ label: '舒适', value: 'comfortable' }, { label: '紧凑', value: 'compact' }]} onChange={value => setCompact(value === 'compact')} /></Drawer>
    <div className="ds-main-region tw:ml-[228px] tw:pt-16 tw:at-most-1023:m-0"><main id="main-content" ref={main} tabIndex={-1} className={cn("ds-main tw:max-w-[1264px] tw:p-[32px_48px_80px] tw:m-[0_auto] tw:min-h-[calc(100vh_-_180px)] tw:min-w-0 tw:[&:focus]:outline-none tw:min-[1600px]:pt-10 tw:at-most-1250:px-8 tw:at-most-767:p-[24px_20px_56px] tw:at-most-360:px-4", `ds-route-${route.id}`)}><div className="ds-breadcrumb tw:text-[var(--ds-muted)] tw:[font-size:12px] tw:flex tw:gap-[10px] tw:items-center tw:mb-[30px] tw:[&_span:first-child]:[font-size:11px] tw:[&_span:first-child]:[letter-spacing:.02em] tw:at-most-767:mb-6"><span>COHESION</span><span aria-hidden="true">/</span><span>{NAV.find(item => item.id === route.id)?.label}</span></div><div key={route.id} className="cohesion-motion-page">{page}</div></main><footer className="ds-footer tw:max-w-[1168px] tw:m-auto tw:p-[24px_0_32px] tw:[border-top:1px_solid_var(--ds-line)] tw:flex tw:gap-6 tw:items-center tw:text-[var(--ds-muted)] tw:[font-size:12px] tw:[&_>_a]:ml-auto tw:[&_>_a]:flex tw:[&_>_a]:gap-2 tw:[&_>_a]:items-center tw:at-most-1250:[margin-inline:32px] tw:at-most-1023:[margin-inline:32px] tw:at-most-767:py-6 tw:at-most-767:[margin-inline:20px] tw:at-most-767:flex-wrap tw:at-most-767:gap-4 tw:at-most-767:[&_>_span]:hidden tw:at-most-767:[&_>_a]:ml-auto tw:at-most-360:[margin-inline:16px] tw:at-most-360:gap-2"><Logo compact mode={mode} /><span>共享品牌，构建不同产品。</span><a href="#integration">查看工程接入 <ArrowRightOutlined /></a></footer></div>
    <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
  </>;
}
class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error(error); }
  render() { return this.state.failed ? <div className="ds-bootstrap tw:max-w-[620px] tw:m-[20vh_auto] tw:p-8 tw:[font-size:16px] tw:leading-[1.8]"><h1>预览暂时无法显示</h1><p>请刷新页面重试，或先阅读 <a href="./README.md">接入规范</a>。</p><button onClick={() => location.reload()}>刷新页面</button></div> : this.props.children; }
}
function Root() {
  const [mode, setTheme, preference] = useCohesionTheme();
  const [compact, setCompactState] = useState(() => { try { return localStorage.getItem('zk-density') === 'compact'; } catch (_) { return false; } });
  const [paused, setPaused] = useState(false), reduced = useReducedMotion();
  const setCompact = value => { setCompactState(value); try { localStorage.setItem('zk-density', value ? 'compact' : 'comfortable'); } catch (_) {} };
  return <ConfigProvider theme={STABLE_MOTION_BOUNDARY}><ConfigProvider locale={zhCN} theme={{ ...createCohesionTheme({ mode, compact, reducedMotion: reduced || paused }), inherit: false }}><AntApp><ThemeBridge mode={mode} compact={compact} stopped={reduced || paused} /><Shell {...{ mode, setTheme, preference, compact, setCompact, paused, setPaused, reduced }} /></AntApp></ConfigProvider></ConfigProvider>;
}
createRoot(document.getElementById('root')).render(<ErrorBoundary><Root /></ErrorBoundary>);
