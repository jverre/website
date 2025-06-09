'use client'

import React, { useState } from 'react'

interface CollapsibleProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="my-6 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-y-auto overflow-x-hidden`}
      >
        <div className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
          {children}
        </div>
      </div>
    </div>
  )
} 