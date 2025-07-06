"use client"

import type React from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import type { MonitoringWidget } from "@/types/monitoring"

interface DraggableWidgetProps {
  widget: MonitoringWidget
  children: React.ReactNode
}

export function DraggableWidget({ widget, children }: DraggableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${isDragging ? "z-50" : ""}`} {...attributes}>
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded bg-background/80 backdrop-blur-sm border"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {children}
    </div>
  )
}
