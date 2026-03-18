"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Star, Settings } from "lucide-react"
import Link from "next/link"

interface ObraHeaderProps {
  title: string
  subtitle?: string
  status: "planejamento" | "licitacao" | "execucao" | "concluida" | "paralisada"
  category?: string
}

const statusConfig = {
  planejamento: { label: "Planejamento", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  licitacao: { label: "Em Licitação", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  execucao: { label: "Em Execução", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
  concluida: { label: "Concluída", className: "bg-primary/10 text-primary hover:bg-primary/10" },
  paralisada: { label: "Paralisada", className: "bg-muted text-muted-foreground hover:bg-muted" },
}

export function ObraHeader({ title, subtitle, status, category }: ObraHeaderProps) {
  const statusInfo = statusConfig[status]

  return (
    <header className=" top-0 z-50 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para mapa de obras</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Star className="h-4 w-4 mr-2" />
              Favoritar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-card text-card-foreground border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
            {category && <Badge variant="outline">{category}</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-balance">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
    </header>
  )
}
