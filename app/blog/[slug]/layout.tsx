'use client'

import { MarginNotesProvider } from '../../providers/MarginNotesContext'

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarginNotesProvider>
      {children}
    </MarginNotesProvider>
  )
}