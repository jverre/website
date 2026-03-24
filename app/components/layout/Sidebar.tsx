'use client'

import { useRef, useEffect, useState } from 'react'
import { useSidebar } from '../../providers/SidebarContext'
import ThreeJsChatResponse from '../ascii/ThreeJsChatResponse'

export default function Sidebar() {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  const handleCodeRequest = (_code: string) => {}

  useEffect(() => {
    const checkWidth = () => {
      setIsVisible(window.innerWidth >= 1100)
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)

    return () => {
      window.removeEventListener('resize', checkWidth)
    }
  }, [])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        closeSidebar()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, closeSidebar])

  if (!isVisible) {
    return null
  }

  return (
    <div className="h-full block">
      <div
        onClick={toggleSidebar}
        className={`fixed z-30 cursor-pointer transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'right-96 top-6' 
            : 'right-0 top-6'
        }`}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <div className="site-sidebar-trigger">
          <div className="writing-vertical site-sidebar-trigger-label">
            ASCII Lab
          </div>
        </div>
      </div>

      <div
        ref={sidebarRef}
        className={`site-sidebar-panel transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full relative">
          <div className="pt-6 px-8 pb-4">
            <p className="site-sidebar-kicker">Experimental Tool</p>
            <h2 className="site-sidebar-title">ASCII Art Generator</h2>
            <p className="site-sidebar-copy">
              Generate ASCII art from text prompts
            </p>
          </div>
          
          <div className="mx-8 border-t border-[var(--rule)] mb-4"></div>
          
          <div className="flex-grow px-8 pb-32 overflow-auto">
            <ThreeJsChatResponse onCodeRequest={handleCodeRequest} />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--paper-raised)] px-8 py-4 border-t border-[var(--rule)]">
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className="relative"
            >
              <input
                id="ascii-prompt"
                type="text"
                placeholder="Enter a prompt to generate ASCII art..."
                className="site-sidebar-input"
                autoFocus
              />
              <button
                type="submit"
                className="site-sidebar-submit"
                aria-label="Generate model"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            
            <div className="site-sidebar-note">
              <p>Why not try "bouncing ball" ? Or "Rocket Takeoff"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
