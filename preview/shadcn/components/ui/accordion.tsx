import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("sc:border-b sc:last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="sc:flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "sc:flex sc:flex-1 sc:items-start sc:justify-between sc:gap-4 sc:rounded-md sc:py-4 sc:text-left sc:text-sm sc:font-medium sc:transition-all sc:outline-none sc:hover:underline sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:disabled:pointer-events-none sc:disabled:opacity-50 sc:[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="sc:pointer-events-none sc:size-4 sc:shrink-0 sc:translate-y-0.5 sc:text-muted-foreground sc:transition-transform sc:duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="sc:overflow-hidden sc:text-sm sc:data-[state=closed]:animate-accordion-up sc:data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("sc:pt-0 sc:pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
