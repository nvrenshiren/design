import { useMemo } from "react"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "sc:flex sc:flex-col sc:gap-6",
        "sc:has-[>[data-slot=checkbox-group]]:gap-3 sc:has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "sc:mb-3 sc:font-medium",
        "sc:data-[variant=legend]:text-base",
        "sc:data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "sc:group/field-group sc:@container/field-group sc:flex sc:w-full sc:flex-col sc:gap-7 sc:data-[slot=checkbox-group]:gap-3 sc:[&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "sc:group/field sc:flex sc:w-full sc:gap-3 sc:data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["sc:flex-col sc:[&>*]:w-full sc:[&>[class~='sc:sr-only']]:w-auto"],
        horizontal: [
          "sc:flex-row sc:items-center",
          "sc:[&>[data-slot=field-label]]:flex-auto",
          "sc:has-[>[data-slot=field-content]]:items-start sc:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "sc:flex-col sc:@md/field-group:flex-row sc:@md/field-group:items-center sc:[&>*]:w-full sc:@md/field-group:[&>*]:w-auto sc:[&>[class~='sc:sr-only']]:w-auto",
          "sc:@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "sc:@md/field-group:has-[>[data-slot=field-content]]:items-start sc:@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "sc:group/field-content sc:flex sc:flex-1 sc:flex-col sc:gap-1.5 sc:leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "sc:group/field-label sc:peer/field-label sc:flex sc:w-fit sc:gap-2 sc:leading-snug sc:group-data-[disabled=true]/field:opacity-50",
        "sc:has-[>[data-slot=field]]:w-full sc:has-[>[data-slot=field]]:flex-col sc:has-[>[data-slot=field]]:rounded-md sc:has-[>[data-slot=field]]:border sc:[&>*]:data-[slot=field]:p-4",
        "sc:has-data-[state=checked]:border-primary sc:has-data-[state=checked]:bg-primary/5 sc:dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "sc:flex sc:w-fit sc:items-center sc:gap-2 sc:text-sm sc:leading-snug sc:font-medium sc:group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "sc:text-sm sc:leading-normal sc:font-normal sc:text-muted-foreground sc:group-has-[[data-orientation=horizontal]]/field:text-balance",
        "sc:last:mt-0 sc:nth-last-2:-mt-1 sc:[[data-variant=legend]+&]:-mt-1.5",
        "sc:[&>a]:underline sc:[&>a]:underline-offset-4 sc:[&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "sc:relative sc:-my-2 sc:h-5 sc:text-sm sc:group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="sc:absolute sc:inset-0 sc:top-1/2" />
      {children && (
        <span
          className="sc:relative sc:mx-auto sc:block sc:w-fit sc:bg-background sc:px-2 sc:text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="sc:ml-4 sc:flex sc:list-disc sc:flex-col sc:gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("sc:text-sm sc:font-normal sc:text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
