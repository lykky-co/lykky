"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface PagefindResult {
  id: string
  url: string
  excerpt: string
  meta: {
    title?: string
    image?: string
  }
  sub_results: Array<{
    title: string
    url: string
    excerpt: string
  }>
}

interface PagefindSearchResponse {
  results: Array<{
    id: string
    data: () => Promise<PagefindResult>
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pagefindInstance: any = null

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PagefindResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Register Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Lazily load Pagefind on first open
  const loadPagefind = useCallback(async () => {
    if (pagefindInstance) return pagefindInstance

    try {
      // Pagefind JS is generated at build time into public/pagefind/
      // and served as a static asset at runtime. The bundler must ignore this import.
      const pagefindPath = "/pagefind/pagefind.js"
      pagefindInstance = await import(
        /* webpackIgnore: true */
        /* turbopackIgnore: true */
        pagefindPath
      )
      await pagefindInstance.init()
      return pagefindInstance
    } catch {
      setError("Run `pnpm build` to enable search")
      return null
    }
  }, [])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      setError(null)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!open) return

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    debounceRef.current = setTimeout(async () => {
      const pf = await loadPagefind()
      if (!pf) {
        setLoading(false)
        return
      }

      try {
        const search: PagefindSearchResponse = await pf.search(query)
        const data = await Promise.all(
          search.results.slice(0, 8).map((r) => r.data())
        )
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, open, loadPagefind])

  function handleSelect(url: string) {
    onOpenChange(false)
    // Pagefind URLs come from the .next/server/app directory as relative paths
    // e.g. "/learn/frameworks/nextjs.html" -> "/learn/frameworks/nextjs"
    const cleanUrl = url
      .replace(/\.html$/, "")
      .replace(/\/index$/, "")
    router.push(cleanUrl)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search documentation pages"
      showCloseButton={false}
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Search documentation..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {error ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        ) : query.trim() && results.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          results.map((result) => (
            <CommandItem
              key={result.id}
              value={result.url}
              onSelect={() => handleSelect(result.url)}
              className="flex flex-col items-start gap-1 px-4 py-3"
            >
              <span className="font-medium">
                {result.meta.title || result.url}
              </span>
              {result.excerpt && (
                <span
                  className="line-clamp-2 text-xs text-muted-foreground"
                  // Pagefind excerpts contain <mark> tags from our own build-time
                  // indexed static content. This is safe - not user-supplied HTML.
                  dangerouslySetInnerHTML={{ __html: result.excerpt }}
                />
              )}
            </CommandItem>
          ))
        )}
      </CommandList>
    </CommandDialog>
  )
}
