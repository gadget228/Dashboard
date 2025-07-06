"use client"

import { useState, useEffect } from "react"
import { BaseMonitoringWidget } from "./base-monitoring-widget"
import { Progress } from "@/components/ui/progress"
import { dataProvider } from "@/services/mock-data-provider"
import type { SystemMetric } from "@/types/monitoring"

interface CpuWidgetProps {
  refreshInterval?: number
  warningThreshold?: number
  criticalThreshold?: number
}

export function CpuWidget({ refreshInterval = 2000, warningThreshold = 70, criticalThreshold = 90 }: CpuWidgetProps) {
  const [metric, setMetric] = useState<SystemMetric | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataProvider.getMetric("cpu")
        setMetric(data)
      } catch (error) {
        console.error("Failed to fetch CPU data:", error)
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
    <BaseMonitoringWidget title="CPU Usage" status={getStatus()} lastUpdated={metric?.timestamp}>
      <div className="space-y-3">
        <div className="text-2xl font-bold">{metric ? `${metric.value.toFixed(1)}%` : "--"}</div>
        <Progress value={metric?.value || 0} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </BaseMonitoringWidget>
  )
}
