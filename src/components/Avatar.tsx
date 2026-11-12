import React from 'react';

interface AvatarProps {
  onBadgeClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ onBadgeClick }) => {
  return (
    <div className="relative inline-block select-none">
      {/* Increased container size: 24 (96px) to 28 (112px) */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-neutral-100 dark:bg-neutral-800 shadow-md transition-all hover:scale-105">
        {/* Solid black circular background so logo merges seamlessly with zero padding */}
        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-1 sm:p-2">
          {/* Logo scaled up to be bold and clearly visible */}
          <img
            src="/typixel.jpg"
            alt="Typixel"
            className="w-full h-auto object-contain scale-110"
          />
        </div>
      </div>

      {/* Floating Pill Badge: "Typixel ✌️" repositioned cleanly for the larger circle */}
      <div
        onClick={onBadgeClick}
        className="absolute -top-1.5 -right-10 sm:-right-12 transform rotate-[6deg] cursor-pointer hover:rotate-0 hover:scale-105 transition-all duration-200"
        title="Hi, I'm Typixel!"
      >
        <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-neutral-200/90 dark:border-neutral-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center gap-1 transition-colors">
          <span className="text-[11px] sm:text-xs font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight whitespace-nowrap">
            Typixel
          </span>
          <span className="text-[11px] sm:text-xs">✌️</span>
        </div>
      </div>
    </div>
  );
};