import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "sc:inline-flex sc:shrink-0 sc:items-center sc:justify-center sc:gap-2 sc:rounded-md sc:text-sm sc:font-medium sc:whitespace-nowrap sc:transition-all sc:outline-none sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background sc:disabled:pointer-events-none sc:disabled:opacity-50 sc:aria-invalid:border-destructive sc:aria-invalid:ring-destructive/20 sc:dark:aria-invalid:ring-destructive/40 sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default: "sc:bg-primary sc:text-primary-foreground sc:hover:bg-primary-hover sc:active:bg-primary-active",
        destructive:
          "sc:bg-destructive-solid sc:text-destructive-foreground sc:hover:bg-destructive-hover sc:active:bg-destructive-active sc:focus-visible:ring-destructive sc:focus-visible:ring-offset-2 sc:ring-offset-background",
        outline:
          "sc:border sc:bg-background sc:shadow-xs sc:hover:bg-accent sc:hover:text-accent-foreground sc:dark:border-input sc:dark:bg-input/30",
        secondary:
          "sc:bg-secondary sc:text-secondary-foreground sc:hover:bg-secondary/80",
        ghost:
          "sc:hover:bg-accent sc:hover:text-accent-foreground",
        link: "sc:text-link sc:underline-offset-4 sc:hover:text-link-hover sc:hover:underline sc:active:text-link-active",
      },
      size: {
        default: "sc:h-9 sc:px-4 sc:py-2 sc:has-[>svg]:px-3",
        xs: "sc:h-6 sc:gap-1 sc:rounded-md sc:px-2 sc:text-xs sc:has-[>svg]:px-1.5 sc:[&_svg:not([class*=size-])]:size-3",
        sm: "sc:h-8 sc:gap-1.5 sc:rounded-md sc:px-3 sc:has-[>svg]:px-2.5",
        lg: "sc:h-10 sc:rounded-md sc:px-6 sc:has-[>svg]:px-4",
        icon: "sc:size-9",
        "icon-xs": "sc:size-6 sc:rounded-md sc:[&_svg:not([class*=size-])]:size-3",
        "icon-sm": "sc:size-8",
        "icon-lg": "sc:size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// React 18 integration: Radix asChild needs the trigger's DOM ref.
const Button = React.forwardRef<HTMLButtonElement,
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }
>(function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}, ref) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      ref={ref}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})

export { Button, buttonVariants }
