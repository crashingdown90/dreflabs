import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlurText from '@/components/animations/BlurText'
import CountUp from '@/components/animations/CountUp'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Timeline from '@/components/home/Timeline'
import {
  Code2,
  Shield,
  Database,
  Brain,
  Landmark,
  LineChart,
  Target,
  Telescope,
  Sparkles,
  Zap
} from 'lucide-react'

export const metadata = {
  title: 'About Drefan Mardiawan | IT Expert & Digital Transformation Consultant',
  description: 'Drefan Mardiawan - IT Expert with 17+ years of experience in Software Development, Cybersecurity, Big Data, AI, and E-Government. Government IT Governance Consultant.',
  keywords: [
    'IT Expert Indonesia',
    'Government IT Consultant',
    'Big Data Specialist',
    'Cybersecurity Expert',
    'E-Government Architect',
    'Digital Transformation Consultant',
    'AI Machine Learning Indonesia',
    'Senior Software Developer',
    'Enterprise Architecture',
    'Data Analytics Expert',
  ],
  openGraph: {
    title: 'About Drefan Mardiawan | IT Expert & Digital Transformation Consultant',
    description: 'IT Expert with 17+ years of experience in Software Development, Cybersecurity, Big Data, AI, and E-Government.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-300">
                <CountUp end={17} duration={2} suffix="+" /> Years of Excellence
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
              <BlurText text="Drefan Mardiawan" delay={0.2} />
            </h1>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 font-medium mb-2">
              <BlurText text="IT Expert & Digital Transformation Consultant" delay={0.4} />
            </p>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              <BlurText
                text="17+ years of experience in Software Development, Cybersecurity, Big Data Analytics, AI/ML, and E-Government Architecture"
                delay={0.6}
                staggerChildren={0.02}
              />
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 rounded-xl overflow-hidden border-4 border-white/30 shadow-2xl shadow-white/10">
                  <Image
                    src="/images/optimized/Drefan.webp"
                    alt="Drefan Mardiawan - IT Expert & Digital Transformation Consultant"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  I am <span className="text-white font-semibold">Drefan Mardiawan</span>, an IT Expert
                  with over <strong className="text-white">17 years</strong> of experience in the information technology industry.
                  My professional journey spans various domains from <em>Software Development</em>,
                  <em>Cybersecurity</em>, <em>System Analysis</em>, to <em>Enterprise Architecture</em>.
                </p>
                <p className="leading-relaxed">
                  My career began in <strong className="text-white">2008</strong> with a focus on
                  <em> ethical hacking</em> and cybersecurity. Over time, my expertise expanded to include
                  enterprise IT infrastructure, large-scale software development, complex system analysis,
                  and now focuses on <strong className="text-white">Big Data Analytics</strong>,
                  <strong className="text-white"> Artificial Intelligence</strong>, and
                  <strong className="text-white"> government digital transformation</strong>.
                </p>
                <p className="leading-relaxed">
                  One of the significant achievements in my career is my involvement as part of the
                  <strong className="text-white"> provincial government IT governance architecture team</strong>,
                  where I contributed to designing and implementing technology solutions to
                  improve public service efficiency and government transparency.
                </p>
                <p className="leading-relaxed">
                  Throughout my career journey, I have been trusted by various government institutions and
                  enterprise companies to implement large-scale <em>Big Data</em> solutions,
                  develop AI-based analytics platforms, and design secure and sustainable digital transformation initiatives.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Core Expertise */}
          <ScrollReveal>
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-white">Areas of Expertise</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-dark-primary/50 hover:bg-dark-primary/70 transition-colors">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Code2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Software Development</h3>
                      <p className="text-sm mt-1">Full-stack development, system architecture, and enterprise application development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-dark-primary/50 hover:bg-dark-primary/70 transition-colors">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Cybersecurity</h3>
                      <p className="text-sm mt-1">Ethical hacking, penetration testing, security audit, and security implementation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-dark-primary/50 hover:bg-dark-primary/70 transition-colors">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Database className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Big Data & Analytics</h3>
                      <p className="text-sm mt-1">Data pipeline, data warehouse, business intelligence, and data visualization</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-dark-primary/50 hover:bg-dark-primary/70 transition-colors">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI & Machine Learning</h3>
                      <p className="text-sm mt-1">Predictive analytics, NLP, computer vision, and AI model implementation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-dark-primary/50 hover:bg-dark-primary/70 transition-colors">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <Landmark className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">E-Government</h3>
                      <p className="text-sm mt-1">Government digital transformation, IT governance, and smart city solutions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-dark-primary/50 hover:bg-dark-primary/70 transition-colors">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <LineChart className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">System Analysis</h3>
                      <p className="text-sm mt-1">Business process analysis, requirement engineering, and solution architecture</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card className="p-8 mb-16">
              <h2 className="text-2xl font-heading font-bold text-white mb-6">Mission & Vision</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">Mission</h3>
                  </div>
                  <p className="leading-relaxed">
                    Leveraging cutting-edge technology to solve real-world problems, especially in the public sector,
                    where data-driven decision-making can have a significant impact on society.
                    I am committed to bridging the gap between advanced technology and the practical needs of
                    government and enterprise in Indonesia.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Telescope className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">Vision</h3>
                  </div>
                  <p className="leading-relaxed">
                    Realizing a future where government services run seamlessly, securely, and citizen-centric,
                    supported by intelligent data analytics and artificial intelligence.
                    Being part of Indonesia&apos;s transformation towards an inclusive and sustainable digital era.
                  </p>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>

        <Timeline />

        <ScrollReveal>
          <div className="mt-16 text-center p-12 rounded-xl border border-dark-border bg-gradient-to-br from-dark-secondary/50 to-dark-primary/30 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-heading font-bold text-white mb-4">
                Let&apos;s Collaborate
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Interested in collaborating on digital transformation projects, big data solutions, or enterprise IT initiatives?
                I&apos;m ready to help bring your technology vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">Get In Touch</Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
