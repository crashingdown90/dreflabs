import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, MapPin, Award, TrendingUp,
  CheckCircle, Target, Users, Lightbulb
} from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import caseStudies from '@/content/data/political-consulting.json'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = caseStudies.find((s) => s.slug === params.slug)
  
  if (!study) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: `${study.title} - Political Consulting Case Study | Dref Labs`,
    description: study.description,
    keywords: [study.type, study.region, 'political consulting', 'campaign strategy', study.year],
    openGraph: {
      title: study.title,
      description: study.description,
      images: [study.coverImage],
    },
  }
}

export default function CaseStudyPage({ params }: Props) {
  const study = caseStudies.find((s) => s.slug === params.slug)

  if (!study) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <Link 
            href="/political-consulting"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Political Consulting
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">{study.result}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {study.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{study.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{study.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>{study.type}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xl text-muted-foreground leading-relaxed">
                {study.description}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cover Image */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-5xl mx-auto">
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-32 h-32 text-primary/30" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card className="p-8">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {study.challenge}
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Card className="p-8">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">The Solution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {study.solution}
                </p>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services & Technologies */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div>
                <h2 className="text-2xl font-bold mb-6">Services Provided</h2>
                <div className="space-y-3">
                  {study.services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <h2 className="text-2xl font-bold mb-6">Technologies Used</h2>
                <div className="space-y-3">
                  {study.technologies.map((tech, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-8 text-center">Campaign Methodology</h2>
            </ScrollReveal>

            <div className="space-y-6">
              {study.methodology.map((phase, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{phase.phase}</h3>
                          <span className="text-sm text-muted-foreground">{phase.duration}</span>
                        </div>
                        <ul className="space-y-2 mt-4">
                          {phase.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-8 text-center">Campaign Results</h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {study.results.map((result, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">{result.metric}</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Before:</span>
                            <span className="font-medium">{result.before}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">After:</span>
                            <span className="font-medium">{result.after}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border">
                            <span className="text-muted-foreground">Improvement:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {result.improvement}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {study.testimonial && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <blockquote className="text-xl md:text-2xl font-medium mb-6 italic">
                      "{study.testimonial.quote}"
                    </blockquote>
                    <div>
                      <div className="font-bold">{study.testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{study.testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Achieve Similar Results?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Let's discuss how we can help you win your next campaign with data-driven strategies.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">
                    Schedule Consultation
                  </Button>
                </Link>
                <Link href="/political-consulting">
                  <Button variant="outline" size="lg">
                    View More Case Studies
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

