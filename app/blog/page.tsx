import { Metadata } from 'next'
import { getBlogPosts } from './utils'
import Link from 'next/link'
import BlogList from 'app/components/blog/BlogList'

export const metadata: Metadata = {
  title: 'Blog - Jacques Verré',
  description: 'Thoughts on product management, AI, and software development',
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <>
      <div className="min-h-screen py-12 md:py-20">
        <section className="mb-16">
          <h1 className="text-2xl font-medium mb-4">Blog</h1>
          <p className="text-base text-muted-foreground">
            Writing about product management, artificial intelligence, and software development.
          </p>
        </section>
        <h2 className="text-xs font-medium text-muted-foreground mb-6 uppercase tracking-wider">All posts</h2>
        <BlogList showAll={true} />
      </div>
    </>
  )
} 