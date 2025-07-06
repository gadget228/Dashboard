"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import type { Widget } from "@/types/widget"

interface WidgetManagerProps {
  widgets: Widget[]
  onToggleWidget: (widgetId: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function WidgetManager({ widgets, onToggleWidget, isOpen, onToggle }: WidgetManagerProps) {
  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={onToggle} className="fixed top-4 right-4 z-50 bg-transparent">
        <Settings className="h-4 w-4 mr-2" />
        Manage Widgets
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Manage Widgets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="flex items-center justify-between">
              <span className="text-sm font-medium">{widget.title}</span>
              <Switch checked={widget.enabled} onCheckedChange={() => onToggleWidget(widget.id)} />
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={onToggle}>Done</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
