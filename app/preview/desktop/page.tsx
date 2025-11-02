'use client'

export default function DesktopPreview() {
  return (
    <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      <div className="h-10 flex items-center px-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <a
          href="/"
          className="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
        >
          ← back
        </a>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="border border-neutral-300 dark:border-neutral-700 shadow-lg">
          <div style={{
            width: '1440px',
            height: '900px',
            transform: 'scale(0.26)',
            transformOrigin: 'top left',
          }}>
            <iframe
              src="/"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
