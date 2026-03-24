import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface SeriesPost {
  slug: string
  metadata: {
    title: string
    summary: string
  }
}

interface SeriesNavigationProps {
  previous: SeriesPost | null
  next: SeriesPost | null
}

export default function SeriesNavigation({ previous, next }: SeriesNavigationProps) {
  if (!previous && !next) return null

  return (
    <nav className="series-nav">
      <div className="series-label mb-4">Continue reading</div>
      <div className="series-grid">
        {previous ? (
          <Link href={`/blog/${previous.slug}`} className="series-card">
            <div className="series-label">
              <ArrowLeft size={12} />
              <span>Previous</span>
            </div>
            <span className="series-title">{previous.metadata.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/blog/${next.slug}`} className="series-card sm:text-right">
            <div className="series-label sm:justify-end">
              <span>Next</span>
              <ArrowRight size={12} />
            </div>
            <span className="series-title">{next.metadata.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
