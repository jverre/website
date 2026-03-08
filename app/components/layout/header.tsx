'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const series = [
  {
    name: 'Firecracker',
    description: 'Building with the open-source VMM behind AI sandboxes',
    href: '/blog/firecracker',
  },
]

export default function Header() {
  const pathname = usePathname()
  const [seriesOpen, setSeriesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSeriesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const linkClass = (active: boolean) =>
    `text-sm tracking-wide transition-colors ${
      active
        ? 'text-neutral-900 font-medium dark:text-white'
        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
    }`

  return (
    <header className="w-full border-b border-neutral-200/80 dark:border-neutral-800/80">
        <nav className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight hover:text-neutral-600 transition-colors"
          >
            JV
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className={linkClass(pathname === '/')}>
              Home
            </Link>
            <Link href="/blog" className={linkClass(pathname.startsWith('/blog'))}>
              Blog
            </Link>
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setSeriesOpen(true)}
              onMouseLeave={() => setSeriesOpen(false)}
            >
              <button
                onClick={() => setSeriesOpen((prev) => !prev)}
                className={`flex items-center gap-1 ${linkClass(false)}`}
              >
                Series
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${seriesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {seriesOpen && (
                <div className="absolute right-0 top-full pt-2 w-64 z-50">
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg py-1">
                  {series.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setSeriesOpen(false)}
                      className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {s.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {s.description}
                      </div>
                    </Link>
                  ))}
                </div>
                </div>
              )}
            </div>
            <Link href="/projects" className={linkClass(pathname.startsWith('/projects'))}>
              Projects
            </Link>
          </div>
        </nav>
    </header>
  )
}
