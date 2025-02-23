function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-neutral-400"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200/80 dark:border-neutral-800/80 mt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-4 text-sm">
          <p className="text-neutral-600 dark:text-neutral-400 order-2 sm:order-1">
            © {new Date().getFullYear()} MIT Licensed
          </p>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <a
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              rel="noopener noreferrer"
              target="_blank"
              href="/rss"
            >
              <ArrowIcon />
              <span>rss</span>
            </a>
            <a
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/jverre/"
            >
              <ArrowIcon />
              <span>github</span>
            </a>
            <a
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/jverre/website"
            >
              <ArrowIcon />
              <span>view source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
