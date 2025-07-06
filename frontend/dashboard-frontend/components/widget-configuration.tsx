"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, X } from "lucide-react"
import type { MonitoringWidget } from "@/types/monitoring"

interface WidgetConfigurationProps {
  widgets: MonitoringWidget[]
  onToggleWidget: (widgetId: string) => void
  onUpdateConfig: (widgetId: string, config: Record<string, any>) => void
  isOpen: boolean
  onToggle: () => void
}

export function WidgetConfiguration({
  widgets,
  onToggleWidget,
  onUpdateConfig,
  isOpen,
  onToggle,
}: WidgetConfigurationProps) {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={onToggle} className="fixed top-4 right-4 z-50 bg-transparent">
        <Settings className="h-4 w-4 mr-2" />
        Configure Widgets
      </Button>
    )
  }

  const selectedWidgetData = selectedWidget ? widgets.find((w) => w.id === selectedWidget) : null

  const getCategoryColor = (category: MonitoringWidget["category"]) => {
    switch (category) {
      case "system":
        return "bg-blue-100 text-blue-800"
      case "docker":
        return "bg-purple-100 text-purple-800"
      case "network":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Widget Configuration</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex gap-4 h-[60vh]">
          {/* Widget List */}
          <div className="w-1/2 space-y-2 overflow-y-auto">
            <h3 className="font-semibold mb-3">Available Widgets</h3>
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedWidget === widget.id ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedWidget(widget.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{widget.title}</span>
                  <Switch
                    checked={widget.enabled}
                    onCheckedChange={() => onToggleWidget(widget.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(widget.category)}>{widget.category}</Badge>
                  <Badge variant="outline">{widget.size}</Badge>
                  {widget.configurable && <Badge variant="secondary">Configurable</Badge>}
                </div>
              </div>
            ))}
          </div>

          {/* Widget Configuration */}
          <div className="w-1/2 overflow-y-auto">
            {selectedWidgetData ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Configure {selectedWidgetData.title}</h3>

                {selectedWidgetData.configurable && selectedWidgetData.config ? (
                  <div className="space-y-4">
                    {Object.entries(selectedWidgetData.config).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </Label>
                        <Input
                          id={key}
                          type={typeof value === "number" ? "number" : "text"}
                          value={value}
                          onChange={(e) => {
                            const newValue =
                              typeof value === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value
                            onUpdateConfig(selectedWidgetData.id, {
                              ...selectedWidgetData.config,
                              [key]: newValue,
                            })
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">This widget is not configurable.</p>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Widget Information</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Category: {selectedWidgetData.category}</p>
                    <p>Size: {selectedWidgetData.size}</p>
                    <p>Refresh Interval: {selectedWidgetData.refreshInterval}ms</p>
                    <p>Configurable: {selectedWidgetData.configurable ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a widget to configure it.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
