"use client"

import { History, Building2, ChevronDown, FileText, Plus, Pencil, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
import { PhaseModal, PhaseFormData } from "./phase-modal"

export interface Phase {
  id: string
  name: string
  description?: string
  contractor: {
    name: string
    cnpj: string
  }
  status: "planejamento" | "licitacao" | "execucao" | "concluida" | "paralisada"
  timeline: {
    executionDays: number
    signatureDate: string
    startDate: string
    cancellationDeadline: string
    completionDeadline: string
    actualEndDate?: string
  }
  executionPercentage: number
  paidValue: number
  expectedValue: number
  documents: Array<{
    id: string
    name: string
    type: string
    url: string
    date: string
  }>
  gallery: Array<{
    id: string
    type: "image" | "video"
    url: string
    date: string
  }>
}

interface ObraPhasesProps {
  phases: Phase[]
  currentPhaseId: string
  onPhaseSelect?: (phaseId: string) => void
  onPhaseCreate?: (data: PhaseFormData) => void
  onPhaseEdit?: (data: PhaseFormData) => void
  onPhaseDelete?: (phaseId: string) => void
  isAdmin?: boolean
}

const statusConfig = {
  planejamento: { label: "Planejamento", className: "bg-blue-100 text-blue-700" },
  licitacao: { label: "Em Licitação", className: "bg-amber-100 text-amber-700" },
  execucao: { label: "Em Execução", className: "bg-emerald-100 text-emerald-700" },
  concluida: { label: "Concluída", className: "bg-primary/10 text-primary" },
  paralisada: { label: "Paralisada", className: "bg-muted text-muted-foreground" },
}

function formatDateDisplay(dateString?: string): string {
  if (!dateString) return "-"
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

export function ObraPhases({ 
  phases, 
  currentPhaseId, 
  onPhaseSelect, 
  onPhaseCreate, 
  onPhaseEdit,
  onPhaseDelete,
  isAdmin = true 
}: ObraPhasesProps) {
  const [openPhases, setOpenPhases] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  const togglePhase = (id: string) => {
    setOpenPhases((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleCreate = () => {
    setEditingPhase(null)
    setModalMode("create")
    setModalOpen(true)
  }

  const handleEdit = (phase: Phase, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingPhase(phase)
    setModalMode("edit")
    setModalOpen(true)
  }

  const handleSave = (data: PhaseFormData) => {
    if (modalMode === "create" && onPhaseCreate) {
      onPhaseCreate(data)
    } else if (modalMode === "edit" && onPhaseEdit) {
      onPhaseEdit(data)
    }
  }

  const handleSetAsCurrent = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPhaseSelect) {
      onPhaseSelect(phaseId)
    }
  }

  // Filtra para mostrar apenas fases que NÃO são a atual
  const historicalPhases = phases.filter((p) => p.id !== currentPhaseId)

  return (
    <>
      <section className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Histórico de Licitações</h2>
            <Badge variant="secondary" className="ml-2">
              {historicalPhases.length} {historicalPhases.length === 1 ? "anterior" : "anteriores"}
            </Badge>
          </div>
          {isAdmin && (
            <Button onClick={handleCreate} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Nova Licitação
            </Button>
          )}
        </div>

        {historicalPhases.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Nenhuma licitação anterior registrada</p>
            <p className="text-sm">Esta é a primeira licitação desta obra</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {historicalPhases.map((phase, index) => {
                const statusInfo = statusConfig[phase.status]
                const isOpen = openPhases.includes(phase.id)

                return (
                  <Collapsible
                    key={phase.id}
                    open={isOpen}
                    onOpenChange={() => togglePhase(phase.id)}
                  >
                    <div className="relative pl-10">
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-2 top-4 w-4 h-4 rounded-full border-2 border-card ${
                          index === 0 ? "bg-muted-foreground" : "bg-muted"
                        }`}
                      />

                      <div className="bg-muted/30 rounded-lg border">
                        <CollapsibleTrigger asChild>
                          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg">
                            <div className="flex flex-col items-start gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{phase.name}</span>
                                <Badge className={statusInfo.className} variant="secondary">
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              {phase.description && (
                                <span className="text-sm text-muted-foreground">
                                  {phase.description}
                                </span>
                              )}
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-muted-foreground transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="px-4 pb-4 pt-0 border-t">
                            <div className="pt-4 space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Construtora:</span>
                                <span className="font-medium">{phase.contractor.name}</span>
                              </div>

                              {phase.executionPercentage !== undefined && (
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">Execução:</span>
                                  <div className="flex-1 max-w-48 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${phase.executionPercentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{phase.executionPercentage}%</span>
                                </div>
                              )}

                              {(phase.timeline.startDate || phase.timeline.completionDeadline) && (
                                <div className="flex items-center gap-4 text-sm">
                                  {phase.timeline.startDate && (
                                    <div>
                                      <span className="text-muted-foreground">Início: </span>
                                      <span className="font-medium">{formatDateDisplay(phase.timeline.startDate)}</span>
                                    </div>
                                  )}
                                  {phase.timeline.completionDeadline && (
                                    <div>
                                      <span className="text-muted-foreground">Término: </span>
                                      <span className="font-medium">{formatDateDisplay(phase.timeline.completionDeadline)}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-2 pt-2">
                                <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Ver Detalhes e Arquivos
                                </Button>
                                
                                {isAdmin && (
                                  <div className="flex items-center gap-1 ml-auto">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                      onClick={(e) => handleSetAsCurrent(phase.id, e)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      Definir como Atual
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                      onClick={(e) => handleEdit(phase, e)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 text-destructive hover:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onPhaseDelete?.(phase.id)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </Collapsible>
                )
              })}
            </div>
          </div>
        )}
      </section>

      <PhaseModal
        key={`${modalMode}-${editingPhase?.id ?? "new"}-${modalOpen ? "open" : "closed"}`}
        open={modalOpen}
        onOpenChange={setModalOpen}
        phase={editingPhase}
        onSave={handleSave}
        mode={modalMode}
      />
    </>
  )
}
