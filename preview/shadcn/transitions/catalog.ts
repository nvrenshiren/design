import type { TransitionCategory, TransitionEntry } from "./types"

export const TRANSITION_CATEGORIES: { id: TransitionCategory; title: string }[] = [
  { id: "layout", title: "布局与导航" },
  { id: "overlays", title: "浮层与通知" },
  { id: "controls", title: "输入与操作" },
  { id: "feedback", title: "反馈与智能状态" },
  { id: "text", title: "数字与文本" },
  { id: "effects", title: "视觉与交互" },
]

type Definition = [string, string, string, string, TransitionCategory, string, TransitionEntry["module"], string, boolean?]
const definitions: Definition[] = [
  ["card-resize", "卡片尺寸", "Card resize", "在同一位置平滑改变卡片尺寸，保持内容与容器的连续关系。", "layout", "Card", "layout", "CardResize"],
  ["panel-reveal", "面板展开", "Panel reveal", "面板从所属区域展开，收起后保留清楚的操作入口。", "layout", "Card · Collapsible", "layout", "PanelReveal"],
  ["page-side-by-side", "页面切换", "Page side-by-side", "用前进与后退的方向表达相邻页面的层级关系。", "layout", "Card · Button", "layout", "PageSideBySide"],
  ["tabs-sliding", "页签滑动", "Tabs sliding", "共享选中标记跟随当前页签，内容切换保留位置感。", "layout", "Tabs", "layout", "TabsSliding"],
  ["dropdown-menu-morph", "菜单形变", "Dropdown menu morph", "触发器的表面延展为菜单，保持同一交互起点。", "layout", "DropdownMenu", "layout", "DropdownMenuMorph"],
  ["accordion", "折叠内容", "Accordion", "内容高度与箭头状态同步变化，支持键盘展开与收起。", "layout", "Accordion", "layout", "AccordionTransition"],
  ["menu-dropdown", "下拉菜单", "Menu dropdown", "菜单从触发位置进入，关闭后焦点回到原操作。", "overlays", "DropdownMenu", "layout", "MenuDropdown"],
  ["modal-open-close", "对话框进出", "Modal open/close", "缩放、淡入与遮罩建立任务层级，支持 Escape 返回。", "overlays", "Dialog", "layout", "ModalOpenClose"],
  ["tooltip-open-close", "提示显隐", "Tooltip open/close", "悬停或聚焦后展示辅助说明，离开后及时退出。", "overlays", "Tooltip", "layout", "TooltipOpenClose"],
  ["toast-open-close", "通知进出", "Toast open/close", "短暂结果反馈通过位移、淡入与缩放进入当前上下文。", "overlays", "Sonner", "layout", "ToastOpenClose"],
  ["banner-stacking", "横幅堆叠", "Banner stacking", "新增提示依次堆叠，关闭后其余提示回到连续位置。", "overlays", "Alert · Button", "layout", "BannerStacking"],
  ["gooey-plus-menu", "加号菜单", "Gooey plus menu", "加号展开为一组邻近操作，弹性连接说明同一来源。", "controls", "Button", "layout", "GooeyPlusMenu", true],
  ["error-state-shake", "错误轻震", "Error state shake", "校验失败时给予短促反馈，同时保留错误文字和修正入口。", "controls", "Field · Input", "effects", "ErrorStateShake"],
  ["input-clear-with-dissolve", "输入消散", "Input clear with dissolve", "清空时整行文字向下模糊消散，占位提示交接并保留键盘焦点。", "controls", "InputGroup", "effects", "InputClearWithDissolve"],
  ["checkbox-check", "勾选描画", "Checkbox check", "选中状态立即成立，再以描画强化一次确认。", "controls", "Checkbox", "effects", "CheckboxCheck"],
  ["toggle", "开关回弹", "Toggle", "滑块的位置、填充和轻微回弹共同表达当前状态。", "controls", "Switch", "effects", "ToggleTransition"],
  ["like-button", "收藏反馈", "Like button", "心形填充与短暂粒子回应收藏操作，状态可再次切换。", "controls", "Button", "effects", "LikeButton"],
  ["learn-more-hover", "链接响应", "Learn more hover", "方向图标跟随悬停与键盘聚焦，链接名称持续可读。", "controls", "Button", "effects", "LearnMoreHover"],
  ["icon-swap", "图标替换", "Icon swap", "在同一位置以缩放和模糊衔接操作图标的前后状态。", "controls", "Button", "effects", "IconSwap"],
  ["confetti-burst", "彩屑完成反馈", "Confetti burst", "彩屑铺满舞台飘落，分别在按钮与底面回弹停留后消失。", "controls", "Button", "pro-confetti", "ConfettiBurst", true],
  ["notification-badge", "消息角标", "Notification badge", "角标斜向进入并轻微回弹，用数字同时说明消息数量。", "feedback", "Badge · Button", "feedback", "NotificationBadge"],
  ["success-check", "完成描画", "Success check", "完成图标与描线同时落定，配合可读文字确认结果。", "feedback", "Button", "feedback", "SuccessCheck"],
  ["skeleton-loader-and-reveal", "骨架交接", "Skeleton loader and reveal", "占位骨架与真实内容交接，等待结束后展示稳定结果。", "feedback", "Skeleton · Card", "feedback", "SkeletonLoaderAndReveal"],
  ["spinner-to-check-morph", "加载转完成", "Spinner to check morph", "旋转加载在同一位置转为描画完成状态。", "feedback", "Spinner · Button", "feedback", "SpinnerToCheckMorph", true],
  ["thinking-states", "思考状态", "Thinking states", "状态文字先表达工作过程，再切换为明确的完成结果。", "feedback", "Spinner · Badge", "feedback", "ThinkingStates"],
  ["matrix-dot-loader", "矩阵加载", "Matrix dot loader", "点阵以不同节奏表达工作状态，支持暂停和静态替代。", "feedback", "Button · Badge", "feedback", "MatrixDotLoader"],
  ["image-generation-placeholder", "图像生成交接", "Image generation placeholder", "点状占位逐步交接到图像，生成结果保留在原有区域。", "feedback", "Card · Skeleton", "feedback", "ImageGenerationPlaceholder", true],
  ["number-pop-in", "数字更新", "Number pop-in", "新数字以短暂模糊和错开节奏进入，最终数值稳定可读。", "text", "Button", "feedback", "NumberPopIn"],
  ["spinning-counter", "滚动计数", "Spinning counter", "各位数字滚动至目标数值，保留完整的辅助文字。", "text", "Button", "feedback", "SpinningCounter"],
  ["text-states-swap", "状态文字切换", "Text states swap", "旧状态退场后在同一行展示新状态，避免重叠阅读。", "text", "Badge · Button", "feedback", "TextStatesSwap"],
  ["texts-reveal", "分组文字呈现", "Texts reveal", "属于同一条消息的两行文字按短暂顺序呈现。", "text", "Button", "feedback", "TextsReveal"],
  ["shimmer-text", "文字扫光", "Shimmer text", "文字高光以两秒节奏循环扫过，可主动停止并保留可读文字。", "text", "Button", "feedback", "ShimmerText"],
  ["pro-gradient-text", "流动文字色彩", "Pro gradient text", "局部品牌色彩沿文字流动，用于有明确语义的短暂状态。", "text", "Button", "feedback", "ProGradientText", true],
  ["reasoning-stream", "推理进度", "Reasoning stream", "工作步骤逐行进入并保持可读的当前上下文。", "text", "Card · Button", "feedback", "ReasoningStream"],
  ["streaming-text", "流式文字", "Streaming text", "文字分段进入，完成后保留可选取、可复制的正文。", "text", "Button", "feedback", "StreamingText"],
  ["avatar-group-hover", "头像组响应", "Avatar group hover", "当前头像抬升，相邻头像按距离减弱响应。", "effects", "Avatar · Button", "effects", "AvatarGroupHover"],
  ["3d-tilt", "指针倾斜", "3D tilt", "卡片轻量跟随指针与高光，离开或暂停后回到稳定姿态。", "effects", "Card", "effects", "ThreeDTilt"],
  ["card-stack-hover", "卡片扇出", "Card stack hover", "堆叠卡片展开为可辨认的层次，离开后收回。", "effects", "Card · Button", "effects", "CardStackHover", true],
  ["drag-drop-with-physics", "拖放落位", "Drag & drop with physics", "拖放图像后平滑落位，同时提供键盘操作替代。", "effects", "Card · Button", "effects", "DragDropWithPhysics", true],
  ["image-open-tilt", "图像倾斜展开", "Image open tilt", "图像从缩略图连续弯曲展开，再沿原路径回缩。", "effects", "Dialog · Button", "pro-image", "ImageOpenTilt", true],
  ["delete-with-smoky-dissolve", "图像消散", "Delete with smoky dissolve", "图像在细微扰动与轻微下沉中逐渐柔化消散，可随时恢复。", "effects", "Button", "pro-smoke", "DeleteWithSmokyDissolve", true],
  ["get-pro-button", "按钮边沿光泽", "Get Pro button", "高光从按钮边沿进入，主操作文字和焦点始终保持清楚。", "effects", "Button", "effects", "GetProButton", true],
  ["organic-shimmer", "波纹工作状态", "Organic shimmer", "柔和波纹在局部工作区域移动，操作后可停止并显示完成。", "effects", "Card · Button", "feedback", "OrganicShimmer", true],
]

export const TRANSITIONS: TransitionEntry[] = definitions.map(([id, title, englishTitle, description, category, primitive, module, exportName, premium]) => ({
  id, title, englishTitle, description, category, primitive, module, exportName,
  engine: id === "drag-drop-with-physics" ? "CSS3 + Anime.js" : "CSS3",
  sourceTier: premium ? "pro-preview" : "free",
}))

if (TRANSITIONS.length !== 43 || new Set(TRANSITIONS.map(entry => entry.id)).size !== 43) {
  throw new Error("The Transitions catalog must contain 43 unique entries.")
}
