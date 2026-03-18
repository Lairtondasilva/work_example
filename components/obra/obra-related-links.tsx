"use client"

import { Link2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface RelatedLink {
  id: string
  title: string
  url: string
  source?: string
}

interface ObraRelatedLinksProps {
  links: RelatedLink[]
}

export function ObraRelatedLinks({ links }: ObraRelatedLinksProps) {
  if (links.length === 0) return null

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Links Relacionados</h2>
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition-colors group"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-primary group-hover:underline line-clamp-2">
                {link.title}
              </span>
              {link.source && (
                <span className="text-xs text-muted-foreground block truncate">
                  {link.source}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
