import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartWidgetProps {
  title: string
  data: { name: string; value: number }[]
}

export function ChartWidget({ title, data }: ChartWidgetProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-16 text-sm text-muted-foreground">{item.name}</div>
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-12 text-sm font-medium text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
