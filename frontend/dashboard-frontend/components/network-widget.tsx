"use client"

import { useState, useEffect } from "react"
import { BaseMonitoringWidget } from "./base-monitoring-widget"
import { ArrowUp, ArrowDown } from "lucide-react"
import { dataProvider } from "@/services/mock-data-provider"
import type { SystemMetric } from "@/types/monitoring"

interface NetworkWidgetProps {
  refreshInterval?: number
}

export function NetworkWidget({ refreshInterval = 2000 }: NetworkWidgetProps) {
  const [metrics, setMetrics] = useState<{ in: SystemMetric | null; out: SystemMetric | null }>({
    in: null,
    out: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataProvider.getMetrics(["network_in", "network_out"])
        setMetrics({
          in: data.network_in,
          out: data.network_out,
        })
      } catch (error) {
        console.error("Failed to fetch network data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return (
    <BaseMonitoringWidget title="Network Activity" lastUpdated={metrics.in?.timestamp}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Download</span>
          </div>
          <div className="text-lg font-semibold">
            {metrics.in ? `${metrics.in.value.toFixed(1)} ${metrics.in.unit}` : "--"}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Upload</span>
          </div>
          <div className="text-lg font-semibold">
            {metrics.out ? `${metrics.out.value.toFixed(1)} ${metrics.out.unit}` : "--"}
          </div>
        </div>
      </div>
    </BaseMonitoringWidget>
  )
}
