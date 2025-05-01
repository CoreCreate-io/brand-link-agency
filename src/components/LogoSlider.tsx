'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { homePageQuery } from '@/sanity/lib/queries';

type Logo = {
  url: string;
  alt?: string;
};

export default function LogoSlider() {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(homePageQuery);
      setLogos(data.homepageLogos || []);
    };
    fetchData();
  }, []);

  if (!logos.length) return null;

  const evenCount = logos.length % 2 === 0 ? logos.length : logos.length - 1;
  const topLogos = logos.slice(0, evenCount / 2);
  const bottomLogos = logos.slice(evenCount / 2, evenCount);
  if (logos.length % 2 === 1) {
    bottomLogos.push(logos[logos.length - 1]);
  }

  return (
    <div className="relative w-full bg-white dark:bg-black py-10">
      <div className="relative overflow-hidden w-full space-y-10">
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white dark:from-black to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white dark:from-black to-transparent" />

        <SliderTrack logos={topLogos} direction="left" />
        <SliderTrack logos={bottomLogos} direction="right" />
      </div>
    </div>
  );
}

function SliderTrack({
  logos,
  direction = 'left',
}: {
  logos: Logo[];
  direction: 'left' | 'right';
}) {
  const animationClass =
    direction === 'left' ? 'animate-marquee-left-start' : 'animate-marquee-right-start';

  return (
    <div className="relative w-full overflow-hidden h-[50px]">
      <div className={`marquee-inner ${animationClass}`}>
        <LogoRow logos={logos} />
        <LogoRow logos={logos} />
      </div>
    </div>
  );
}

function LogoRow({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex gap-6 sm:gap-10 min-w-max">
      {logos.map((logo, index) => (
        <div key={index} className="flex items-center justify-center">
          <Image
            src={logo.url}
            alt={logo.alt || `Logo ${index}`}
            width={120}
            height={60}
            priority
            className="object-contain h-[50px] dark:invert w-auto max-w-[120px]"
          />
        </div>
      ))}
    </div>
  );
}
