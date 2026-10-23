import { cn } from "cn"
import * as React from "react"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("sc:animate-pulse sc:rounded-md sc:bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
