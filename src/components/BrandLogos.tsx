import React from 'react';

interface BrandItem {
  id: string;
  name: string;
  src: string;
  sizeClass: string;
}

const BRAND_LOGOS: BrandItem[] = [
  // Wide horizontal lettermarks - amplified to be clear and prominent
  { id: '1', name: 'Akbar Trades', src: '/akbar.png', sizeClass: 'h-14 sm:h-16 max-w-[200px] scale-125' },
  { id: '2', name: 'Chamayam', src: '/Chamayam.png', sizeClass: 'h-14 sm:h-16 max-w-[200px] scale-125' },
  
  // Compact / vertical logos - sized up without overwhelming the row
  { id: '3', name: 'Classy Coat', src: '/classy coat.png', sizeClass: 'h-12 sm:h-14 max-w-[150px]' },
  { id: '4', name: 'Frost Dessert', src: '/Frost.png', sizeClass: 'h-12 sm:h-14 max-w-[150px]' },
  
  // Balanced horizontal logos
  { id: '5', name: 'Quick Resume', src: '/Quick_resume.png', sizeClass: 'h-13 sm:h-15 max-w-[180px] scale-110' },
  { id: '6', name: 'Skillovia', src: '/skilllovia.png', sizeClass: 'h-12 sm:h-14 max-w-[170px]' },
  { id: '7', name: 'Vistora Edu', src: '/Vistora.png', sizeClass: 'h-14 sm:h-16 max-w-[190px] scale-120' },
];

export const BrandLogos: React.FC = () => {
  // Duplicated for a seamless continuous marquee loop
  const marqueeItems = [...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <div className="w-full select-none bg-white py-6 sm:py-8">
      {/* Subtitle / Header Text */}
      <p className="text-center text-xs sm:text-sm font-semibold tracking-wider text-neutral-500 uppercase mb-6 sm:mb-8">
        Trust by 50+ international clients
      </p>

      {/* Marquee Wrapper with Edge Fade Gradients */}
      <div className="relative w-full overflow-hidden">
        {/* Soft gradient edge fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee track from your index.css */}
        <div className="marquee-track-left items-center space-x-12 sm:space-x-16 cursor-pointer">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              title={brand.name}
              className="group flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className={`${brand.sizeClass} w-auto object-contain transition-all duration-300 [filter:grayscale(100%)_brightness(0)] opacity-85 group-hover:[filter:none] group-hover:opacity-100`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};