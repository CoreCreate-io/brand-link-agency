'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
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

  return (
    <div className="relative overflow-hidden w-full py-10 bg-white dark:bg-black">
      {/* Edge gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />

      {/* Conveyor animation */}
      <SliderTrack logos={logos} />
    </div>
  );
}

function SliderTrack({ logos }: { logos: Logo[] }) {
  const x = useMotionValue(0);
  const baseSpeed = 50; // pixels per second

  const containerRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((t, delta) => {
    const moveBy = (baseSpeed * delta) / 1000;
    const width = containerRef.current?.offsetWidth ?? 0;
    const currentX = x.get();

    if (currentX <= -width / 2) {
      x.set(0); // reset without flicker
    } else {
      x.set(currentX - moveBy);
    }
  });

  return (
    <motion.div
      ref={containerRef}
      className="flex w-max"
      style={{ x }}
    >
      <LogoRow logos={logos} />
      <LogoRow logos={logos} />
    </motion.div>
  );
}

function LogoRow({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex w-full">
      {logos.map((logo, index) => (
        <div
          key={index}
          className="flex-1 flex items-center justify-center px-6"
        >
          <Image
            src={logo.url}
            alt={logo.alt || `Logo ${index}`}
            width={120}
            height={60}
            className="object-contain h-[50px] dark:invert"
          />
        </div>
      ))}
    </div>
  );
}
