import Hero from '@/components/Hero'
import InfluencerGrid from '@/components/InfluencerGrid'
import LogoSlider from '@/components/LogoSlider'

export default function HomePage() {
  return (
    <main className="pt-20">
      <InfluencerGrid />
      <LogoSlider />
      <Hero />
    </main>
  )
}
