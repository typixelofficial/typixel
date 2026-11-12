import React, { useState, useRef, useEffect } from 'react';
import { SHOWCASE_ROW_1, SHOWCASE_ROW_2, ShowcaseItem } from '../data/showcaseData.ts';
import { ShowcaseArtwork } from './ShowcaseArtwork.tsx';

interface SlidingShowcaseProps {
  onInquire?: (projectTitle: string) => void;
  row1?: ShowcaseItem[];
  row2?: ShowcaseItem[];
  onOpenAdmin?: () => void;
}

// Helper to build seamless gapless track supporting unlimited items in a row with minimal memory overhead
const buildMarqueeTrack = (items: ShowcaseItem[]) => {
  if (!items || items.length === 0) return [];
  let base = [...items];
  // If very few items, repeat to reach at least 6 before doubling
  while (base.length < 6) {
    base = [...base, ...items];
  }
  // Exactly 2 sets for perfect CSS translateX(-50%) infinite marquee
  return [...base, ...base];
};

export const SlidingShowcase: React.FC<SlidingShowcaseProps> = ({
  row1 = SHOWCASE_ROW_1,
  row2 = SHOWCASE_ROW_2
}) => {
  // Support unlimited items in Row 1 & Row 2
  const row1Items = buildMarqueeTrack(row1);
  const row2Items = buildMarqueeTrack(row2);

  // Proportional smooth scroll speed: keeps scroll velocity consistent with unlimited items
  const row1Duration = `${Math.max(28, Math.max(row1.length, 6) * 5)}s`;
  const row2Duration = `${Math.max(28, Math.max(row2.length, 6) * 5)}s`;

  return (
    <section className="w-full my-6 sm:my-8 bg-white rounded-[32px] sm:rounded-[40px] pt-7 sm:pt-9 pb-10 sm:pb-12 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-300">
      {/* Section Header with Title and Auto-streaming Indicator */}
      <div className="px-6 sm:px-10 md:px-12 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Curated Showcase Stream</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-[-0.03em]">
            Motion Videos &amp; Creative Posters
          </h2>
          <p className="text-xs sm:text-[13px] text-neutral-500 mt-1 max-w-xl">
            Continuous live showcase stream with unlimited motion reels and creative brand designs.
          </p>
        </div>

        {/* Live Auto-Streaming Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs self-start sm:self-auto select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Auto-Streaming (Muted Videos)</span>
        </div>
      </div>

      {/* CONTINUOUS SLIDING SHOWCASE MARQUEE (Unlimited items in row) */}
      <div className="space-y-4 sm:space-y-5 select-none">
        {/* ROW 1: Slides Left */}
        {row1Items.length > 0 && (
          <div className="relative w-full overflow-hidden">
            {/* Soft edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
              className="marquee-track-left"
              style={{ animationDuration: row1Duration }}
            >
              {row1Items.map((item, index) => (
                <div
                  key={`${item.id}-r1-${index}`}
                  className="w-48 sm:w-56 h-64 sm:h-72 mx-2 sm:mx-2.5 rounded-[22px] overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-neutral-500 hover:scale-[1.02] transition-all duration-300 relative shrink-0 flex-none bg-neutral-900 select-none cursor-default"
                  title={item.title}
                >
                  <ShowcaseArtwork item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROW 2: Slides Right */}
        {row2Items.length > 0 && (
          <div className="relative w-full overflow-hidden">
            {/* Soft edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
              className="marquee-track-right"
              style={{ animationDuration: row2Duration }}
            >
              {row2Items.map((item, index) => (
                <div
                  key={`${item.id}-r2-${index}`}
                  className="w-48 sm:w-56 h-64 sm:h-72 mx-2 sm:mx-2.5 rounded-[22px] overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-neutral-500 hover:scale-[1.02] transition-all duration-300 relative shrink-0 flex-none bg-neutral-900 select-none cursor-default"
                  title={item.title}
                >
                  <ShowcaseArtwork item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
