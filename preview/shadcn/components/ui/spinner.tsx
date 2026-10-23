import { cn } from "cn"
import * as React from "react"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("sc:size-4 sc:animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
