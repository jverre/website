'use client'

import { useEffect, useState } from 'react'

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement>
}

interface HeadingData {
  id: string
  text: string
  level: number
}

export function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!contentRef.current) return

    const elements = contentRef.current.querySelectorAll('h2, h3, h4')
    const headingData: HeadingData[] = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1)),
    }))
    setHeadings(headingData)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [contentRef])

  if (headings.length === 0) return null

  return (
    <aside className="blog-toc-column">
      <div className="blog-toc">
        <nav>
          <h4 className="blog-toc-title !mt-0">Table of Contents</h4>
          <ul className="blog-toc-list">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`blog-toc-link ${
                    heading.level === 3 ? 'pl-4' : heading.level === 4 ? 'pl-8' : ''
                  } ${activeId === heading.id ? 'blog-toc-link-active' : ''}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
