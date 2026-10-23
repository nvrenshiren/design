"use client"

import * as React from "react"
import { cn } from "cn"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import { useShadcnPortalContainer } from "@/scope"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const portalContainer = useShadcnPortalContainer()
  if (portalContainer === null) return null
  return (
    <TooltipPrimitive.Portal container={portalContainer}>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "sc:z-50 sc:w-fit sc:origin-(--radix-tooltip-content-transform-origin) sc:animate-in sc:rounded-md sc:bg-foreground sc:px-3 sc:py-1.5 sc:text-xs sc:text-balance sc:text-background sc:fade-in-0 sc:zoom-in-95 sc:data-[side=bottom]:slide-in-from-top-2 sc:data-[side=left]:slide-in-from-right-2 sc:data-[side=right]:slide-in-from-left-2 sc:data-[side=top]:slide-in-from-bottom-2 sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="sc:z-50 sc:size-2.5 sc:translate-y-[calc(-50%_-_2px)] sc:rotate-45 sc:rounded-[2px] sc:bg-foreground sc:fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
