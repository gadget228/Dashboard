import type { MonitoringWidget } from "@/types/monitoring"
import { CpuWidget } from "@/components/cpu-widget"
import { MemoryWidget } from "@/components/memory-widget"
import { DiskWidget } from "@/components/disk-widget"
import { NetworkWidget } from "@/components/network-widget"
import { DockerWidget } from "@/components/docker-widget"

// Widget Registry - follows Open/Closed Principle
// Open for extension (add new widgets), Closed for modification
export class WidgetRegistry {
  private static widgets: MonitoringWidget[] = [
    {
      id: "cpu",
      title: "CPU Usage",
      category: "system",
      component: CpuWidget,
      enabled: true,
      refreshInterval: 2000,
      size: "small",
      configurable: true,
      position: 0,
      config: {
        warningThreshold: 70,
        criticalThreshold: 90,
      },
    },
    {
      id: "memory",
      title: "Memory Usage",
      category: "system",
      component: MemoryWidget,
      enabled: true,
      refreshInterval: 3000,
      size: "small",
      configurable: true,
      position: 1,
      config: {
        warningThreshold: 80,
        criticalThreshold: 95,
      },
    },
    {
      id: "disk",
      title: "Disk Usage",
      category: "system",
      component: DiskWidget,
      enabled: true,
      refreshInterval: 10000,
      size: "small",
      configurable: true,
      position: 2,
      config: {
        warningThreshold: 85,
        criticalThreshold: 95,
      },
    },
    {
      id: "network",
      title: "Network Activity",
      category: "network",
      component: NetworkWidget,
      enabled: true,
      refreshInterval: 2000,
      size: "small",
      configurable: false,
      position: 3,
    },
    {
      id: "docker",
      title: "Docker Containers",
      category: "docker",
      component: DockerWidget,
      enabled: true,
      refreshInterval: 5000,
      size: "large",
      configurable: true,
      position: 4,
      config: {
        maxContainers: 10,
      },
    },
  ]

  // Get all registered widgets
  static getWidgets(): MonitoringWidget[] {
    return [...this.widgets]
  }

  // Register a new widget (Open for extension)
  static registerWidget(widget: MonitoringWidget): void {
    const existingIndex = this.widgets.findIndex((w) => w.id === widget.id)
    if (existingIndex >= 0) {
      this.widgets[existingIndex] = widget
    } else {
      this.widgets.push(widget)
    }
  }

  // Get widgets by category
  static getWidgetsByCategory(category: MonitoringWidget["category"]): MonitoringWidget[] {
    return this.widgets.filter((w) => w.category === category)
  }

  // Get enabled widgets
  static getEnabledWidgets(): MonitoringWidget[] {
    return this.widgets.filter((w) => w.enabled)
  }

  // Get default widget order
  static getDefaultOrder(): string[] {
    return this.widgets.sort((a, b) => (a.position || 0) - (b.position || 0)).map((w) => w.id)
  }
}
