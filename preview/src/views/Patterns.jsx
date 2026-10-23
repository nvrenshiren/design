import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert, App, Avatar, Badge, Button, Checkbox, Descriptions, Drawer, Empty,
  Form, Input, Modal, Radio, Select, Space, Switch, Table, Tabs, Tag, theme,
} from 'antd';
import {
  ArrowRightOutlined, BellOutlined, CalendarOutlined, CheckCircleOutlined,
  CustomerServiceOutlined, FileTextOutlined,
  HomeOutlined, PlusOutlined, SearchOutlined, SettingOutlined, UserOutlined,
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

const initialContent = [
  { key: 'C-20261019-01', title: '10 月产品更新说明', category: '产品更新', status: 'published', owner: '周予', updated: '2026-10-19', views: 1280 },
  { key: 'C-20261018-02', title: '新成员入门指南', category: '使用指南', status: 'review', owner: '林禾', updated: '2026-10-18', views: 0 },
  { key: 'C-20261018-03', title: '让团队协作更清晰', category: '团队故事', status: 'published', owner: '陈可', updated: '2026-10-18', views: 936 },
  { key: 'C-20261017-04', title: '品牌素材使用规范', category: '品牌素材', status: 'draft', owner: '周予', updated: '2026-10-17', views: 0 },
  { key: 'C-20261016-05', title: '服务预约常见问题', category: '使用指南', status: 'published', owner: '沈言', updated: '2026-10-16', views: 684 },
  { key: 'C-20261015-06', title: '从想法到一次完整交付', category: '团队故事', status: 'draft', owner: '林禾', updated: '2026-10-15', views: 0 },
  { key: 'C-20261014-07', title: '工作空间权限说明', category: '使用指南', status: 'published', owner: '陈可', updated: '2026-10-14', views: 542 },
  { key: 'C-20261013-08', title: '移动端体验更新', category: '产品更新', status: 'review', owner: '沈言', updated: '2026-10-13', views: 0 },
];
const statusMeta = {
  published: { color: 'success', label: '已发布' },
  review: { color: 'processing', label: '待审核' },
  draft: { color: 'default', label: '草稿' },
  archived: { color: 'default', label: '已归档' },
};

function ContentPattern() {
  const { message, modal } = App.useApp();
  const [rows, setRows] = useState(initialContent);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [detailKey, setDetailKey] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm] = Form.useForm();
  const timer = useRef();
  const detailTrigger = useRef(null);
  const detailWasOpen = useRef(false);
  useEffect(() => {
    const closed = detailWasOpen.current && !detailKey;
    detailWasOpen.current = !!detailKey;
    if (!closed) return undefined;
    const frame = requestAnimationFrame(() => { if (detailTrigger.current?.isConnected) detailTrigger.current.focus({ preventScroll: true }); });
    return () => cancelAnimationFrame(frame);
  }, [detailKey]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const filtered = useMemo(() => rows.filter(row => (status === 'all' || row.status === status) && `${row.title} ${row.category} ${row.owner}`.toLowerCase().includes(query.trim().toLowerCase())), [rows, query, status]);
  const detail = rows.find(row => row.key === detailKey);
  const openDetails = (key, event) => { detailTrigger.current = event.currentTarget; setDetailKey(key); };
  const reset = () => { setQuery(''); setStatus('all'); setPage(1); setSelected([]); };
  const archive = () => modal.confirm({
    title: `归档选中的 ${selected.length} 项演示内容？`,
    content: '内容将进入已归档状态。此操作只改变当前页面中的演示数据。',
    okText: '归档内容', cancelText: '取消',
    onOk: () => {
      setRows(old => old.map(row => selected.includes(row.key) ? { ...row, status: 'archived' } : row));
      setSelected([]);
      setPage(1);
      message.success('选中的演示内容已归档');
    },
  });
  const createContent = values => {
    setCreating(true);
    timer.current = setTimeout(() => {
      const newRow = { key: `C-DEMO-${Date.now()}`, title: values.title.trim(), category: values.category, status: 'draft', owner: '周予', updated: '2026-10-19', views: 0 };
      setRows(old => [newRow, ...old]);
      reset();
      setCreating(false);
      setCreateOpen(false);
      createForm.resetFields();
      message.success('演示草稿已创建');
    }, 800);
  };
  const columns = [
    { title: '内容', dataIndex: 'title', width: 300, render: (_, row) => <button className="ds-content-title-button tw:border-0 tw:[background:none] tw:p-0 tw:text-left tw:[font:inherit] tw:text-inherit tw:cursor-pointer tw:flex tw:items-center tw:gap-3 tw:[&:hover]:text-[var(--ds-example-primary)] tw:[&:focus-visible]:[outline:2px_solid_var(--ds-example-primary)] tw:[&:focus-visible]:[outline-offset:4px] tw:[&:focus-visible]:rounded-[2px]" onClick={event => openDetails(row.key, event)}><span className="ds-content-file-icon tw:grid tw:[place-items:center] tw:shrink-0 tw:w-[34px] tw:h-10 tw:rounded-[6px] tw:bg-[var(--ds-example-subtle)] tw:text-[var(--ds-example-muted)] tw:[font-size:17px]"><FileTextOutlined /></span><span className="ds-content-title-copy tw:flex tw:flex-col tw:gap-1 tw:[&_strong]:font-medium tw:[&_small]:[font-size:12px] tw:[&_small]:text-[var(--ds-example-muted)] tw:[&_small]:font-normal"><strong>{row.title}</strong><small>{row.category}</small></span></button> },
    { title: '状态', dataIndex: 'status', width: 110, render: value => <Badge status={statusMeta[value].color} text={statusMeta[value].label} /> },
    { title: '负责人', dataIndex: 'owner', width: 110, render: value => <Space size={8}><Avatar size={24}>{value.slice(0, 1)}</Avatar><span>{value}</span></Space> },
    { title: '浏览量', dataIndex: 'views', width: 95, align: 'right', sorter: (a, b) => a.views - b.views, render: value => <span className="tw:tabular-nums">{value ? value.toLocaleString('zh-CN') : '—'}</span> },
    { title: '更新时间', dataIndex: 'updated', width: 128, sorter: (a, b) => a.updated.localeCompare(b.updated) },
    { title: '操作', key: 'operation', width: 70, render: (_, row) => <Button type="link" size="small" onClick={event => openDetails(row.key, event)}>详情</Button> },
  ];
  return <>
    <div className="ds-pattern-workspace tw:p-7 tw:[border:1px_solid_var(--ds-example-border)] tw:bg-[var(--ds-example-bg)] tw:rounded-[var(--ds-example-radius,12px)] tw:min-w-0 tw:min-[1500px]:p-8 tw:at-most-700:p-5">
      <header className="ds-pattern-intro tw:flex tw:justify-between tw:items-start tw:gap-6 tw:mb-6 tw:[&_h2]:[font-size:23px] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[letter-spacing:-.02em] tw:[&_h2]:m-[0_0_8px] tw:[&_h2]:font-semibold tw:[&_p]:m-0 tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:leading-[1.75] tw:[&_p]:max-w-[62ch] tw:at-most-700:flex-col tw:at-most-700:gap-[18px]"><div><h2>内容管理</h2><p>组织团队内容，从草稿到发布保持清晰。</p></div><Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>新建内容</Button></header>
      <div className="ds-filter-bar tw:flex tw:items-center tw:gap-3 tw:m-[24px_0_18px] tw:flex-wrap tw:at-most-700:[&>.ant-btn]:shrink-0">
        <Input className="ds-content-search tw:w-[280px] tw:max-w-full tw:at-most-700:w-full" aria-label="搜索内容、分类或负责人" placeholder="搜索内容、分类或负责人" prefix={<SearchOutlined />} allowClear value={query} onChange={e => { setQuery(e.target.value); setPage(1); setSelected([]); }} />
        <Select className="ds-status-filter tw:w-36 tw:at-most-700:[flex:1]" aria-label="筛选内容状态" value={status} onChange={value => { setStatus(value); setPage(1); setSelected([]); }} options={[{ value: 'all', label: '全部状态' }, ...Object.entries(statusMeta).map(([value, meta]) => ({ value, label: meta.label }))]} />
        {(query || status !== 'all') && <Button type="text" onClick={reset}>重置筛选</Button>}
      </div>
      <div className="ds-content-meta tw:flex tw:justify-between tw:items-center tw:gap-4 tw:m-[0_0_14px] tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:min-h-8 tw:flex-wrap"><span aria-live="polite">{selected.length ? `已选择 ${selected.length} 项` : `共 ${filtered.length} 项内容 · 演示数据`}</span>{selected.length > 0 && <Space><Button size="small" onClick={() => setSelected([])}>取消选择</Button><Button size="small" onClick={archive}>归档选中项</Button></Space>}</div>
      <Table columns={columns} dataSource={filtered} size="middle" scroll={{ x: 820 }} rowSelection={{ selectedRowKeys: selected, onChange: setSelected }} pagination={{ current: page, pageSize: 5, total: filtered.length, showSizeChanger: false, showTotal: total => `共 ${total} 项`, onChange: setPage, hideOnSinglePage: false }} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有符合条件的内容"><Button onClick={reset}>重置筛选</Button></Empty> }} />
    </div>
    <div className="ds-pattern-caption tw:flex tw:gap-6 tw:flex-wrap tw:items-start tw:m-[18px_0_0] tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.8] tw:[&_strong]:font-medium tw:[&_strong]:text-[var(--ds-example-text)] tw:at-most-700:gap-2 tw:at-most-700:flex-col"><span><strong>适用于</strong> 内容管理、资料库、工具任务列表。</span><span><strong>组合规则</strong> 筛选在列表上方，详情在抽屉中查看，批量操作随选择出现。</span></div>
    <Drawer title="内容详情" size="min(480px, 100vw)" open={!!detail} onClose={() => setDetailKey(null)} afterOpenChange={open => { if (!open) requestAnimationFrame(() => { if (detailTrigger.current?.isConnected) detailTrigger.current.focus({ preventScroll: true }); }); }} destroyOnHidden footer={detail && <Space><Button onClick={() => setDetailKey(null)}>关闭</Button>{detail.status !== 'published' && detail.status !== 'archived' && <Button type="primary" onClick={() => { setRows(old => old.map(row => row.key === detail.key ? { ...row, status: 'published' } : row)); message.success('演示内容已发布'); }}>发布内容</Button>}</Space>}>
      {detail && <><Tag color={statusMeta[detail.status].color}>{statusMeta[detail.status].label}</Tag><h2 className="ds-drawer-title tw:[font-size:24px] tw:leading-[1.45] tw:[letter-spacing:-.02em] tw:m-[20px_0_12px]">{detail.title}</h2><p className="ds-muted tw:[font-size:13px] tw:leading-[1.7] tw:text-[var(--ds-muted)]">这是一条演示内容。详情与列表共享同一份状态，发布操作会同步反映在列表中。</p><Descriptions column={1} size="small" className="tw:mt-7" items={[{ key: 'category', label: '内容分类', children: detail.category }, { key: 'owner', label: '负责人', children: detail.owner }, { key: 'updated', label: '更新时间', children: detail.updated }, { key: 'views', label: '浏览量', children: detail.views.toLocaleString('zh-CN') }, { key: 'id', label: '内容编号', children: detail.key }]} /><Alert type="info" title="仅用于交互演示" description="修改保存在当前页面内，刷新后恢复演示数据。" showIcon className="tw:mt-7" /></>}
    </Drawer>
    <Modal title="新建内容" open={createOpen} onCancel={() => { if (!creating) setCreateOpen(false); }} okText="创建草稿" cancelText="取消" confirmLoading={creating} onOk={() => createForm.submit()} destroyOnHidden>
      <p className="ds-muted tw:[font-size:13px] tw:leading-[1.7] tw:text-[var(--ds-muted)] tw:mb-6">先创建草稿，再完善内容。以下信息仅用于当前演示。</p>
      <Form form={createForm} layout="vertical" onFinish={createContent} initialValues={{ category: '产品更新' }} preserve={false} disabled={creating}>
        <Form.Item name="title" label="内容标题" rules={[{ required: true, whitespace: true, message: '请填写内容标题' }, { min: 2, max: 40, message: '标题长度需为 2–40 个字符' }]}><Input placeholder="例如：11 月产品更新说明" maxLength={40} showCount /></Form.Item>
        <Form.Item name="category" label="内容分类" rules={[{ required: true, message: '请选择内容分类' }]}><Select options={['产品更新', '使用指南', '品牌素材', '团队故事'].map(value => ({ value, label: value }))} /></Form.Item>
      </Form>
    </Modal>
  </>;
}

const initialSettings = {
  name: '周予', email: 'member@cohesion.example', role: '产品设计师',
  bio: '让每一次协作更清楚，让每一个产品更好用。', language: 'zh-CN',
  timezone: 'Asia/Shanghai', comments: true, digest: false, visibility: 'team',
};

function SettingsPattern() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const submit = () => {
    setSaving(true);
    timer.current = setTimeout(() => {
      setSaving(false);
      setDirty(false);
      setSaved(true);
      message.success('演示资料与偏好已保存');
    }, 900);
  };
  return <>
    <div className="ds-pattern-workspace tw:p-7 tw:[border:1px_solid_var(--ds-example-border)] tw:bg-[var(--ds-example-bg)] tw:rounded-[var(--ds-example-radius,12px)] tw:min-w-0 tw:min-[1500px]:p-8 tw:at-most-700:p-5">
      <header className="ds-pattern-intro tw:flex tw:justify-between tw:items-start tw:gap-6 tw:mb-6 tw:[&_h2]:[font-size:23px] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[letter-spacing:-.02em] tw:[&_h2]:m-[0_0_8px] tw:[&_h2]:font-semibold tw:[&_p]:m-0 tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:leading-[1.75] tw:[&_p]:max-w-[62ch] tw:at-most-700:flex-col tw:at-most-700:gap-[18px]"><div><h2>资料与偏好</h2><p>把个人资料、区域设置与通知偏好放在可预测的位置。</p></div><Tag>演示表单</Tag></header>
      <div className="ds-settings-layout tw:grid tw:[grid-template-columns:220px_minmax(0,680px)] tw:gap-10 tw:p-[8px_0] tw:at-most-1000:[grid-template-columns:170px_minmax(0,1fr)] tw:at-most-1000:gap-7 tw:at-most-700:[grid-template-columns:1fr] tw:at-most-700:gap-7">
        <aside className="ds-settings-summary tw:[border-right:1px_solid_var(--ds-example-border)] tw:pr-7 tw:flex tw:items-start tw:flex-col tw:gap-4 tw:[&_h3]:[font-size:16px] tw:[&_h3]:m-0 tw:[&_h3]:font-semibold tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:[font-size:13px] tw:[&_p]:leading-[1.8] tw:[&_p]:m-0 tw:at-most-700:[border-right:0] tw:at-most-700:[border-bottom:1px_solid_var(--ds-example-border)] tw:at-most-700:p-[0_0_24px] tw:at-most-700:gap-3 tw:at-most-700:[&_p]:max-w-[52ch]"><Avatar size={64}>周</Avatar><div><h3>个人工作资料</h3><p>团队成员会看到你的名称、职位和简介。</p></div><p>表单保存前进行校验。示例中的所有修改只保留在当前页面中。</p></aside>
        <Form noValidate form={form} className="ds-settings-form tw:[&_h3]:[font-size:16px] tw:[&_h3]:font-semibold tw:[&_h3]:leading-[1.6] tw:[&_h3]:m-[0_0_20px] tw:[&_h3:not(:first-child)]:pt-7 tw:[&_h3:not(:first-child)]:[border-top:1px_solid_var(--ds-example-border)] tw:[&_h3:not(:first-child)]:mt-[30px]" layout="vertical" initialValues={initialSettings} onFinish={submit} onValuesChange={() => { setDirty(true); setSaved(false); }} scrollToFirstError={{ focus: true }} disabled={saving}>
          <h3>基本资料</h3>
          <div className="ds-form-grid tw:grid tw:[grid-template-columns:repeat(2,minmax(0,1fr))] tw:gap-[0_28px] tw:min-w-0 tw:at-most-700:[grid-template-columns:1fr] tw:at-most-700:gap-0"><Form.Item name="name" label="显示名称" rules={[{ required: true, whitespace: true, message: '请填写显示名称' }, { min: 2, max: 20, message: '请输入 2–20 个字符' }]}><Input autoComplete="name" maxLength={20} placeholder="填写你的名称" /></Form.Item><Form.Item name="role" label="职位" rules={[{ max: 30, message: '职位不能超过 30 个字符' }]}><Input placeholder="例如：产品设计师" maxLength={30} /></Form.Item></div>
          <Form.Item name="email" label="联系邮箱" extra="用于接收与你的账号和工作相关的通知。" rules={[{ required: true, message: '请填写联系邮箱' }, { type: 'email', message: '请填写完整有效的邮箱地址' }]}><Input type="email" autoComplete="email" placeholder="name@example.com" /></Form.Item>
          <Form.Item name="bio" label="个人简介" rules={[{ max: 120, message: '个人简介不能超过 120 个字符' }]}><Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} maxLength={120} showCount placeholder="向团队简单介绍你自己" /></Form.Item>
          <h3>区域与可见性</h3>
          <div className="ds-form-grid tw:grid tw:[grid-template-columns:repeat(2,minmax(0,1fr))] tw:gap-[0_28px] tw:min-w-0 tw:at-most-700:[grid-template-columns:1fr] tw:at-most-700:gap-0"><Form.Item label="语言" name="language"><Select options={[{ value: 'zh-CN', label: '简体中文' }, { value: 'en-US', label: 'English' }]} /></Form.Item><Form.Item label="时区" name="timezone"><Select options={[{ value: 'Asia/Shanghai', label: '中国标准时间 UTC+8' }, { value: 'Asia/Tokyo', label: '日本标准时间 UTC+9' }, { value: 'UTC', label: '协调世界时 UTC' }]} /></Form.Item></div>
          <Form.Item name="visibility" label="资料可见范围"><Radio.Group options={[{ value: 'team', label: '团队成员' }, { value: 'private', label: '仅自己' }]} /></Form.Item>
          <h3>通知偏好</h3>
          <div className="ds-preference-row tw:flex tw:items-center tw:justify-between tw:gap-6 tw:mb-6 tw:[&_strong]:font-medium tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:[font-size:13px] tw:[&_p]:m-[4px_0_0] tw:[&_p]:leading-[1.7]"><div><strong>评论与提及</strong><p>有人回复你或在内容中提到你时接收通知。</p></div><Form.Item name="comments" valuePropName="checked" noStyle><Switch aria-label="评论与提及通知" /></Form.Item></div>
          <div className="ds-preference-row tw:flex tw:items-center tw:justify-between tw:gap-6 tw:mb-6 tw:[&_strong]:font-medium tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:[font-size:13px] tw:[&_p]:m-[4px_0_0] tw:[&_p]:leading-[1.7]"><div><strong>每周工作摘要</strong><p>每周一汇总团队内容和待办事项。</p></div><Form.Item name="digest" valuePropName="checked" noStyle><Switch aria-label="每周工作摘要" /></Form.Item></div>
          <div className="ds-form-actions tw:flex tw:gap-3 tw:items-center tw:flex-wrap tw:pt-5 tw:mt-7 tw:[border-top:1px_solid_var(--ds-example-border)]"><Button type="primary" htmlType="submit" loading={saving}>保存更改</Button><Button onClick={() => { form.resetFields(); setDirty(false); setSaved(false); }}>恢复示例</Button><span className="ds-save-state tw:[font-size:13px] tw:text-[var(--ds-example-muted)] tw:ml-auto tw:at-most-700:w-full tw:at-most-700:ml-0" aria-live="polite">{saving ? '正在保存…' : dirty ? '有未保存的更改' : saved ? '全部更改已保存' : '示例资料已加载'}</span></div>
        </Form>
      </div>
    </div>
    <div className="ds-pattern-caption tw:flex tw:gap-6 tw:flex-wrap tw:items-start tw:m-[18px_0_0] tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.8] tw:[&_strong]:font-medium tw:[&_strong]:text-[var(--ds-example-text)] tw:at-most-700:gap-2 tw:at-most-700:flex-col"><span><strong>适用于</strong> 账号设置、团队设置、工具偏好。</span><span><strong>组合规则</strong> 内容分组对应用户理解，错误在字段附近，保存结果即时可见。</span></div>
  </>;
}

function MobilePattern() {
  const { message } = App.useApp();
  const [active, setActive] = useState('home');
  const [slot, setSlot] = useState('14:00');
  const [agreed, setAgreed] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState(true);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const services = [
    { title: '产品使用咨询', description: '了解功能与使用方法', icon: <CustomerServiceOutlined /> },
    { title: '账号与空间设置', description: '管理账号、权限和工作空间', icon: <SettingOutlined /> },
  ].filter(item => `${item.title}${item.description}`.includes(search.trim()));
  const reserve = () => {
    setBooking(true);
    timer.current = setTimeout(() => { setBooking(false); setBooked(true); message.success(`已预约今天 ${slot} 的演示咨询`); }, 900);
  };
  return <>
    <div className="ds-pattern-workspace tw:p-7 tw:[border:1px_solid_var(--ds-example-border)] tw:bg-[var(--ds-example-bg)] tw:rounded-[var(--ds-example-radius,12px)] tw:min-w-0 tw:min-[1500px]:p-8 tw:at-most-700:p-5"><header className="ds-pattern-intro tw:flex tw:justify-between tw:items-start tw:gap-6 tw:mb-6 tw:[&_h2]:[font-size:23px] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[letter-spacing:-.02em] tw:[&_h2]:m-[0_0_8px] tw:[&_h2]:font-semibold tw:[&_p]:m-0 tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:leading-[1.75] tw:[&_p]:max-w-[62ch] tw:at-most-700:flex-col tw:at-most-700:gap-[18px]"><div><h2>移动服务</h2><p>将桌面的秩序延续到触控界面，保留明确的下一步。</p></div><Tag>响应式 Web 演示</Tag></header>
      <div className="ds-mobile-stage tw:grid tw:[grid-template-columns:minmax(300px,390px)_minmax(240px,1fr)] tw:gap-14 tw:items-center tw:p-[8px_20px] tw:at-most-1000:gap-7 tw:at-most-1000:px-0 tw:at-most-700:[grid-template-columns:1fr] tw:at-most-700:gap-8 tw:at-most-700:justify-items-center">
        <div className="ds-mobile-surface tw:w-full tw:max-w-[390px] tw:p-6 tw:bg-[var(--ds-example-bg)] tw:[border:1px_solid_var(--ds-example-border)] tw:rounded-[24px] tw:[box-shadow:0_14px_40px_rgba(0,0,0,.04)] tw:at-most-700:p-5">
          <header className="ds-mobile-header tw:flex tw:justify-between tw:items-center tw:mb-7 tw:[&_strong]:[font-size:18px] tw:[&_strong]:font-semibold"><strong>逐科服务</strong><Badge dot><Button size="large" type="text" icon={<BellOutlined />} aria-label="查看服务通知" onClick={() => message.info('你有一条演示服务通知')} /></Badge></header>
          {active === 'home' && <><h2 className="ds-mobile-heading tw:[font-size:25px] tw:[letter-spacing:-.025em] tw:leading-[1.4] tw:m-[0_0_8px] tw:[font-weight:650]">需要帮助时，<br />服务就在身边。</h2><p className="ds-mobile-intro tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7] tw:m-[0_0_24px]">查找使用帮助，或预约一次产品咨询。</p><Input size="large" placeholder="搜索帮助与服务" aria-label="搜索帮助与服务" prefix={<SearchOutlined />} allowClear value={search} onChange={e => setSearch(e.target.value)} /><div className="ds-service-list tw:m-[24px_0] tw:flex tw:flex-col tw:gap-0">{services.length ? services.map(item => <div className="ds-service-item tw:flex tw:items-center tw:gap-[14px] tw:p-[17px_0] tw:[border-bottom:1px_solid_var(--ds-example-border)] tw:[&>div]:[flex:1] tw:[&>div]:min-w-0 tw:[&_strong]:[font-size:14px] tw:[&_strong]:font-medium tw:[&_strong]:leading-[1.6] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:[font-size:12px] tw:[&_p]:leading-[1.6] tw:[&_p]:m-[3px_0_0]" key={item.title}><span className="ds-service-icon tw:[place-items:center] tw:shrink-0 tw:flex tw:items-center tw:justify-center tw:size-[50px] tw:rounded-[12px] tw:bg-[var(--ds-primary-bg)] tw:text-[var(--ds-primary)] tw:[font-size:24px]">{item.icon}</span><div><strong>{item.title}</strong><p>{item.description}</p></div><Button type="text" size="large" icon={<ArrowRightOutlined />} aria-label={`查看${item.title}`} onClick={() => message.info(`「${item.title}」是演示服务入口`)} /></div>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有找到相关服务"><Button onClick={() => setSearch('')}>清除搜索</Button></Empty>}</div><div className="ds-mobile-booking tw:p-[18px_0_0] tw:flex tw:flex-col tw:gap-[14px] tw:[&_h3]:[font-size:15px] tw:[&_h3]:m-0 tw:[&_h3]:font-semibold"><h3>预约产品咨询</h3>{booked ? <Alert type="success" showIcon title="预约已确认" description={`今天 ${slot} · 线上产品咨询（演示）`} action={<Button size="small" onClick={() => setBooked(false)}>重新选择</Button>} /> : <><span className="ds-inline-note tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.7]">今天可预约时段 · 约 30 分钟</span><Radio.Group value={slot} disabled={booking} size="large" onChange={e => setSlot(e.target.value)} optionType="button" options={['14:00', '15:00', '16:30']} buttonStyle="solid" /><Checkbox className="ds-mobile-consent tw:min-h-11 tw:items-center" checked={agreed} disabled={booking} onChange={e => setAgreed(e.target.checked)}>同意使用演示联系信息预约</Checkbox><Button type="primary" size="large" block disabled={!agreed} loading={booking} onClick={reserve}>确认预约</Button></>}</div></>}
          {active === 'bookings' && <div className="ds-mobile-placeholder tw:flex tw:flex-col tw:gap-[18px] tw:min-h-[375px] tw:pt-2"><h2 className="ds-mobile-heading tw:[font-size:25px] tw:[letter-spacing:-.025em] tw:leading-[1.4] tw:m-[0_0_8px] tw:[font-weight:650]">我的预约</h2>{booked ? <><Alert type="success" showIcon title="产品咨询" description={`今天 ${slot} · 线上进行（演示）`} /><Button size="large" onClick={() => { setBooked(false); message.success('演示预约已取消'); }}>取消预约</Button></> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前没有预约"><Button type="primary" size="large" onClick={() => setActive('home')}>预约一次咨询</Button></Empty>}</div>}
          {active === 'account' && <div className="ds-mobile-placeholder tw:flex tw:flex-col tw:gap-[18px] tw:min-h-[375px] tw:pt-2"><div className="ds-loaded-example tw:[&_strong]:font-semibold tw:flex tw:items-start tw:gap-[14px] tw:p-[12px_0] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:m-[6px_0_0] tw:[&_p]:[font-size:13px] tw:[&_p]:leading-[1.7]"><Avatar size={48}>周</Avatar><div><strong>周予</strong><p>演示服务账号</p></div></div><div className="ds-service-item tw:flex tw:items-center tw:gap-[14px] tw:p-[17px_0] tw:[border-bottom:1px_solid_var(--ds-example-border)] tw:[&>div]:[flex:1] tw:[&>div]:min-w-0 tw:[&_strong]:[font-size:14px] tw:[&_strong]:font-medium tw:[&_strong]:leading-[1.6] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:[font-size:12px] tw:[&_p]:leading-[1.6] tw:[&_p]:m-[3px_0_0]"><span className="ds-service-icon tw:[place-items:center] tw:shrink-0 tw:flex tw:items-center tw:justify-center tw:size-[50px] tw:rounded-[12px] tw:bg-[var(--ds-primary-bg)] tw:text-[var(--ds-primary)] tw:[font-size:24px]"><CheckCircleOutlined /></span><div><strong>通知偏好</strong><p>接收预约变更与服务提醒</p></div><Switch checked={notifications} aria-label="接收服务提醒" onChange={checked => { setNotifications(checked); message.success(checked ? '已开启演示服务提醒' : '已关闭演示服务提醒'); }} /></div><Alert type="info" title="这是移动服务的 Web 组合示例" description="可用于验证布局与交互；原生应用和小程序需使用各自的组件实现。" showIcon /></div>}
          <nav className="ds-mobile-bottom tw:flex tw:[justify-content:space-around] tw:[border-top:1px_solid_var(--ds-example-border)] tw:pt-[18px] tw:mt-7" aria-label="移动服务导航">{[{ key: 'home', label: '服务', icon: <HomeOutlined /> }, { key: 'bookings', label: '预约', icon: <CalendarOutlined /> }, { key: 'account', label: '我的', icon: <UserOutlined /> }].map(item => <button key={item.key} className="ds-mobile-nav tw:border-0 tw:[background:none] tw:p-[4px_8px] tw:[font:inherit] tw:[font-size:12px] tw:flex tw:flex-col tw:items-center tw:gap-[7px] tw:text-[var(--ds-example-muted)] tw:cursor-pointer tw:min-w-[50px] tw:min-h-11 tw:[&_.anticon]:[font-size:20px] tw:[&[aria-current=page]]:text-[var(--ds-example-primary)] tw:[&:focus-visible]:[outline:2px_solid_var(--ds-example-primary)] tw:[&:focus-visible]:[outline-offset:2px] tw:[&:focus-visible]:rounded-[6px]" aria-current={active === item.key ? 'page' : undefined} onClick={() => setActive(item.key)}>{item.icon}<span>{item.label}</span></button>)}</nav>
        </div>
        <div className="ds-pattern-principles tw:flex tw:flex-col tw:gap-6 tw:max-w-[360px] tw:[&_h3]:[font-size:16px] tw:[&_h3]:font-semibold tw:[&_h3]:m-[0_0_7px] tw:[&_p]:[font-size:13px] tw:[&_p]:leading-[1.8] tw:[&_p]:text-[var(--ds-example-muted)] tw:[&_p]:m-0 tw:at-most-1000:max-w-full tw:at-most-700:max-w-[390px]"><div><h3>一屏围绕一个任务</h3><p>帮助检索和预约承接同一个需求。主操作固定使用大尺寸，辅助入口收在任务附近。</p></div><div><h3>信息随状态变化</h3><p>预约后原位显示确认信息，并同步到「我的预约」。无结果时给出清除搜索的动作。</p></div><div><h3>触控保留呼吸空间</h3><p>主要操作、时段选择和导航提供至少 44px 的可操作高度。窄屏保持单列，避免把桌面多列直接压缩。</p></div></div>
      </div>
    </div>
    <div className="ds-pattern-caption tw:flex tw:gap-6 tw:flex-wrap tw:items-start tw:m-[18px_0_0] tw:text-[var(--ds-example-muted)] tw:[font-size:13px] tw:leading-[1.8] tw:[&_strong]:font-medium tw:[&_strong]:text-[var(--ds-example-text)] tw:at-most-700:gap-2 tw:at-most-700:flex-col"><span><strong>适用于</strong> 服务预约、帮助中心、轻量工具。</span><span><strong>演示说明</strong> 时段、资料与预约状态均为当前页面的演示数据。</span></div>
  </>;
}

export default function PatternsView() {
  return <div className="ds-patterns-view tw:text-[var(--ds-example-text)] tw:min-w-0 tw:motion-reduce:[&_*]:[scroll-behavior:auto]!" style={useSurfaceTokens()}><header className="ds-page-heading tw:max-w-[760px] tw:[&_h1]:m-[0_0_12px] tw:[&_>_p]:m-0 tw:mb-9 tw:[&_h1]:[font-size:var(--ant-token-font-size-heading1,_38px)] tw:[&_h1]:[font-weight:var(--ds-strong)] tw:[&_h1]:leading-[1.23] tw:[&_h1]:mb-4 tw:[&_h1]:[letter-spacing:-.025em] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:max-w-[70ch] tw:[&_>_p]:[font-size:15px] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h1]:[font-size:30px] tw:at-most-767:[&_>_p]:[font-size:14px]"><h1>场景模式</h1><p>把统一的组件和状态放进真实任务，验证它们如何共同工作。所有业务内容均为演示数据。</p></header><Tabs className="ds-category-tabs tw:min-w-0" classNames={{ header: "tw:mb-7" }} defaultActiveKey="content" items={[{ key: 'content', label: '内容管理', children: <ContentPattern /> }, { key: 'settings', label: '资料与偏好', children: <SettingsPattern /> }, { key: 'mobile', label: '移动服务', children: <MobilePattern /> }]} /></div>;
}
