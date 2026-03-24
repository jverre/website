'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { TableOfContents } from 'app/components/ui/TableOfContents'

export default function BlogPageClient({ children, image }: { children: React.ReactNode; image?: string }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="article-layout">
      <div className="section-rule">
        <span>Fig. 5 - Essay</span>
      </div>
      <div className="article-grid">
        <div className="article-main">
          {image && (
            <div className="article-media">
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
          <article ref={contentRef} className="prose article-prose">
            {children}
          </article>
        </div>
        <TableOfContents contentRef={contentRef} />
      </div>
    </div>
  )
}
