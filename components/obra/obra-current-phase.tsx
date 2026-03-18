"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Building2, Hash, FolderOpen, Clock } from "lucide-react"
import { Phase } from "./obra-phases"
import { PhaseModal, PhaseFormData } from "./phase-modal"

interface ObraCurrentPhaseProps {
  phase: Phase | undefined
  category: string
  onEdit?: (data: PhaseFormData) => void
  isAdmin?: boolean
  embedded?: boolean
}

const statusConfig = {
  planejamento: { label: "Planejamento", className: "bg-blue-100 text-blue-700" },
  licitacao: { label: "Em Licitação", className: "bg-amber-100 text-amber-700" },
  execucao: { label: "Em Execução", className: "bg-emerald-100 text-emerald-700" },
  concluida: { label: "Concluída", className: "bg-primary/10 text-primary" },
  paralisada: { label: "Paralisada", className: "bg-muted text-muted-foreground" },
}

export function ObraCurrentPhase({ phase, category, onEdit, isAdmin = false, embedded = false }: ObraCurrentPhaseProps) {
  const [modalOpen, setModalOpen] = useState(false)

  if (!phase) return null

  const statusInfo = statusConfig[phase.status]

  const handleEdit = () => {
    setModalOpen(true)
  }

  const handleSave = (data: PhaseFormData) => {
    onEdit?.(data)
  }

  const Container = embedded ? "div" : "section"
  const containerClassName = embedded ? "p-6 relative" : "bg-card rounded-lg border border-primary/20 p-6 relative"

  return (
    <>
      <Container className={containerClassName}>
        {/* Header com badge de destaque */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{phase.name}</h2>
            </div>
            <Badge className={statusInfo.className} variant="secondary">
              {statusInfo.label}
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary">
              Licitação Atual
            </Badge>
          </div>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={handleEdit} className="gap-1">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>

        {/* Descrição */}
        {phase.description && (
          <p className="text-sm text-muted-foreground mb-4">{phase.description}</p>
        )}

        {/* Execução e Responsáveis */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Execução e Responsáveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <span className="text-xs text-muted-foreground block">Construtora</span>
                <span className="font-medium text-sm">{phase.contractor.name}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <span className="text-xs text-muted-foreground block">CNPJ</span>
                <span className="font-medium text-sm">{phase.contractor.cnpj}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FolderOpen className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <span className="text-xs text-muted-foreground block">Categoria</span>
                <span className="font-medium text-sm">{category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Execução */}
        {/* <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Execução da Fase</span>
            <span className="text-sm font-semibold">{phase.executionPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${phase.executionPercentage}%`,
                background: phase.executionPercentage < 30 
                  ? "#eab308" 
                  : phase.executionPercentage < 70 
                    ? "linear-gradient(to right, #eab308, #f97316)" 
                    : "linear-gradient(to right, #eab308, #ef4444)",
              }}
            />
          </div>
        </div> */}

        {/* Valor pago nesta fase */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Valor Pago nesta Fase</span>
          <span className="font-semibold text-emerald-600">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(phase.paidValue)}
          </span>
        </div>
      </Container>

      <PhaseModal
        key={`current-${phase.id}-${modalOpen ? "open" : "closed"}`}
        open={modalOpen}
        onOpenChange={setModalOpen}
        phase={phase}
        onSave={handleSave}
        mode="edit"
      />
    </>
  )
}
