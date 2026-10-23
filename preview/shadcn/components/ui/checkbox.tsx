"use client"

import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "sc:peer sc:size-4 sc:shrink-0 sc:rounded-[4px] sc:border sc:border-input sc:shadow-xs sc:transition-shadow sc:outline-none sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background sc:disabled:cursor-not-allowed sc:disabled:opacity-50 sc:aria-invalid:border-destructive sc:aria-invalid:ring-destructive/20 sc:data-[state=checked]:border-primary sc:data-[state=checked]:bg-primary sc:data-[state=checked]:text-primary-foreground sc:dark:bg-input/30 sc:dark:aria-invalid:ring-destructive/40 sc:dark:data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="sc:grid sc:place-content-center sc:text-current sc:transition-none"
      >
        <CheckIcon className="sc:size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
