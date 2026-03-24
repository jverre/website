import React from 'react'

interface ReferencesProps {
  children: React.ReactNode
}

export default function References({ children }: ReferencesProps) {
  return (
    <section className="my-8">
      <div className="note-card">
        <div className="note-label">References</div>
        <div className="note-content [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0 [&_li]:mb-2 [&_li:last-child]:mb-0 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </section>
  )
}
