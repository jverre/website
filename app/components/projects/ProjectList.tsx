import Link from 'next/link'
import { Github } from 'lucide-react'

interface Project {
  title: string
  description: string
  repoUrl: string
  tags: string[]
  updatedAt: string
}

const projects: Project[] = [
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
    title: 'Opik - Chat history',
    description: 'VSCode extension that logs all your Zencoder chats to the Opik platform',
    repoUrl: 'https://github.com/jverre/opik-chat-history',
    tags: ['VSCode Extension', 'Zencoder', 'Open-Source', 'vibe-coding'],
    updatedAt: '2025-04-17',
  }
]

export default function ProjectList({ showAll = false }: { showAll?: boolean }) {
  const displayProjects = showAll ? projects : projects.slice(0, 3)

  return (
    <div className="max-w-2xl">
      <h2 className="text-xs font-medium text-muted-foreground mb-6 uppercase tracking-wider">
        Featured projects
      </h2>
      <div className="space-y-6">
        {displayProjects.map((project) => (
          <article 
            key={project.title}
            className="group relative"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-medium group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <Link 
                  href={project.repoUrl} 
                  className="text-muted-foreground/60 hover:text-primary"
                  target="_blank"
                >
                  <Github className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-4 mt-1">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      {!showAll && (
        <div className="flex justify-end mt-8">
          <Link 
            href="/projects" 
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
            View all projects →
          </Link>
        </div>
      )}
    </div>
  )
} 