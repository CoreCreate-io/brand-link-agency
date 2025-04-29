import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { TalentProfile } from '@/components/TalentProfile';

interface PageProps {
  params: { handle: string }; // Explicitly define the type of params
}

export default async function TalentProfilePage({ params }: PageProps) {
  const { handle } = params;

  const influencer = await client.fetch(
    groq`*[_type == "influencer" && handle == $handle][0]{
      name,
      handle,
      about,
      description,
      "imageUrl": image.asset->url,
      instagramFollowers,
      tiktokFollowers,
      youtubeFollowers
    }`,
    { handle }
  );

  if (!influencer || !influencer.handle) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        Influencer not found.
      </div>
    );
  }

  return <TalentProfile influencer={influencer} />;
}

export async function generateStaticParams() {
  const handles = await client.fetch(
    groq`*[_type == "influencer"].handle`
  );

  return handles
    .filter((handle: string) => !!handle) // Ensure no null or undefined handles
    .map((handle: string) => ({ handle }));
}