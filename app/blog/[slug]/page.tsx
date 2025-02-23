import { mdxComponents } from 'app/components/mdx'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const { default: Content, metadata } = await import(`app/blog/posts/${slug}.mdx`)

  return (
    <article className="prose dark:prose-invert">
      <Content components={mdxComponents} />
    </article>
  )
}

export const dynamicParams = true