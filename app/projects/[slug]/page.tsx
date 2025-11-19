import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users, Clock } from 'lucide-react'
import { notFound } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import projectsData from '@/content/data/projects.json'

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projectsData.find((p) => p.slug === params.slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: `${project.title} | Dref Labs`,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projectsData.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </Link>

        <article className="max-w-5xl mx-auto">
          {/* Cover Image */}
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image src={project.coverImage} alt={project.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
          </div>

          {/* Header */}
          <header className="mb-12">
            <Badge variant="secondary" className="mb-4">
              {project.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8">{project.longDescription}</p>

            {/* Project Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <CardContent className="p-0">
                  <Calendar className="text-white mb-2" size={24} />
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-semibold text-white">{project.duration}</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="p-0">
                  <Users className="text-white mb-2" size={24} />
                  <p className="text-sm text-gray-400">Team Size</p>
                  <p className="font-semibold text-white">{project.teamSize} people</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="p-0">
                  <Clock className="text-white mb-2" size={24} />
                  <p className="text-sm text-gray-400">Year</p>
                  <p className="font-semibold text-white">{project.year}</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="p-0">
                  <p className="text-sm text-gray-400 mb-1">Role</p>
                  <p className="font-semibold text-white text-sm">{project.role}</p>
                </CardContent>
              </Card>
            </div>
          </header>

          {/* Problem */}
          <section className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">The Challenge</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{project.problem}</p>
          </section>

          {/* Solution */}
          <section className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">The Solution</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{project.solution}</p>
          </section>

          {/* Technologies */}
          <section className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-white mb-6">Technologies Used</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <Badge key={tech.name} variant="default" className="text-base px-4 py-2">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </section>

          {/* Results */}
          <section className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-white mb-6">Results & Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.results.map((result, index) => (
                <Card key={index} hover glow className="p-6 text-center">
                  <CardContent className="p-0">
                    <p className="text-3xl font-bold gradient-text mb-2">{result.value}</p>
                    <p className="text-white font-semibold mb-2">{result.metric}</p>
                    <p className="text-gray-400 text-sm">{result.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 p-8 rounded-xl border border-dark-border bg-dark-secondary/30 text-center">
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              Need Similar Solution?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              I can help you design and implement solutions tailored to your organization's needs.
              Let's discuss your project.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Me</Button>
            </Link>
          </section>
        </article>
      </div>
    </div>
  )
}
