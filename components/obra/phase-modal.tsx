"use client"

import { useState } from "react"
import { X, Building2, Calendar, FileText, Percent, Upload, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface PhaseFormData {
  id?: string
  name: string
  description: string
  status: "planejamento" | "licitacao" | "execucao" | "concluida" | "paralisada"
  contractor: {
    name: string
    cnpj: string
  }
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

interface PhaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phase?: PhaseFormData | null
  onSave: (data: PhaseFormData) => void
  mode: "create" | "edit"
}

const statusOptions = [
  { value: "planejamento", label: "Planejamento", color: "bg-blue-100 text-blue-700" },
  { value: "licitacao", label: "Em Licitação", color: "bg-amber-100 text-amber-700" },
  { value: "execucao", label: "Em Execução", color: "bg-emerald-100 text-emerald-700" },
  { value: "concluida", label: "Concluída", color: "bg-primary/10 text-primary" },
  { value: "paralisada", label: "Paralisada", color: "bg-muted text-muted-foreground" },
]

const emptyFormData: PhaseFormData = {
  name: "",
  description: "",
  status: "planejamento",
  contractor: {
    name: "",
    cnpj: "",
  },
  timeline: {
    executionDays: 0,
    signatureDate: "",
    startDate: "",
    cancellationDeadline: "",
    completionDeadline: "",
  },
  executionPercentage: 0,
  paidValue: 0,
  expectedValue: 0,
  documents: [],
  gallery: [],
}

export function PhaseModal({ open, onOpenChange, phase, onSave, mode }: PhaseModalProps) {
  const [formData, setFormData] = useState<PhaseFormData>(() => {
    if (!phase) return emptyFormData
    return { ...emptyFormData, ...phase, description: phase.description || "" }
  })
  const [activeTab, setActiveTab] = useState("info")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: formData.id || `phase-${Date.now()}`,
    })
    onOpenChange(false)
  }

  const updateField = <K extends keyof PhaseFormData>(key: K, value: PhaseFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const updateContractor = (field: keyof PhaseFormData["contractor"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      contractor: { ...prev.contractor, [field]: value },
    }))
  }

  const updateTimeline = (field: keyof PhaseFormData["timeline"], value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: { ...prev.timeline, [field]: value },
    }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {mode === "create" ? "Nova Licitação/Fase" : "Editar Licitação/Fase"}
            {formData.status && (
              <Badge
                className={statusOptions.find((s) => s.value === formData.status)?.color}
                variant="secondary"
              >
                {statusOptions.find((s) => s.value === formData.status)?.label}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="timeline">Prazos</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="files">Arquivos</TabsTrigger>
            </TabsList>

            {/* Tab: Informações Básicas */}
            <TabsContent value="info" className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome da Licitação/Fase</FieldLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Ex: 3ª Licitação"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      updateField("status", value as PhaseFormData["status"])
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${option.color.split(" ")[0]}`}
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Descrição da Fase</FieldLabel>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Descreva os detalhes desta fase..."
                    rows={3}
                  />
                </Field>
              </FieldGroup>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Dados da Construtora
                </h3>
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="contractor-name">Nome da Construtora</FieldLabel>
                      <Input
                        id="contractor-name"
                        value={formData.contractor.name}
                        onChange={(e) => updateContractor("name", e.target.value)}
                        placeholder="Nome da empresa"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="contractor-cnpj">CNPJ</FieldLabel>
                      <Input
                        id="contractor-cnpj"
                        value={formData.contractor.cnpj}
                        onChange={(e) => updateContractor("cnpj", e.target.value)}
                        placeholder="00.000.000/0001-00"
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Progresso da Execução
                </h3>
                <Field>
                  <FieldLabel htmlFor="execution">Porcentagem de Execução: {formData.executionPercentage}%</FieldLabel>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="execution"
                      min={0}
                      max={100}
                      value={formData.executionPercentage}
                      onChange={(e) => updateField("executionPercentage", Number(e.target.value))}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.executionPercentage}
                      onChange={(e) => updateField("executionPercentage", Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-20"
                    />
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${formData.executionPercentage}%`,
                        background: `linear-gradient(to right, #eab308 0%, #eab308 ${formData.executionPercentage < 50 ? "100%" : "50%"}, #ef4444 100%)`,
                      }}
                    />
                  </div>
                </Field>
              </div>
            </TabsContent>

            {/* Tab: Prazos e Cronograma */}
            <TabsContent value="timeline" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Prazos e Cronograma</h3>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="execution-days">Prazo de Execução (dias)</FieldLabel>
                  <Input
                    id="execution-days"
                    type="number"
                    min={1}
                    value={formData.timeline.executionDays || ""}
                    onChange={(e) => updateTimeline("executionDays", Number(e.target.value))}
                    placeholder="Ex: 60"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="signature-date">Data de Assinatura</FieldLabel>
                    <Input
                      id="signature-date"
                      type="date"
                      value={formData.timeline.signatureDate}
                      onChange={(e) => updateTimeline("signatureDate", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="start-date">Previsão de Início</FieldLabel>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.timeline.startDate}
                      onChange={(e) => updateTimeline("startDate", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="cancellation-deadline">Previsão de Cancelamento</FieldLabel>
                    <Input
                      id="cancellation-deadline"
                      type="date"
                      value={formData.timeline.cancellationDeadline}
                      onChange={(e) => updateTimeline("cancellationDeadline", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="completion-deadline">Término Previsto</FieldLabel>
                    <Input
                      id="completion-deadline"
                      type="date"
                      value={formData.timeline.completionDeadline}
                      onChange={(e) => updateTimeline("completionDeadline", e.target.value)}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="actual-end-date">Término Real (se concluída)</FieldLabel>
                  <Input
                    id="actual-end-date"
                    type="date"
                    value={formData.timeline.actualEndDate || ""}
                    onChange={(e) => updateTimeline("actualEndDate", e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </TabsContent>

            {/* Tab: Financeiro */}
            <TabsContent value="financial" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-primary font-bold">R$</span>
                <h3 className="font-semibold">Dados Financeiros</h3>
              </div>

              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="expected-value">Valor Previsto</FieldLabel>
                    <Input
                      id="expected-value"
                      type="number"
                      step="0.01"
                      min={0}
                      value={formData.expectedValue || ""}
                      onChange={(e) => updateField("expectedValue", Number(e.target.value))}
                      placeholder="0,00"
                    />
                    {formData.expectedValue > 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(formData.expectedValue)}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paid-value">Valor Pago</FieldLabel>
                    <Input
                      id="paid-value"
                      type="number"
                      step="0.01"
                      min={0}
                      value={formData.paidValue || ""}
                      onChange={(e) => updateField("paidValue", Number(e.target.value))}
                      placeholder="0,00"
                    />
                    {formData.paidValue > 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(formData.paidValue)}
                      </span>
                    )}
                  </Field>
                </div>
              </FieldGroup>

              {formData.expectedValue > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Progresso Financeiro</span>
                    <span className="text-sm font-medium">
                      {((formData.paidValue / formData.expectedValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (formData.paidValue / formData.expectedValue) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Pago: {formatCurrency(formData.paidValue)}</span>
                    <span>Restante: {formatCurrency(formData.expectedValue - formData.paidValue)}</span>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Tab: Arquivos */}
            <TabsContent value="files" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Documentos</h3>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Documento
                  </Button>
                </div>

                {formData.documents.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>Nenhum documento anexado</p>
                    <p className="text-sm">Clique em &quot;Adicionar Documento&quot; para enviar arquivos</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.date}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Galeria de Fotos e Vídeos</h3>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Mídia
                  </Button>
                </div>

                {formData.gallery.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                    <Upload className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma mídia anexada</p>
                    <p className="text-sm">Clique em &quot;Adicionar Mídia&quot; para enviar fotos ou vídeos</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.gallery.map((item) => (
                      <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden">
                        <Image src={item.url} alt="" fill className="object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {mode === "create" ? "Criar Licitação" : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
