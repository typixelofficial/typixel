import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Header } from './Header.tsx';
import { Avatar } from './Avatar.tsx';
import { BrandLogos } from './BrandLogos.tsx';

interface HeroCardProps {
  email?: string;
  onOpenShots: () => void;
  onOpenSocial?: (platform: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenBlog?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  email,
  onOpenShots,
  onOpenSocial,
  onNavigateSection,
  onOpenBlog
}) => {
  return (
    <div className="w-full bg-white rounded-[32px] sm:rounded-[40px] pt-5 sm:pt-7 pb-6 sm:pb-8 px-4 sm:px-8 md:px-12 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden flex flex-col justify-between transition-all duration-300">
      {/* Top Header */}
      <Header
        email={email}
        onOpenSocial={onOpenSocial}
        onNavigateSection={onNavigateSection}
        onOpenBlog={onOpenBlog}
      />

      {/* Hero Center Content */}
      <div className="flex flex-col items-center text-center pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 md:pb-20 max-w-2xl mx-auto w-full">
        {/* Avatar with floating tilted name badge */}
        <Avatar />

        {/* Main Headline */}
        <h1 className="mt-7 sm:mt-8 text-3xl sm:text-4xl md:text-[44px] font-bold text-neutral-800 leading-[1.16] tracking-[-0.03em] max-w-xl">
          Building digital<br />
          products, brands, and<br />
          experience.
        </h1>

        {/* Action Buttons: Latest Shots & Autoplay Motion Videos */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={onOpenShots}
            type="button"
            className="group inline-flex items-center gap-1.5 bg-[#171717] hover:bg-neutral-900 active:scale-98 text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-tight shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>Latest Shots &amp; Studies</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('showcase-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            type="button"
            className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 px-4 py-2.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>🎬 Motion Videos (Autoplay Muted)</span>
          </button>
        </div>
      </div>

      {/* Sculpted Bottom Shelf for Brand Logos */}
      <div className="w-full pt-4 pb-2 border-t border-neutral-100/90 relative">
        <BrandLogos />
      </div>
    </div>
  );
};
