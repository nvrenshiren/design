import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "cn"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "sc:flex sc:min-w-0 sc:flex-1 sc:flex-col sc:items-center sc:justify-center sc:gap-6 sc:rounded-lg sc:border-dashed sc:p-6 sc:text-center sc:text-balance sc:md:p-12",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "sc:flex sc:max-w-sm sc:flex-col sc:items-center sc:gap-2 sc:text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "sc:mb-2 sc:flex sc:shrink-0 sc:items-center sc:justify-center sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "sc:bg-transparent",
        icon: "sc:flex sc:size-10 sc:shrink-0 sc:items-center sc:justify-center sc:rounded-lg sc:bg-muted sc:text-foreground sc:[&_svg:not([class*=size-])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("sc:text-lg sc:font-medium sc:tracking-tight", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "sc:text-sm/relaxed sc:text-muted-foreground sc:[&>a]:underline sc:[&>a]:underline-offset-4 sc:[&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "sc:flex sc:w-full sc:max-w-sm sc:min-w-0 sc:flex-col sc:items-center sc:gap-4 sc:text-sm sc:text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
