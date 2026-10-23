import * as React from "react"
import { cn } from "cn"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { useShadcnPortalContainer } from "@/scope"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  container,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  const scopeContainer = useShadcnPortalContainer()
  if (scopeContainer === null && !container) return null
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" container={container ?? scopeContainer} {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "sc:z-50 sc:max-h-(--radix-dropdown-menu-content-available-height) sc:min-w-[8rem] sc:origin-(--radix-dropdown-menu-content-transform-origin) sc:overflow-x-hidden sc:overflow-y-auto sc:rounded-md sc:border sc:bg-popover sc:p-1 sc:text-popover-foreground sc:shadow-md sc:data-[side=bottom]:slide-in-from-top-2 sc:data-[side=left]:slide-in-from-right-2 sc:data-[side=right]:slide-in-from-left-2 sc:data-[side=top]:slide-in-from-bottom-2 sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=closed]:zoom-out-95 sc:data-[state=open]:animate-in sc:data-[state=open]:fade-in-0 sc:data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </DropdownMenuPortal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "sc:relative sc:flex sc:cursor-default sc:items-center sc:gap-2 sc:rounded-sm sc:px-2 sc:py-1.5 sc:text-sm sc:outline-hidden sc:select-none sc:focus:bg-accent sc:focus:text-accent-foreground sc:data-[disabled]:pointer-events-none sc:data-[disabled]:opacity-50 sc:data-[inset]:pl-8 sc:data-[variant=destructive]:text-destructive sc:data-[variant=destructive]:focus:bg-destructive/10 sc:data-[variant=destructive]:focus:text-destructive sc:dark:data-[variant=destructive]:focus:bg-destructive/20 sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4 sc:[&_svg:not([class*=text-])]:text-muted-foreground sc:data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "sc:relative sc:flex sc:cursor-default sc:items-center sc:gap-2 sc:rounded-sm sc:py-1.5 sc:pr-2 sc:pl-8 sc:text-sm sc:outline-hidden sc:select-none sc:focus:bg-accent sc:focus:text-accent-foreground sc:data-[disabled]:pointer-events-none sc:data-[disabled]:opacity-50 sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="sc:pointer-events-none sc:absolute sc:left-2 sc:flex sc:size-3.5 sc:items-center sc:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="sc:size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "sc:relative sc:flex sc:cursor-default sc:items-center sc:gap-2 sc:rounded-sm sc:py-1.5 sc:pr-2 sc:pl-8 sc:text-sm sc:outline-hidden sc:select-none sc:focus:bg-accent sc:focus:text-accent-foreground sc:data-[disabled]:pointer-events-none sc:data-[disabled]:opacity-50 sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4",
        className
      )}
      {...props}
    >
      <span className="sc:pointer-events-none sc:absolute sc:left-2 sc:flex sc:size-3.5 sc:items-center sc:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="sc:size-2 sc:fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "sc:px-2 sc:py-1.5 sc:text-sm sc:font-medium sc:data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("sc:-mx-1 sc:my-1 sc:h-px sc:bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "sc:ml-auto sc:text-xs sc:tracking-widest sc:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "sc:flex sc:cursor-default sc:items-center sc:gap-2 sc:rounded-sm sc:px-2 sc:py-1.5 sc:text-sm sc:outline-hidden sc:select-none sc:focus:bg-accent sc:focus:text-accent-foreground sc:data-[inset]:pl-8 sc:data-[state=open]:bg-accent sc:data-[state=open]:text-accent-foreground sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4 sc:[&_svg:not([class*=text-])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="sc:ml-auto sc:size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "sc:z-50 sc:min-w-[8rem] sc:origin-(--radix-dropdown-menu-content-transform-origin) sc:overflow-hidden sc:rounded-md sc:border sc:bg-popover sc:p-1 sc:text-popover-foreground sc:shadow-lg sc:data-[side=bottom]:slide-in-from-top-2 sc:data-[side=left]:slide-in-from-right-2 sc:data-[side=right]:slide-in-from-left-2 sc:data-[side=top]:slide-in-from-bottom-2 sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=closed]:zoom-out-95 sc:data-[state=open]:animate-in sc:data-[state=open]:fade-in-0 sc:data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
