import { mdxComponents } from 'app/components/ui/mdx'
import BlogPageClient from './BlogPageClient'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const { default: Content, metadata } = await import(`app/blog/posts/${slug}.mdx`)

  return (
    <BlogPageClient>
      <Content components={mdxComponents} />
    </BlogPageClient>
  )
}

export const dynamicParams = true