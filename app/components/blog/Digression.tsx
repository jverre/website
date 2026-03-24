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
      <div className="hidden xl:block relative" ref={containerRef}>
        <aside 
          ref={asideRef}
          className="absolute left-full ml-6 w-64 z-10"
          style={{ 
            top: `${topOffset}px`,
            opacity: isPositioned ? 1 : 0
          }}
        >
          <div className="note-card shadow-[0_18px_45px_rgba(50,35,16,0.08)] backdrop-blur-sm">
            <div className="note-label">Aside</div>
            <div className="note-content italic">
              {children}
            </div>
          </div>
        </aside>
      </div>
      
      <aside className="xl:hidden my-6">
        <div className="note-card border-l-[3px] border-l-[var(--rule-strong)]">
          <div className="note-label">Aside</div>
          <div className="note-content italic">
            {children}
          </div>
        </div>
      </aside>
    </>  
  )
} 
