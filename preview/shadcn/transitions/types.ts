export interface TransitionDemoProps {
  stopped: boolean
  replayKey: number
}

export type TransitionCategory = "layout" | "overlays" | "controls" | "feedback" | "text" | "effects"

export interface TransitionEntry {
  id: string
  title: string
  englishTitle: string
  description: string
  category: TransitionCategory
  primitive: string
  engine: "CSS3" | "CSS3 + Anime.js"
  sourceTier: "free" | "pro-preview"
  module: "layout" | "feedback" | "effects" | "pro-image" | "pro-smoke" | "pro-confetti"
  exportName: string
}
