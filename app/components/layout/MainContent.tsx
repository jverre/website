'use client'

import { ReactNode } from 'react'
import { useSidebar } from '../../providers/SidebarContext'

export default function MainContent({ children }: { children: ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={`site-main transition-all duration-300 ease-in-out ${
        isOpen ? 'pr-96' : ''
      }`}
    >
      <div className={isOpen ? 'transform translate-x-[-48px]' : ''}>
        <main className="site-frame">
          <div className="site-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 
