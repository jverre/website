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
    `site-nav-link ${
      active
        ? 'site-nav-link-active'
        : ''
    }`

  return (
    <header className="site-header">
        <nav className="site-nav">
          <Link
            href="/"
            className="site-logo"
          >
            <span className="site-logo-mark">JV</span>
            <span className="site-logo-text">
              Jacques Verré
              <span>Build and Learn</span>
            </span>
          </Link>
          <div className="site-nav-links">
            <Link href="/" className={linkClass(pathname === '/')}>
              Home
            </Link>
            <Link href="/blog" className={linkClass(pathname.startsWith('/blog'))}>
              Blog
            </Link>
            <div
              ref={dropdownRef}
              className="site-dropdown"
              onMouseEnter={() => setSeriesOpen(true)}
              onMouseLeave={() => setSeriesOpen(false)}
            >
              <button
                onClick={() => setSeriesOpen((prev) => !prev)}
                className={`site-nav-link flex items-center gap-1 ${seriesOpen ? 'site-nav-link-active' : ''}`}
              >
                Series
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${seriesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {seriesOpen && (
                <div className="site-dropdown-panel">
                  {series.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setSeriesOpen(false)}
                      className="site-dropdown-item"
                    >
                      <div className="site-dropdown-title">
                        {s.name}
                      </div>
                      <div className="site-dropdown-description">
                        {s.description}
                      </div>
                    </Link>
                  ))}
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
