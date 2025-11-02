import { Metadata } from 'next'
import ProjectList from 'app/components/projects/ProjectList'

export const metadata: Metadata = {
  title: 'Projects - Jacques Verré',
  description: 'Reference implementations and open-source projects focused on AI and product development',
}

export default function ProjectsPage() {
  return (
    <>
      <div className="min-h-screen py-12 md:py-20">
        <section className="mb-16">
          <h1 className="text-2xl font-medium mb-4">Projects</h1>
          <p className="text-base text-muted-foreground">
            Reference implementations and open-source projects focused on AI and product development.
          </p>
        </section>

        <ProjectList showAll />
      </div>
    </>
  )
} 