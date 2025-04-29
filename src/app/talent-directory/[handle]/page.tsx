import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { TalentProfile } from "@/components/TalentProfile";
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

const options = { next: { revalidate: 30 } };

export default async function TalentProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  const influencer = await client.fetch<SanityDocument | null>(
    QUERY,
    { handle: params.handle },
    options
  );

  if (!influencer) {
    notFound();
  }

  return <TalentProfile influencer={influencer} />;
}

export async function generateStaticParams(): Promise<{ handle: string }[]> {
  const handles: { handle: string }[] = await client.fetch(
    groq`*[_type == "influencer" && defined(handle)]{ handle }`
  );

  return handles.map((h) => ({ handle: h.handle }));
}
