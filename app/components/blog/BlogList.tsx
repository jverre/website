import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export default function BlogList({ showAll = false }: { showAll?: boolean }) {
  const posts = getBlogPosts()
  const displayPosts = showAll ? posts : posts.slice(0, 5)

  return (
    <>
      <div className="list-grid">
        {displayPosts.map((post, index) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="list-card">
              <div className="list-card-kicker">Post {String(index + 1).padStart(2, '0')}</div>
              <div className="list-card-header">
                <div className="min-w-0 space-y-3">
                  <h3 className="list-card-title">{post.metadata.title}</h3>
                  <p className="list-card-summary">{post.metadata.summary}</p>
                </div>
                <time dateTime={post.metadata.date} className="meta-pill list-card-meta">
                  {formatDate(post.metadata.date, false)}
                </time>
              </div>
              <span className="paper-inline-link">
                Read article
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </article>
        ))}
      </div>
      {!showAll && (
        <div className="mt-6 flex justify-end">
          <Link href="/blog" className="paper-inline-link">
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </>
  )
}
