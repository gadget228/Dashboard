import type { SystemMetric, DockerContainer, DataProvider } from "@/types/monitoring"

// Mock data provider - replace with real system APIs
export class MockDataProvider implements DataProvider {
  private generateMetric(value: number, unit: string, label: string): SystemMetric {
    return {
      value,
      unit,
      timestamp: Date.now(),
      label,
    }
  }

  async getMetric(metricName: string): Promise<SystemMetric> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    switch (metricName) {
      case "cpu":
        return this.generateMetric(Math.random() * 100, "%", "CPU Usage")
      case "memory":
        return this.generateMetric(Math.random() * 100, "%", "Memory Usage")
      case "disk":
        return this.generateMetric(Math.random() * 100, "%", "Disk Usage")
      case "network_in":
        return this.generateMetric(Math.random() * 1000, "MB/s", "Network In")
      case "network_out":
        return this.generateMetric(Math.random() * 500, "MB/s", "Network Out")
      case "temperature":
        return this.generateMetric(45 + Math.random() * 30, "°C", "CPU Temperature")
      default:
        throw new Error(`Unknown metric: ${metricName}`)
    }
  }

  async getMetrics(metricNames: string[]): Promise<Record<string, SystemMetric>> {
    const metrics: Record<string, SystemMetric> = {}
    for (const name of metricNames) {
      metrics[name] = await this.getMetric(name)
    }
    return metrics
  }

  async getDockerContainers(): Promise<DockerContainer[]> {
    // Mock Docker containers
    return [
      {
        id: "nginx-001",
        name: "nginx-web",
        image: "nginx:latest",
        status: "running",
        uptime: "2d 14h 32m",
        ports: ["80:80", "443:443"],
        cpuUsage: Math.random() * 50,
        memoryUsage: Math.random() * 512,
      },
      {
        id: "postgres-001",
        name: "postgres-db",
        image: "postgres:13",
        status: "running",
        uptime: "5d 8h 15m",
        ports: ["5432:5432"],
        cpuUsage: Math.random() * 30,
        memoryUsage: Math.random() * 256,
      },
      {
        id: "redis-001",
        name: "redis-cache",
        image: "redis:alpine",
        status: "running",
        uptime: "1d 3h 45m",
        ports: ["6379:6379"],
        cpuUsage: Math.random() * 20,
        memoryUsage: Math.random() * 128,
      },
      {
        id: "app-001",
        name: "my-app",
        image: "node:16-alpine",
        status: Math.random() > 0.8 ? "stopped" : "running",
        uptime: "12h 23m",
        ports: ["3000:3000"],
        cpuUsage: Math.random() * 40,
        memoryUsage: Math.random() * 200,
      },
    ]
  }
}

export const dataProvider = new MockDataProvider()
