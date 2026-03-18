"use client"

import { TrendingUp } from "lucide-react"

interface ObraProgressProps {
  percentage: number
}

export function ObraProgress({ percentage }: ObraProgressProps) {
  const getProgressColor = (value: number) => {
    if (value < 30) return "bg-primary"
    if (value < 70) return "bg-amber-500"
    return "bg-emerald-500"
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Progresso da Obra</span>
        </div>
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
