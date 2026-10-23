import * as React from "react"
import { createPortal } from "react-dom"
import styles from "cohesion-shadcn-styles"

// null means a scoped portal host is still mounting; undefined keeps Radix's
// default body portal when a copied component is used outside this preview.
const PortalContainerContext = React.createContext<HTMLElement | null | undefined>(undefined)
const ThemeContext = React.createContext<"light" | "dark" | "system">("system")

export function useShadcnPortalContainer() {
  return React.useContext(PortalContainerContext)
}

export function useShadcnTheme() {
  return React.useContext(ThemeContext)
}

export function ShadcnScope({
  mode = "light",
  stopped = false,
  className = "",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  mode?: "light" | "dark"
  stopped?: boolean
}) {
  const host = React.useRef<HTMLDivElement>(null)
  const [shadow, setShadow] = React.useState<ShadowRoot | null>(null)
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null)

  React.useLayoutEffect(() => {
    if (!host.current) return
    const root = host.current.shadowRoot || host.current.attachShadow({ mode: "open" })
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(styles)
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet]
    setShadow(root)
    return () => { root.adoptedStyleSheets = root.adoptedStyleSheets.filter(item => item !== sheet) }
  }, [])

  return (
    <div ref={host} className="tw:block tw:min-w-0" data-shadcn-host="" data-shadcn-theme={mode}>
      {shadow && createPortal(<>
        <ThemeContext.Provider value={mode}>
        <PortalContainerContext.Provider value={portalContainer}>
          <div
            {...props}
            className={["shadcn-scope sc:[--spacing:var(--sc-spacing)] sc:font-sans sc:[font-size:16px] sc:leading-[1.5] sc:text-foreground sc:bg-background sc:caret-link sc:antialiased sc:[:where(&)_*]:border-border sc:[:where(&)_*]:[outline-color:color-mix(in_oklab,var(--ring)_50%,transparent)] sc:[:where(&)_::before]:border-border sc:[:where(&)_::after]:border-border sc:[:where(&)_::before]:[outline-color:color-mix(in_oklab,var(--ring)_50%,transparent)] sc:[:where(&)_::after]:[outline-color:color-mix(in_oklab,var(--ring)_50%,transparent)] sc:selection:bg-primary sc:selection:text-primary-foreground sc:[&[data-motion=paused]_*]:[animation-play-state:paused]! sc:[&[data-motion=paused]_*]:[animation-duration:0s]! sc:[&[data-motion=paused]_*]:[animation-delay:0s]! sc:[&[data-motion=paused]_*]:[transition-duration:0s]! sc:[&[data-motion=paused]_*]:[transition-delay:0s]! sc:[&[data-motion=paused]_*]:scroll-auto! sc:[&[data-motion=paused]_*::before]:[animation-play-state:paused]! sc:[&[data-motion=paused]_*::before]:[animation-duration:0s]! sc:[&[data-motion=paused]_*::before]:[animation-delay:0s]! sc:[&[data-motion=paused]_*::before]:[transition-duration:0s]! sc:[&[data-motion=paused]_*::before]:[transition-delay:0s]! sc:[&[data-motion=paused]_*::after]:[animation-play-state:paused]! sc:[&[data-motion=paused]_*::after]:[animation-duration:0s]! sc:[&[data-motion=paused]_*::after]:[animation-delay:0s]! sc:[&[data-motion=paused]_*::after]:[transition-duration:0s]! sc:[&[data-motion=paused]_*::after]:[transition-delay:0s]! sc:motion-reduce:[&_*]:[animation-duration:0s]! sc:motion-reduce:[&_*]:[animation-delay:0s]! sc:motion-reduce:[&_*]:[transition-duration:0s]! sc:motion-reduce:[&_*]:[transition-delay:0s]! sc:motion-reduce:[&_*]:scroll-auto! sc:motion-reduce:[&_*::before]:[animation-duration:0s]! sc:motion-reduce:[&_*::before]:[animation-delay:0s]! sc:motion-reduce:[&_*::before]:[transition-duration:0s]! sc:motion-reduce:[&_*::before]:[transition-delay:0s]! sc:motion-reduce:[&_*::after]:[animation-duration:0s]! sc:motion-reduce:[&_*::after]:[animation-delay:0s]! sc:motion-reduce:[&_*::after]:[transition-duration:0s]! sc:motion-reduce:[&_*::after]:[transition-delay:0s]!", className].filter(Boolean).join(" ")}
            data-shadcn-theme={mode}
            data-motion={stopped ? "paused" : "running"}
          >
            {children}
            <div ref={setPortalContainer} data-shadcn-portal="" />
          </div>
        </PortalContainerContext.Provider>
        </ThemeContext.Provider>
      </>, shadow)}
    </div>
  )
}
