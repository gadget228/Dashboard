"use client"

import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, RotateCcw } from "lucide-react"

interface DashboardHeaderProps {
  onOpenConfig: () => void
  onResetLayout: () => void
}

export function DashboardHeader({ onOpenConfig, onResetLayout }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Monitor</h1>
        <p className="text-muted-foreground">Real-time monitoring of your system resources and Docker containers</p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Button variant="outline" size="sm" onClick={onResetLayout} className="bg-transparent">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Layout
        </Button>

        <Button variant="outline" size="sm" onClick={onOpenConfig} className="bg-transparent">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>
    </div>
  )
}
