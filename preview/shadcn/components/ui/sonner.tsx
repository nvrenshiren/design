import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useShadcnTheme } from "../../scope"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { cn } from "cn"

const Toaster = ({ className, style, ...props }: ToasterProps) => {
  const theme = useShadcnTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("sc:toaster sc:group", className)}
      icons={{
        success: <CircleCheckIcon className="sc:size-4" />,
        info: <InfoIcon className="sc:size-4" />,
        warning: <TriangleAlertIcon className="sc:size-4" />,
        error: <OctagonXIcon className="sc:size-4" />,
        loading: <Loader2Icon className="sc:size-4 sc:animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
