import { AppstoreOutlined, BgColorsOutlined, FontSizeOutlined, LayoutOutlined, CompassOutlined, ExperimentOutlined, CodeOutlined, BlockOutlined } from '@ant-design/icons';

export const NAV = [
  { id: 'overview', label: '概览', description: '统一语言，真实产品体验', icon: CompassOutlined, group: '开始' },
  { id: 'colors', label: '色彩与主题', description: '品牌、语义色与浅深主题', icon: BgColorsOutlined, group: 'Ant Design 基础' },
  { id: 'typography', label: '字体与排版', description: '文字层级、阅读与数字', icon: FontSizeOutlined, group: 'Ant Design 基础' },
  { id: 'layout', label: '布局与层级', description: '间距、密度、形状与表面', icon: LayoutOutlined, group: 'Ant Design 基础' },
  { id: 'components', label: 'Ant Design 组件', description: '操作、输入、导航、反馈与数据', icon: AppstoreOutlined, group: '组件体系' },
  { id: 'shadcn', label: 'shadcn/ui', description: '品牌主题、组件、Transitions 动效与产品组合', icon: BlockOutlined, group: '组件体系' },
  { id: 'patterns', label: '场景模式', description: '内容管理、设置与移动服务', icon: BlockOutlined, group: '构建产品' },
  { id: 'motion', label: '动效', description: '反馈、过渡与品牌实验', icon: ExperimentOutlined, group: '构建产品' },
  { id: 'integration', label: '工程接入', description: '主题配置、token 与分发资源', icon: CodeOutlined, group: '资源' },
];
const aliases = { global: 'overview', brand: 'colors', scales: 'colors', semantic: 'colors', spacing: 'layout', radius: 'layout', easing: 'motion', transitions: 'motion', 'transitions-pro': 'motion', beam: 'motion', orbs: 'motion', dark: 'colors', platforms: 'integration' };
export function readRoute() {
  const [raw, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  const route = aliases[raw] || raw;
  return { id: NAV.some(item => item.id === route) ? route : 'overview', params: new URLSearchParams(query) };
}
