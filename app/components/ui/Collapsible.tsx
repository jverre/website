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
    <div className="collapsible-shell">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="collapsible-button"
        aria-expanded={isOpen}
      >
        <span className="collapsible-title">
          {title}
        </span>
        <svg
          className={`collapsible-icon w-4 h-4 transition-transform duration-200 ${
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
        <div className="collapsible-content">
          {children}
        </div>
      </div>
    </div>
  )
} 
