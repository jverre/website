'use client'

import { useRef, useEffect, useState } from 'react'
import { useSidebar } from '../../providers/SidebarContext'
import ThreeJsChatResponse from '../ascii/ThreeJsChatResponse'

export default function Sidebar() {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [threeJsCode, setThreeJsCode] = useState<string | null>(null)

  // Handle receiving code from the chat component
  const handleCodeRequest = (code: string) => {
    setThreeJsCode(code);
  };

  // Check window width and update visibility
  useEffect(() => {
    const checkWidth = () => {
      setIsVisible(window.innerWidth >= 1100)
    }
    
    // Initial check
    checkWidth()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkWidth)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkWidth)
    }
  }, [])

  // Close sidebar with Escape key
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

  // Don't render anything if not visible
  if (!isVisible) {
    return null
  }

  return (
    <div className="h-full block">
      {/* Tab-style trigger */}
      <div
        onClick={toggleSidebar}
        className={`fixed z-30 cursor-pointer transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'right-96 top-6' 
            : 'right-0 top-6'
        }`}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <div className="flex flex-col items-center">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm p-1.5 rounded-l-md shadow-sm border-l border-t border-b border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-black transition-colors">
            <div className="writing-vertical text-xs font-medium tracking-wide py-8 px-0.5 text-gray-700 dark:text-gray-300">
              ASCII Art
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar panel */}
      <div
        ref={sidebarRef}
        className={`fixed right-0 top-0 h-screen w-96 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-l border-gray-200 dark:border-gray-800 shadow-md transform transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full relative">
          <div className="pt-6 px-8 pb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">ASCII Art Generator</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Generate ASCII art from text prompts
            </p>
          </div>
          
          {/* Separator */}
          <div className="mx-8 border-t border-gray-200 dark:border-gray-800 mb-4"></div>
          
          {/* Main content area with ThreeJs */}
          <div className="flex-grow px-8 pb-32 overflow-auto">
            <ThreeJsChatResponse onCodeRequest={handleCodeRequest} />
          </div>
          
          {/* Fixed input at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 px-8 py-4 border-t border-gray-200 dark:border-gray-800">
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submission is handled in ThreeJsChatResponse
            }} className="relative">
              <input
                id="ascii-prompt"
                type="text"
                placeholder="Enter a prompt to generate ASCII art..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                aria-label="Generate model"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>Why not try "bouncing ball" ?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 