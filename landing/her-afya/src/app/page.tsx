import Features from '@/components/sections/Features'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import HowItWorks from '@/components/sections/HowItWorks'
import Download from '@/components/sections/Download'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import Team from '@/components/sections/Team'
import About from '@/components/sections/About'

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Team />
      <Testimonials />
      <FAQ />
      <Download />
    </main>
  )
}