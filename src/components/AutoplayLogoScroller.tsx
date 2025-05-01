'use client';
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { homePageQuery } from '@/sanity/lib/queries';

type Logo = {
  url: string;
  alt?: string;
};

const AutoplayLogoScroller = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(homePageQuery);
      setLogos(data?.homepageLogos || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (logos.length === 0) return null;

  const midpoint = Math.ceil(logos.length / 2);
  const topRow = logos.slice(0, midpoint);
  const bottomRow = logos.slice(midpoint);

  const repeatLogos = (arr: Logo[], count = 3) =>
    Array(count).fill(arr).flat();

  const renderRow = (
    logos: Logo[],
    direction: 'left' | 'right',
    padding: 'top' | 'bottom' | null
  ) => {
    const repeated = repeatLogos(logos, 5); // extra for mobile smoothness
    const isRight = direction === 'right';
    const padded = isRight
      ? [...logos.slice(-3), ...repeated]
      : repeated;

    return (
      <div
        className="relative w-full overflow-hidden"
        style={{
          paddingTop: padding === 'top' ? '3rem' : undefined,
          paddingBottom: padding === 'bottom' ? '1rem' : undefined,
          '--bg-color': isDark ? '#000000' : '#ffffff',
        } as React.CSSProperties}
      >
        <div
          className={`flex whitespace-nowrap ${
            isRight ? 'animate-scroll-right' : 'animate-scroll-left'
          }`}
        >
          {padded.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-8 min-w-[160px] shrink-0"
            >
              <img
                src={logo.url}
                alt={logo.alt || `Logo ${index}`}
                className="logo-image"
                style={{
                  maxHeight: '48px',
                  maxWidth: '120px',
                  objectFit: 'contain',
                  filter: isDark ? 'invert(1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderRow(logos.slice(0, Math.ceil(logos.length / 2)), 'left', 'top')}
      {renderRow(logos.slice(Math.ceil(logos.length / 2)), 'right', 'bottom')}
    </div>
  );
};

export default AutoplayLogoScroller;
