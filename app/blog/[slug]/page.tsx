import { mdxComponents } from 'app/components/ui/mdx'
import { getSeriesNavigation } from 'app/blog/utils'
import SeriesNavigation from 'app/components/blog/SeriesNavigation'
import BlogPageClient from './BlogPageClient'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const { default: Content, metadata } = await import(`app/blog/posts/${slug}.mdx`)

  const seriesNav = metadata?.series
    ? getSeriesNavigation(metadata.series, slug)
    : null

  return (
    <BlogPageClient image={metadata?.image}>
      <Content components={mdxComponents} />
      {seriesNav && (
        <SeriesNavigation
          previous={seriesNav.previous}
          next={seriesNav.next}
        />
      )}
    </BlogPageClient>
  )
}

export const dynamicParams = true