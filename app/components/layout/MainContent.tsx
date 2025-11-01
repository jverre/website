'use client'

import { ReactNode } from 'react'
import { useSidebar } from '../../providers/SidebarContext'

export default function MainContent({ children }: { children: ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={`transition-all duration-300 ease-in-out w-full ${
        isOpen ? 'pr-96' : ''
      }`}
    >
      <div className={isOpen ? 'transform translate-x-[-48px]' : ''}>
        <main className="flex-auto min-w-0 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
} 