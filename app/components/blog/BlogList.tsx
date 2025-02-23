import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'

export default function BlogList({ showAll = false }: { showAll?: boolean }) {
  const posts = getBlogPosts()
  const displayPosts = showAll ? posts : posts.slice(0, 5)

  return (
      <>
      <div className="space-y-3">
        {displayPosts.map((post) => (
          <article 
            key={post.slug} 
            className="group relative py-3"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex items-baseline justify-between gap-6">
                <div className="space-y-2 min-w-0">
                  <h3 className="text-base font-medium group-hover:text-primary transition-colors">
                    {post.metadata.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 line-clamp-2">
                    {post.metadata.summary}
                  </p>
                </div>
                <time 
                  dateTime={post.metadata.date} 
                  className="text-sm text-muted-foreground/60 whitespace-nowrap"
                >
                  {new Date(post.metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </time>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {!showAll && (
        <div className="flex justify-end mt-8">
          <Link 
          href="/blog" 
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
            View all posts →
          </Link>
        </div>
      )}
    </>
  )
} 