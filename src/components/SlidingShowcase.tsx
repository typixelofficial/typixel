import React, { useState, useRef, useEffect } from 'react';
import { SHOWCASE_ROW_1, SHOWCASE_ROW_2, ShowcaseItem } from '../data/showcaseData.ts';
import { ShowcaseArtwork } from './ShowcaseArtwork.tsx';

interface SlidingShowcaseProps {
  onInquire?: (projectTitle: string) => void;
  row1?: ShowcaseItem[];
  row2?: ShowcaseItem[];
  onOpenAdmin?: () => void;
}

export const SlidingShowcase: React.FC<SlidingShowcaseProps> = ({
  row1 = SHOWCASE_ROW_1,
  row2 = SHOWCASE_ROW_2
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Marquee duplicates for infinite seamless loop
  const row1Items = row1.length > 0 ? [...row1, ...row1] : [];
  const row2Items = row2.length > 0 ? [...row2, ...row2] : [];

  // Temporary pause on interaction, with automatic restart
  const handleInteractPause = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    // Auto-restart motion automatically after 2.5 seconds
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2500);
  };

  const handlePointerResume = () => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

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
            Auto-moving showcase. Point or hold any artwork to pause, automatically resumes on release.
          </p>
        </div>

        {/* Live Auto-Streaming Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs self-start sm:self-auto select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Auto-Streaming</span>
        </div>
      </div>

      {/* CONTINUOUS SLIDING SHOWCASE MARQUEE (Auto-starting infinite loop) */}
      <div
        className="space-y-4 sm:space-y-5 select-none"
        onMouseLeave={handlePointerResume}
      >
        {/* ROW 1: Slides Left (Auto-starts, pauses on hover/point, auto-resumes) */}
        {row1Items.length > 0 && (
          <div className="relative w-full overflow-hidden">
            {/* Soft edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
              className={`marquee-track-left ${isPaused ? 'is-paused' : ''}`}
              onPointerDown={handleInteractPause}
              onPointerUp={handlePointerResume}
              title="Point to pause motion"
            >
              {row1Items.map((item, index) => (
                <div
                  key={`${item.id}-r1-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInteractPause();
                  }}
                  className="w-48 sm:w-56 h-64 sm:h-72 mx-2 sm:mx-2.5 rounded-[22px] overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-neutral-500 hover:scale-[1.02] transition-all duration-300 relative shrink-0 flex-none bg-neutral-900 cursor-pointer"
                  title="Hover or point to pause"
                >
                  <ShowcaseArtwork item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROW 2: Slides Right (Auto-starts, pauses on hover/point, auto-resumes) */}
        {row2Items.length > 0 && (
          <div className="relative w-full overflow-hidden">
            {/* Soft edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
              className={`marquee-track-right ${isPaused ? 'is-paused' : ''}`}
              onPointerDown={handleInteractPause}
              onPointerUp={handlePointerResume}
              title="Point to pause motion"
            >
              {row2Items.map((item, index) => (
                <div
                  key={`${item.id}-r2-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInteractPause();
                  }}
                  className="w-48 sm:w-56 h-64 sm:h-72 mx-2 sm:mx-2.5 rounded-[22px] overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-neutral-500 hover:scale-[1.02] transition-all duration-300 relative shrink-0 flex-none bg-neutral-900 cursor-pointer"
                  title="Hover or point to pause"
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
