import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "sc:relative sc:grid sc:w-full sc:grid-cols-[0_1fr] sc:items-start sc:gap-y-0.5 sc:rounded-lg sc:border sc:px-4 sc:py-3 sc:text-sm sc:has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] sc:has-[>svg]:gap-x-3 sc:[&>svg]:size-4 sc:[&>svg]:translate-y-0.5 sc:[&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "sc:bg-card sc:text-card-foreground",
        destructive:
          "sc:bg-card sc:text-destructive sc:*:data-[slot=alert-description]:text-destructive sc:[&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "sc:col-start-2 sc:line-clamp-1 sc:min-h-4 sc:font-medium sc:tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "sc:col-start-2 sc:grid sc:justify-items-start sc:gap-1 sc:text-sm sc:text-muted-foreground sc:[&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
