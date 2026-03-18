"use client"

import { Images, FileText, Play, Download, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  date: string
  caption?: string
}

interface Document {
  id: string
  name: string
  type: string
  url: string
  date: string
}

interface Gallery {
  id: string
  name: string
  items: MediaItem[]
}

interface ObraGalleryProps {
  galleries: Gallery[]
  documents: Document[]
  emptyMessage?: string
  embedded?: boolean
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

export function ObraGallery({ galleries, documents, emptyMessage, embedded = false }: ObraGalleryProps) {
  const Container = embedded ? "div" : "section"
  const containerClassName = embedded ? "p-6" : "bg-card rounded-lg border p-6"

  return (
    <Container className={containerClassName}>
      <div className="flex items-center gap-2 mb-6">
        <Images className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Galeria e Documentos</h2>
      </div>

      {/* Galleries */}
      <div className="space-y-6">
        {galleries.map((gallery) => (
          <div key={gallery.id}>
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">{gallery.name}</h3>
              <span className="text-xs text-muted-foreground">({gallery.items.length} itens)</span>
            </div>

            {gallery.items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {gallery.items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                  >
                    <Image
                      src={item.thumbnail || item.url}
                      alt={item.caption || "Mídia da obra"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                        <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
                          <Play className="h-5 w-5 text-foreground ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-2">
                      <span className="text-xs text-background">{formatDate(item.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nenhuma mídia nesta galeria</p>
            )}
          </div>
        ))}

        {galleries.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Images className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{emptyMessage || "Nenhuma galeria disponível"}</p>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Documentos</h3>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium text-sm block">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(doc.date)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Nenhum documento anexado</p>
        )}
      </div>
    </Container>
  )
}
