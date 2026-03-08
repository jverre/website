'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { TableOfContents } from 'app/components/ui/TableOfContents'

export default function BlogPageClient({ children, image }: { children: React.ReactNode; image?: string }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative py-10">
      <TableOfContents contentRef={contentRef} />
      {image && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <Image
            src={image}
            alt=""
            width={1200}
            height={630}
            className="w-full h-auto"
            priority
          />
        </div>
      )}
      <article
        ref={contentRef}
        className="prose dark:prose-invert"
      >
        {children}
      </article>
    </div>
  )
} 