'use client'

import { useRef } from 'react'
import { TableOfContents } from '../../components/ui/TableOfContents'

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative max-w-3xl mx-auto px-6 py-10">
      <article 
        ref={contentRef}
        className="
          prose 
          prose-lg
          max-w-none
          prose-headings:font-semibold 
          prose-headings:tracking-tight 
          prose-headings:text-gray-900
          prose-headings:before:content-none
          prose-h1:text-5xl 
          prose-h1:font-bold
          prose-h1:mb-8
          prose-h2:text-3xl 
          prose-h2:mt-12
          prose-h3:text-2xl
          prose-p:text-gray-700
          prose-p:leading-relaxed
          prose-a:text-blue-600
          prose-a:no-underline
          prose-a:hover:text-blue-800
          prose-blockquote:border-l-4
          prose-blockquote:border-gray-200
          prose-blockquote:pl-6
          prose-blockquote:italic
          prose-blockquote:text-gray-700
          prose-strong:text-gray-900
          prose-code:text-gray-800
          prose-code:bg-gray-100
          prose-code:px-1.5
          prose-code:py-0.5
          prose-code:rounded-md
          prose-pre:bg-gray-900
          prose-img:rounded-lg
          prose-img:shadow-md
          dark:prose-invert
          dark:prose-headings:text-gray-100
          dark:prose-p:text-gray-300
          dark:prose-a:text-blue-400
          dark:prose-blockquote:text-gray-300
          dark:prose-strong:text-gray-100
          dark:prose-code:text-gray-200
          dark:prose-code:bg-gray-800
        "
      >
        {children}
      </article>
      <TableOfContents contentRef={contentRef} />
    </div>
  )
}