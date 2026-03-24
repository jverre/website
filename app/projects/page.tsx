import { Metadata } from 'next'
import ProjectList from 'app/components/projects/ProjectList'

export const metadata: Metadata = {
  title: 'Projects - Jacques Verré',
  description: 'Reference implementations and open-source projects focused on AI and product development',
}

export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <div className="page-stack">
        <section className="page-hero">
          <div className="page-intro">
            <p className="page-caption">Build Log</p>
            <h1 className="page-title">Projects that taught me something.</h1>
            <p className="page-description">
              A mix of open-source tools, product experiments, and reference implementations centered on
              LLM workflows and developer tooling.
            </p>
          </div>
        </section>

        <div className="section-rule">
          <span>Fig. 4 - Project Index</span>
        </div>
        <section className="section-panel">
          <ProjectList showAll />
        </section>
      </div>
    </div>
  )
}
