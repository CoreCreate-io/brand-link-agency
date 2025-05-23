import Hero from '@/components/Hero';
import InfluencerGrid from '@/components/InfluencerGrid';
import SellingPoints from '@/components/SellingPoints';
import AutoplayLogoScroller from '@/components/AutoplayLogoScroller';
import { client } from '@/sanity/lib/client';
import { homePageQuery } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import AutoplayImageScroller from '@/components/AutoplayImageScroller';

const options = { next: { revalidate: 30 } };

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(homePageQuery, {}, options);

  return {
    title: page?.seo?.metaTitle || 'Brand Link - Built to Link, Made to Move',
    description: page?.seo?.metaDescription || 'Welcome to Brand Link, where we connect brands with influencers to create impactful partnerships.',
    openGraph: {
      title: page?.seo?.metaTitle || 'Brand Link - Built to Link, Made to Move',
      description: page?.seo?.metaDescription,
      images: page?.seo?.shareImage ? [
        {
          url: page.seo.shareImage,
          width: 1200,
          height: 630,
          alt: page?.title || 'Brand Link'
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: page?.seo?.metaTitle || 'Brand Link - Built to Link, Made to Move',
      description: page?.seo?.metaDescription,
      images: page?.seo?.shareImage ? [page.seo.shareImage] : [],
    },
    keywords: page?.seo?.keywords || ['brand link', 'influencer marketing', 'brand partnerships'],
  }
}

export default async function HomePage() {
  // Fetch the homepage data to use for all components
  const homepageData = await client.fetch(homePageQuery, {}, options);
  
  // Debug what's coming back for troubleshooting
  console.log('Homepage data in server component:', {
    statsTitle: homepageData?.statsTitle,
    sellingPointsCount: homepageData?.sellingPoints?.length,
    imageScrollerEnabled: homepageData?.showImageScroller,
    hasTopRowImages: (homepageData?.topRowImages?.length || 0) > 0
  });

  return (
    <main className="pt-20">
      <InfluencerGrid />
      <AutoplayLogoScroller />
      <Hero />
      
      {/* Pass the selling points data to the component */}
      <SellingPoints 
        stats={homepageData?.sellingPoints || []} 
        title={homepageData?.statsTitle} 
      />
      
      {/* Only render the image scroller if enabled and has images */}
      {homepageData?.showImageScroller && homepageData?.topRowImages?.length >= 8 && (
        <AutoplayImageScroller />
      )}
    </main>
  );
}
