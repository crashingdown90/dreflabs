import Link from 'next/link'
import Image from 'next/image'
import Card, { CardContent, CardFooter } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import projectsData from '@/content/data/projects.json'

export const metadata = {
  title: 'Projects | Dref Labs',
  description: 'Portfolio of big data, AI, and e-government projects',
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-4">
            Projects
          </h1>
          <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Showcasing impactful solutions in big data, AI, cyber security, and e-government
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <Card hover glow className="h-full group">
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-xl">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent opacity-60"></div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {project.category}
                  </Badge>
                  <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech.name}
                        className="text-xs px-2 py-1 rounded bg-dark-tertiary text-gray-300"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <span className="text-white text-sm font-medium group-hover:underline">
                    View Case Study →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
