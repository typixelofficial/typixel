import React, { useRef, useEffect } from 'react';
import { Film } from 'lucide-react';
import { ShowcaseItem, normalizeShowcaseImagePath, isVideoMediaUrl } from '../data/showcaseData.ts';

interface ShowcaseArtworkProps {
  item: ShowcaseItem;
}

export const ShowcaseArtwork: React.FC<ShowcaseArtworkProps> = ({ item }) => {
  const isVideo = isVideoMediaUrl(item.videoUrl || item.imageUrl, item.mediaType);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const normalizedImg = normalizeShowcaseImagePath(item.imageUrl);
  const rawVideoUrl = item.videoUrl || (isVideo ? item.imageUrl : '');
  const videoSrc = normalizeShowcaseImagePath(rawVideoUrl);

  // Guarantee continuous muted playback across all browsers and devices
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry playback automatically
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }, 300);
        });
      }
    }
  }, [isVideo, videoSrc]);

  // Video Showcase Card: Continuous Muted Loop that Cannot Be Paused
  if (isVideo && videoSrc) {
    const posterSrc = item.imageUrl && !isVideoMediaUrl(item.imageUrl)
      ? normalizeShowcaseImagePath(item.imageUrl)
      : '';

    return (
      <div
        className="w-full h-full bg-neutral-950 text-white relative overflow-hidden select-none flex flex-col justify-end group/video"
        style={{ backgroundColor: item.accentColor ? `${item.accentColor}30` : '#0a0a0a' }}
      >
        {/* Instant Poster Background so card never shows black */}
        {posterSrc && (
          <img
            src={posterSrc}
            alt={item.title}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              const target = e.currentTarget;
              const filename = posterSrc.split('/').pop() || '';
              if (filename && !target.src.includes('raw.githubusercontent.com')) {
                target.src = `https://raw.githubusercontent.com/typixelofficial/typixel/main/showcase/showcase/${encodeURIComponent(filename)}`;
              }
            }}
          />
        )}

        {/* Real HTML5 Video Autoplay Muted Loop - faststart metadata for instant playback */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          onPause={(e) => {
            // Cannot be paused - immediately resumes playback
            e.currentTarget.play().catch(() => {});
          }}
          onEnded={(e) => {
            e.currentTarget.play().catch(() => {});
          }}
        />

        {/* Ambient bottom gradient for title readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

        {/* Bottom Title Bar */}
        <div className="relative z-10 p-3.5 pt-2">
          <div className="flex items-center gap-1.5 text-[9px] text-purple-300 font-medium mb-0.5">
            <Film className="w-2.5 h-2.5 text-purple-400" />
            <span>Motion Video Reel</span>
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
  if (normalizedImg && normalizedImg.trim().length > 0) {
    return (
      <div
        className="w-full h-full bg-neutral-900 text-white relative overflow-hidden select-none flex flex-col justify-end group"
        style={{ backgroundColor: item.accentColor ? `${item.accentColor}30` : '#171717' }}
      >
        <img
          src={normalizedImg}
          alt={item.title}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          onError={(e) => {
            const target = e.currentTarget;
            const filename = normalizedImg.split('/').pop() || '';
            if (filename) {
              if (target.src.includes('/showcase/')) {
                // Try root public directory
                target.src = `/${filename}`;
              } else if (!target.src.includes('raw.githubusercontent.com')) {
                // Fallback to raw GitHub repository asset
                target.src = `https://raw.githubusercontent.com/typixelofficial/typixel/main/showcase/showcase/${encodeURIComponent(filename)}`;
              }
            }
          }}
        />
        {/* Soft bottom gradient so title text is always legible without darkening top artwork */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

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
    <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black text-white p-4 flex flex-col justify-end select-none">
      <div>
        <h5 className="text-sm font-bold text-white leading-snug">{item.title}</h5>
        <p className="text-[11px] text-neutral-400 mt-1">{item.subtitle}</p>
      </div>
    </div>
  );
};
