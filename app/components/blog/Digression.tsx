'use client'

import React, { useState, useLayoutEffect, useRef } from 'react'
import { useMarginNotes } from '../../providers/MarginNotesContext'

interface DigressionProps {
  children: React.ReactNode
}

export default function Digression({ children }: DigressionProps) {
  const { calculatePosition } = useMarginNotes()
  const [topOffset, setTopOffset] = useState(0)
  const [isPositioned, setIsPositioned] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const asideRef = useRef<HTMLDivElement>(null)
  const [noteId] = useState(() => Math.random().toString(36))

  useLayoutEffect(() => {
    if (containerRef.current && asideRef.current) {
      // Get the natural position of this aside relative to its content
      const containerRect = containerRef.current.getBoundingClientRect()
      const naturalTop = containerRect.top
      
      // Get the height of the aside
      const height = asideRef.current.offsetHeight || 120
      
      // Calculate the final position (may be adjusted for overlaps)
      const calculatedTop = calculatePosition(noteId, naturalTop, height)
      
      // Set the position and make visible
      setTopOffset(calculatedTop - naturalTop)
      setIsPositioned(true)
    }
  }, [calculatePosition, noteId])

  return (
    <>
      {/* Margin note for large screens - positioned in right margin */}
      <div className="hidden xl:block relative" ref={containerRef}>
        <aside 
          ref={asideRef}
          className="absolute left-full ml-8 w-80 z-10"
          style={{ 
            top: `${topOffset}px`,
            opacity: isPositioned ? 1 : 0
          }}
        >
          <div className="bg-neutral-50/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-lg backdrop-blur-sm">
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 opacity-75">
              Aside
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 italic leading-relaxed">
              {children}
            </div>
          </div>
        </aside>
      </div>
      
      {/* Inline fallback for smaller screens */}
      <aside className="xl:hidden my-6">
        <div className="bg-neutral-50/50 dark:bg-neutral-800/30 border-l-4 border-neutral-300 dark:border-neutral-600 rounded-r-lg p-4">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 opacity-75">
            Aside
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400 italic leading-relaxed">
            {children}
          </div>
        </div>
      </aside>
    </>  
  )
} 