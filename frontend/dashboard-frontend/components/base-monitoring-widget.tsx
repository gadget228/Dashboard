"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface BaseMonitoringWidgetProps {
  title: string
  refreshInterval?: number
  children: React.ReactNode
  status?: "normal" | "warning" | "critical"
  lastUpdated?: number
}

export function BaseMonitoringWidget({
  title,
  refreshInterval = 5000,
  children,
  status = "normal",
  lastUpdated,
}: BaseMonitoringWidgetProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = () => {
    switch (status) {
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-green-500"
    }
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return ""
    const seconds = Math.floor((Date.now() - lastUpdated) / 1000)
    return `${seconds}s ago`
  }

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {lastUpdated && <p className="text-xs text-muted-foreground mt-2">Updated {formatLastUpdated()}</p>}
      </CardContent>
    </Card>
  )
}
