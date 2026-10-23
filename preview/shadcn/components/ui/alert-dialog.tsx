import * as React from "react"
import { cn } from "cn"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { useShadcnPortalContainer } from "@/scope"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  container,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  const scopeContainer = useShadcnPortalContainer()
  if (scopeContainer === null && !container) return null
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" container={container ?? scopeContainer} {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "sc:fixed sc:inset-0 sc:z-50 sc:bg-black/50 sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=open]:animate-in sc:data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "sc:group/alert-dialog-content sc:fixed sc:top-[50%] sc:left-[50%] sc:z-50 sc:grid sc:w-full sc:max-w-[calc(100%-2rem)] sc:translate-x-[-50%] sc:translate-y-[-50%] sc:gap-4 sc:rounded-lg sc:border sc:bg-background sc:p-6 sc:shadow-lg sc:duration-200 sc:data-[size=sm]:max-w-xs sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=closed]:zoom-out-95 sc:data-[state=open]:animate-in sc:data-[state=open]:fade-in-0 sc:data-[state=open]:zoom-in-95 sc:data-[size=default]:sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "sc:grid sc:grid-rows-[auto_1fr] sc:place-items-center sc:gap-1.5 sc:text-center sc:has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] sc:has-data-[slot=alert-dialog-media]:gap-x-6 sc:sm:group-data-[size=default]/alert-dialog-content:place-items-start sc:sm:group-data-[size=default]/alert-dialog-content:text-left sc:sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "sc:flex sc:flex-col-reverse sc:gap-2 sc:group-data-[size=sm]/alert-dialog-content:grid sc:group-data-[size=sm]/alert-dialog-content:grid-cols-2 sc:sm:flex-row sc:sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "sc:text-lg sc:font-semibold sc:sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("sc:text-sm sc:text-muted-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "sc:mb-2 sc:inline-flex sc:size-16 sc:items-center sc:justify-center sc:rounded-md sc:bg-muted sc:sm:group-data-[size=default]/alert-dialog-content:row-span-2 sc:*:[svg:not([class*=size-])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
