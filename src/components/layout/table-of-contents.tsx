"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { cn } from "@/lib/utils"

/** Velite TOC entry (nested tree structure from s.toc()). */
export interface TocEntry {
  title: string
  url: string
  items: TocEntry[]
}

/** Flat entry used internally for rendering. */
interface FlatTocEntry {
  title: string
  url: string
  depth: number
}

/** Flatten the nested Velite TOC tree into a flat list with depth. */
function flattenToc(entries: TocEntry[], depth = 1): FlatTocEntry[] {
  return entries.flatMap((entry) => [
    { title: entry.title, url: entry.url, depth },
    ...flattenToc(entry.items, depth + 1),
  ])
}

interface TableOfContentsProps {
  toc: TocEntry[]
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  const flatEntries = useMemo(() => flattenToc(toc), [toc])

  useEffect(() => {
    const ids = flatEntries.map((entry) => entry.url.replace("#", ""))
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    )

    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      observerRef.current?.disconnect()
    }
  }, [flatEntries])

  if (flatEntries.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="hidden xl:block">
      <div className="sticky top-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-1">
          {flatEntries.map((entry) => {
            const id = entry.url.replace("#", "")
            const isActive = activeId === id

            return (
              <li key={entry.url}>
                <a
                  href={entry.url}
                  className={cn(
                    "block text-sm leading-relaxed transition-colors",
                    entry.depth > 1 && "pl-3",
                    entry.depth > 2 && "pl-6",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {entry.title}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
