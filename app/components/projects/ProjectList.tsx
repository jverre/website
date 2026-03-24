import Link from 'next/link'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'

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
    title: 'Oscar',
    description: 'Share all your LLM chats - Works with Cursor, Claude code, ChatGPT and more.',
    repoUrl: 'https://github.com/jverre/oscar',
    websiteUrl: 'https://getoscar.ai',
    tags: ['TypeScript', 'LLMs', 'Open-Source'],
    updatedAt: '2025-10-24',
  },
  {
    title: 'Opik',
    description: 'An LLM development platform for debugging, testing and monitoring LLM applications.',
    repoUrl: 'https://github.com/comet-ml/opik',
    tags: ['Python', 'Java', 'LLMs', 'Open-Source'],
    updatedAt: '2025-02-22',
  },
  {
    title: 'Chrome MCP Server',
    description: 'A Chrome MCP Server - Can be used by Cursor to iterate faster during frontend development.',
    repoUrl: 'https://github.com/jverre/chrome-mcp-server',
    tags: ['Python', 'FastAPI', 'MCP', 'Open-Source'],
    updatedAt: '2025-02-22',
  },
  {
    title: 'Opik Chat History',
    description: 'A Cursor extension to log chat history to Opik',
    repoUrl: 'https://github.com/jverre/opik-chat-history',
    tags: ['Python', 'LLMs', 'Open-Source', 'Cursor'],
    updatedAt: '2025-06-08',
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
              <span className="meta-pill list-card-meta">{project.updatedAt}</span>
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
              <span className="paper-inline-link">
                Shipping notes
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </article>
        ))}
      </div>
      {!showAll && (
        <div className="mt-6 flex justify-end">
          <Link href="/projects" className="paper-inline-link">
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
