import React, { useRef, useEffect } from 'react';
import { Play, Sparkles, Film, VolumeX } from 'lucide-react';
import { ShowcaseItem } from '../data/showcaseData.ts';

interface ShowcaseArtworkProps {
  item: ShowcaseItem;
}

export const ShowcaseArtwork: React.FC<ShowcaseArtworkProps> = ({ item }) => {
  const isVideo = item.mediaType === 'video' || (Boolean(item.videoUrl) && item.videoUrl!.endsWith('.mp4'));
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure autoplay muted starts reliably across all mobile & desktop browsers
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser suspended playback
        });
      }
    }
  }, [isVideo, item.videoUrl]);

  // Video Showcase Card Preview: Real-time Autoplay Muted Loop
  if (isVideo && item.videoUrl) {
    return (
      <div className="w-full h-full bg-neutral-950 text-white relative overflow-hidden select-none flex flex-col justify-between group/video">
        {/* Real HTML5 Video Autoplay Muted Loop */}
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.imageUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Ambient Video Vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/45 pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-wider text-purple-200 bg-purple-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-purple-500/30 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Video Reel</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-neutral-300 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/15" title="Autoplay Muted">
              <VolumeX className="w-2.5 h-2.5 text-neutral-300" />
            </span>
            {item.duration && (
              <span className="text-[9px] font-mono font-bold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20">
                {item.duration}
              </span>
            )}
          </div>
        </div>

        {/* Subtle center play indicator that gently appears on hover */}
        <div className="relative z-10 flex items-center justify-center my-auto pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl">
            <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Title Bar */}
        <div className="relative z-10 p-3.5 pt-2">
          <div className="flex items-center gap-1.5 text-[9px] text-purple-300 font-medium mb-0.5">
            <Film className="w-2.5 h-2.5 text-purple-400" />
            <span>Motion Video Edit</span>
          </div>
          <h5 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-sm">
            {item.title}
          </h5>
          <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
            {item.subtitle || item.client}
          </p>
        </div>
      </div>
    );
  }

  // General Image / Poster Card Preview
  if (item.imageUrl && item.imageUrl.trim().length > 0) {
    return (
      <div className="w-full h-full bg-neutral-900 text-white relative overflow-hidden select-none flex flex-col justify-between">
        <img
          src={item.imageUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
        {/* Soft dark vignette so text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/45 pointer-events-none" />

        {/* Top badge */}
        <div className="relative z-10 p-3.5 flex items-center justify-between">
          <span className="text-[9px] uppercase font-mono tracking-wider text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
            {item.category}
          </span>
          {item.badge && (
            <span className="text-[8px] font-mono text-white/80 bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded">
              {item.badge}
            </span>
          )}
        </div>

        {/* Bottom Title bar */}
        <div className="relative z-10 p-3.5 pt-2">
          <h5 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-sm">
            {item.title}
          </h5>
          <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
            {item.subtitle || item.client}
          </p>
        </div>
      </div>
    );
  }

  // Fallback typography card
  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black text-white p-4 flex flex-col justify-between select-none">
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
          {item.category}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
      </div>
      <div>
        <h5 className="text-sm font-bold text-white leading-snug">{item.title}</h5>
        <p className="text-[11px] text-neutral-400 mt-1">{item.subtitle}</p>
      </div>
    </div>
  );
};
