import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Flex, Select, Space, Tag, Typography, theme as antdTheme } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import snippets from '../../../reference/transitions/snippets.json';
import { decorateReferenceMarkup, referenceRootClasses } from '../../../reference/transitions/classes.mjs';

const { Title, Paragraph, Text } = Typography;

const labels = {
  accordion: ['信息展开', '展开与收起沿内容所属区域发生。'],
  'avatar-group-hover': ['头像组响应', '指针经过时，邻近头像跟随响应；离开后复位。'],
  'card-resize': ['容器尺寸变化', '在同一位置展开更多内容，保留容器与内容的关系。'],
  'card-tilt': ['卡片跟随', '适合可选择的展示物；普通内容卡片保留静态。'],
  'checkbox-check': ['勾选描画', '选中状态立即成立，描画仅补充确认反馈。'],
  'icon-swap': ['图标状态替换', '同一位置的图标说明当前操作状态。'],
  'error-state-shake': ['输入错误反馈', '短促位移配合明确错误文案，输入后恢复。'],
  'input-clear-dissolve': ['输入清空', '保留真实输入、清空结果与焦点，按场景选用消散反馈。'],
  'learn-more-hover': ['链接方向反馈', '链接保持明确名称，方向图标轻量响应指针。'],
  'like-button': ['收藏确认', '颜色、图标填充与文字共同表达收藏状态。'],
  'menu-dropdown': ['菜单展开', '从触发位置附近建立菜单与操作的关系。'],
  modal: ['浮层进出', '演示浮层外观的进出；真实模态任务使用上方组件管理焦点。'],
  'number-pop-in': ['数字更新', '数值变化完成后仍可直接读取最终结果。'],
  'notification-badge': ['消息角标', '角标出现与消失表达新增消息，数字始终可读。'],
  'page-side-by-side': ['局部页面切换', '在同一局部空间内表达前后内容的切换。'],
  'plus-menu-morph': ['加号菜单变形', '触发图标与操作列表共享同一展开状态。'],
  'panel-reveal': ['局部面板展开', '面板从所属区域进入，保持与当前任务的关系。'],
  'shimmer-text': ['状态文字扫光', '仅用于短暂工作状态，演示按需播放一次。'],
  'skeleton-reveal': ['骨架到内容', '等待结束后让占位与真实内容连续交接。'],
  'success-check': ['完成确认', '描画反馈与明确文字同时确认操作已完成。'],
  'spinning-counter': ['滚动数字', '滚动过程结束后提供稳定、可读取的最终数值。'],
  'tabs-sliding': ['滑动选中标记', '选中标记追随当前页签，保持位置关系。'],
  'text-states-swap': ['状态文字切换', '旧状态退场后展示新状态，避免重叠阅读。'],
  'texts-reveal': ['分组文字呈现', '只在同组信息出现时使用短暂顺序，不用于整页滚动。'],
  toast: ['通知进出', '短暂反馈从当前上下文附近出现，结果仍有文字说明。'],
  toggle: ['开关状态', '滑块的位置与填充共同表达开关状态。'],
  tooltip: ['提示显隐', '指针悬停或键盘聚焦时，说明出现在触发位置附近。'],
};

const check = '<svg viewBox="0 0 48 48" width="44" height="44" fill="none" aria-hidden="true"><path d="M11 24l9 9 18-20" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const plus = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const markup = {
  accordion: '<div class="t-acc" data-open="false"><button class="t-acc-head" aria-expanded="false">查看发布说明<span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner">本次演示展示内容展开、图标转向和信息层级。再次操作即可收起。</div></div></div>',
  'avatar-group-hover': '<div class="t-avatar-group" aria-label="演示协作成员"><button class="t-avatar" aria-label="成员林">林</button><button class="t-avatar" aria-label="成员陈">陈</button><button class="t-avatar" aria-label="成员周">周</button><button class="t-avatar" aria-label="成员李">李</button></div>',
  'card-resize': '<div class="t-resize specimen-surface"><strong>项目摘要</strong><p>点击重放展开更多空间</p></div>',
  'card-tilt': '<div class="t-tilt" tabindex="0" aria-label="展示卡片，移动指针体验"><div class="t-tilt-card"><strong>产品设计空间</strong><p>移动指针，体验轻量的方向反馈。</p><div class="t-tilt-glare"></div></div></div>',
  'checkbox-check': '<button class="t-check" role="checkbox" aria-label="选择此任务" aria-checked="false"><svg viewBox="0 0 10.1668 10.1668" width="15" height="15" fill="none"><path d="M1 5.52L3.92 9.17L9.17 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>',
  'icon-swap': `<button class="t-icon-swap" data-state="a" aria-label="切换新建与完成图标"><span class="t-icon" data-icon="a">${plus}</span><span class="t-icon" data-icon="b">${check}</span></button>`,
  'error-state-shake': '<div class="t-input-wrap"><label for="demo-email">成员邮箱</label><div class="t-input"><input id="demo-email" type="email" value="member" aria-describedby="demo-error"/></div><p class="t-error-msg" id="demo-error">请填写完整的成员邮箱</p></div>',
  'input-clear-dissolve': '<div class="t-clear has-value"><input type="text" value="查找设计规范" aria-label="查找设计规范" placeholder="搜索设计规范"/><div class="t-clear-mirror" aria-hidden="true">查找设计规范</div><div class="t-clear-placeholder" aria-hidden="true">搜索设计规范</div><div class="t-clear-glow" aria-hidden="true"></div><button class="t-clear-btn" aria-label="清空搜索"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" stroke="currentColor" stroke-width="1.5"/></svg></button></div>',
  'learn-more-hover': '<button class="t-learn">查看项目详情<span class="t-learn-chevron"><svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path class="t-learn-arm t-learn-arm-top" d="M6 4L10 8" stroke="currentColor" stroke-width="1.5"/><path class="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" stroke="currentColor" stroke-width="1.5"/></svg></span></button>',
  'like-button': '<button class="t-like" data-liked="false" aria-pressed="false"><span class="t-like-icon"><svg class="t-like-heart" viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M20 5.5c-2.5-2.5-6-1-8 1-2-2-5.5-3.5-8-1-3 3 0 7.5 8 13 8-5.5 11-10 8-13Z" stroke-width="1.5" stroke-linejoin="round"/></svg></span><span class="t-like-particles" aria-hidden="true"></span><span class="like-label">收藏</span></button>',
  'menu-dropdown': '<div class="t-dropdown specimen-surface" data-origin="top-center"><strong>空间操作</strong><p>查看详情</p><p>复制链接</p></div>',
  modal: '<div class="t-modal specimen-surface" role="group" aria-label="浮层外观参考"><strong>发布已准备好</strong><p>这是局部动效参考，确认任务请使用真实 Dialog。</p></div>',
  'number-pop-in': '<span class="t-digit-group" aria-live="polite"><span class="t-digit">1</span><span class="t-digit">2</span><span class="t-digit" data-stagger="1">.</span><span class="t-digit" data-stagger="2">3</span></span>',
  'notification-badge': '<button class="notification-trigger" aria-label="演示消息通知">消息<span class="t-badge" data-open="false"><span class="t-badge-dot">1</span></span></button>',
  'page-side-by-side': '<div class="t-page-slide" data-page="1"><section class="t-page specimen-surface" data-page-id="1"><strong>项目概览</strong><p>演示项目与当前工作内容</p></section><section class="t-page specimen-surface" data-page-id="2"><strong>项目详情</strong><p>在同一位置继续查看详细信息</p></section></div>',
  'plus-menu-morph': `<div class="t-morph" data-open="false"><div class="t-morph-menu"><span>新建文档</span><span>新建任务</span></div><button class="t-morph-plus" aria-label="展开创建菜单" aria-expanded="false">${plus}</button></div>`,
  'panel-reveal': '<div class="t-panel-slide specimen-surface" data-open="false"><strong>补充说明</strong><p>保留当前页面，按需展开辅助内容。</p></div>',
  'shimmer-text': '<span class="t-shimmer" data-text="正在整理演示内容">正在整理演示内容</span>',
  'skeleton-reveal': '<div class="t-skel" data-state="loading"><div class="t-skel-skeleton"><i></i><i></i><i></i></div><div class="t-skel-content specimen-surface"><strong>内容已准备好</strong><p>真实数据替代占位，保留阅读位置。</p></div></div>',
  'success-check': `<div class="success-result"><span class="t-success-check" data-state="out" aria-hidden="true">${check}</span><span>操作已完成</span></div>`,
  'spinning-counter': '<div class="t-reel" role="status" aria-label="演示计数 123"></div>',
  'tabs-sliding': '<div class="t-tabs" role="tablist" aria-label="动效页签示例"><span class="t-tabs-pill" aria-hidden="true"></span><button class="t-tab" role="tab" aria-selected="true">概览</button><button class="t-tab" role="tab" aria-selected="false">任务</button><button class="t-tab" role="tab" aria-selected="false">成员</button></div>',
  'text-states-swap': '<span class="t-text-swap" role="status">正在准备内容</span>',
  'texts-reveal': '<div class="t-stagger is-shown"><strong class="t-stagger-line t-stagger-line--1">设计已就绪</strong><span class="t-stagger-line t-stagger-line--2">团队现在可以开始协作</span></div>',
  toast: '<div class="t-toast specimen-surface" role="status">演示草稿已保存</div>',
  toggle: '<button class="t-toggle" role="switch" data-on="false" aria-checked="false" aria-label="演示通知开关"><span class="t-toggle-thumb"></span></button>',
  tooltip: '<span class="t-tt-wrap"><button class="t-tt-trigger" aria-describedby="motion-tooltip">查看说明</button><span class="t-tt" id="motion-tooltip" role="tooltip">此处展示项目辅助说明</span></span>',
};

// The original fragment controllers and stylesheet run in an isolated document.
// No reference selector or reset can change Ant Design or shadcn components.
function referenceDocument(slug, token, mode) {
  const palette = {
    ink: token.colorText, muted: token.colorTextSecondary, bg: token.colorBgContainer,
    fill: token.colorFillQuaternary, line: token.colorBorder, primary: token.colorPrimary,
    error: token.colorError, selected: token.colorPrimaryBg,
  };
  const variables = Object.entries(palette).map(([name, value]) => `--demo-${name}:${value}`).join(';');
  const rootClasses = `${referenceRootClasses} mr:[--tabs-bar-bg:var(--demo-fill)] mr:[--tabs-pill-bg:var(--demo-bg)] mr:[--tabs-text-active:var(--demo-ink)] mr:[--tabs-text-muted:var(--demo-muted)] mr:[--tt-bg:var(--demo-bg)] mr:[--tt-fg:var(--demo-ink)] mr:[--shimmer-base:var(--demo-muted)] mr:[--shimmer-highlight:var(--demo-ink)] ${mode === 'dark' ? 'mr:scheme-dark' : 'mr:scheme-light'}`;
  const bodyClasses = 'mr:m-0 mr:text-[14px] mr:leading-[1.6] mr:[font-family:-apple-system,BlinkMacSystemFont,Segoe_UI,Microsoft_YaHei,sans-serif] mr:text-(--demo-ink) mr:bg-(--demo-bg) mr:[&_*]:box-border mr:[&_button]:[font:inherit] mr:[&_button]:text-inherit mr:[&_button]:cursor-pointer mr:[&_input]:[font:inherit] mr:[&_input]:text-inherit mr:[&_input]:min-w-0 mr:[&_input]:caret-(--demo-primary) mr:[&_:focus-visible]:outline-2 mr:[&_:focus-visible]:outline-(--demo-primary) mr:[&_:focus-visible]:outline-offset-[3px] mr:[&_p]:my-2 mr:[&_p]:text-(--demo-muted) mr:[&_strong]:font-semibold mr:[html[data-motion=paused]_&_*]:[animation-duration:0s]! mr:[html[data-motion=paused]_&_*]:[animation-delay:0s]! mr:[html[data-motion=paused]_&_*]:transition-none! mr:[html[data-motion=paused]_&_*::before]:[animation-duration:0s]! mr:[html[data-motion=paused]_&_*::before]:[animation-delay:0s]! mr:[html[data-motion=paused]_&_*::before]:transition-none! mr:[html[data-motion=paused]_&_*::after]:[animation-duration:0s]! mr:[html[data-motion=paused]_&_*::after]:[animation-delay:0s]! mr:[html[data-motion=paused]_&_*::after]:transition-none! mr:motion-reduce:[&_*]:[animation-duration:0s]! mr:motion-reduce:[&_*]:[animation-delay:0s]! mr:motion-reduce:[&_*]:transition-none! mr:motion-reduce:[&_*::before]:[animation-duration:0s]! mr:motion-reduce:[&_*::before]:[animation-delay:0s]! mr:motion-reduce:[&_*::before]:transition-none!';
  return `<!doctype html><html lang="zh-CN" data-theme="${mode}" class="${rootClasses}" style="${variables}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/vendor/motion-reference.css"></head><body class="${bodyClasses}"><div id="stage" class="mr:grid mr:h-[250px] mr:place-items-center mr:overflow-hidden mr:p-6"><div id="specimen" class="mr:grid mr:min-h-[170px] mr:w-full mr:max-w-[340px] mr:place-items-center">${decorateReferenceMarkup(markup[slug])}</div></div><script src="/vendor/transitions.js"></script><script>
    const slug=${JSON.stringify(slug)};const specimen=document.getElementById('specimen');const controls=CohesionTransitions.mount(slug,specimen);let step=0;let timer=0;
    function stopped(){return document.documentElement.dataset.motion==='paused'||matchMedia('(prefers-reduced-motion:reduce)').matches}
    function reel(value){const el=specimen.querySelector('.t-reel');el.setAttribute('aria-label','演示计数 '+value);el.replaceChildren();String(value).split('').forEach((digit,index)=>{const col=document.createElement('div');col.className=CohesionTransitions.classNames('t-reel-col');const strip=document.createElement('div');strip.className=CohesionTransitions.classNames('t-reel-strip');for(let n=0;n<20;n++){const cell=document.createElement('span');cell.className=CohesionTransitions.classNames('t-reel-digit');cell.textContent=n%10;strip.append(cell)}col.append(strip);el.append(col);strip.style.setProperty('--reel-y','0px');void strip.offsetHeight;strip.style.setProperty('--reel-transition',stopped()?'none':'transform var(--reel-dur) var(--reel-ease) '+index*90+'ms');strip.style.setProperty('--reel-y','-'+(10+Number(digit))*30+'px')})}if(slug==='spinning-counter')reel(123);
    function replay(){clearTimeout(timer);step++;const find=s=>specimen.querySelector(s);switch(slug){
      case'accordion':find('.t-acc-head').click();break;
      case'avatar-group-hover':{const avatars=specimen.querySelectorAll('.t-avatar');avatars[step%avatars.length].dispatchEvent(new MouseEvent('mouseenter'));timer=setTimeout(()=>find('.t-avatar-group').dispatchEvent(new MouseEvent('mouseleave')),450);break}
      case'card-tilt':{const el=find('.t-tilt');const r=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointermove',{clientX:r.right-12,clientY:r.top+12,pointerType:'mouse'}));timer=setTimeout(()=>el.dispatchEvent(new PointerEvent('pointerleave',{pointerType:'mouse'})),450);break}
      case'card-resize':{const el=find('.t-resize');el.dataset.expanded=String(step%2===1);break}
      case'checkbox-check':find('.t-check').setAttribute('aria-checked',String(step%2===1));break;
      case'icon-swap':find('.t-icon-swap').dataset.state=step%2?'b':'a';break;
      case'learn-more-hover':{const el=find('.t-learn');el.focus();const chevron=find('.t-learn-chevron');chevron.dataset.shift=String(step%2===1);break}
      case'like-button':{const el=find('.t-like');el.dataset.liked=String(step%2===1);el.setAttribute('aria-pressed',String(step%2===1));find('.like-label').textContent=step%2?'已收藏':'收藏';if(step%2&&!stopped()){el.classList.add('is-bursting');timer=setTimeout(()=>el.classList.remove('is-bursting'),650)}break}
      case'notification-badge':find('.t-badge').dataset.open=String(step%2===1);break;
      case'panel-reveal':find('.t-panel-slide').dataset.open=String(step%2===1);break;
      case'shimmer-text':{const el=find('.t-shimmer');el.classList.remove('is-playing');void el.offsetWidth;if(!stopped())el.classList.add('is-playing');break}
      case'spinning-counter':reel(123+step*137);break;
      case'toast':find('.t-toast').classList.toggle('is-open',step%2===1);break;
      case'toggle':{const el=find('.t-toggle');el.classList.add('is-init');el.dataset.on=String(step%2===1);el.setAttribute('aria-checked',String(step%2===1));break}
      case'tooltip':find('.t-tt-wrap').classList.toggle('is-preview',step%2===1);break;
      case'error-state-shake':controls.showError();break;
      case'input-clear-dissolve':{const input=find('input');input.value='查找设计规范';input.dispatchEvent(new Event('input',{bubbles:true}));if(stopped()){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus()}else find('.t-clear-btn').click();break}
      case'menu-dropdown':controls[step%2?'openDropdown':'closeDropdown']();break;
      case'modal':controls[step%2?'openModal':'closeModal']();break;
      case'number-pop-in':controls.setDigits((12.3+step*7.6).toFixed(1));break;
      case'page-side-by-side':controls.showPage(step%2+1);break;
      case'plus-menu-morph':controls.setOpen(step%2===1);break;
      case'skeleton-reveal':stopped()?controls.reveal():controls.replay();break;
      case'success-check':controls.showCheck();break;
      case'tabs-sliding':specimen.querySelectorAll('.t-tab')[step%3].click();break;
      case'text-states-swap':if(stopped()){find('.t-text-swap').textContent=step%2?'内容已准备好':'正在准备内容'}else controls.swapText(step%2?'内容已准备好':'正在准备内容');break;
      case'texts-reveal':controls[step%2?'hideText':'showText']();break;
    }}
    if(slug==='like-button'){const particles=specimen.querySelector('.t-like-particles');for(let i=0;i<8;i++){const dot=document.createElement('i');dot.style.setProperty('--px',Math.cos(i*Math.PI/4)*24+'px');dot.style.setProperty('--py',Math.sin(i*Math.PI/4)*24+'px');particles.append(dot)}}
    specimen.addEventListener('click',event=>{if(event.target.closest('.t-check,.t-icon-swap,.t-like,.notification-trigger,.t-toggle'))replay()});
    specimen.addEventListener('click',event=>{if(stopped()&&event.target.closest('.t-clear-btn')){event.preventDefault();event.stopImmediatePropagation();const input=specimen.querySelector('.t-clear input');input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus()}},true);
    function setPaused(paused){document.documentElement.dataset.motion=paused?'paused':'running';if(paused){const input=specimen.querySelector('.t-clear input');if(input)input.dispatchEvent(new Event('input',{bubbles:true}));if(slug==='skeleton-reveal')controls.reveal()}}
    specimen.addEventListener('keydown',event=>{if(event.target.matches('.t-tab')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const tabs=[...specimen.querySelectorAll('.t-tab')];const current=tabs.indexOf(event.target);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(current+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[next].click();tabs[next].focus()}});
    window.__cohesionMotionDemo={replay,setPaused};window.addEventListener('pagehide',()=>{clearTimeout(timer);controls.destroy()});
  </script></body></html>`;
}

export default function MotionReferences({ mode, stopped }) {
  const { token } = antdTheme.useToken();
  const [slug, setSlug] = useState('success-check');
  const frame = useRef(null);
  const source = useMemo(() => referenceDocument(slug, token, mode), [slug, token, mode]);
  const applyPreference = () => frame.current?.contentWindow?.__cohesionMotionDemo?.setPaused(stopped);
  useEffect(applyPreference, [stopped, source]);
  const available = Object.entries(snippets);
  return (
    <section className="ds-section tw:mt-12 tw:at-most-767:mt-10" aria-labelledby="motion-reference-heading">
      <div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]">
        <div><Title level={2} id="motion-reference-heading">组件动效参考</Title><Paragraph type="secondary">原有 {available.length} 类可交互动效保留在这里。独立参考用于按需组合，Ant Design 与 shadcn/ui 组件继续使用各自原生动效。</Paragraph></div>
        <Tag>原有参考 · {available.length} 类</Tag>
      </div>
      <div className="ds-panel tw:p-6 tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg,_8px)] tw:bg-[var(--ds-bg)] tw:min-w-0 tw:at-most-767:p-5" data-motion-reference={slug}>
        <Flex justify="space-between" wrap gap="middle" align="center">
          <Space wrap><Text strong>选择动效</Text><Select aria-label="选择组件动效参考" virtual={false} value={slug} onChange={setSlug} className="tw:w-[210px]" options={available.map(([key, snippet]) => ({ value: key, label: labels[key]?.[0] || snippet.name }))} /></Space>
          <Button aria-label="重放组件动效" icon={<ReloadOutlined />} onClick={() => frame.current?.contentWindow?.__cohesionMotionDemo?.replay()}>重放或切换状态</Button>
        </Flex>
        <Paragraph type="secondary" className="tw:mt-(--ant-token-margin-md)! tw:mb-0!">{labels[slug]?.[1]}</Paragraph>
        <iframe ref={frame} srcDoc={source} onLoad={applyPreference} title={`${labels[slug]?.[0] || snippets[slug].name}动效参考`} className="tw:block tw:h-[250px] tw:w-full tw:border-0" />
        <Flex justify="space-between" wrap gap="small"><Text type="secondary">{stopped ? '减少动效：直接展示状态变化，保留交互结果。' : '点击重放，也可在舞台内直接操作。演示一次仅运行一项。'}</Text><a href="/vendor/transitions-snippets.json" download>下载原始片段</a></Flex>
      </div>
    </section>
  );
}
