"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "sc:group/tabs sc:flex sc:gap-2 sc:data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "sc:group/tabs-list sc:inline-flex sc:w-fit sc:items-center sc:justify-center sc:rounded-lg sc:p-[3px] sc:text-muted-foreground sc:group-data-[orientation=horizontal]/tabs:h-9 sc:group-data-[orientation=vertical]/tabs:h-fit sc:group-data-[orientation=vertical]/tabs:flex-col sc:data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "sc:bg-muted",
        line: "sc:gap-1 sc:bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "sc:relative sc:inline-flex sc:h-[calc(100%-1px)] sc:flex-1 sc:items-center sc:justify-center sc:gap-1.5 sc:rounded-md sc:border sc:border-transparent sc:px-2 sc:py-1 sc:text-sm sc:font-medium sc:whitespace-nowrap sc:text-foreground/60 sc:transition-all sc:group-data-[orientation=vertical]/tabs:w-full sc:group-data-[orientation=vertical]/tabs:justify-start sc:hover:text-foreground sc:focus-visible:border-ring sc:focus-visible:ring-[3px] sc:focus-visible:ring-ring sc:focus-visible:ring-offset-2 sc:ring-offset-background sc:focus-visible:outline-1 sc:focus-visible:outline-ring sc:disabled:pointer-events-none sc:disabled:opacity-50 sc:group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm sc:group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none sc:dark:text-muted-foreground sc:dark:hover:text-foreground sc:[&_svg]:pointer-events-none sc:[&_svg]:shrink-0 sc:[&_svg:not([class*=size-])]:size-4",
        "sc:group-data-[variant=line]/tabs-list:bg-transparent sc:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent sc:dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent sc:dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "sc:data-[state=active]:bg-accent sc:data-[state=active]:text-accent-foreground sc:dark:data-[state=active]:border-input",
        "sc:after:absolute sc:after:bg-primary sc:after:opacity-0 sc:after:transition-opacity sc:group-data-[orientation=horizontal]/tabs:after:inset-x-0 sc:group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] sc:group-data-[orientation=horizontal]/tabs:after:h-0.5 sc:group-data-[orientation=vertical]/tabs:after:inset-y-0 sc:group-data-[orientation=vertical]/tabs:after:-right-1 sc:group-data-[orientation=vertical]/tabs:after:w-0.5 sc:group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("sc:flex-1 sc:outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
