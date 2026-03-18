"use client"

import { useState } from "react"
import { ObraHeader } from "@/components/obra/obra-header"
import { ObraHero } from "@/components/obra/obra-hero"
import { ObraProgress } from "@/components/obra/obra-progress"
import { ObraAbout } from "@/components/obra/obra-about"
import { ObraFinancial } from "@/components/obra/obra-financial"
import { ObraTimeline } from "@/components/obra/obra-timeline"
import { ObraPhases, Phase } from "@/components/obra/obra-phases"
import { ObraPayments } from "@/components/obra/obra-payments"
import { ObraGallery } from "@/components/obra/obra-gallery"
import { ObraLocation } from "@/components/obra/obra-location"
import { ObraRelatedLinks } from "@/components/obra/obra-related-links"
import { ObraContribution } from "@/components/obra/obra-contribution"
import { ObraCurrentPhase } from "@/components/obra/obra-current-phase"
import { PhaseFormData } from "@/components/obra/phase-modal"

// Dados de exemplo - em produção viriam de uma API
const initialPhases: Phase[] = [
  {
    id: "3",
    name: "3ª Licitação",
    description: "teste",
    contractor: {
      name: "GPA LOCAÇÕES DE TRANSPORTE E CONSTRUÇÃO DE EDIFÍCIOS",
      cnpj: "12.345.678/0001-90",
    },
    status: "planejamento",
    timeline: {
      executionDays: 60,
      signatureDate: "2026-03-01",
      startDate: "2026-03-03",
      cancellationDeadline: "2027-02-10",
      completionDeadline: "2028-03-24",
    },
    executionPercentage: 0,
    paidValue: 0,
    expectedValue: 50000,
    documents: [],
    gallery: [],
  },
  {
    id: "2",
    name: "2ª Licitação",
    description: "teste",
    contractor: {
      name: "F LIMA DE CARVALHO CONSTRUÇÕES LTDA",
      cnpj: "41.080.738/0001-93",
    },
    status: "paralisada",
    timeline: {
      executionDays: 90,
      signatureDate: "2025-07-01",
      startDate: "2025-07-15",
      cancellationDeadline: "2026-01-10",
      completionDeadline: "2026-04-15",
    },
    executionPercentage: 70,
    paidValue: 1200,
    expectedValue: 30000,
    documents: [
      {
        id: "doc1",
        name: "contrato-2a-licitacao.pdf",
        type: "pdf",
        url: "#",
        date: "2025-07-01",
      },
    ],
    gallery: [
      {
        id: "g1",
        type: "image",
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop",
        date: "2025-08-15",
      },
    ],
  },
  {
    id: "1",
    name: "1ª Licitação",
    description: "Licitação inicial da obra",
    contractor: {
      name: "BWS CONSTRUÇÕES LTDA",
      cnpj: "00.079.528/0001-09",
    },
    status: "concluida",
    timeline: {
      executionDays: 120,
      signatureDate: "2024-01-15",
      startDate: "2024-02-01",
      cancellationDeadline: "2024-06-01",
      completionDeadline: "2024-06-01",
      actualEndDate: "2024-05-20",
    },
    executionPercentage: 100,
    paidValue: 20000,
    expectedValue: 20000,
    documents: [],
    gallery: [],
  },
]

const obraData = {
  title: "Calçamento de diversas ruas com blocos de concreto intertravado",
  subtitle: "Calçamento setor 123",
  status: "licitacao" as const,
  category: "Construção",
  heroImage: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&h=400&fit=crop",
  
  description: `Muitos calçamentos soltos nas ruas, teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste.
testestestesteste teste teste teste teste
teste 1234`,
  
  financial: {
    fundingSource: "Estadual",
    parliamentaryAmendment: "Lairton da Silva",
  },
  
  payments: [
    {
      id: "1",
      date: "17/03/2026",
      orderNumber: "teste",
      description: "GPA Locações de transporte e construção de edifícios",
      installment: 1,
      contractor: "GPA Locações de transporte e construção de edifícios",
      phase: "3ª Licitação",
      value: 33333.00,
    },
    {
      id: "2",
      date: "17/03/2026",
      orderNumber: "123#21",
      description: "teste desc# #test#test",
      installment: 6,
      contractor: "GPA Locações de transporte e construção de edifícios",
      phase: "3ª Licitação",
      value: 123.45,
    },
    {
      id: "3",
      date: "17/03/2026",
      orderNumber: "teste",
      description: "test#test",
      installment: 1,
      contractor: "GPA Locações de transporte e construção de edifícios",
      phase: "1 Licitação",
      value: 3342.00,
    },
  ],
  
  location: {
    address: "Rua Esmeralda Soares de Oliveira",
    neighborhood: "Centro",
    city: "Floresta",
    state: "PE",
    coordinates: {
      lat: -8.6013,
      lng: -38.5678,
    },
  },
  
  relatedLinks: [
    {
      id: "1",
      title: "Governo de Pernambuco divulga licitação para calçar novas ruas em Floresta, PE",
      url: "#",
      source: "Diário Oficial de Pernambuco",
    },
  ],
}

// Helper function to format date for display
function formatDateDisplay(dateString: string): string {
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

export default function ObraDetailsPage() {
  const [phases, setPhases] = useState<Phase[]>(initialPhases)
  const [currentPhaseId, setCurrentPhaseId] = useState<string>("3")

  // Encontra a fase atual
  const currentPhase = phases.find((p) => p.id === currentPhaseId) || phases[0]

  // Calcula o total pago de todas as fases
  const totalPaidAllPhases = phases.reduce((sum, p) => sum + p.paidValue, 0)
  const totalExpectedAllPhases = phases.reduce((sum, p) => sum + p.expectedValue, 0)

  // Calcula progresso geral (média ponderada ou pode ser a execução da fase atual)
  const overallProgress = currentPhase?.executionPercentage || 0

  // Handlers para CRUD de fases
  const handlePhaseCreate = (data: PhaseFormData) => {
    const newPhase: Phase = {
      ...data,
      id: data.id || `phase-${Date.now()}`,
    } as Phase
    setPhases((prev) => [newPhase, ...prev])
    setCurrentPhaseId(newPhase.id)
  }

  const handlePhaseEdit = (data: PhaseFormData) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === data.id ? { ...p, ...data } as Phase : p))
    )
  }

  const handlePhaseDelete = (phaseId: string) => {
    setPhases((prev) => prev.filter((p) => p.id !== phaseId))
    if (currentPhaseId === phaseId && phases.length > 1) {
      const remaining = phases.filter((p) => p.id !== phaseId)
      setCurrentPhaseId(remaining[0]?.id || "")
    }
  }

  const handlePhaseSelect = (phaseId: string) => {
    setCurrentPhaseId(phaseId)
  }

  const handleCurrentPhaseEdit = (data: PhaseFormData) => {
    handlePhaseEdit(data)
  }

  // Prepara os itens de timeline a partir da fase atual
  const timelineItems = currentPhase
    ? [
        { label: "Assinatura", value: formatDateDisplay(currentPhase.timeline.signatureDate) },
        { label: "Previsão Início", value: formatDateDisplay(currentPhase.timeline.startDate) },
        ...(currentPhase.timeline.cancellationDeadline
          ? [{ label: "Previsão de Cancelação", value: formatDateDisplay(currentPhase.timeline.cancellationDeadline) }]
          : []),
        { label: "Término Prev.", value: formatDateDisplay(currentPhase.timeline.completionDeadline) },
        ...(currentPhase.timeline.actualEndDate
          ? [{ label: "Término Real", value: formatDateDisplay(currentPhase.timeline.actualEndDate) }]
          : []),
      ]
    : []

  // Prepara galeria e documentos a partir da fase atual
  const currentGalleries = currentPhase?.gallery.length
    ? [
        {
          id: "current",
          name: `Galeria - ${currentPhase.name}`,
          items: currentPhase.gallery,
        },
      ]
    : []

  const currentDocuments = currentPhase?.documents || []

  // Filtra pagamentos da fase atual
  const currentPhasePayments = obraData.payments.filter(
    (p) => p.phase === currentPhase?.name
  )
  const currentPhaseTotalPaid = currentPhasePayments.reduce((sum, p) => sum + p.value, 0)

  return (
    <div className="min-h-screen bg-background">
      <ObraHeader
        title={obraData.title}
        subtitle={obraData.subtitle}
        status={currentPhase?.status || obraData.status}
        category={obraData.category}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <ObraHero imageUrl={obraData.heroImage} title={obraData.title} />
            
            <ObraProgress percentage={overallProgress} />
            
            {/* Sobre a Obra - acima da licitação */}
            <ObraAbout description={obraData.description} />
            
            <section className="bg-card rounded-lg border border-primary/20 overflow-hidden">
              <ObraCurrentPhase
                phase={currentPhase}
                category={obraData.category}
                onEdit={handleCurrentPhaseEdit}
                isAdmin={true}
                embedded
              />
              
              <div className="border-t">
                <ObraTimeline
                  executionDays={currentPhase?.timeline.executionDays || 0}
                  items={timelineItems}
                  embedded
                />
              </div>
              
              <div className="border-t">
                <ObraFinancial
                  fundingSource={obraData.financial.fundingSource}
                  parliamentaryAmendment={obraData.financial.parliamentaryAmendment}
                  expectedValue={currentPhase?.expectedValue || 0}
                  phasePaid={currentPhase?.paidValue || 0}
                  totalPaidAllPhases={totalPaidAllPhases}
                  totalExpectedAllPhases={totalExpectedAllPhases}
                  embedded
                />
              </div>
              
              <div className="border-t">
                <ObraPayments 
                  payments={currentPhasePayments} 
                  totalPaid={currentPhaseTotalPaid}
                  phaseName={currentPhase?.name}
                  embedded
                />
              </div>

              <div className="border-t">
                <ObraGallery
                  galleries={currentGalleries}
                  documents={currentDocuments}
                  emptyMessage={`Nenhuma mídia registrada para ${currentPhase?.name || "esta fase"}`}
                  embedded
                />
              </div>
            </section>
            
            {/* Histórico mostra apenas fases anteriores */}
            <ObraPhases 
              phases={phases}
              currentPhaseId={currentPhaseId}
              onPhaseSelect={handlePhaseSelect}
              onPhaseCreate={handlePhaseCreate}
              onPhaseEdit={handlePhaseEdit}
              onPhaseDelete={handlePhaseDelete}
              isAdmin={true}
            />
            
            <ObraContribution />
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <aside className="space-y-6">
            <ObraLocation
              address={obraData.location.address}
              neighborhood={obraData.location.neighborhood}
              city={obraData.location.city}
              state={obraData.location.state}
              coordinates={obraData.location.coordinates}
            />
            
            <ObraRelatedLinks links={obraData.relatedLinks} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Trombone Cidadão</h3>
              <p className="text-sm text-muted-foreground">
                Sua voz, nossa ação: juntos por uma cidade melhor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Navegação</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Início</a></li>
                <li><a href="#" className="hover:text-foreground">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground">Estatísticas</a></li>
                <li><a href="#" className="hover:text-foreground">Notícias</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Obras Públicas</a></li>
                <li><a href="#" className="hover:text-foreground">Mapa de Pavimentação</a></li>
                <li><a href="#" className="hover:text-foreground">Serviços</a></li>
                <li><a href="#" className="hover:text-foreground">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>trombonecidadao@gmail.com</li>
                <li>(81) 99999-9999</li>
                <li>Floresta, Pernambuco, Brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            © 2026 Trombone Cidadão. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
