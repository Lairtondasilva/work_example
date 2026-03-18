"use client"

import { MessageCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ObraContribution() {
  return (
    <section className="bg-card rounded-lg border p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="h-6 w-6 text-primary" />
      </div>
      
      <h2 className="text-lg font-semibold mb-2">
        Tem informações sobre esta obra?
      </h2>
      
      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
        Ajude-nos a manter os dados atualizados enviando fotos, vídeos ou relatos sobre o andamento desta obra.
      </p>
      
      <Button className="bg-primary hover:bg-primary/90">
        <Upload className="h-4 w-4 mr-2" />
        Enviar Contribuição
      </Button>
      
      <p className="text-xs text-muted-foreground mt-4">
        Os dados são provenientes de portais de transparência e cadastrados pela equipe.{" "}
        <Link href="#" className="text-primary hover:underline">
          Saiba mais
        </Link>
      </p>
    </section>
  )
}
