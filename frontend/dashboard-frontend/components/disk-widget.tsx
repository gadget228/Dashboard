"use client"

import { useState, useEffect } from "react"
import { BaseMonitoringWidget } from "./base-monitoring-widget"
import { Progress } from "@/components/ui/progress"
import { HardDrive } from "lucide-react"
import { dataProvider } from "@/services/mock-data-provider"
import type { SystemMetric } from "@/types/monitoring"

interface DiskWidgetProps {
  refreshInterval?: number
  warningThreshold?: number
  criticalThreshold?: number
}

export function DiskWidget({
  refreshInterval = 10000,
  warningThreshold = 85,
  criticalThreshold = 95,
}: DiskWidgetProps) {
  const [metric, setMetric] = useState<SystemMetric | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataProvider.getMetric("disk")
        setMetric(data)
      } catch (error) {
        console.error("Failed to fetch disk data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const getStatus = () => {
    if (!metric) return "normal"
    if (metric.value >= criticalThreshold) return "critical"
    if (metric.value >= warningThreshold) return "warning"
    return "normal"
  }

  return (
    <BaseMonitoringWidget title="Disk Usage" status={getStatus()} lastUpdated={metric?.timestamp}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <div className="text-2xl font-bold">{metric ? `${metric.value.toFixed(1)}%` : "--"}</div>
        </div>
        <Progress value={metric?.value || 0} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Free Space</span>
          <span>Used Space</span>
        </div>
      </div>
    </BaseMonitoringWidget>
  )
}
