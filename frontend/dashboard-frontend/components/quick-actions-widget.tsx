"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Users, Settings } from "lucide-react"

interface QuickActionsWidgetProps {
  title: string
}

export function QuickActionsWidget({ title }: QuickActionsWidgetProps) {
  const actions = [
    { icon: Plus, label: "New Project", action: () => console.log("New project") },
    { icon: FileText, label: "Create Report", action: () => console.log("Create report") },
    { icon: Users, label: "Invite Team", action: () => console.log("Invite team") },
    { icon: Settings, label: "Settings", action: () => console.log("Settings") },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto p-3 flex flex-col items-center gap-2 bg-transparent"
              onClick={action.action}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
