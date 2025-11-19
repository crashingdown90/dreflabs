import Link from 'next/link'
import Image from 'next/image'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card, { CardContent, CardFooter } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import projectsData from '@/content/data/projects.json'

export default function FeaturedProjects() {
  const featuredProjects = projectsData.filter((p) => p.featured).slice(0, 3)

  return (
    <section className="relative py-20 md:py-32 bg-dark-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Showcasing impactful solutions in big data, AI, and digital government
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <ScrollReveal key={project.slug} delay={index * 0.1}>
              <Link href={`/projects/${project.slug}`}>
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
                    <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors">
                      {project.title}
                    </h3>
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
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link href="/projects">
              <Button size="lg" variant="outline">
                View All Projects
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
