import * as React from "react"

export type MotionFrames = Record<string, Record<string, Record<string, string | number>>>

const propertyName = (property: string) => property.startsWith("--") ? property : property.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)

/** Render finite, measured motion data with browser CSS interpolation.
 * Components provide frames and geometry, never selector or stylesheet strings.
 * Each instance owns one adopted sheet and removes it on replay/unmount. */
export function MotionStyles({ frames }: { frames: MotionFrames }) {
  const anchor = React.useRef<HTMLSpanElement>(null)
  React.useLayoutEffect(() => {
    const root = anchor.current?.getRootNode()
    if (!(root instanceof ShadowRoot || root instanceof Document)) return
    const sheet = new CSSStyleSheet()
    for (const [name, keyframes] of Object.entries(frames)) {
      if (!/^[a-zA-Z_][\w-]*$/.test(name)) throw new Error(`Invalid motion name: ${name}`)
      sheet.insertRule(`@keyframes ${name} {}`, sheet.cssRules.length)
      const rule = sheet.cssRules[sheet.cssRules.length - 1] as CSSKeyframesRule
      for (const [offset, declarations] of Object.entries(keyframes)) {
        if (!/^(?:from|to|(?:\d+(?:\.\d+)?%))(?:\s*,\s*(?:from|to|\d+(?:\.\d+)?%))*$/.test(offset)) throw new Error(`Invalid motion offset: ${offset}`)
        rule.appendRule(`${offset} {}`)
        const frame = rule.cssRules[rule.cssRules.length - 1] as CSSKeyframeRule
        for (const [property, value] of Object.entries(declarations)) frame.style.setProperty(propertyName(property), String(value))
      }
    }
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet]
    return () => { root.adoptedStyleSheets = root.adoptedStyleSheets.filter(item => item !== sheet) }
  }, [frames])
  return <span ref={anchor} hidden aria-hidden="true" />
}
