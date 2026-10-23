import * as React from "react"
import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "sc:peer sc:group/switch sc:inline-flex sc:shrink-0 sc:items-center sc:rounded-full sc:border sc:border-transparent sc:shadow-xs sc:transition-all sc:outline-none sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background sc:disabled:cursor-not-allowed sc:disabled:opacity-50 sc:data-[size=default]:h-[1.15rem] sc:data-[size=default]:w-8 sc:data-[size=sm]:h-3.5 sc:data-[size=sm]:w-6 sc:data-[state=checked]:bg-primary sc:data-[state=unchecked]:bg-input sc:dark:data-[state=unchecked]:bg-input/80",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "sc:pointer-events-none sc:block sc:rounded-full sc:bg-background sc:ring-0 sc:transition-transform sc:group-data-[size=default]/switch:size-4 sc:group-data-[size=sm]/switch:size-3 sc:data-[state=checked]:translate-x-[calc(100%-2px)] sc:data-[state=unchecked]:translate-x-0 sc:dark:data-[state=checked]:bg-primary-foreground sc:dark:data-[state=unchecked]:bg-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
