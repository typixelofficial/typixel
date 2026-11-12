import React from 'react';

interface BrandItem {
  id: string;
  name: string;
  src: string;
  sizeClass: string;
}

const BRAND_LOGOS: BrandItem[] = [
  // 1. Akbar Trades (Horizontal Lettermark)
  { id: '1', name: 'Akbar Trades', src: '/logos/akbar.png', sizeClass: 'h-14 sm:h-16 max-w-[200px] scale-125' },

  // 2. Chamayam (Traditional Heritage Lettermark)
  { id: '2', name: 'Chamayam', src: '/logos/Chamayam.png', sizeClass: 'h-14 sm:h-16 max-w-[200px] scale-125' },

  // 3. Classy Coat (Architectural Texture Brand)
  { id: '3', name: 'Classy Coat', src: '/logos/classy coat.png', sizeClass: 'h-12 sm:h-14 max-w-[150px]' },

  // 4. Frost Dessert (Gourmet Confectionery Badge)
  { id: '4', name: 'Frost Dessert', src: '/logos/Frost.png', sizeClass: 'h-12 sm:h-14 max-w-[150px]' },

  // 5. Quick Resume (Digital Product Platform)
  { id: '5', name: 'Quick Resume', src: '/logos/Quick_resume.png', sizeClass: 'h-13 sm:h-15 max-w-[180px] scale-110' },

  // 6. Skillovia (EdTech Geometric Mark)
  { id: '6', name: 'Skillovia', src: '/logos/skilllovia.png', sizeClass: 'h-12 sm:h-14 max-w-[170px]' },

  // 7. Vistora Edu (Educational Brand Logotype)
  { id: '7', name: 'Vistora Edu', src: '/logos/Vistora.png', sizeClass: 'h-14 sm:h-16 max-w-[190px] scale-120' },
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
                onError={(e) => {
                  const target = e.currentTarget;
                  const filename = brand.src.split('/').pop();
                  if (filename && !target.src.includes('raw.githubusercontent.com')) {
                    target.src = `https://raw.githubusercontent.com/typixelofficial/typixel/main/logos/${encodeURIComponent(filename)}`;
                  }
                }}
                className={`${brand.sizeClass} w-auto object-contain transition-all duration-300 [filter:grayscale(100%)_brightness(0)] opacity-85 group-hover:[filter:none] group-hover:opacity-100`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};