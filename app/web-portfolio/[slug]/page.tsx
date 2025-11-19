import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Card, { CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ScrollReveal from '@/components/animations/ScrollReveal'
import portfolioData from '@/content/data/web-portfolio.json'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return portfolioData.portfolioProjects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = portfolioData.portfolioProjects.find((p) => p.slug === params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Web Portfolio`,
    description: project.shortDescription,
    keywords: [project.category, ...project.technologies],
  }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = portfolioData.portfolioProjects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <ScrollReveal>
          <Link href="/web-portfolio">
            <Button variant="ghost" className="mb-8">
              ← Back to Portfolio
            </Button>
          </Link>
        </ScrollReveal>

        {/* Hero Section */}
        <ScrollReveal>
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="default">{project.category}</Badge>
              {project.status === 'Live' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  ● Live
                </Badge>
              )}
              <span className="text-gray-400">{project.year}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              {project.title}
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-4xl">{project.shortDescription}</p>

            {/* Project Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Client</div>
                <div className="font-semibold">{project.client}</div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="font-semibold">{project.duration}</div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Year</div>
                <div className="font-semibold">{project.year}</div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <div className="font-semibold">{project.status}</div>
              </div>
            </div>

            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  Visit Website →
                </Button>
              </a>
            )}
          </div>
        </ScrollReveal>

        {/* Main Screenshot */}
        <ScrollReveal delay={0.1}>
          <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden mb-12 glass">
            <Image
              src={project.screenshots[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <ScrollReveal delay={0.2}>
              <Card className="glass-strong">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                  <p className="text-gray-300 leading-relaxed">{project.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Challenge */}
            <ScrollReveal delay={0.3}>
              <Card className="glass-strong">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-orange-400">The Challenge</h2>
                  <p className="text-gray-300 leading-relaxed">{project.challenge}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Solution */}
            <ScrollReveal delay={0.4}>
              <Card className="glass-strong">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-blue-400">The Solution</h2>
                  <p className="text-gray-300 leading-relaxed">{project.solution}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Results */}
            {project.results && project.results.length > 0 && (
              <ScrollReveal delay={0.5}>
                <Card className="glass-strong">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-green-400">Results & Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.results.map((result, index) => (
                        <div key={index} className="flex items-start gap-3 glass p-4 rounded-lg">
                          <span className="text-green-400 text-xl mt-0.5">✓</span>
                          <span className="text-gray-300">{result}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Features */}
            <ScrollReveal delay={0.6}>
              <Card className="glass-strong">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-primary mt-1">▸</span>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Screenshots Gallery */}
            {project.screenshots.length > 1 && (
              <ScrollReveal delay={0.7}>
                <div>
                  <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.screenshots.slice(1).map((screenshot, index) => (
                      <div
                        key={index}
                        className="relative h-64 rounded-xl overflow-hidden glass group cursor-pointer"
                      >
                        <Image
                          src={screenshot}
                          alt={`${project.title} screenshot ${index + 2}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Testimonial */}
            {project.testimonial && (
              <ScrollReveal delay={0.8}>
                <Card className="glass-strong border-l-4 border-primary">
                  <CardContent className="p-8">
                    <div className="text-4xl text-primary mb-4">"</div>
                    <p className="text-lg text-gray-300 italic mb-6">
                      {project.testimonial.text}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {project.testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{project.testimonial.author}</div>
                        <div className="text-sm text-gray-400">
                          {project.testimonial.position}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technologies */}
            <ScrollReveal delay={0.2}>
              <Card className="glass-strong sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.3}>
              <Card className="glass-strong">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Interested in Similar Project?</h3>
                  <p className="text-gray-400 mb-6 text-sm">
                    Let's discuss how I can help build a custom solution for your business.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full">Contact Me</Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>

        {/* Navigation to Other Projects */}
        <ScrollReveal>
          <div className="text-center">
            <Link href="/web-portfolio">
              <Button variant="outline" size="lg">
                View All Projects
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

