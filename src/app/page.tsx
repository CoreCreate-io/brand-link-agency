import Hero from '@/components/Hero'
import InfluencerGrid from '@/components/InfluencerGrid'

export default function HomePage() {
  return (
    <main className="pt-20">
      <InfluencerGrid />
      <Hero />
    </main>
  )
}
