'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="w-full max-w-3xl mx-auto px-2 md:px-6">
        <nav className="flex h-20 items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-semibold tracking-tight hover:text-neutral-600 transition-colors"
          >
            JV
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm tracking-wide transition-colors ${
                pathname === '/' 
                  ? 'text-neutral-900 font-medium dark:text-white' 
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className={`text-sm tracking-wide transition-colors ${
                pathname.startsWith('/blog')
                  ? 'text-neutral-900 font-medium dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/projects" 
              className={`text-sm tracking-wide transition-colors ${
                pathname.startsWith('/projects')
                  ? 'text-neutral-900 font-medium dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              Projects
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 