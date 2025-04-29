import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { TalentProfile } from "@/components/TalentProfile";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { type SanityDocument } from "next-sanity";
import { notFound } from "next/navigation";

const QUERY = groq`*[
  _type == "influencer" && handle == $handle
][0]{
  _id,
  name,
  handle,
  about,
  description,
  "imageUrl": image.asset->url,
  instagramFollowers,
  tiktokFollowers,
  youtubeFollowers
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function TalentProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params; // Resolve the Promise
  const influencer = await client.fetch<SanityDocument | null>(
    QUERY,
    { handle: resolvedParams.handle },
    options
  );

  if (!influencer) {
    notFound();
  }

  const influencerImageUrl = influencer.imageUrl
    ? urlFor(influencer.imageUrl)?.width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <h1 className="text-4xl font-bold mb-8">{influencer.name}</h1>
      {influencerImageUrl && (
        <img
          src={influencerImageUrl}
          alt={influencer.name}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <p>{influencer.description}</p>
      <div className="flex gap-4">
        <p>Instagram Followers: {influencer.instagramFollowers}</p>
        <p>TikTok Followers: {influencer.tiktokFollowers}</p>
        <p>YouTube Followers: {influencer.youtubeFollowers}</p>
      </div>
    </main>
  );
}

export async function generateStaticParams(): Promise<{ handle: string }[]> {
  const handles = await client.fetch(
    groq`*[_type == "influencer" && defined(handle)].handle`
  );

  return handles.map((handle: string) => ({ handle }));
}
