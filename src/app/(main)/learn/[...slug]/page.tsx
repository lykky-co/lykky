import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MDXContent } from '@/components/content/mdx-content'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { TableOfContents } from '@/components/layout/table-of-contents'
import { getAllContent, getContentBySlug } from '@/lib/content'
import { Badge } from '@/components/ui/badge'

interface ContentPageProps {
  params: Promise<{ slug: string[] }>
}

export function generateStaticParams() {
  return getAllContent().map((item) => ({
    slug: item.href.replace('/learn/', '').split('/'),
  }))
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { slug } = await params
  const content = getContentBySlug(slug)
  if (!content) return {}

  return {
    title: `${content.title} — Lykky`,
    description: content.description,
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params
  const content = getContentBySlug(slug)
  if (!content) notFound()

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1" data-pagefind-body>
        <Breadcrumbs />

        <header className="mb-8">
          <h1
            className="mb-2 text-3xl font-bold"
            data-pagefind-meta="title"
          >
            {content.title}
          </h1>
          <p className="text-muted-foreground">{content.description}</p>

          {/* Tags */}
          {'tags' in content && content.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {content.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Framework-specific metadata */}
          {'difficulty' in content && (
            <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
              <span>Difficulty: {content.difficulty}</span>
              {'stage' in content && <span>Stage: {content.stage}</span>}
              {'estimatedTime' in content && content.estimatedTime && (
                <span>{content.estimatedTime}</span>
              )}
            </div>
          )}
        </header>

        <MDXContent code={content.body} />

        <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          <p>
            Last updated:{' '}
            {new Date(content.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </footer>
      </article>

      {'toc' in content && content.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <TableOfContents toc={content.toc} />
        </aside>
      )}
    </div>
  )
}
