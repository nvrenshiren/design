import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "sc:inline-flex sc:w-fit sc:shrink-0 sc:items-center sc:justify-center sc:gap-1 sc:overflow-hidden sc:rounded-full sc:border sc:border-transparent sc:px-2 sc:py-0.5 sc:text-xs sc:font-medium sc:whitespace-nowrap sc:transition-[color,box-shadow] sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background sc:aria-invalid:border-destructive sc:aria-invalid:ring-destructive/20 sc:dark:aria-invalid:ring-destructive/40 sc:[&>svg]:pointer-events-none sc:[&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "sc:bg-primary sc:text-primary-foreground sc:[a&]:hover:bg-primary-hover sc:[a&]:active:bg-primary-active",
        secondary:
          "sc:bg-secondary sc:text-secondary-foreground sc:[a&]:hover:bg-secondary/90",
        destructive:
          "sc:bg-destructive-solid sc:text-destructive-foreground sc:focus-visible:ring-destructive sc:[a&]:hover:bg-destructive-hover sc:[a&]:active:bg-destructive-active",
        outline:
          "sc:border-border sc:text-foreground sc:[a&]:hover:bg-accent sc:[a&]:hover:text-accent-foreground",
        ghost: "sc:[a&]:hover:bg-accent sc:[a&]:hover:text-accent-foreground",
        link: "sc:text-link sc:underline-offset-4 sc:[a&]:hover:text-link-hover sc:[a&]:hover:underline sc:[a&]:active:text-link-active",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
