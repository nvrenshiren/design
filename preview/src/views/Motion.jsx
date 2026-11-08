import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Button, Card, Collapse, Descriptions, Divider, Drawer, Flex, Modal,
  Progress, Select, Space, Spin, Switch, Tabs, Tag, Typography,
  theme as antdTheme,
} from 'antd';
import {
  CheckCircleOutlined, ExpandOutlined, LoadingOutlined,
  PlayCircleOutlined, ReloadOutlined, RightOutlined,
} from '@ant-design/icons';
import ThinkingOrb from '../../../dist/react/ThinkingOrb.jsx';
import BorderBeam from '../../../dist/react/BorderBeam.jsx';
import { useFocusReturn } from '../useFocusReturn.js';
import MotionReferences from './MotionReferences.jsx';

const { Title, Paragraph, Text } = Typography;
const motionDefaults = antdTheme.getDesignToken();
const renderMotionOption = (option, { index }) => (
  <span className="cohesion-motion-select-option" style={{ '--cohesion-motion-delay': `${Math.min(index, 5) * 18}ms` }}>
    {option.label}
  </span>
);

function DurationSample({ title, tokenName, description, active, enabled, token }) {
  const duration = token[tokenName];
  return (
    <div className="ds-motion-sample tw:min-w-0">
      <Flex align="center" justify="space-between" gap="small">
        <Text strong>{title}</Text>
        <Text code>{Math.round(parseFloat(motionDefaults[tokenName]) * 1000)} ms</Text>
      </Flex>
      <div className="ds-motion-stage tw:my-(--ant-token-margin-md) tw:min-h-[88px] tw:overflow-hidden tw:rounded-(--ant-token-border-radius-lg) tw:bg-(--ant-token-color-fill-quaternary) tw:p-(--ant-token-padding-md) tw:min-w-0">
        <div className={`tw:grid tw:size-12 tw:place-items-center tw:rounded-(--ant-token-border-radius) tw:bg-(--ant-token-color-primary) tw:text-(--ant-token-color-white) tw:[transition:var(--sample-transition)] ${active ? 'tw:translate-x-[88px]' : 'tw:translate-x-0'}`}
          style={{ '--sample-transition': enabled ? `translate ${duration} ${token.motionEaseOut}` : 'none' }} aria-hidden="true"><RightOutlined /></div>
      </div>
      <Text type="secondary">{description}</Text>
      <div className="tw:mt-(--ant-token-margin-sm)"><Text code>{tokenName}</Text></div>
    </div>
  );
}

function BrandExperiments({ theme, paused }) {
  const { token } = antdTheme.useToken();
  const [orbState, setOrbState] = useState('breathing');
  const [beamSize, setBeamSize] = useState('md');
  const [localPaused, setLocalPaused] = useState(false);
  const stopped = paused || localPaused;
  const beamContent = (
    <div className="tw:rounded-(--ant-token-border-radius-lg) tw:bg-(--ant-token-color-bg-container) tw:p-(--ant-token-padding-lg)">
      <Space align="start">
        <CheckCircleOutlined className="tw:text-(--ant-token-color-primary)! tw:[font-size:var(--ant-token-font-size-xl)]!" />
        <div>
          <Text strong>需要强调的完成时刻</Text>
          <Paragraph type="secondary" className="tw:m-0!">品牌光效仅用于有明确意义的节点。</Paragraph>
        </div>
      </Space>
    </div>
  );
  return (
    <div className="ds-brand-experiments tw:min-w-0 tw:at-most-767:[grid-template-columns:1fr]">
      <Flex align="center" justify="space-between" wrap gap="middle" className="tw:mb-(--ant-token-margin-lg)">
        <Text type="secondary">以下效果保留 Logo 三色，按产品场景选择启用。</Text>
        <Space><Text>播放品牌动效</Text><Switch
          checked={!stopped}
          disabled={paused}
          onChange={playing => setLocalPaused(!playing)}
          aria-label="播放品牌动效"
        /></Space>
      </Flex>
      <div className="ds-split tw:grid tw:[grid-template-columns:repeat(2,minmax(0,1fr))] tw:gap-6 tw:at-most-767:[grid-template-columns:1fr]">
        <section className="ds-brand-experiment">
          <Title level={4}>智能状态</Title>
          <Paragraph type="secondary">用来表达智能助手的工作状态，常规等待优先使用加载组件。</Paragraph>
          <Flex align="center" gap="large" className="tw:min-h-28">
            <ThinkingOrb state={orbState} size={64} theme={theme} paused={stopped} aria-label={`智能状态：${orbState}`} />
            <div><Text strong>{stopped ? '静态预览' : '正在演示'}</Text><br /><Text type="secondary">{orbState}</Text></div>
          </Flex>
          <Select aria-label="智能状态动效" value={orbState} onChange={setOrbState} className="tw:w-full tw:max-w-[300px]" options={[
            { label: '待命', value: 'breathing' },
            { label: '工作', value: 'working' },
            { label: '搜索', value: 'searching' },
            { label: '求解', value: 'solving' },
            { label: '聆听', value: 'listening' },
            { label: '连接', value: 'connecting' },
            { label: '编织', value: 'weaving' },
            { label: '创作', value: 'composing' },
            { label: '塑形', value: 'shaping' },
          ]} optionRender={renderMotionOption} />
        </section>
        <section className="ds-brand-experiment">
          <Title level={4}>边框光效</Title>
          <Paragraph type="secondary">用于品牌展示或关键完成反馈，避免覆盖常规操作与信息列表。</Paragraph>
          <div className="tw:py-(--ant-token-padding-lg)">
            {stopped ? beamContent : (
              <BorderBeam key={beamSize} size={beamSize} theme={theme} bundleUrl="/vendor/border-beam.js" strength={0.65}>
                {beamSize === 'sm' ? <Button>完成演示任务</Button> : beamContent}
              </BorderBeam>
            )}
          </div>
          <Select aria-label="边框光效预设" value={beamSize} onChange={setBeamSize} className="tw:w-full tw:max-w-[300px]" options={[
            { label: '小型控件 · sm', value: 'sm' },
            { label: '容器流光 · md', value: 'md' },
            { label: '底边流光 · line', value: 'line' },
            { label: '外侧呼吸 · pulse-outside', value: 'pulse-outside' },
            { label: '内侧呼吸 · pulse-inner', value: 'pulse-inner' },
          ]} optionRender={renderMotionOption} />
        </section>
      </div>
    </div>
  );
}

export default function MotionView({ theme = 'light', paused = false }) {
  const { token } = antdTheme.useToken();
  const enabled = token.motion !== false && !paused;
  const [replayed, setReplayed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerTrigger = useRef(null);
  const afterDrawerChange = useFocusReturn(drawerOpen, drawerTrigger);
  const [loadState, setLoadState] = useState('idle');
  const loadingTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(loadingTimer.current), []);
  const playLoading = () => {
    window.clearTimeout(loadingTimer.current);
    setLoadState('loading');
    loadingTimer.current = window.setTimeout(() => setLoadState('complete'), 1400);
  };

  return (
    <div className="ds-view ds-motion-view">
      <header className="ds-page-header tw:mb-9 tw:[&_h1]:[font-size:var(--ant-token-font-size-heading1,_38px)] tw:[&_h1]:[font-weight:var(--ds-strong)] tw:[&_h1]:leading-[1.23] tw:[&_h1]:mb-4 tw:[&_h1]:[letter-spacing:-.025em] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:max-w-[70ch] tw:[&_>_p]:[font-size:15px] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h1]:[font-size:30px] tw:at-most-767:[&_>_p]:text-sm">
        <div>
          <Title level={1}>动效</Title>
          <Paragraph>让变化有迹可循。延续 Ant Design 的时长与缓动预设，用轻快的反馈连接每一次操作。</Paragraph>
        </div>
        <Tag color={enabled ? 'processing' : 'default'}>{enabled ? '标准动效' : '减少动效'}</Tag>
      </header>

      <section className="ds-section tw:mt-12 tw:at-most-767:mt-10" aria-labelledby="motion-duration-heading">
        <div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]">
          <div><Title level={2} id="motion-duration-heading">一套有节奏的时长</Title><Paragraph type="secondary">三档时长来自同一套官方 Token；变化越复杂，留给理解的时间越充分。</Paragraph></div>
          <Button icon={<ReloadOutlined />} onClick={() => setReplayed(value => !value)}>{replayed ? '重放返回' : '播放动效'}</Button>
        </div>
        <div className="ds-motion-presets tw:grid tw:[grid-template-columns:repeat(3,minmax(0,1fr))] tw:gap-5 tw:[&_>_*]:min-w-0 tw:at-most-767:[grid-template-columns:1fr]">
          <DurationSample title="即时反馈" tokenName="motionDurationFast" description="悬停、按压与选中等细节反馈。" active={replayed} enabled={enabled} token={token} />
          <DurationSample title="局部变化" tokenName="motionDurationMid" description="下拉、提示与局部内容切换。" active={replayed} enabled={enabled} token={token} />
          <DurationSample title="空间转换" tokenName="motionDurationSlow" description="弹窗、抽屉与较大区域的展开。" active={replayed} enabled={enabled} token={token} />
        </div>
        <Descriptions className="ds-motion-easing tw:mt-(--ant-token-margin-lg) tw:[&_code]:[overflow-wrap:anywhere]" bordered size="small" column={1} items={[
          { key: 'easeOut', label: <Text code>motionEaseOut</Text>, children: <><Text code>{token.motionEaseOut}</Text><Text type="secondary">　快速响应，平稳落定。</Text></> },
          { key: 'easeInOut', label: <Text code>motionEaseInOut</Text>, children: <><Text code>{token.motionEaseInOut}</Text><Text type="secondary">　用于持续、往返的状态变化。</Text></> },
        ]} />
      </section>

      <section className="ds-section tw:mt-12 tw:at-most-767:mt-10" aria-labelledby="motion-components-heading">
        <div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><div><Title level={2} id="motion-components-heading">在真实交互中体验</Title><Paragraph type="secondary">同一套节奏贯穿组件。点击操作，体验展开、切换、等待与完成。</Paragraph></div></div>
        <div className="ds-panel tw:p-6 tw:[border:1px_solid_var(--ds-line)] tw:rounded-[var(--ant-token-border-radius-lg,_8px)] tw:bg-[var(--ds-bg)] tw:min-w-0 tw:at-most-767:p-5">
          <Tabs animated={enabled} items={[
            { key: 'transition', label: '空间与层级', children: (
              <div className="ds-split tw:grid tw:[grid-template-columns:repeat(3,minmax(0,1fr))] tw:gap-6 tw:at-most-900:[grid-template-columns:repeat(2,minmax(0,1fr))] tw:at-most-767:[grid-template-columns:1fr]">
                <div>
                  <Title level={4}>保持上下文</Title>
                  <Paragraph type="secondary">对话框用于需要集中注意力的确认；抽屉用于保留当前页面的延伸任务。</Paragraph>
                  <Space wrap>
                    <Button icon={<ExpandOutlined />} onClick={() => setModalOpen(true)}>体验对话框</Button>
                    <Button ref={drawerTrigger} icon={<RightOutlined />} onClick={() => setDrawerOpen(true)}>体验抽屉</Button>
                  </Space>
                </div>
                <Collapse items={[
                  { key: 'detail', label: '展开一段辅助信息', children: <Paragraph className="tw:m-0!">内容沿所属区域自然展开，帮助用户理解信息关系。收起后恢复紧凑布局，页面位置保持连续。</Paragraph> },
                  { key: 'rules', label: '何时使用动效', children: <Paragraph className="tw:m-0!">解释状态、建立层级或反馈操作时使用。纯装饰的连续动画应保持少量，并允许用户暂停。</Paragraph> },
                ]} />
                <Card className="cohesion-motion-card" title="项目概览" extra={<Tag color="processing">进行中</Tag>}>
                  <Paragraph type="secondary">悬停或键盘聚焦时轻微抬升，帮助识别可进入的内容卡片。</Paragraph>
                  <Button type="link" icon={<RightOutlined />} iconPlacement="end">查看项目</Button>
                </Card>
              </div>
            ) },
            { key: 'feedback', label: '等待与完成', children: (
              <div className="ds-split tw:grid tw:[grid-template-columns:repeat(2,minmax(0,1fr))] tw:gap-6 tw:at-most-767:[grid-template-columns:1fr]">
                <div>
                  <Title level={4}>让等待可理解</Title>
                  <Paragraph type="secondary">有确定进度时显示进度条；无法预估时用加载状态，并说明当前任务。</Paragraph>
                  <Button icon={<PlayCircleOutlined />} loading={loadState === 'loading' && enabled} disabled={loadState === 'loading'} onClick={playLoading}>演示加载反馈</Button>
                </div>
                <Space orientation="vertical" size="middle" className="tw:w-full">
                  <Space><Spin spinning={loadState === 'loading'} indicator={<LoadingOutlined spin={enabled} />} /><Text aria-live="polite">{loadState === 'loading' ? '正在准备演示内容…' : loadState === 'complete' ? '演示内容已准备好' : '点击按钮开始体验'}</Text></Space>
                  <Progress percent={loadState === 'loading' ? 64 : loadState === 'complete' ? 100 : 0} status={loadState === 'complete' ? 'success' : 'normal'} />
                  <Text type="secondary">此处为交互演示，进度仅用于展示状态。</Text>
                </Space>
              </div>
            ) },
          ]} />
        </div>
      </section>

      <MotionReferences mode={theme} stopped={!enabled} />

      <section className="ds-section tw:mt-12 tw:at-most-767:mt-10" aria-labelledby="motion-accessibility-heading">
        <div className="ds-section-header tw:mb-6 tw:[&_h2]:[font-size:var(--ant-token-font-size-heading3,_24px)] tw:[&_h2]:leading-[1.4] tw:[&_h2]:[font-weight:var(--ds-strong)] tw:[&_h2]:[letter-spacing:-.015em] tw:[&_h2]:mb-[10px] tw:[&_>_p]:max-w-[72ch] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h2]:[font-size:22px]"><div><Title level={2} id="motion-accessibility-heading">尊重用户的动效偏好</Title><Paragraph type="secondary">系统开启「减少动态效果」或使用页面暂停开关后，保留状态反馈，停止位移和品牌循环动画。</Paragraph></div></div>
        <Alert type="info" showIcon title="变化仍然清晰，过程可以更安静" description="按钮状态、文字说明与完成结果始终可见。动效不承载唯一信息，也不阻塞任务完成。" />
      </section>

      <Divider />
      <Collapse destroyOnHidden items={[{
        key: 'brand-experiments',
        label: <Text strong>品牌实验</Text>,
        extra: <Text type="secondary">选择性使用</Text>,
        children: <BrandExperiments theme={theme} paused={!enabled} />,
      }]} />

      <Modal title="对话框动效" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => setModalOpen(false)} okText="完成体验" cancelText="关闭" destroyOnHidden>
        <div className="cohesion-motion-dialog-content">
          <Paragraph>对话框通过缩放与遮罩建立前后层级，让注意力集中在当前确认任务。</Paragraph>
          <Paragraph type="secondary">按 Escape、点击遮罩或关闭按钮都可返回，焦点随后回到触发按钮。</Paragraph>
        </div>
      </Modal>
      <Drawer afterOpenChange={afterDrawerChange} title="抽屉动效" open={drawerOpen} onClose={() => setDrawerOpen(false)} size="min(420px, 100vw)" destroyOnHidden>
        <div className="cohesion-motion-dialog-content">
          <Title level={4}>保留当前上下文</Title>
          <Paragraph>抽屉从页面边缘进入，适合查看详情、编辑局部设置或完成与当前页面相关的延伸任务。</Paragraph>
          <Descriptions bordered size="small" column={1} items={[
            { key: 'duration', label: '过渡时长', children: <Text code>{token.motionDurationSlow}</Text> },
            { key: 'motion', label: '动效偏好', children: enabled ? '标准动效' : '减少动效' },
          ]} />
        </div>
      </Drawer>
    </div>
  );
}
