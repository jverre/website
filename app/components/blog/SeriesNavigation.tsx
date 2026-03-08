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
    <nav className="mt-16 border-t border-neutral-200 dark:border-neutral-700 pt-8">
      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4 opacity-75">
        Continue reading
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {previous ? (
          <Link
            href={`/blog/${previous.slug}`}
            className="group flex flex-col gap-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors no-underline"
          >
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <ArrowLeft size={12} />
              <span>Previous</span>
            </div>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
              {previous.metadata.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex flex-col gap-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors no-underline sm:text-right"
          >
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 sm:justify-end">
              <span>Next</span>
              <ArrowRight size={12} />
            </div>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
              {next.metadata.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
