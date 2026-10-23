import * as React from "react"
import type { TransitionDemoProps } from "./types"

/** A copied component respects device preferences even outside the preview. */
export function useMotionDemo({ stopped, replayKey }: TransitionDemoProps) {
  const [deviceStopped, setDeviceStopped] = React.useState(() =>
    typeof document !== "undefined" &&
      (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches))

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setDeviceStopped(document.hidden || media.matches)
    media.addEventListener("change", update)
    document.addEventListener("visibilitychange", update)
    update()
    return () => {
      media.removeEventListener("change", update)
      document.removeEventListener("visibilitychange", update)
    }
  }, [])

  return React.useMemo(() => ({ stopped: stopped || deviceStopped, replayKey }), [stopped, deviceStopped, replayKey])
}
