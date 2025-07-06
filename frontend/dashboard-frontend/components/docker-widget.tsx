"use client"

import { useState, useEffect } from "react"
import { BaseMonitoringWidget } from "./base-monitoring-widget"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { dataProvider } from "@/services/mock-data-provider"
import type { DockerContainer } from "@/types/monitoring"

interface DockerWidgetProps {
  refreshInterval?: number
  maxContainers?: number
}

export function DockerWidget({ refreshInterval = 5000, maxContainers = 10 }: DockerWidgetProps) {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [lastUpdated, setLastUpdated] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataProvider.getDockerContainers()
        setContainers(data.slice(0, maxContainers))
        setLastUpdated(Date.now())
      } catch (error) {
        console.error("Failed to fetch Docker data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval, maxContainers])

  const getStatusVariant = (status: DockerContainer["status"]) => {
    switch (status) {
      case "running":
        return "default"
      case "stopped":
        return "destructive"
      case "paused":
        return "secondary"
      case "restarting":
        return "outline"
      default:
        return "secondary"
    }
  }

  const runningCount = containers.filter((c) => c.status === "running").length

  return (
    <BaseMonitoringWidget
      title={`Docker Containers (${runningCount}/${containers.length} running)`}
      lastUpdated={lastUpdated}
    >
      <ScrollArea className="h-64">
        <div className="space-y-3">
          {containers.map((container) => (
            <div key={container.id} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{container.name}</p>
                  <Badge variant={getStatusVariant(container.status)} className="text-xs">
                    {container.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{container.image}</p>
                <p className="text-xs text-muted-foreground">Uptime: {container.uptime}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>CPU: {container.cpuUsage.toFixed(1)}%</div>
                <div>RAM: {container.memoryUsage.toFixed(0)}MB</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </BaseMonitoringWidget>
  )
}
