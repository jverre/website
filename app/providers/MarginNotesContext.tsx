'use client'

import React, { createContext, useContext, useRef } from 'react'

interface AsidePosition {
  id: string
  naturalTop: number
  calculatedTop: number
  height: number
}

interface MarginNotesContextType {
  calculatePosition: (id: string, naturalTop: number, height: number) => number
}

const MarginNotesContext = createContext<MarginNotesContextType | undefined>(undefined)

export function MarginNotesProvider({ children }: { children: React.ReactNode }) {
  const asidesRef = useRef<AsidePosition[]>([])

  const calculatePosition = (id: string, naturalTop: number, height: number): number => {
    // Remove existing entry for this id if it exists
    asidesRef.current = asidesRef.current.filter(aside => aside.id !== id)
    
    // Start with the natural position
    let calculatedTop = naturalTop
    
    // Check for overlaps with existing asides
    const sortedAsides = [...asidesRef.current].sort((a, b) => a.calculatedTop - b.calculatedTop)
    
    for (const existingAside of sortedAsides) {
      const existingBottom = existingAside.calculatedTop + existingAside.height
      const proposedBottom = calculatedTop + height
      
      // If there's an overlap, move this aside below the existing one
      if (calculatedTop < existingBottom && proposedBottom > existingAside.calculatedTop) {
        calculatedTop = existingBottom + 20 // 20px gap
      }
    }
    
    // Store the calculated position
    asidesRef.current.push({
      id,
      naturalTop,
      calculatedTop,
      height
    })
    
    return calculatedTop
  }

  return (
    <MarginNotesContext.Provider value={{ calculatePosition }}>
      {children}
    </MarginNotesContext.Provider>
  )
}

export function useMarginNotes() {
  const context = useContext(MarginNotesContext)
  if (!context) {
    throw new Error('useMarginNotes must be used within MarginNotesProvider')
  }
  return context
} 