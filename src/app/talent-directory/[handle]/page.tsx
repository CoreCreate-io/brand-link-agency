import * as React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { type SanityDocument } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Instagram, Youtube } from "lucide-react";
import { TikTokIcon } from "@/components/ui/TikTokIcon";

function formatFollowers(num: number | null | undefined) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num.toString();
}

const QUERY = groq`*[_type == "influencer" && handle == $handle][0]{
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

const OTHER_INFLUENCERS_QUERY = groq`*[_type == "influencer" && handle != $handle]
  | order(instagramFollowers desc)[0...10]{
    _id,
    name,
    handle,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    instagramFollowers
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null;

const options = { next: { revalidate: 30 } };

export default async function TalentProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params; // Await the params to resolve the Promise
  const influencer = await client.fetch<SanityDocument | null>(QUERY, { handle: resolvedParams.handle }, options);
  const otherInfluencers = await client.fetch<SanityDocument[]>(OTHER_INFLUENCERS_QUERY, { handle: resolvedParams.handle }, options);

  if (!influencer) {
    notFound();
  }

  const influencerImageUrl = influencer.imageUrl || null;

  return (
    <main className="container max-w-7xl mx-auto px-0 pt-0 md:px-6 md:pt-40">
      {/* Header Section */}
      <div className="relative border-0 border-b md:border md:rounded-2xl border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] overflow-hidden grid grid-cols-1 md:grid-cols-2">
  {/* Left: Image */}
  <div className="relative aspect-[4/5] md:aspect-auto md:h-full w-full">
    {influencerImageUrl && (
      <img
        src={influencerImageUrl}
        alt={influencer.name}
        className="w-full h-full object-cover"
      />
    )}
  </div>

  {/* Right: Bio & Stats */}
  <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-12 text-white">
  <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">@{influencer.handle}</h1>

  <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 mb-6">
      {influencer.about && <PortableText value={influencer.about} />}
    </div>

    <div className="flex flex-wrap gap-2">
      {influencer.instagramFollowers && (
        <div className="flex items-center gap-2 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
          <Instagram className="w-4 h-4" />
          {formatFollowers(influencer.instagramFollowers)}
        </div>
      )}
      {influencer.tiktokFollowers && (
        <div className="flex items-center gap-2 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
          <TikTokIcon className="w-4 h-4" />
          {formatFollowers(influencer.tiktokFollowers)}
        </div>
      )}
      {influencer.youtubeFollowers && (
        <div className="flex items-center gap-2 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
          <Youtube className="w-4 h-4" />
          {formatFollowers(influencer.youtubeFollowers)}
        </div>
      )}
    </div>
  </div>
</div>


      {/* Other Influencers Section */}
      <section className="mt-5 bg-secondary-dark py-10">
  <div className="max-w-7xl mx-auto px-0 md:px-0">
  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white pl-4">Other Influencers</h2>

    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
      {otherInfluencers.slice(0, 4).map((other) => (
        <Link
          key={other._id}
          href={`/talent-directory/${other.slug || other.handle}`}
          className="bg-secondary-dark rounded-lg border border-gray-700 p-3 hover:scale-[1.02] transition-transform"
        >
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-secondary-dark">
            <img
              src={other.imageUrl || ""}
              alt={other.name || "Influencer"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2 text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">@{other.handle || "unknown"}</p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Instagram className="w-4 h-4" />
              {formatFollowers(other.instagramFollowers)}
            </p>
          </div>
        </Link>
      ))}
    </div>

    {/* Mobile scroll layout */}
    <ScrollArea className="md:hidden w-full">
      <div className="flex space-x-4 pl-4 pr-4">
        {otherInfluencers.map((other) => (
          <Link
            key={other._id}
            href={`/talent-directory/${other.slug || other.handle}`}
            className="shrink-0 w-60 rounded-lg border border-gray-700 bg-secondary-dark p-3"
          >
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <img
                src={other.imageUrl || ""}
                alt={other.name || "Influencer"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 text-center">
            <p className="text-sm font-bold text-gray-900 dark:text-white">@{other.handle || "unknown"}</p>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Instagram className="w-4 h-4" />
                {formatFollowers(other.instagramFollowers)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</section>

    </main>
  );
}
