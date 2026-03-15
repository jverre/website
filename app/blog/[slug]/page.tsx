import { mdxComponents } from 'app/components/ui/mdx'
import { getSeriesNavigation } from 'app/blog/utils'
import SeriesNavigation from 'app/components/blog/SeriesNavigation'
import BlogPageClient from './BlogPageClient'
import { baseUrl } from 'app/sitemap'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const slug = (await params).slug
  const { metadata } = await import(`app/blog/posts/${slug}.mdx`)
  const ogImage = `${baseUrl}/og?title=${encodeURIComponent(metadata.title)}${metadata.summary ? `&summary=${encodeURIComponent(metadata.summary)}` : ''}`

  return {
    title: metadata.title,
    description: metadata.summary,
    openGraph: {
      title: metadata.title,
      description: metadata.summary,
      type: 'article',
      publishedTime: metadata.date,
      url: `${baseUrl}/blog/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.summary,
      images: [ogImage],
    },
  }
}

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