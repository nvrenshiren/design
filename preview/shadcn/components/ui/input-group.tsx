import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "sc:group/input-group sc:relative sc:flex sc:w-full sc:items-center sc:rounded-md sc:border sc:border-input sc:shadow-xs sc:transition-[color,box-shadow] sc:outline-none sc:dark:bg-input/30",
        "sc:h-9 sc:min-w-0 sc:has-[>textarea]:h-auto",

        // Variants based on alignment.
        "sc:has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "sc:has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "sc:has-[>[data-align=block-start]]:h-auto sc:has-[>[data-align=block-start]]:flex-col sc:has-[>[data-align=block-start]]:[&>input]:pb-3",
        "sc:has-[>[data-align=block-end]]:h-auto sc:has-[>[data-align=block-end]]:flex-col sc:has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "sc:has-[[data-slot=input-group-control]:focus-visible]:border-ring sc:has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] sc:has-[[data-slot=input-group-control]:focus-visible]:ring-ring",

        // Error state.
        "sc:has-[[data-slot][aria-invalid=true]]:border-destructive sc:has-[[data-slot][aria-invalid=true]]:ring-destructive/20 sc:dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "sc:flex sc:h-auto sc:cursor-text sc:items-center sc:justify-center sc:gap-2 sc:py-1.5 sc:text-sm sc:font-medium sc:text-muted-foreground sc:select-none sc:group-data-[disabled=true]/input-group:opacity-50 sc:[&>kbd]:rounded-[calc(var(--radius)-5px)] sc:[&>svg:not([class*=size-])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "sc:order-first sc:pl-3 sc:has-[>button]:ml-[-0.45rem] sc:has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "sc:order-last sc:pr-3 sc:has-[>button]:mr-[-0.45rem] sc:has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "sc:order-first sc:w-full sc:justify-start sc:px-3 sc:pt-3 sc:group-has-[>input]/input-group:pt-2.5 sc:[.border-b]:pb-3",
        "block-end":
          "sc:order-last sc:w-full sc:justify-start sc:px-3 sc:pb-3 sc:group-has-[>input]/input-group:pb-2.5 sc:[.border-t]:pt-3",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "sc:flex sc:items-center sc:gap-2 sc:text-sm sc:shadow-none",
  {
    variants: {
      size: {
        xs: "sc:h-6 sc:gap-1 sc:rounded-[calc(var(--radius)-5px)] sc:px-2 sc:has-[>svg]:px-2 sc:[&>svg:not([class*=size-])]:size-3.5",
        sm: "sc:h-8 sc:gap-1.5 sc:rounded-md sc:px-2.5 sc:has-[>svg]:px-2.5",
        "icon-xs":
          "sc:size-6 sc:rounded-[calc(var(--radius)-5px)] sc:p-0 sc:has-[>svg]:p-0",
        "icon-sm": "sc:size-8 sc:p-0 sc:has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "sc:flex sc:items-center sc:gap-2 sc:text-sm sc:text-muted-foreground sc:[&_svg]:pointer-events-none sc:[&_svg:not([class*=size-])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "sc:flex-1 sc:rounded-none sc:border-0 sc:bg-transparent sc:shadow-none sc:focus-visible:ring-0 sc:dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "sc:flex-1 sc:resize-none sc:rounded-none sc:border-0 sc:bg-transparent sc:py-3 sc:shadow-none sc:focus-visible:ring-0 sc:dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
