import * as React from "react"
import { cn } from "cn"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "sc:h-9 sc:w-full sc:min-w-0 sc:rounded-md sc:border sc:border-input sc:bg-transparent sc:px-3 sc:py-1 sc:text-base sc:shadow-xs sc:transition-[color,box-shadow] sc:outline-none sc:selection:bg-primary sc:selection:text-primary-foreground sc:file:inline-flex sc:file:h-7 sc:file:border-0 sc:file:bg-transparent sc:file:text-sm sc:file:font-medium sc:file:text-foreground sc:placeholder:text-muted-foreground sc:disabled:pointer-events-none sc:disabled:cursor-not-allowed sc:disabled:opacity-50 sc:md:text-sm sc:dark:bg-input/30",
        "sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background",
        "sc:aria-invalid:border-destructive sc:aria-invalid:ring-destructive/20 sc:dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
})

export { Input }
