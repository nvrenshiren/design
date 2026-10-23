"use client"

import * as React from "react"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"
import { useShadcnPortalContainer } from "@/scope"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "sc:flex sc:w-fit sc:items-center sc:justify-between sc:gap-2 sc:rounded-md sc:border sc:border-input sc:bg-transparent sc:px-3 sc:py-2 sc:text-sm sc:whitespace-nowrap sc:shadow-xs sc:transition-[color,box-shadow] sc:outline-none sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background sc:disabled:cursor-not-allowed sc:disabled:opacity-50 sc:aria-invalid:border-destructive sc:aria-invalid:ring-destructive/20 sc:data-[placeholder]:text-muted-foreground sc:data-[size=default]:h-9 sc:data-[size=sm]:h-8 sc:*:data-[slot=select-value]:line-clamp-1 sc:*:data-[slot=select-value]:flex sc:*:data-[slot=select-value]:items-center sc:*:data-[slot=select-value]:gap-2 sc:dark:bg-input/30 sc:dark:hover:bg-input/50 sc:dark:aria-invalid:ring-destructive/40 sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4 sc:[&_svg:not([class*=text-])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="sc:size-4 sc:opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const portalContainer = useShadcnPortalContainer()
  if (portalContainer === null) return null
  return (
    <SelectPrimitive.Portal container={portalContainer}>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "sc:relative sc:z-50 sc:max-h-(--radix-select-content-available-height) sc:min-w-[8rem] sc:origin-(--radix-select-content-transform-origin) sc:overflow-x-hidden sc:overflow-y-auto sc:rounded-md sc:border sc:bg-popover sc:text-popover-foreground sc:shadow-md sc:data-[side=bottom]:slide-in-from-top-2 sc:data-[side=left]:slide-in-from-right-2 sc:data-[side=right]:slide-in-from-left-2 sc:data-[side=top]:slide-in-from-bottom-2 sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=closed]:zoom-out-95 sc:data-[state=open]:animate-in sc:data-[state=open]:fade-in-0 sc:data-[state=open]:zoom-in-95",
          position === "popper" &&
            "sc:data-[side=bottom]:translate-y-1 sc:data-[side=left]:-translate-x-1 sc:data-[side=right]:translate-x-1 sc:data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "sc:p-1",
            position === "popper" &&
              "sc:h-[var(--radix-select-trigger-height)] sc:w-full sc:min-w-[var(--radix-select-trigger-width)] sc:scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("sc:px-2 sc:py-1.5 sc:text-xs sc:text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "sc:relative sc:flex sc:w-full sc:cursor-default sc:items-center sc:gap-2 sc:rounded-sm sc:py-1.5 sc:pr-8 sc:pl-2 sc:text-sm sc:outline-hidden sc:select-none sc:focus:bg-accent sc:focus:text-accent-foreground sc:data-[disabled]:pointer-events-none sc:data-[disabled]:opacity-50 sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4 sc:[&_svg:not([class*=text-])]:text-muted-foreground sc:*:[span]:last:flex sc:*:[span]:last:items-center sc:*:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="sc:absolute sc:right-2 sc:flex sc:size-3.5 sc:items-center sc:justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="sc:size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("sc:pointer-events-none sc:-mx-1 sc:my-1 sc:h-px sc:bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "sc:flex sc:cursor-default sc:items-center sc:justify-center sc:py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="sc:size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "sc:flex sc:cursor-default sc:items-center sc:justify-center sc:py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="sc:size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
