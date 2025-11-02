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
          <div className="w-full max-w-3xl mx-auto px-2 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 