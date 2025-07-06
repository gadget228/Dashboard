"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { WidgetRegistry } from "@/services/widget-registry"
import { WidgetConfiguration } from "@/components/widget-configuration"
import { DraggableWidget } from "@/components/draggable-widget"
import { DashboardHeader } from "@/components/dashboard-header"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { MonitoringWidget, DashboardLayout } from "@/types/monitoring"

export default function SystemMonitoringDashboard() {
  const [widgets, setWidgets] = useState<MonitoringWidget[]>([])
  const [configOpen, setConfigOpen] = useState(false)

  // Persist widget order and layout
  const [dashboardLayout, setDashboardLayout] = useLocalStorage<DashboardLayout>("dashboard-layout", {
    widgetOrder: [],
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    // Initialize widgets from registry
    const registryWidgets = WidgetRegistry.getWidgets()

    // Apply saved order if it exists
    if (dashboardLayout.widgetOrder.length > 0) {
      const orderedWidgets = dashboardLayout.widgetOrder
        .map((id) => registryWidgets.find((w) => w.id === id))
        .filter(Boolean) as MonitoringWidget[]

      // Add any new widgets that weren't in the saved order
      const newWidgets = registryWidgets.filter((w) => !dashboardLayout.widgetOrder.includes(w.id))

      setWidgets([...orderedWidgets, ...newWidgets])
    } else {
      // First time - use default order
      setWidgets(registryWidgets)
      setDashboardLayout({
        widgetOrder: WidgetRegistry.getDefaultOrder(),
      })
    }
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const enabledWidgets = widgets.filter((w) => w.enabled)
      const oldIndex = enabledWidgets.findIndex((w) => w.id === active.id)
      const newIndex = enabledWidgets.findIndex((w) => w.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newEnabledOrder = arrayMove(enabledWidgets, oldIndex, newIndex)
        const newOrder = [...newEnabledOrder.map((w) => w.id), ...widgets.filter((w) => !w.enabled).map((w) => w.id)]

        // Update widget positions
        const reorderedWidgets = newOrder.map((id) => widgets.find((w) => w.id === id)!)

        setWidgets(reorderedWidgets)
        setDashboardLayout({
          ...dashboardLayout,
          widgetOrder: newOrder,
        })
      }
    }
  }

  const toggleWidget = (widgetId: string) => {
    setWidgets((prev) => {
      const updated = prev.map((widget) => (widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget))

      // Update saved order
      setDashboardLayout({
        ...dashboardLayout,
        widgetOrder: updated.map((w) => w.id),
      })

      return updated
    })
  }

  const updateWidgetConfig = (widgetId: string, config: Record<string, any>) => {
    setWidgets((prev) => prev.map((widget) => (widget.id === widgetId ? { ...widget, config } : widget)))
  }

  const resetLayout = () => {
    const defaultWidgets = WidgetRegistry.getWidgets()
    setWidgets(defaultWidgets)
    setDashboardLayout({
      widgetOrder: WidgetRegistry.getDefaultOrder(),
    })
  }

  const enabledWidgets = widgets.filter((widget) => widget.enabled)

  const getGridClass = (size: MonitoringWidget["size"]) => {
    switch (size) {
      case "large":
        return "md:col-span-2 lg:col-span-2"
      case "medium":
        return "md:col-span-1 lg:col-span-1"
      case "small":
      default:
        return "md:col-span-1 lg:col-span-1"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader onOpenConfig={() => setConfigOpen(true)} onResetLayout={resetLayout} />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={enabledWidgets.map((w) => w.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enabledWidgets.map((widget) => {
                const WidgetComponent = widget.component
                return (
                  <div key={widget.id} className={getGridClass(widget.size)}>
                    <DraggableWidget widget={widget}>
                      <WidgetComponent {...(widget.config || {})} refreshInterval={widget.refreshInterval} />
                    </DraggableWidget>
                  </div>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>

        <WidgetConfiguration
          widgets={widgets}
          onToggleWidget={toggleWidget}
          onUpdateConfig={updateWidgetConfig}
          isOpen={configOpen}
          onToggle={() => setConfigOpen(!configOpen)}
        />
      </div>
    </div>
  )
}
