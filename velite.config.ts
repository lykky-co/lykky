import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

const frameworks = defineCollection({
  name: 'Framework',
  pattern: 'frameworks/**/*.mdx',
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug('frameworks'),
    description: s.string().max(300),
    order: s.number(),
    stage: s.enum([
      'discovery',
      'pre-launch',
      'launch',
      'post-launch',
      'scale',
    ]),
    difficulty: s.enum(['beginner', 'intermediate', 'advanced']),
    estimatedTime: s.string().optional(),
    tags: s.array(s.string()).default([]),
    author: s.string().default('Lykky'),
    lastUpdated: s.isodate(),
    toc: s.toc(),
    metadata: s.metadata(),
    body: s.mdx(),
  }),
})

const playbooks = defineCollection({
  name: 'Playbook',
  pattern: 'playbooks/**/*.mdx',
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug('playbooks'),
    description: s.string().max(300),
    region: s.enum(['oulu', 'finland', 'nordics', 'eu', 'global']),
    order: s.number().default(0),
    tags: s.array(s.string()).default([]),
    author: s.string().default('Lykky'),
    lastUpdated: s.isodate(),
    toc: s.toc(),
    metadata: s.metadata(),
    body: s.mdx(),
  }),
})

const templates = defineCollection({
  name: 'Template',
  pattern: 'templates/**/*.mdx',
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug('templates'),
    description: s.string().max(300),
    category: s.string(),
    tags: s.array(s.string()).default([]),
    author: s.string().default('Lykky'),
    lastUpdated: s.isodate(),
    toc: s.toc(),
    metadata: s.metadata(),
    body: s.mdx(),
  }),
})

const resources = defineCollection({
  name: 'Resource',
  pattern: 'resources/**/*.mdx',
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug('resources'),
    description: s.string().max(300),
    category: s.string(),
    tags: s.array(s.string()).default([]),
    author: s.string().default('Lykky'),
    lastUpdated: s.isodate(),
    toc: s.toc(),
    metadata: s.metadata(),
    body: s.mdx(),
  }),
})

const caseStudies = defineCollection({
  name: 'CaseStudy',
  pattern: 'case-studies/**/*.mdx',
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug('case-studies'),
    description: s.string().max(300),
    company: s.string(),
    location: s.string(),
    industry: s.string(),
    stage: s.string().optional(),
    tags: s.array(s.string()).default([]),
    author: s.string().default('Lykky'),
    lastUpdated: s.isodate(),
    toc: s.toc(),
    metadata: s.metadata(),
    body: s.mdx(),
  }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { frameworks, playbooks, templates, resources, caseStudies },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: 'github-dark-dimmed' }],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    remarkPlugins: [remarkGfm],
  },
})
