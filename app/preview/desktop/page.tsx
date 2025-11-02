'use client'

export default function DesktopPreview() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black">
      <a
        href="/"
        className="absolute top-4 left-4 z-20 text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
      >
        ← back
      </a>
      <div className="h-screen overflow-auto">
        <div style={{
          width: '1440px',
          height: '900px',
          transform: 'scale(0.26)',
          transformOrigin: 'top left',
        }}>
          <iframe
            src="/"
            className="w-full h-full border border-neutral-300 dark:border-neutral-700"
          />
        </div>
      </div>
    </div>
  )
}
