import React, { useEffect, useRef, useState } from 'react';
import { cn } from 'cn';
import {
  Alert, App, Avatar, Badge, Breadcrumb, Button, Checkbox, Drawer, Dropdown,
  Empty, Form, Input, Pagination, Progress, Radio, Segmented, Select,
  Skeleton, Space, Steps, Switch, Table, Tabs, Tag, Tooltip, theme,
} from 'antd';
import {
  ArrowRightOutlined, BellOutlined, CheckCircleOutlined, CheckOutlined,
  CopyOutlined, DeleteOutlined, DownloadOutlined,
  FileTextOutlined, FolderOutlined, MoreOutlined, PlusOutlined,
  SearchOutlined, SettingOutlined, UserOutlined,
} from '@ant-design/icons';

function useSurfaceTokens() {
  const { token } = theme.useToken();
  return {
    '--ds-example-bg': token.colorBgContainer,
    '--ds-example-subtle': token.colorFillAlter,
    '--ds-example-border': token.colorBorderSecondary,
    '--ds-example-text': token.colorText,
    '--ds-example-muted': token.colorTextSecondary,
    '--ds-example-primary': token.colorPrimary,
    '--ds-example-primary-bg': token.colorPrimaryBg,
    '--ds-example-radius': `${token.borderRadiusLG}px`,
  };
}

function Example({ title, description, children, note, className = '' }) {
  return (
    <section className={cn("ds-example tw:min-w-0", className)}>
      <div className="ds-example-heading tw:m-[0_0_16px] tw:[&_h2]:[font-size:18px] tw:[&_h2]:leading-[1.5] tw:[&_h2]:m-[0_0_6px] tw:[&_h2]:font-semibold tw:[&_p]:m-0 tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:leading-[1.75] tw:[&_p]:max-w-[68ch]"><h2>{title}</h2><p>{description}</p></div>
      <div className="ds-example-canvas tw:p-7 tw:[border:1px_solid_var(--ds-example-border)] tw:rounded-[var(--ds-example-radius,12px)] tw:bg-[var(--ds-example-bg)] tw:min-w-0 tw:min-[1500px]:p-8 tw:at-most-700:p-5">{children}</div>
      {note && <p className="ds-example-note tw:[font-size:12px] tw:text-[var(--ds-example-muted)] tw:leading-[1.7] tw:m-[10px_0_0]">{note}</p>}
    </section>
  );
}

function ActionExamples() {
  const { message, modal } = App.useApp();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const save = () => {
    setSaving(true);
    setSaved(false);
    timer.current = setTimeout(() => {
      setSaving(false);
      setSaved(true);
      message.success('演示草稿已保存');
    }, 850);
  };
  const remove = () => modal.confirm({
    title: '删除这份演示草稿？',
    content: '草稿将从当前演示中移除。正式产品中的不可撤销操作，应说明影响范围。',
    okText: '删除草稿', cancelText: '保留草稿',
    okButtonProps: { danger: true },
    onOk: () => message.success('演示草稿已删除'),
  });
  return <div className="ds-example-stack tw:flex tw:flex-col tw:gap-9 tw:min-w-0 tw:at-most-700:gap-7">
    <Example title="动作有主次" description="让最需要完成的动作清楚可见；辅助操作保持安静。" note="Button · 每个任务区域通常保留一个主要操作。">
      <div className="ds-action-context tw:flex tw:gap-4 tw:items-center tw:flex-wrap">
        <div className="ds-context-icon tw:w-11 tw:h-12 tw:grid tw:[place-items:center] tw:bg-[var(--ds-example-subtle)] tw:[font-size:22px] tw:rounded-[8px] tw:shrink-0 tw:text-[var(--ds-example-muted)]"><FileTextOutlined /></div>
        <div className="ds-context-copy tw:flex tw:flex-col tw:gap-[5px] tw:mr-auto tw:min-w-45 tw:[&_strong]:font-semibold tw:[&_span]:text-[var(--ds-example-muted)] tw:[&_span]:[font-size:13px] tw:[&_span]:leading-[1.7]"><strong>产品更新说明</strong><span>{saved ? '刚刚保存 · 演示文档' : '有未保存的修改 · 演示文档'}</span></div>
        <Space wrap>
          <Dropdown menu={{ items: [
            { key: 'copy', label: '复制演示文档', icon: <CopyOutlined /> },
            { key: 'download', label: '导出 Markdown', icon: <DownloadOutlined /> },
          ], onClick: ({ key }) => message.info(key === 'copy' ? '已创建演示副本' : '导出操作演示完成') }}>
            <Button icon={<MoreOutlined />} aria-label="更多文档操作" />
          </Dropdown>
          <Button onClick={() => message.info('预览已是当前示例的完整内容')}>预览</Button>
          <Button type="primary" icon={saved ? <CheckOutlined /> : undefined} loading={saving} onClick={save}>保存草稿</Button>
        </Space>
      </div>
    </Example>
    <Example title="同一语义，不同强度" description="依据任务权重选样式，依据空间和触控需求选尺寸。">
      <div className="ds-specimen-rows tw:flex tw:flex-col tw:gap-6">
        <div className="ds-specimen-row tw:flex tw:gap-6 tw:items-center tw:min-w-0 tw:at-most-700:items-start tw:at-most-700:flex-col tw:at-most-700:gap-3"><span className="ds-specimen-label tw:w-[86px] tw:shrink-0 tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:at-most-700:w-auto">视觉层级</span><Space wrap><Button type="primary" onClick={() => message.success('主要操作已完成')}>主要操作</Button><Button onClick={() => message.info('次要操作已完成')}>次要操作</Button><Button type="text" onClick={() => message.info('轻量操作已完成')}>轻量操作</Button><Button type="link" icon={<ArrowRightOutlined />} iconPlacement="end" onClick={() => message.info('链接操作演示')}>了解使用规范</Button></Space></div>
        <div className="ds-specimen-row tw:flex tw:gap-6 tw:items-center tw:min-w-0 tw:at-most-700:items-start tw:at-most-700:flex-col tw:at-most-700:gap-3"><span className="ds-specimen-label tw:w-[86px] tw:shrink-0 tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:at-most-700:w-auto">尺寸与状态</span><Space wrap><Button size="large" icon={<PlusOutlined />} onClick={() => message.success('演示项目已创建')}>新建项目</Button><Button size="middle" onClick={() => message.info('默认尺寸适合常规操作')}>默认尺寸</Button><Button size="small" onClick={() => message.info('紧凑尺寸适合密集工具栏')}>紧凑尺寸</Button><Button disabled>权限不足</Button><Tooltip title="下载演示文件"><Button icon={<DownloadOutlined />} aria-label="下载演示文件" onClick={() => message.success('下载操作演示完成')} /></Tooltip></Space></div>
        <div className="ds-specimen-row tw:flex tw:gap-6 tw:items-center tw:min-w-0 tw:at-most-700:items-start tw:at-most-700:flex-col tw:at-most-700:gap-3"><span className="ds-specimen-label tw:w-[86px] tw:shrink-0 tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:at-most-700:w-auto">危险操作</span><Space wrap><Button danger icon={<DeleteOutlined />} onClick={remove}>删除草稿</Button><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">高风险动作在执行前说明影响。</span></Space></div>
      </div>
    </Example>
  </div>;
}

function InputExamples() {
  const { message } = App.useApp();
  const [channels, setChannels] = useState(['web']);
  const [scope, setScope] = useState('team');
  const [notify, setNotify] = useState(true);
  return <div className="ds-example-stack tw:flex tw:flex-col tw:gap-9 tw:min-w-0 tw:at-most-700:gap-7">
    <Example title="输入有边界" description="标签始终可见，说明给出预期，错误靠近需要修正的位置。" note="Input / Select / Form · 占位符用于举例，不能替代字段标签。">
      <Form noValidate layout="vertical" className="ds-demo-form tw:max-w-[800px]" initialValues={{ name: '品牌内容空间', type: 'content', email: 'team@' }} onFinish={() => message.success('演示信息验证通过')}>
        <div className="ds-form-grid tw:grid tw:[grid-template-columns:repeat(2,minmax(0,1fr))] tw:gap-[0_28px] tw:min-w-0 tw:at-most-700:[grid-template-columns:1fr] tw:at-most-700:gap-0">
          <Form.Item label="空间名称" name="name" extra="2–24 个字符，可在创建后修改。" rules={[{ required: true, whitespace: true, message: '请填写空间名称' }, { min: 2, max: 24, message: '请输入 2–24 个字符' }]}><Input placeholder="例如：品牌内容空间" maxLength={24} showCount /></Form.Item>
          <Form.Item label="业务类型" name="type" rules={[{ required: true, message: '请选择业务类型' }]}><Select options={[{ value: 'content', label: '内容与媒体' }, { value: 'tool', label: '效率工具' }, { value: 'service', label: '生活服务' }]} /></Form.Item>
          <Form.Item label="联系邮箱" name="email" extra="用于接收空间管理通知。" rules={[{ required: true, message: '请填写联系邮箱' }, { type: 'email', message: '请填写完整的邮箱，例如 team@example.com' }]}><Input type="email" placeholder="team@example.com" /></Form.Item>
          <Form.Item label="只读信息" extra="只读用于展示，禁用用于暂不可编辑。"><Input value="cohesion.example / workspace" readOnly aria-label="只读空间地址" /></Form.Item>
        </div>
        <Button type="primary" htmlType="submit">验证信息</Button>
      </Form>
    </Example>
    <Example title="选择适合的控件" description="多选使用复选框，互斥选项使用单选，即时设置使用开关。">
      <div className="ds-choice-list tw:flex tw:flex-col tw:gap-6">
        <div className="ds-choice-row tw:[&_strong]:font-semibold tw:flex tw:items-center tw:justify-between tw:gap-6 tw:pb-6 tw:[border-bottom:1px_solid_var(--ds-example-border)] tw:[&:last-child]:pb-0 tw:[&:last-child]:[border-bottom:0] tw:[&_p]:[font-size:13px] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:leading-[1.7] tw:[&_p]:m-[4px_0_0] tw:at-most-700:items-start tw:at-most-700:flex-wrap tw:at-most-700:gap-[14px]"><div><strong>发布渠道</strong><p>可以同时选择多个渠道。</p></div><Checkbox.Group value={channels} onChange={setChannels} options={[{ value: 'web', label: '网页' }, { value: 'app', label: '应用' }, { value: 'mini', label: '小程序' }]} /></div>
        <div className="ds-choice-row tw:[&_strong]:font-semibold tw:flex tw:items-center tw:justify-between tw:gap-6 tw:pb-6 tw:[border-bottom:1px_solid_var(--ds-example-border)] tw:[&:last-child]:pb-0 tw:[&:last-child]:[border-bottom:0] tw:[&_p]:[font-size:13px] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:leading-[1.7] tw:[&_p]:m-[4px_0_0] tw:at-most-700:items-start tw:at-most-700:flex-wrap tw:at-most-700:gap-[14px]"><div><strong>可见范围</strong><p>每次只保留一个选项。</p></div><Radio.Group value={scope} onChange={e => setScope(e.target.value)} options={[{ value: 'team', label: '团队成员' }, { value: 'all', label: '所有人' }]} /></div>
        <div className="ds-choice-row tw:[&_strong]:font-semibold tw:flex tw:items-center tw:justify-between tw:gap-6 tw:pb-6 tw:[border-bottom:1px_solid_var(--ds-example-border)] tw:[&:last-child]:pb-0 tw:[&:last-child]:[border-bottom:0] tw:[&_p]:[font-size:13px] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:leading-[1.7] tw:[&_p]:m-[4px_0_0] tw:at-most-700:items-start tw:at-most-700:flex-wrap tw:at-most-700:gap-[14px]"><div><strong>评论通知</strong><p>{notify ? '有新评论时接收通知。' : '已关闭新评论通知。'}</p></div><Switch checked={notify} onChange={setNotify} aria-label="评论通知" /></div>
      </div>
    </Example>
    <Example title="状态可以被理解" description="视觉差异同时配合文字；颜色不独自承担信息。">
      <div className="ds-form-grid tw:grid tw:[grid-template-columns:repeat(2,minmax(0,1fr))] tw:gap-[0_28px] tw:min-w-0 tw:at-most-700:[grid-template-columns:1fr] tw:at-most-700:gap-0">
        <Form layout="vertical"><Form.Item label="校验失败" validateStatus="error" help="空间名称已存在，请换一个名称。"><Input defaultValue="品牌内容空间" status="error" /></Form.Item></Form>
        <Form layout="vertical"><Form.Item label="暂不可用" extra="管理员完成配置后即可编辑。"><Input placeholder="等待管理员配置" disabled /></Form.Item></Form>
      </div>
    </Example>
  </div>;
}

function NavigationExamples() {
  const { message } = App.useApp();
  const [tab, setTab] = useState('overview');
  const [view, setView] = useState('列表');
  const [page, setPage] = useState(1);
  return <div className="ds-example-stack tw:flex tw:flex-col tw:gap-9 tw:min-w-0 tw:at-most-700:gap-7">
    <Example title="位置、范围与视图" description="面包屑表达层级，标签页切换同级内容，分段选择切换同一份数据的视图。">
      <div className="ds-navigation-demo tw:flex tw:flex-col tw:gap-6">
        <Breadcrumb items={[{ title: <a href="#patterns">工作空间</a> }, { title: '品牌内容' }, { title: '内容详情' }]} />
        <Tabs activeKey={tab} onChange={setTab} items={[
          { key: 'overview', label: '内容概览', children: <div className="ds-tab-content tw:[&_strong]:font-semibold tw:flex tw:gap-4 tw:p-[18px_0_12px] tw:min-h-27 tw:items-start tw:[&>.anticon]:[font-size:24px] tw:[&>.anticon]:text-[var(--ds-example-primary)] tw:[&>.anticon]:mt-[2px] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:m-[6px_0_0] tw:[&_p]:leading-[1.75] tw:[&_p]:max-w-[58ch]"><FileTextOutlined /><div><strong>产品更新说明</strong><p>内容概览展示摘要与基本信息。切换标签后，导航位置与内容保持对应。</p></div></div> },
          { key: 'activity', label: '协作记录', children: <div className="ds-tab-content tw:[&_strong]:font-semibold tw:flex tw:gap-4 tw:p-[18px_0_12px] tw:min-h-27 tw:items-start tw:[&>.anticon]:[font-size:24px] tw:[&>.anticon]:text-[var(--ds-example-primary)] tw:[&>.anticon]:mt-[2px] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:m-[6px_0_0] tw:[&_p]:leading-[1.75] tw:[&_p]:max-w-[58ch]"><CheckCircleOutlined /><div><strong>周予更新了正文</strong><p>今天 14:32 · 演示协作记录</p></div></div> },
          { key: 'settings', label: '发布设置', children: <div className="ds-tab-content tw:[&_strong]:font-semibold tw:flex tw:gap-4 tw:p-[18px_0_12px] tw:min-h-27 tw:items-start tw:[&>.anticon]:[font-size:24px] tw:[&>.anticon]:text-[var(--ds-example-primary)] tw:[&>.anticon]:mt-[2px] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:m-[6px_0_0] tw:[&_p]:leading-[1.75] tw:[&_p]:max-w-[58ch]"><SettingOutlined /><div><strong>仅团队成员可见</strong><p>设置内容在同一空间内切换，保留用户上下文。</p></div></div> },
        ]} />
        <div className="ds-example-toolbar tw:flex tw:items-center tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-4"><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">当前视图：{view}</span><Segmented value={view} onChange={setView} options={['列表', '网格']} /></div>
        <div className={view === '网格' ? "ds-mini-grid tw:[&>div]:flex tw:[&>div]:gap-3 tw:[&>div]:items-center tw:[&>div]:p-[18px_16px] tw:[&>div]:bg-[var(--ds-example-subtle)] tw:grid tw:[grid-template-columns:repeat(3,minmax(0,1fr))] tw:gap-3 tw:[&>div]:flex-col tw:[&>div]:justify-center tw:[&>div]:min-h-30 tw:[&>div]:rounded-[8px] tw:[&_.anticon]:[font-size:24px] tw:at-most-700:gap-2 tw:at-most-700:[&>div]:p-[14px_8px] tw:at-most-700:[&>div]:[font-size:12px]" : "ds-mini-list tw:flex tw:flex-col tw:[&>div]:flex tw:[&>div]:gap-3 tw:[&>div]:items-center tw:[&>div]:p-[18px_16px] tw:[&>div]:bg-[var(--ds-example-subtle)] tw:[&>div+div]:[border-top:1px_solid_var(--ds-example-border)]"}>{['品牌素材', '产品内容', '服务指南'].map(title => <div key={title}><FolderOutlined /><span>{title}</span></div>)}</div>
      </div>
    </Example>
    <Example title="让流程和数量可预测" description="步骤表示有先后的任务，分页控制明确的数据范围。">
      <div className="ds-example-stack tw:flex tw:flex-col tw:min-w-0 ds-example-stack-tight tw:gap-5 tw:at-most-700:gap-[18px]"><Steps size="small" current={1} items={[{ title: '填写信息' }, { title: '预览确认' }, { title: '完成发布' }]} /><div className="ds-pagination-demo tw:flex tw:justify-between tw:items-center tw:gap-5 tw:flex-wrap"><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">正在查看第 {(page - 1) * 10 + 1}–{Math.min(page * 10, 48)} 条，共 48 条演示记录</span><Pagination current={page} onChange={setPage} total={48} pageSize={10} showSizeChanger={false} size="small" /></div><Button type="link" className="tw:self-start tw:px-0" onClick={() => message.info('流程示例停留在预览确认步骤')}>查看流程使用说明</Button></div>
    </Example>
  </div>;
}

function FeedbackExamples() {
  const { message, modal } = App.useApp();
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const drawerTrigger = useRef(null);
  const drawerWasOpen = useRef(false);
  const restoreDrawerFocus = () => {
    const trigger = drawerTrigger.current?.nativeElement || drawerTrigger.current;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  };
  useEffect(() => {
    const closed = drawerWasOpen.current && !drawer;
    drawerWasOpen.current = drawer;
    if (!closed) return undefined;
    const frame = requestAnimationFrame(restoreDrawerFocus);
    return () => cancelAnimationFrame(frame);
  }, [drawer]);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const reload = () => {
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 1200);
  };
  return <div className="ds-example-stack tw:flex tw:flex-col tw:gap-9 tw:min-w-0 tw:at-most-700:gap-7">
    <Example title="反馈与发生的位置相关" description="即时成功用短提示；需要持续关注的信息留在页面中。">
      <div className="ds-example-stack tw:flex tw:flex-col tw:min-w-0 ds-example-stack-tight tw:gap-5 tw:at-most-700:gap-[18px]"><Alert type="info" showIcon title="演示空间将在 7 天后自动归档" description="归档后仍可查看内容。你可以在空间设置中调整归档时间。" /><Alert type="success" showIcon title="全部更改已保存" /><Alert type="warning" showIcon title="有 2 项内容缺少封面" description="发布前请补充封面，草稿内容不会受到影响。" /><Alert type="error" showIcon title="连接中断，修改尚未同步" description="请检查网络连接后重试。当前输入内容已保留在页面中。" action={<Button size="small" onClick={() => message.success('演示连接已恢复')}>重试连接</Button>} /></div>
    </Example>
    <Example title="按任务选择反馈容器" description="短提示不打断工作；抽屉保留列表上下文；确认框保护有后果的操作。">
      <Space wrap><Button onClick={() => message.success('演示链接已复制')}>显示成功提示</Button><Button ref={drawerTrigger} onClick={() => setDrawer(true)}>打开详情抽屉</Button><Button onClick={() => modal.confirm({ title: '归档演示空间？', content: '空间成员将无法继续编辑，已发布内容不受影响。你可以稍后恢复空间。', okText: '归档空间', cancelText: '取消', onOk: () => message.success('演示空间已归档') })}>显示操作确认</Button></Space>
      <Drawer title="内容详情" size="min(480px, 100vw)" open={drawer} onClose={() => setDrawer(false)} afterOpenChange={open => { if (!open) requestAnimationFrame(restoreDrawerFocus); }} destroyOnHidden footer={<Button type="primary" onClick={() => setDrawer(false)}>完成查看</Button>}>
        <Tag color="success">已发布</Tag><h2 className="ds-drawer-title tw:[font-size:24px] tw:leading-[1.45] tw:[letter-spacing:-.02em] tw:m-[20px_0_12px]">让团队的每次协作更清晰</h2><p className="ds-muted tw:[font-size:13px] tw:leading-[1.7] tw:text-[var(--ds-muted)]">此处展示演示内容。详情抽屉让用户查看信息时，仍能保留原列表的位置与筛选状态。</p><dl className="ds-detail-list tw:m-[28px_0] tw:[&>div]:grid tw:[&>div]:[grid-template-columns:90px_1fr] tw:[&>div]:gap-5 tw:[&>div]:p-[14px_0] tw:[&>div]:[border-bottom:1px_solid_var(--ds-example-border)] tw:[&_dt]:text-[var(--ds-example-muted)] tw:[&_dd]:m-0 tw:[&_dd]:[overflow-wrap:anywhere] tw:at-most-700:[&>div]:[grid-template-columns:76px_1fr] tw:at-most-700:[&>div]:gap-3"><div><dt>所属空间</dt><dd>品牌内容</dd></div><div><dt>创建人</dt><dd>周予</dd></div><div><dt>更新时间</dt><dd>2026-10-19 14:32</dd></div></dl>
      </Drawer>
    </Example>
    <Example title="等待与空白都提供方向" description="骨架保留内容布局；空状态说明当前原因，并给出可执行的下一步。">
      <div className="ds-state-examples tw:grid tw:[grid-template-columns:1fr_1fr] tw:gap-7 tw:at-most-700:[grid-template-columns:1fr] tw:at-most-700:gap-6"><div className="ds-state-demo tw:min-w-0 tw:min-h-45 tw:[&+.ds-state-demo]:[border-left:1px_solid_var(--ds-example-border)] tw:[&+.ds-state-demo]:pl-7 tw:at-most-700:[&+.ds-state-demo]:[border-left:0] tw:at-most-700:[&+.ds-state-demo]:[border-top:1px_solid_var(--ds-example-border)] tw:at-most-700:[&+.ds-state-demo]:pl-0 tw:at-most-700:[&+.ds-state-demo]:pt-6"><div className="ds-example-toolbar tw:flex tw:items-center tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-4"><strong>加载状态</strong><Button size="small" onClick={reload} loading={loading}>重新加载示例</Button></div><Skeleton loading={loading} active avatar paragraph={{ rows: 2 }}><div className="ds-loaded-example tw:[&_strong]:font-semibold tw:flex tw:items-start tw:gap-[14px] tw:p-[12px_0] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:m-[6px_0_0] tw:[&_p]:[font-size:13px] tw:[&_p]:leading-[1.7]"><Avatar icon={<UserOutlined />} /><div><strong>团队更新已就绪</strong><p>点击重新加载，体验布局稳定的内容占位。</p></div></div></Skeleton></div><div className="ds-state-demo tw:min-w-0 tw:min-h-45 tw:[&+.ds-state-demo]:[border-left:1px_solid_var(--ds-example-border)] tw:[&+.ds-state-demo]:pl-7 tw:at-most-700:[&+.ds-state-demo]:[border-left:0] tw:at-most-700:[&+.ds-state-demo]:[border-top:1px_solid_var(--ds-example-border)] tw:at-most-700:[&+.ds-state-demo]:pl-0 tw:at-most-700:[&+.ds-state-demo]:pt-6">{hasContent ? <><div className="ds-loaded-example tw:[&_strong]:font-semibold tw:flex tw:items-start tw:gap-[14px] tw:p-[12px_0] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:m-[6px_0_0] tw:[&_p]:[font-size:13px] tw:[&_p]:leading-[1.7]"><Avatar icon={<FileTextOutlined />} /><div><strong>第一条演示内容</strong><p>创建成功。空状态在完成操作后替换为真实内容。</p></div></div><Button size="small" onClick={() => setHasContent(false)}>重置为空状态</Button></> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有创建内容"><Button type="primary" icon={<PlusOutlined />} onClick={() => { setHasContent(true); message.success('已创建第一条演示内容'); }}>创建第一条内容</Button></Empty>}</div></div>
    </Example>
  </div>;
}

const demoRows = [
  { key: '1', title: '产品更新说明', owner: '周予', status: 'published', date: '10 月 19 日', progress: 100 },
  { key: '2', title: '新成员入门指南', owner: '林禾', status: 'review', date: '10 月 18 日', progress: 72 },
  { key: '3', title: '品牌素材使用规范', owner: '陈可', status: 'draft', date: '10 月 17 日', progress: 35 },
];

function DataExamples() {
  const { message } = App.useApp();
  const [selected, setSelected] = useState([]);
  const statuses = { published: ['success', '已发布'], review: ['processing', '审核中'], draft: ['default', '草稿'] };
  return <div className="ds-example-stack tw:flex tw:flex-col tw:gap-9 tw:min-w-0 tw:at-most-700:gap-7">
    <Example title="数据服务于判断" description="主信息优先，状态有文字，相关操作紧随内容。表格不依赖颜色传达含义。" note="以下为演示数据；选择、排序和详情操作均可体验。">
      <div className="ds-example-toolbar tw:flex tw:items-center tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-4"><strong>最近内容</strong><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">{selected.length ? `已选择 ${selected.length} 项` : '3 条演示记录'}</span></div>
      <Table size="middle" dataSource={demoRows} pagination={false} scroll={{ x: 560 }} rowSelection={{ selectedRowKeys: selected, onChange: setSelected }} columns={[
        { title: '内容名称', dataIndex: 'title', key: 'title', render: value => <span className="ds-table-title tw:inline-flex tw:items-center tw:gap-[10px] tw:whitespace-nowrap tw:[&_.anticon]:text-[var(--ds-example-muted)]"><FileTextOutlined />{value}</span> },
        { title: '负责人', dataIndex: 'owner', key: 'owner', render: value => <Space size={8}><Avatar size={24}>{value.slice(0, 1)}</Avatar>{value}</Space> },
        { title: '状态', dataIndex: 'status', key: 'status', render: value => <Badge status={statuses[value][0]} text={statuses[value][1]} /> },
        { title: '更新日期', dataIndex: 'date', key: 'date', sorter: (a, b) => b.date.localeCompare(a.date) },
        { title: '操作', key: 'actions', render: (_, record) => <Button size="small" type="link" onClick={() => message.info(`已选择「${record.title}」的详情操作`)}>查看</Button> },
      ]} />
    </Example>
    <Example title="少量信息，清楚分组" description="头像识别人，标签分类内容，进度说明任务状态，避免把它们当成装饰。">
      <div className="ds-specimen-rows tw:flex tw:flex-col tw:gap-6"><div className="ds-specimen-row tw:flex tw:gap-6 tw:items-center tw:min-w-0 tw:at-most-700:items-start tw:at-most-700:flex-col tw:at-most-700:gap-3"><span className="ds-specimen-label tw:w-[86px] tw:shrink-0 tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:at-most-700:w-auto">协作成员</span><Space size={16}><Avatar.Group><Tooltip title="周予"><Avatar>周</Avatar></Tooltip><Tooltip title="林禾"><Avatar>林</Avatar></Tooltip><Tooltip title="陈可"><Avatar>陈</Avatar></Tooltip></Avatar.Group><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">3 位成员正在协作</span></Space></div><div className="ds-specimen-row tw:flex tw:gap-6 tw:items-center tw:min-w-0 tw:at-most-700:items-start tw:at-most-700:flex-col tw:at-most-700:gap-3"><span className="ds-specimen-label tw:w-[86px] tw:shrink-0 tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:at-most-700:w-auto">内容分类</span><Space wrap><Tag>产品更新</Tag><Tag>使用指南</Tag><Tag>品牌素材</Tag></Space></div><div className="ds-specimen-row tw:flex tw:gap-6 tw:items-center tw:min-w-0 tw:at-most-700:items-start tw:at-most-700:flex-col tw:at-most-700:gap-3"><span className="ds-specimen-label tw:w-[86px] tw:shrink-0 tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:at-most-700:w-auto">上传进度</span><div className="ds-progress-example tw:w-[min(100%,360px)] tw:[&_.ds-example-toolbar]:mb-1"><div className="ds-example-toolbar tw:flex tw:items-center tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-4"><span>品牌素材.zip</span><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">7.2 / 10 MB</span></div><Progress percent={72} showInfo={false} /><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">正在上传，请保持页面打开。</span></div></div><div className="ds-specimen-row tw:flex tw:gap-6 tw:items-center tw:min-w-0 tw:at-most-700:items-start tw:at-most-700:flex-col tw:at-most-700:gap-3"><span className="ds-specimen-label tw:w-[86px] tw:shrink-0 tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:at-most-700:w-auto">通知数量</span><Space size={24}><Badge count={3} size="small"><Button icon={<BellOutlined />} aria-label="查看 3 条演示通知" onClick={() => message.info('当前有 3 条演示通知')} /></Badge><Badge status="success" text="服务正常" /></Space></div></div>
    </Example>
  </div>;
}

const categoryAliases = { 操作: 'actions', 输入: 'input', 导航: 'navigation', 反馈: 'feedback', 数据: 'data', forms: 'input', buttons: 'actions' };
const categories = [
  { key: 'actions', label: '操作', children: <ActionExamples /> },
  { key: 'input', label: '输入', children: <InputExamples /> },
  { key: 'navigation', label: '导航', children: <NavigationExamples /> },
  { key: 'feedback', label: '反馈', children: <FeedbackExamples /> },
  { key: 'data', label: '数据', children: <DataExamples /> },
];

export default function ComponentsView({ category, onCategoryChange }) {
  const initialCategory = categoryAliases[category] || category;
  const [activeCategory, setActiveCategory] = useState(categories.some(item => item.key === initialCategory) ? initialCategory : 'actions');
  useEffect(() => {
    const key = categoryAliases[category] || category;
    if (categories.some(item => item.key === key)) setActiveCategory(key);
  }, [category]);
  return <div className="ds-components-view tw:text-[var(--ds-example-text)] tw:min-w-0 tw:motion-reduce:[&_*]:[scroll-behavior:auto]!" style={useSurfaceTokens()}>
    <header className="ds-page-heading tw:max-w-[760px] tw:[&_h1]:m-[0_0_12px] tw:[&_>_p]:m-0 tw:mb-9 tw:[&_h1]:[font-size:var(--ant-token-font-size-heading1,_38px)] tw:[&_h1]:[font-weight:var(--ds-strong)] tw:[&_h1]:leading-[1.23] tw:[&_h1]:mb-4 tw:[&_h1]:[letter-spacing:-.025em] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:max-w-[70ch] tw:[&_>_p]:[font-size:15px] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h1]:[font-size:30px] tw:at-most-767:[&_>_p]:[font-size:14px]"><h1>Ant Design 组件</h1><p>沿用 Ant Design 的成熟交互与状态，用一致的主题预设支撑内容、工具与服务。</p></header>
    <Tabs activeKey={activeCategory} onChange={key => { setActiveCategory(key); onCategoryChange?.(key); }} items={categories} className="ds-category-tabs tw:min-w-0" classNames={{ header: "tw:mb-7" }} />
  </div>;
}
