"use client"

import { Calendar, Clock, CalendarCheck, CalendarX, Timer } from "lucide-react"

interface TimelineItem {
  label: string
  value: string
}

interface ObraTimelineProps {
  executionDays: number
  items: TimelineItem[]
  embedded?: boolean
}

const iconMap = {
  "Prazo de Execução": Timer,
  "Assinatura": Calendar,
  "Previsão Início": CalendarCheck,
  "Previsão de Cancelação": CalendarX,
  "Término Prev.": Clock,
  "Término Real": CalendarCheck,
} as const

export function ObraTimeline({
  executionDays,
  items,
  embedded = false,
}: ObraTimelineProps) {
  const timelineItems = [
    { label: "Prazo de Execução", value: `${executionDays} dias` },
    ...items,
  ]

  const Container = embedded ? "div" : "section"
  const containerClassName = embedded ? "p-6" : "bg-card rounded-lg border p-6"

  return (
    <Container className={containerClassName}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Prazos e Cronograma</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {timelineItems.map((item, index) => {
          const Icon = iconMap[item.label as keyof typeof iconMap] || Calendar
          return (
            <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
              <Icon className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
              <span className="text-xs text-muted-foreground block mb-1">{item.label}</span>
              <span className="font-semibold text-sm">{item.value}</span>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
