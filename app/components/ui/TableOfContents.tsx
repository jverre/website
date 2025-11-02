'use client'

import { useEffect, useState } from 'react'
import { useSidebar } from '../../providers/SidebarContext'

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
  const { isOpen: isSidebarOpen } = useSidebar()

  useEffect(() => {
    if (!contentRef.current) return

    // Extract headings from the content
    const elements = contentRef.current.querySelectorAll('h2, h3, h4')
    const headingData: HeadingData[] = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1))
    }))
    setHeadings(headingData)

    // Set up intersection observer
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-100px 0px -66%'
    })

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [contentRef])

  if (headings.length === 0 || isSidebarOpen) return null

  return (
    <div className="hidden xl:block relative">
      <div className="sticky top-24 left-full ml-8 w-80 z-10">
        <nav className="relative">
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 !mt-0">
            Table of Contents
          </h4>
          <ul className="space-y-2.5 max-h-[calc(100vh-16rem)] overflow-y-hidden">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block text-sm ${
                    heading.level === 3 ? 'pl-4' : heading.level === 4 ? 'pl-8' : ''
                  } ${
                    activeId === heading.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                  } transition-colors duration-200`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
} 