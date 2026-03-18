"use client"

import { DollarSign, Landmark, User, CircleDollarSign, Wallet } from "lucide-react"

interface ObraFinancialProps {
  fundingSource: string
  parliamentaryAmendment?: string
  expectedValue: number
  phasePaid: number
  totalPaidAllPhases: number
  totalExpectedAllPhases: number
  embedded?: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function ObraFinancial({
  fundingSource,
  parliamentaryAmendment,
  expectedValue,
  phasePaid,
  totalPaidAllPhases,
  totalExpectedAllPhases,
  embedded = false,
}: ObraFinancialProps) {
  const phasePaidPercentage = expectedValue > 0 ? Math.round((phasePaid / expectedValue) * 100) : 0
  const totalPaidPercentage = totalExpectedAllPhases > 0 ? Math.round((totalPaidAllPhases / totalExpectedAllPhases) * 100) : 0

  const Container = embedded ? "div" : "section"
  const containerClassName = embedded ? "p-6" : "bg-card rounded-lg border p-6"

  return (
    <Container className={containerClassName}>
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Financeiro</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-start gap-3">
          <Landmark className="h-4 w-4 text-muted-foreground mt-1" />
          <div>
            <span className="text-xs text-muted-foreground block">Fonte de Recurso</span>
            <span className="font-medium text-sm">{fundingSource}</span>
          </div>
        </div>
        
        {parliamentaryAmendment && (
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <span className="text-xs text-muted-foreground block">Emenda Parlamentar</span>
              <span className="font-medium text-sm">{parliamentaryAmendment}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-3">
          <CircleDollarSign className="h-4 w-4 text-muted-foreground mt-1" />
          <div>
            <span className="text-xs text-muted-foreground block">Valor Previsto (Fase Atual)</span>
            <span className="font-medium text-sm">{formatCurrency(expectedValue)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Valor pago na fase atual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CircleDollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Pago na Fase Atual</span>
          </div>
          <span className="text-lg font-bold text-blue-700 block mb-2">{formatCurrency(phasePaid)}</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(phasePaidPercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-blue-600 font-medium">{phasePaidPercentage}%</span>
          </div>
        </div>

        {/* Total pago em todas as fases */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Total Pago (Todas as Fases)</span>
          </div>
          <span className="text-lg font-bold text-emerald-700 block mb-2">{formatCurrency(totalPaidAllPhases)}</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(totalPaidPercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-emerald-600 font-medium">{totalPaidPercentage}%</span>
          </div>
        </div>
      </div>
    </Container>
  )
}
