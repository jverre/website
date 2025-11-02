'use client'

import { useState } from 'react'

export default function DesktopPreview() {
  const [url, setUrl] = useState('/')

  return (
    <div className="fixed inset-0 bg-gray-100">
      <div className="h-12 bg-black text-white flex items-center justify-between px-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-gray-800 text-white px-3 py-1 rounded text-sm"
          placeholder="/path"
        />
        <a href="/" className="ml-3 text-sm">✕</a>
      </div>
      <div className="h-[calc(100vh-3rem)] overflow-auto">
        <div style={{
          width: '1440px',
          height: '900px',
          transform: 'scale(0.26)',
          transformOrigin: 'top left',
        }}>
          <iframe
            src={url}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
