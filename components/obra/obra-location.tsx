"use client"

import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ObraLocationProps {
  address: string
  neighborhood: string
  city: string
  state: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export function ObraLocation({
  address,
  neighborhood,
  city,
  state,
  coordinates,
}: ObraLocationProps) {
  const fullAddress = `${address}, ${neighborhood} - ${city}, ${state}`

  const openInMaps = () => {
    if (coordinates) {
      window.open(
        `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`,
        "_blank"
      )
    } else {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`,
        "_blank"
      )
    }
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Localização</h2>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="relative h-40 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <span className="text-sm text-muted-foreground">Mapa interativo</span>
          </div>
        </div>
        {/* Map controls placeholder */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <button className="w-8 h-8 bg-card border rounded shadow-sm flex items-center justify-center text-lg hover:bg-muted">
            +
          </button>
          <button className="w-8 h-8 bg-card border rounded shadow-sm flex items-center justify-center text-lg hover:bg-muted">
            -
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <span className="text-xs text-muted-foreground block">Endereço</span>
          <span className="text-sm font-medium">{address}</span>
        </div>
        <div className="flex gap-4">
          <div>
            <span className="text-xs text-muted-foreground block">Bairro</span>
            <span className="text-sm font-medium">{neighborhood}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Cidade</span>
            <span className="text-sm font-medium">{city}, {state}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={openInMaps}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Abrir no Google Maps
        </Button>
      </div>
    </div>
  )
}
