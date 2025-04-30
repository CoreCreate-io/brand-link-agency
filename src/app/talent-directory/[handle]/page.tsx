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
    <main className="container mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="-mx-4 -mt-4 md:-mx-8 relative max-w-screen overflow-hidden aspect-[4/5]">
          {influencerImageUrl && (
            <img
              src={influencerImageUrl}
              alt={influencer.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Stats and Info Section */}
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-2xl font-bold">@{influencer.handle}</h1>
          <div className="text-sm text-gray-400">
            {influencer.about && <PortableText value={influencer.about} />}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {influencer.instagramFollowers && (
              <div className="flex items-center gap-1 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
                <Instagram className="w-4 h-4" />
                {formatFollowers(influencer.instagramFollowers)}
              </div>
            )}
            {influencer.tiktokFollowers && (
              <div className="flex items-center gap-1 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
                <TikTokIcon className="w-4 h-4" />
                {formatFollowers(influencer.tiktokFollowers)}
              </div>
            )}
            {influencer.youtubeFollowers && (
              <div className="flex items-center gap-1 bg-black/60 dark:bg-white/10 text-white text-xs font-medium rounded-full px-3 py-1">
                <Youtube className="w-4 h-4" />
                {formatFollowers(influencer.youtubeFollowers)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Other Influencers Section */}
      <section className="mt-12 w-screen -mx-4 md:-mx-8 px-4 md:px-8 bg-secondary-dark">
        <h2 className="text-2xl font-bold mb-4 text-white">Other Influencers</h2>
        <ScrollArea className="w-full">
          <div className="flex w-max space-x-4 p-4">
            {otherInfluencers.map((other) => (
              <Link
                key={other._id}
                href={`/talent-directory/${other.slug || other.handle}`}
                className="shrink-0 w-55 bg-secondary-dark rounded-lg p-3 border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105"
              >
                <div className="relative w-full h-55 rounded-lg overflow-hidden bg-secondary-dark">
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
      </section>
    </main>
  );
}
