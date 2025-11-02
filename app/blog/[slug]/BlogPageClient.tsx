'use client'

import { useRef } from 'react'
import { TableOfContents } from 'app/components/ui/TableOfContents'

export default function BlogPageClient({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative py-10">
      <TableOfContents contentRef={contentRef} />
      <article
        ref={contentRef}
        className="prose dark:prose-invert"
      >
        {children}
      </article>
    </div>
  )
} 