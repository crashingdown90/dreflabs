import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Timeline from '@/components/home/Timeline'

export const metadata = {
  title: 'About | Dref Labs',
  description: 'Learn more about Drefan Mardiawan and his 17+ years journey in IT',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
              About Me
            </h1>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              17+ years of innovation in technology, from ethical hacking to AI-powered government solutions
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 rounded-xl overflow-hidden border-4 border-white/30">
                  <Image
                    src="/images/profile.png"
                    alt="Drefan Mardiawan"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  I'm <span className="text-white font-semibold">Drefan Mardiawan</span>, an IT expert
                  with over 17 years of experience transforming complex data challenges into actionable
                  insights and building innovative digital government solutions.
                </p>
                <p className="leading-relaxed">
                  My journey began in 2008 with a passion for ethical hacking and cyber security. Over the
                  years, I've evolved through enterprise IT infrastructure, big data analytics, and now focus
                  on AI/ML and e-government digital transformation.
                </p>
                <p className="leading-relaxed">
                  Throughout my career, I've had the privilege of working with government institutions and
                  enterprises, implementing large-scale big data solutions, developing AI-powered analytics
                  platforms, and architecting secure digital transformation initiatives.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <Card className="p-8 mb-16">
              <h2 className="text-2xl font-heading font-bold text-white mb-6">Mission & Vision</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-white font-semibold mb-2">Mission</h3>
                  <p>
                    To leverage cutting-edge technology to solve real-world problems, particularly in the
                    public sector, where data-driven decision making can have profound impacts on society.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Vision</h3>
                  <p>
                    A future where government services are seamlessly digital, secure, and citizen-centric,
                    powered by intelligent data analytics and AI.
                  </p>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>

        <Timeline />

        <ScrollReveal>
          <div className="mt-16 text-center p-12 rounded-xl border border-dark-border bg-dark-secondary/30 max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Let's Work Together
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Interested in collaborating on innovative technology solutions? I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Get in Touch</Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline">
                  View My Work
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
