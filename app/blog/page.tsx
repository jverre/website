import { Metadata } from 'next'
import BlogList from 'app/components/blog/BlogList'

export const metadata: Metadata = {
  title: 'Blog - Jacques Verré',
  description: 'Thoughts on product management, AI, and software development',
}

export default function BlogPage() {
  return (
    <div className="page-shell">
      <div className="page-stack">
        <section className="page-hero">
          <div className="page-intro">
            <p className="page-caption">Notebook</p>
            <h1 className="page-title">Writing in public.</h1>
            <p className="page-description">
              Product thinking, AI infrastructure, and the small engineering details that usually hide
              behind the polished version of the story.
            </p>
          </div>
        </section>
        <div className="section-rule">
          <span>Fig. 3 - Archive</span>
        </div>
        <section className="section-panel">
          <BlogList showAll />
        </section>
      </div>
    </div>
  )
}
