import * as React from "react"
import { cn } from "cn"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "sc:flex sc:field-sizing-content sc:min-h-16 sc:w-full sc:rounded-md sc:border sc:border-input sc:bg-transparent sc:px-3 sc:py-2 sc:text-base sc:shadow-xs sc:transition-[color,box-shadow] sc:outline-none sc:placeholder:text-muted-foreground sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background sc:disabled:cursor-not-allowed sc:disabled:opacity-50 sc:aria-invalid:border-destructive sc:aria-invalid:ring-destructive/20 sc:md:text-sm sc:dark:bg-input/30 sc:dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
})

export { Textarea }
