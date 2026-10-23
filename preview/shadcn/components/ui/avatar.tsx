import * as React from "react"
import { cn } from "cn"
import { Avatar as AvatarPrimitive } from "radix-ui"

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "sc:group/avatar sc:relative sc:flex sc:size-8 sc:shrink-0 sc:overflow-hidden sc:rounded-full sc:select-none sc:data-[size=lg]:size-10 sc:data-[size=sm]:size-6",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("sc:aspect-square sc:size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "sc:flex sc:size-full sc:items-center sc:justify-center sc:rounded-full sc:bg-muted sc:text-sm sc:text-muted-foreground sc:group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "sc:absolute sc:right-0 sc:bottom-0 sc:z-10 sc:inline-flex sc:items-center sc:justify-center sc:rounded-full sc:bg-primary sc:text-primary-foreground sc:ring-2 sc:ring-background sc:select-none",
        "sc:group-data-[size=sm]/avatar:size-2 sc:group-data-[size=sm]/avatar:[&>svg]:hidden",
        "sc:group-data-[size=default]/avatar:size-2.5 sc:group-data-[size=default]/avatar:[&>svg]:size-2",
        "sc:group-data-[size=lg]/avatar:size-3 sc:group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "sc:group/avatar-group sc:flex sc:-space-x-2 sc:*:data-[slot=avatar]:ring-2 sc:*:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "sc:relative sc:flex sc:size-8 sc:shrink-0 sc:items-center sc:justify-center sc:rounded-full sc:bg-muted sc:text-sm sc:text-muted-foreground sc:ring-2 sc:ring-background sc:group-has-data-[size=lg]/avatar-group:size-10 sc:group-has-data-[size=sm]/avatar-group:size-6 sc:[&>svg]:size-4 sc:group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 sc:group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
}
