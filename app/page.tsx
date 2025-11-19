import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import Timeline from '@/components/home/Timeline'
import Expertise from '@/components/home/Expertise'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import RecentPosts from '@/components/home/RecentPosts'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <Expertise />
      <FeaturedProjects />
      <RecentPosts />
    </>
  )
}
