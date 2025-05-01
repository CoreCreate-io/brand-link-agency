import Hero from '@/components/Hero';
import InfluencerGrid from '@/components/InfluencerGrid';
import AutoplayLogoScroller from '@/components/AutoplayLogoScroller';

export default function HomePage() {
  return (
    <main className="pt-20">
      <InfluencerGrid />
      <AutoplayLogoScroller />
      <Hero />
    </main>
  );
}
