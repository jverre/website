'use client'

import { ReactNode } from 'react'

export default function MainContent({ children }: { children: ReactNode }) {
  return (
    <div className="site-main">
      <main className="site-frame">
        <div className="site-content">
          {children}
        </div>
      </main>
    </div>
  )
}
