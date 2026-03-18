"use client"

import { Receipt, Plus, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Payment {
  id: string
  date: string
  orderNumber: string
  description: string
  installment: number
  contractor: string
  phase: string
  value: number
}

interface ObraPaymentsProps {
  payments: Payment[]
  totalPaid: number
  phaseName?: string
  embedded?: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}



export function ObraPayments({ payments, totalPaid, phaseName, embedded = false }: ObraPaymentsProps) {
  const Container = embedded ? "div" : "section"
  const containerClassName = embedded ? "p-6" : "bg-card rounded-lg border p-6"

  return (
    <Container className={containerClassName}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Pagamentos {phaseName && <span className="text-muted-foreground font-normal text-sm">- {phaseName}</span>}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Total pago: <strong className="text-foreground">{formatCurrency(totalPaid)}</strong>
          </span>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar pagamento
          </Button>
        </div>
      </div>

      {payments.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pagamento</TableHead>
                <TableHead>Nº Empenho</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Parcela</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Vínculo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.date}</TableCell>
                  <TableCell>{payment.orderNumber}</TableCell>
                  <TableCell className="max-w-48 truncate">{payment.description}</TableCell>
                  <TableCell className="text-center">{payment.installment}</TableCell>
                  <TableCell className="max-w-32 truncate" title={payment.contractor}>{payment.contractor}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatCurrency(payment.value)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="text-primary">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4 pt-4 border-t">
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Somatório:</span>
              <span className="ml-2 text-lg font-bold">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum pagamento registrado {phaseName && `para ${phaseName}`}</p>
        </div>
      )}
    </Container>
  )
}
