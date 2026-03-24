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
    <footer className="site-footer">
        <div className="site-footer-grid">
          <div className="site-footer-cell">
            <span className="site-footer-label">Project</span>
            <span className="site-footer-value">Jacques Verré</span>
          </div>
          <div className="site-footer-cell">
            <span className="site-footer-label">License</span>
            <span className="site-footer-value">MIT Licensed</span>
          </div>
          <div className="site-footer-cell site-footer-links">
            <span className="site-footer-label">Links</span>
            <div className="site-footer-link-row">
            <a
              className="site-footer-link"
              rel="noopener noreferrer"
              target="_blank"
              href="/rss"
            >
              <ArrowIcon />
              <span>rss</span>
            </a>
            <a
              className="site-footer-link"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/jverre/"
            >
              <ArrowIcon />
              <span>github</span>
            </a>
            <a
              className="site-footer-link"
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
