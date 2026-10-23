import * as React from "react"
import { cn } from "cn"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { useShadcnPortalContainer } from "@/scope"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  container,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  const scopeContainer = useShadcnPortalContainer()
  if (scopeContainer === null && !container) return null
  return <DialogPrimitive.Portal data-slot="dialog-portal" container={container ?? scopeContainer} {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "sc:fixed sc:inset-0 sc:z-50 sc:bg-black/50 sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=open]:animate-in sc:data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "sc:fixed sc:top-[50%] sc:left-[50%] sc:z-50 sc:grid sc:w-full sc:max-w-[calc(100%-2rem)] sc:translate-x-[-50%] sc:translate-y-[-50%] sc:gap-4 sc:rounded-lg sc:border sc:bg-background sc:p-6 sc:shadow-lg sc:duration-200 sc:outline-none sc:data-[state=closed]:animate-out sc:data-[state=closed]:fade-out-0 sc:data-[state=closed]:zoom-out-95 sc:data-[state=open]:animate-in sc:data-[state=open]:fade-in-0 sc:data-[state=open]:zoom-in-95 sc:sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="sc:absolute sc:top-4 sc:right-4 sc:rounded-xs sc:opacity-70 sc:ring-offset-background sc:transition-opacity sc:hover:opacity-100 sc:focus:ring-2 sc:focus:ring-ring sc:focus:ring-offset-2 sc:focus:outline-hidden sc:disabled:pointer-events-none sc:data-[state=open]:bg-accent sc:data-[state=open]:text-muted-foreground sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4"
          >
            <XIcon />
            <span className="sc:sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("sc:flex sc:flex-col sc:gap-2 sc:text-center sc:sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "sc:flex sc:flex-col-reverse sc:gap-2 sc:sm:flex-row sc:sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("sc:text-lg sc:leading-none sc:font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("sc:text-sm sc:text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
