import React from 'react'

interface ReferencesProps {
  children: React.ReactNode
}

export default function References({ children }: ReferencesProps) {
  return (
    <section className="my-8">
      <div className="bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3 opacity-75">
          References
        </div>
        <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0 [&_li]:mb-2 [&_li:last-child]:mb-0 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </section>
  )
}
