'use client'

import { useRef } from 'react'
import { TableOfContents } from 'app/components/ui/TableOfContents'

export default function BlogPageClient({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full max-w-none">
      <TableOfContents contentRef={contentRef} />
      <div className="max-w-2xl mx-auto xl:mx-0">
        <article 
          ref={contentRef}
          className="prose dark:prose-invert max-w-none"
        >
          {children}
        </article>
      </div>
    </div>
  )
} 