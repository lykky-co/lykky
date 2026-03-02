# Lykky — Open-Source GTM Toolkit for Nordic Founders

## What is Lykky?

Lykky is an open-source go-to-market knowledge base built for Nordic startup founders. It provides frameworks, playbooks, templates, resources, and case studies to help you take your product to market — with a focus on the Nordics and EU ecosystem.

## Quick Start

```bash
git clone https://github.com/lykky-co/lykky.git
cd lykky
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Requires Node.js 22+ and pnpm.

## Project Structure

| Directory | Description |
|-----------|-------------|
| `content/` | MDX content — frameworks, playbooks, templates, resources, case studies |
| `src/app/` | Next.js App Router pages |
| `src/components/` | React components |

## Tech Stack

Next.js 16, Velite, Tailwind CSS v4, shadcn/ui, React Three Fiber, Pagefind

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing code and content.

## License

- **Code** — [MIT](LICENSE-CODE)
- **Content** (`/content`) — [CC BY-SA 4.0](LICENSE-CONTENT)
