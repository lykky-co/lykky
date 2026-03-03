import type { Metadata } from "next"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contribute — Lykky",
  description:
    "Learn how to contribute to the open-source GTM knowledge base.",
}

const contributionPaths = [
  {
    icon: "💡",
    title: "Share Knowledge",
    description:
      "Have GTM insights from your own experience? Open a GitHub issue to share frameworks, tactics, or lessons learned.",
    cta: "Open an issue",
    href: "https://github.com/lykky-co/lykky/issues/new/choose",
  },
  {
    icon: "📖",
    title: "Submit a Case Study",
    description:
      "Share your startup's Go-to-Market story. Real-world examples help other founders learn what actually works.",
    cta: "Submit a case study",
    href: "https://github.com/lykky-co/lykky/issues/new?template=case-study.yml",
  },
  {
    icon: "✏️",
    title: "Improve Content",
    description:
      "Fix errors, clarify explanations, or add new frameworks. Fork the repo, make your edits, and submit a pull request.",
    cta: "View on GitHub",
    href: "https://github.com/lykky-co/lykky",
  },
  {
    icon: "🛠️",
    title: "Build Features",
    description:
      "Help build the platform itself. Check the contributing guide for setup instructions, architecture overview, and open issues.",
    cta: "Read CONTRIBUTING.md",
    href: "https://github.com/lykky-co/lykky/blob/main/CONTRIBUTING.md",
  },
] as const

const projectDocs = [
  {
    label: "Contributing Guide",
    href: "https://github.com/lykky-co/lykky/blob/main/CONTRIBUTING.md",
  },
  {
    label: "Code of Conduct",
    href: "https://github.com/lykky-co/lykky/blob/main/CODE_OF_CONDUCT.md",
  },
  {
    label: "Content Policy",
    href: "https://github.com/lykky-co/lykky/blob/main/CONTENT_POLICY.md",
  },
] as const

export default function ContributePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Contribute to Lykky</h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Lykky is an open-source GTM knowledge base built by and for founders.
          Every contribution — whether a quick fix, a new framework, or a
          founder story — helps the community make better Go-to-Market
          decisions.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {contributionPaths.map((path) => (
          <Card key={path.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-1 text-2xl" aria-hidden="true">
                {path.icon}
              </div>
              <CardTitle>{path.title}</CardTitle>
              <CardDescription className="leading-relaxed">
                {path.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter>
              <a
                href={path.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                {path.cta} &rarr;
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-lg font-semibold mb-4">Project Documentation</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {projectDocs.map((doc) => (
            <li key={doc.label}>
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {doc.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
