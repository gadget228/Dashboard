import type React from "react"
export interface Widget {
  id: string
  title: string
  component: React.ComponentType<any>
  enabled: boolean
  size?: "small" | "medium" | "large"
  props?: Record<string, any>
}

export interface DashboardConfig {
  widgets: Widget[]
}
