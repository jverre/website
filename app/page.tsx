import { Metadata } from 'next'
import BlogList from 'app/components/blog/BlogList'
import ProjectList from 'app/components/projects/ProjectList'
import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jacques Verré - Product Manager & AI Enthusiast',
  description: 'Personal blog and thoughts on AI, LLMs, and product management',
}

export default async function HomePage() {
  return (
    <>
      <main className="min-h-screen max-w-2xl mx-auto px-4 py-12 md:py-20">
        <section className="mb-20">
          <h1 className="text-2xl font-medium mb-4">
            Jacques Verré
          </h1>
          <p className="text-base text-muted-foreground leading-normal mb-8">
            Product Manager passionate about AI and LLMs. Writing about the intersection of product management and artificial intelligence.
          </p>

          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/jverre" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              target="_blank"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm">GitHub</span>
            </Link>
            <Link 
              href="https://linkedin.com/in/jacques-verré-27a4965b" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              target="_blank"
            >
              <Linkedin className="h-4 w-4" />
              <span className="text-sm">LinkedIn</span>
            </Link>
          </div>
        </section>

        <div className="flex flex-col gap-20">
          <section>
            <div className="max-w-2xl">
              <h2 className="text-xs font-medium text-muted-foreground mb-6 uppercase tracking-wider">Latest posts</h2>
              <BlogList />
            </div>
          </section>
          
          <section>
            <ProjectList />
          </section>
        </div>
      </main>
    </>
  )
}
