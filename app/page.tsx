import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import Timeline from '@/components/home/Timeline'
import Expertise from '@/components/home/Expertise'
import BentoFeaturedProjects from '@/components/home/BentoFeaturedProjects'
import RecentPosts from '@/components/home/RecentPosts'
import {
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/structured-data'
import { JsonLd } from '@/components/seo/JsonLd'

const personSchema = generatePersonSchema({
  name: 'Drefan Mardiawan',
  jobTitle: 'IT Expert & Consultant',
  url: 'https://dreflabs.com',
  image: 'https://dreflabs.com/images/optimized/Drefan.webp',
  description:
    'IT Expert with 17+ years of experience in Big Data, AI, Cyber Security, and E-Government Digital Transformation.',
  sameAs: [
    'https://www.linkedin.com/in/drefan-mardiawan',
    'https://github.com/drefanmardiawan',
  ],
})

const organizationSchema = generateOrganizationSchema({
  name: 'Dref Labs',
  url: 'https://dreflabs.com',
  logo: 'https://dreflabs.com/images/logo.png',
  description:
    'Technology consulting and implementation services specializing in Big Data, AI, Cyber Security, and E-Government solutions.',
  sameAs: ['https://www.linkedin.com/in/drefan-mardiawan'],
})

const websiteSchema = generateWebSiteSchema('https://dreflabs.com', 'Dref Labs')

import Marquee from '@/components/animations/Marquee'
import Stats from '@/components/home/Stats'

export default function Home() {
  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Hero />
      <Marquee items={['BIG DATA', 'AI & ML', 'CYBER SECURITY', 'E-GOVERNMENT', 'CLOUD COMPUTING', 'DIGITAL TRANSFORMATION']} speed={25} />
      <Stats />
      <About />
      <Timeline />
      <Expertise />
      <BentoFeaturedProjects />
      <RecentPosts />
    </>
  )
}
