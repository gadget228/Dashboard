import type React from "react"

export interface SystemMetric {
  value: number
  unit: string
  timestamp: number
  label: string
}

export interface DockerContainer {
  id: string
  name: string
  image: string
  status: "running" | "stopped" | "paused" | "restarting"
  uptime: string
  ports: string[]
  cpuUsage: number
  memoryUsage: number
}

export interface MonitoringWidget {
  id: string
  title: string
  category: "system" | "docker" | "network" | "custom"
  component: React.ComponentType<any>
  enabled: boolean
  refreshInterval?: number
  size?: "small" | "medium" | "large"
  configurable: boolean
  config?: Record<string, any>
  position?: number // Add position for drag and drop ordering
}

export interface DataProvider {
  getMetric(metricName: string): Promise<SystemMetric>
  getMetrics(metricNames: string[]): Promise<Record<string, SystemMetric>>
}

export interface DashboardLayout {
  widgetOrder: string[]
  gridLayout?: {
    [widgetId: string]: {
      x: number
      y: number
      w: number
      h: number
    }
  }
}
