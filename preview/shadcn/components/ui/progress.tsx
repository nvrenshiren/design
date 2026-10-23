"use client"

import * as React from "react"
import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "sc:relative sc:h-2 sc:w-full sc:overflow-hidden sc:rounded-full sc:bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="sc:h-full sc:w-full sc:flex-1 sc:bg-primary sc:transition-all sc:[transform:translateX(var(--progress-offset))]"
        style={{ "--progress-offset": `-${100 - (value || 0)}%` } as React.CSSProperties}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
