import { Metadata } from 'next'
import BlogList from 'app/components/blog/BlogList'
import ProjectList from 'app/components/projects/ProjectList'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { ArrowRight, BookOpenText, FolderKanban, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jacques Verré - Essays and Build Notes',
  description: 'Writing about AI products, language models, and the systems built around them.',
}

export default async function HomePage() {
  const posts = getBlogPosts()
  const latestPost = posts[0]

  return (
    <div className="page-shell">
      <div className="page-stack">
        <section className="page-hero home-hero">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <p className="page-tag">Writing About AI, Product, And Builder Taste</p>
              <h1 className="page-title">
                Notes from building with language models, teams, and small pieces of software.
              </h1>
              <p className="page-description">
                This is primarily a writing home now: essays, implementation notes, and sharper takes on
                what feels durable in the current AI wave.
              </p>

              <div className="hero-actions">
                <Link href="/blog" className="paper-button">
                  <BookOpenText className="h-4 w-4" />
                  Read the archive
                </Link>
                <Link href={latestPost ? `/blog/${latestPost.slug}` : '/blog'} className="paper-button-secondary">
                  <ArrowRight className="h-4 w-4" />
                  Start with the latest piece
                </Link>
              </div>

              <div className="hero-links">
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
            </div>

            {latestPost && (
              <aside className="home-featured-card">
                <div className="list-card-kicker">Latest Essay</div>
                <div className="home-featured-meta">
                  <span className="meta-pill">{formatDate(latestPost.metadata.date, false)}</span>
                </div>
                <h2 className="home-featured-title">{latestPost.metadata.title}</h2>
                <p className="home-featured-summary">{latestPost.metadata.summary}</p>
                <Link href={`/blog/${latestPost.slug}`} className="paper-inline-link">
                  Read this article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </aside>
            )}
          </div>

          <p className="hero-notes">Fig. A • Essays first, projects second, learning all the way through</p>
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
          <span>Fig. 2 - Projects In Support Of The Writing</span>
        </div>
        <section className="section-panel">
          <div className="section-header">
            <div>
              <p className="page-caption">Built To Clarify</p>
              <h2 className="section-title">Selected projects</h2>
            </div>
            <p className="section-description">
              Small products and open-source experiments that feed back into the essays and technical notes.
            </p>
          </div>
          <ProjectList />
          <div className="mt-8 flex justify-end">
            <Link href="/projects" className="paper-inline-link">
              View all projects
              <FolderKanban className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
