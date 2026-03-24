import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { formatDate } from 'app/blog/utils'

interface Project {
  title: string
  description: string
  repoUrl: string
  websiteUrl?: string
  tags: string[]
  updatedAt: string
}

const projects: Project[] = [
  {
    title: 'Flint',
    description: 'Firecracker VM management tool with a Python SDK, daemon API, benchmarks, and optional TUI.',
    repoUrl: 'https://github.com/jverre/flint',
    tags: ['Python', 'Firecracker', 'MicroVMs', 'Open-Source'],
    updatedAt: '2026-03-24',
  },
  {
    title: 'Opik Chat History',
    description: 'Extension to log your vibecoding sessions to Opik and make LLM work easier to inspect.',
    repoUrl: 'https://github.com/jverre/opik-chat-history',
    tags: ['TypeScript', 'Cursor', 'LLMs', 'Open-Source'],
    updatedAt: '2025-09-16',
  },
  {
    title: 'AI SDK',
    description: 'Python port of the Vercel AI SDK with a single interface for multiple model providers.',
    repoUrl: 'https://github.com/jverre/ai-sdk',
    tags: ['Python', 'LLMs', 'SDK', 'Open-Source'],
    updatedAt: '2025-04-18',
  },
  {
    title: 'Chrome MCP Server',
    description: 'MCP server to interact with Chrome and validate frontend changes with screenshots and browser actions.',
    repoUrl: 'https://github.com/jverre/chrome-mcp-server',
    tags: ['Python', 'MCP', 'Chrome', 'Open-Source'],
    updatedAt: '2025-02-23',
  },
]

export default function ProjectList({ showAll = false }: { showAll?: boolean }) {
  const displayProjects = showAll ? projects : projects.slice(0, 3)

  return (
    <div>
      <div className="list-grid">
        {displayProjects.map((project, index) => (
          <article key={project.title} className="list-card">
            <div className="list-card-kicker">Project {String(index + 1).padStart(2, '0')}</div>
            <div className="list-card-header">
              <div className="min-w-0 space-y-3">
                <h3 className="list-card-title">{project.title}</h3>
                <p className="list-card-summary">{project.description}</p>
              </div>
              <span className="meta-pill list-card-meta">{formatDate(project.updatedAt, false)}</span>
            </div>

            <div className="tag-list">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>

            <div className="project-link-row mt-4">
              {project.websiteUrl && (
                <Link href={project.websiteUrl} className="project-inline-link" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  {project.websiteUrl.replace('https://', '')}
                </Link>
              )}
              <Link href={project.repoUrl} className="project-inline-link" target="_blank">
                <Github className="h-4 w-4" />
                View repository
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
