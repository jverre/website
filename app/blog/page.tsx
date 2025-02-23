import { Metadata } from 'next'
import { getBlogPosts } from './utils'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Jacques Verré',
  description: 'Thoughts on product management, AI, and software development',
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <>
      <main className="min-h-screen max-w-2xl mx-auto px-4 py-12 md:py-20">
        <section className="mb-16">
          <h1 className="text-2xl font-medium mb-4">Blog</h1>
          <p className="text-base text-muted-foreground">
            Writing about product management, artificial intelligence, and software development.
          </p>
        </section>

        <div className="space-y-12">
          {posts.map((post) => (
            <article 
              key={post.slug}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium group-hover:text-primary transition-colors">
                      {post.metadata.title}
                    </h2>
                    <time 
                      dateTime={post.metadata.date}
                      className="text-sm text-muted-foreground"
                    >
                      {new Date(post.metadata.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </time>
                  </div>
                  <p className="text-base text-muted-foreground/90 leading-relaxed">
                    {post.metadata.summary}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  )
} 