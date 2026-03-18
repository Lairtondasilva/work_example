"use client"

import Image from "next/image"

interface ObraHeroProps {
  imageUrl: string
  title: string
}

export function ObraHero({ imageUrl, title }: ObraHeroProps) {
  return (
    <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-muted">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
    </div>
  )
}
