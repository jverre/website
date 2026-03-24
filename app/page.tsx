import { Metadata } from 'next'
import BlogList from 'app/components/blog/BlogList'
import ProjectList from 'app/components/projects/ProjectList'
import { ArrowRight, BookOpenText, FolderKanban, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jacques Verré - Product Leader - Build & Learn',
  description: 'Personal blog and thoughts on AI, LLMs, and product management',
}

export default async function HomePage() {
  return (
    <div className="page-shell">
      <div className="page-stack">
        <section className="page-hero home-hero">
          <div className="hero-mark-frame" aria-hidden="true">
            <span className="hero-mark">JV</span>
          </div>
          <p className="page-tag">Product Leadership x AI x Building</p>
          <h1 className="page-title">
            Building small AI products and writing down what they teach me.
          </h1>
          <p className="page-description">
            I lead product teams, experiment in public, and use this site as a notebook for LLM tools,
            technical deep dives, and the systems behind them.
          </p>

          <div className="hero-actions">
            <Link href="/blog" className="paper-button">
              <BookOpenText className="h-4 w-4" />
              Browse writing
            </Link>
            <Link href="/projects" className="paper-button-secondary">
              <FolderKanban className="h-4 w-4" />
              Explore projects
            </Link>
          </div>

          <div className="hero-actions">
            <Link href="https://github.com/jverre" className="paper-inline-link" target="_blank">
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/jacques-verré-27a4965b"
              className="paper-inline-link"
              target="_blank"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Link>
          </div>

          <p className="hero-notes">Fig. A • Essays, experiments, and reference builds</p>
        </section>

        <div className="section-rule">
          <span>Fig. 1 - Latest Writing</span>
        </div>
        <section className="section-panel">
          <div className="section-header">
            <div>
              <p className="page-caption">Fresh Notes</p>
              <h2 className="section-title">Recent posts</h2>
            </div>
            <p className="section-description">
              The newest essays, technical notes, and working-through-it posts from the lab.
            </p>
          </div>
          <BlogList />
        </section>

        <div className="section-rule">
          <span>Fig. 2 - Open Source</span>
        </div>
        <section className="section-panel">
          <div className="section-header">
            <div>
              <p className="page-caption">Built To Learn</p>
              <h2 className="section-title">Featured projects</h2>
            </div>
            <Link href="/projects" className="paper-inline-link">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProjectList />
        </section>
      </div>
    </div>
  )
}
