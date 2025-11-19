import { Metadata } from 'next'
import Link from 'next/link'
import {
  Target, TrendingUp, Users, BarChart3, Brain, Shield,
  CheckCircle, ArrowRight, Award, Zap, Database, LineChart
} from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import caseStudies from '@/content/data/political-consulting.json'

export const metadata: Metadata = {
  title: 'Political Consulting - Data-Driven Campaign Strategy | Dref Labs',
  description: 'Professional political consulting services combining data analytics, AI technology, and strategic expertise for winning electoral campaigns. From branding to victory.',
  keywords: ['political consulting', 'campaign strategy', 'election analytics', 'political branding', 'voter targeting', 'data-driven campaigns'],
  openGraph: {
    title: 'Political Consulting - Strategic Campaign Solutions',
    description: 'Data-driven political consulting for electoral success',
    images: ['/political/og-image.jpg'],
  },
}

const services = [
  {
    icon: Target,
    title: 'Political Branding & Positioning',
    description: 'Crafting compelling political narratives and positioning strategies that resonate with target voters.',
    features: ['Brand identity development', 'Message framework', 'Visual identity system', 'Positioning strategy']
  },
  {
    icon: Database,
    title: 'Data-Driven Voter Targeting',
    description: 'Advanced analytics to identify, segment, and target key voter demographics with precision.',
    features: ['Voter segmentation', 'Demographic analysis', 'Behavioral profiling', 'Micro-targeting']
  },
  {
    icon: Brain,
    title: 'AI Sentiment Analysis',
    description: 'Real-time monitoring and analysis of public sentiment using artificial intelligence and machine learning.',
    features: ['Social media monitoring', 'Sentiment tracking', 'Trend analysis', 'Crisis detection']
  },
  {
    icon: TrendingUp,
    title: 'Campaign Strategy & Execution',
    description: 'Comprehensive campaign planning and execution from kickoff to election day.',
    features: ['Strategic planning', 'Resource allocation', 'Timeline management', 'Performance optimization']
  },
  {
    icon: Users,
    title: 'Ground Movement Coordination',
    description: 'Organizing and mobilizing grassroots supporters for maximum impact on the ground.',
    features: ['Volunteer management', 'Event coordination', 'Door-to-door campaigns', 'GOTV operations']
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description: 'Using big data and predictive modeling to forecast outcomes and optimize strategies.',
    features: ['Vote prediction', 'Trend forecasting', 'Risk assessment', 'Scenario planning']
  },
]

const methodology = [
  {
    step: '01',
    title: 'Research & Analysis',
    description: 'Deep dive into voter demographics, competitor analysis, and historical patterns.',
    icon: Database,
  },
  {
    step: '02',
    title: 'Strategy Development',
    description: 'Crafting data-driven strategies tailored to your unique political landscape.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Campaign Execution',
    description: 'Implementing multi-channel campaigns with real-time monitoring and optimization.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Performance Optimization',
    description: 'Continuous analysis and adjustment based on real-time data and feedback.',
    icon: LineChart,
  },
]

const stats = [
  { value: '15+', label: 'Winning Campaigns' },
  { value: '83%', label: 'Success Rate' },
  { value: '5M+', label: 'Voters Reached' },
  { value: '50+', label: 'Districts Covered' },
]

const technologies = [
  'AI & Machine Learning',
  'Big Data Analytics',
  'Geospatial Mapping',
  'Social Media Intelligence',
  'Predictive Modeling',
  'Real-time Dashboards',
  'CRM Systems',
  'Mobile Campaign Apps',
]

export default function PoliticalConsultingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Professional Political Consulting</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Data-Driven Political Strategy for Electoral Victory
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Combining advanced data analytics, AI technology, and strategic expertise to deliver winning campaigns. 
                From political branding to election day victory.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="#case-studies">
                  <Button size="lg">
                    View Case Studies
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#services">
                  <Button variant="outline" size="lg">
                    Our Services
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive Political Consulting Services
              </h2>
              <p className="text-lg text-muted-foreground">
                End-to-end solutions for modern political campaigns, powered by technology and data
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Proven Methodology
              </h2>
              <p className="text-lg text-muted-foreground">
                A systematic approach to political campaign success
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodology.map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="relative">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary/20 mb-2">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                  {index < methodology.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Proven Track Record of Success
              </h2>
              <p className="text-lg text-muted-foreground">
                Real campaigns, real results. See how we've helped candidates win elections.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <ScrollReveal key={study.id} delay={index * 0.1}>
                <Link href={`/political-consulting/${study.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="w-16 h-16 text-primary/30" />
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium">
                          {study.result}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{study.year}</span>
                        <span>•</span>
                        <span>{study.region}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {study.description}
                      </p>
                      <div className="flex items-center text-primary font-medium text-sm">
                        View Case Study
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powered by Advanced Technology
              </h2>
              <p className="text-lg text-muted-foreground">
                Leveraging cutting-edge tools and platforms for maximum campaign effectiveness
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="px-6 py-3 rounded-full bg-background border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
                >
                  <span className="font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
              <div className="p-12 text-center">
                <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Win Your Next Campaign?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's discuss how data-driven strategies and advanced technology can help you achieve electoral victory.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg">
                      Schedule Consultation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="#case-studies">
                    <Button variant="outline" size="lg">
                      View More Case Studies
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

