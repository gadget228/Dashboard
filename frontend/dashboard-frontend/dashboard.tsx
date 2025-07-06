"use client"

import { useState } from "react"
import { DollarSign, Users, CreditCard, Activity } from "lucide-react"
import type { Widget } from "@/types/widget"
import { StatsWidget } from "@/components/stats-widget"
import { ChartWidget } from "@/components/chart-widget"
import { ActivityWidget } from "@/components/activity-widget"
import { QuickActionsWidget } from "@/components/quick-actions-widget"
import { WidgetManager } from "@/components/widget-manager"

export default function Dashboard() {
  const [managerOpen, setManagerOpen] = useState(false)

  // Sample data
  const chartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
  ]

  const activities = [
    {
      id: "1",
      user: "John Doe",
      action: "created a new project",
      time: "2 minutes ago",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "updated the dashboard",
      time: "1 hour ago",
    },
    {
      id: "3",
      user: "Mike Johnson",
      action: "completed a task",
      time: "3 hours ago",
    },
  ]

  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "revenue",
      title: "Total Revenue",
      component: StatsWidget,
      enabled: true,
      props: {
        title: "Total Revenue",
        value: "$45,231.89",
        change: 20.1,
        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      },
    },
    {
      id: "users",
      title: "Active Users",
      component: StatsWidget,
      enabled: true,
      props: {
        title: "Active Users",
        value: "+2350",
        change: 180.1,
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
      },
    },
    {
      id: "sales",
      title: "Sales",
      component: StatsWidget,
      enabled: true,
      props: {
        title: "Sales",
        value: "+12,234",
        change: 19,
        icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      },
    },
    {
      id: "active",
      title: "Active Now",
      component: StatsWidget,
      enabled: true,
      props: {
        title: "Active Now",
        value: "+573",
        change: 201,
        icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      },
    },
    {
      id: "chart",
      title: "Monthly Overview",
      component: ChartWidget,
      enabled: true,
      props: {
        title: "Monthly Overview",
        data: chartData,
      },
    },
    {
      id: "activity",
      title: "Recent Activity",
      component: ActivityWidget,
      enabled: true,
      props: {
        title: "Recent Activity",
        activities: activities,
      },
    },
    {
      id: "actions",
      title: "Quick Actions",
      component: QuickActionsWidget,
      enabled: false,
      props: {
        title: "Quick Actions",
      },
    },
  ])

  const toggleWidget = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((widget) => (widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget)),
    )
  }

  const enabledWidgets = widgets.filter((widget) => widget.enabled)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {enabledWidgets.map((widget) => {
            const WidgetComponent = widget.component
            return <WidgetComponent key={widget.id} {...widget.props} />
          })}
        </div>

        <WidgetManager
          widgets={widgets}
          onToggleWidget={toggleWidget}
          isOpen={managerOpen}
          onToggle={() => setManagerOpen(!managerOpen)}
        />
      </div>
    </div>
  )
}
