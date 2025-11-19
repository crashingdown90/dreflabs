import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Card, { CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ScrollReveal from '@/components/animations/ScrollReveal'
import portfolioData from '@/content/data/web-portfolio.json'

export const metadata: Metadata = {
  title: 'Web Development Portfolio | Drefan Madiawan',
  description:
    'Professional web development portfolio showcasing enterprise applications, e-commerce platforms, ERP systems, and custom web solutions.',
  keywords: [
    'web development',
    'full-stack developer',
    'enterprise applications',
    'e-commerce',
    'ERP systems',
    'custom web solutions',
  ],
}

export default function WebPortfolioPage() {
  const { portfolioProjects, statistics, categories } = portfolioData
  const featuredProjects = portfolioProjects.filter((p) => p.featured)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Web Development Portfolio
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              Building Digital Solutions
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Professional web developer specializing in enterprise applications, e-commerce
              platforms, and custom web solutions. Transforming business requirements into
              scalable, high-performance web applications.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {statistics.totalProjects}+
                </div>
                <div className="text-sm text-gray-400">Projects Completed</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {statistics.yearsExperience}+
                </div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {statistics.clientsSatisfied}+
                </div>
                <div className="text-sm text-gray-400">Satisfied Clients</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {statistics.technologiesUsed}+
                </div>
                <div className="text-sm text-gray-400">Technologies</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Categories Filter */}
        <ScrollReveal delay={0.1}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Project Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Badge key={category} variant="outline" className="text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Projects */}
        <div className="mb-16">
          <ScrollReveal delay={0.2}>
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={0.1 * (index + 1)}>
                <Link href={`/web-portfolio/${project.slug}`}>
                  <Card hover glow className="h-full group overflow-hidden">
                    {/* Project Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={project.screenshots[0]}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="default">{project.category}</Badge>
                      </div>
                      {project.status === 'Live' && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                            ● Live
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-sm text-gray-400">
                        <span>{project.client}</span>
                        <span>•</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {project.shortDescription}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.technologies.length - 5} more
                          </Badge>
                        )}
                      </div>

                      {/* Key Results */}
                      {project.results && project.results.length > 0 && (
                        <div className="border-t border-dark-border pt-4">
                          <div className="text-sm font-semibold mb-2 text-primary">
                            Key Results:
                          </div>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {project.results.slice(0, 2).map((result, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">✓</span>
                                <span>{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-6">
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                          View Case Study →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* All Projects */}
        <div className="mb-16">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8 text-center">All Projects</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={0.05 * index}>
                <Link href={`/web-portfolio/${project.slug}`}>
                  <Card hover className="h-full group">
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <Image
                        src={project.screenshots[0]}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent opacity-60"></div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="text-xs text-gray-500 mb-2">{project.year}</div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {project.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <ScrollReveal>
          <Card className="glass-strong text-center p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Next Project?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's discuss how I can help transform your business requirements into a
              high-performance web application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="min-w-[200px]">
                  Get in Touch
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Learn More About Me
                </Button>
              </Link>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}

