import * as React from "react"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "sc:flex sc:items-center sc:gap-2 sc:text-sm sc:leading-none sc:font-medium sc:select-none sc:group-data-[disabled=true]:pointer-events-none sc:group-data-[disabled=true]:opacity-50 sc:peer-disabled:cursor-not-allowed sc:peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
