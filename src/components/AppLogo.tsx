import React from 'react';

interface AppLogoProps {
  name: string;
  badge?: string;
  iconUrl?: string; // Custom PNG, SVG, or image link
  size?: number; // default 44
  className?: string;
  monochrome?: boolean; // default false for authentic full-color brand logos
}

export const AppLogo: React.FC<AppLogoProps> = ({
  name,
  badge = '',
  iconUrl = '',
  size = 44,
  className = '',
  monochrome = false
}) => {
  // If custom icon PNG or image link is provided, render it directly
  if (iconUrl && iconUrl.trim().length > 0) {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform bg-white/95 p-1.5 border border-neutral-200 shadow-2xs ${className}`}
        style={{
          width: size,
          height: size
        }}
        title={name}
      >
        <img
          src={iconUrl}
          alt={name}
          className="w-full h-full object-contain select-none"
          loading="lazy"
        />
      </div>
    );
  }

  const normalized = name.toLowerCase().trim();

  // 1. Adobe Photoshop
  if (normalized.includes('photoshop') || badge === 'Ps') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#001E36',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #31A8FF'
        }}
        title="Adobe Photoshop"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill={monochrome ? '#171717' : '#31A8FF'}
            letterSpacing="-0.5px"
          >
            Ps
          </text>
        </svg>
      </div>
    );
  }

  // 2. Adobe Illustrator
  if (normalized.includes('illustrator') || badge === 'Ai') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#330000',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #FF9A00'
        }}
        title="Adobe Illustrator"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill={monochrome ? '#171717' : '#FF9A00'}
            letterSpacing="-0.5px"
          >
            Ai
          </text>
        </svg>
      </div>
    );
  }

  // 3. Adobe InDesign
  if (normalized.includes('indesign') || badge === 'Id') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#49021F',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #FF3366'
        }}
        title="Adobe InDesign"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill={monochrome ? '#171717' : '#FF3366'}
            letterSpacing="-0.5px"
          >
            Id
          </text>
        </svg>
      </div>
    );
  }

  // 4. Adobe Premiere Pro
  if (normalized.includes('premiere') || badge === 'Pr') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#00005B',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #EA77FF'
        }}
        title="Adobe Premiere Pro"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill={monochrome ? '#171717' : '#EA77FF'}
            letterSpacing="-0.5px"
          >
            Pr
          </text>
        </svg>
      </div>
    );
  }

  // 5. Adobe After Effects
  if (normalized.includes('after effects') || normalized.includes('affter') || badge === 'Ae') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#00005B',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #9999FF'
        }}
        title="Adobe After Effects"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill={monochrome ? '#171717' : '#9999FF'}
            letterSpacing="-0.5px"
          >
            Ae
          </text>
        </svg>
      </div>
    );
  }

  // 6. DaVinci Resolve
  if (normalized.includes('davinci') || normalized.includes('resolve') || badge === 'Dv') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1.5 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: 'transparent'
        }}
        title="DaVinci Resolve"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {monochrome ? (
            <>
              {/* Uncoloured Monochrome Pinwheel */}
              <path
                d="M50 20C50 20 62 35 62 48C62 55 57 60 50 60C43 60 38 55 38 48C38 35 50 20 50 20Z"
                fill="#171717"
              />
              <path
                d="M24 65C24 65 41 62 50 51C55 45 61 47 64 53C67 59 64 66 57 70C43 78 24 65 24 65Z"
                fill="#555555"
              />
              <path
                d="M76 65C76 65 59 62 50 51C45 45 39 47 36 53C33 59 36 66 43 70C57 78 76 65 76 65Z"
                fill="#888888"
              />
              <circle cx="50" cy="52" r="6" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <path
                d="M50 20C50 20 62 35 62 48C62 55 57 60 50 60C43 60 38 55 38 48C38 35 50 20 50 20Z"
                fill="#E04E39"
              />
              <path
                d="M24 65C24 65 41 62 50 51C55 45 61 47 64 53C67 59 64 66 57 70C43 78 24 65 24 65Z"
                fill="#F39C12"
              />
              <path
                d="M76 65C76 65 59 62 50 51C45 45 39 47 36 53C33 59 36 66 43 70C57 78 76 65 76 65Z"
                fill="#00A3E0"
              />
              <circle cx="50" cy="52" r="6" fill="#FFFFFF" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // 7. Canva
  if (normalized.includes('canva') || badge === 'Cv') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1.5 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : undefined,
          background: monochrome ? undefined : 'linear-gradient(135deg, #00C4CC 0%, #7D2AE8 100%)',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #00C4CC'
        }}
        title="Canva"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="60%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="'Brush Script MT', 'Lucida Calligraphy', cursive, sans-serif"
            fontSize="48"
            fontWeight="bold"
            fontStyle="italic"
            fill={monochrome ? '#171717' : '#FFFFFF'}
          >
            C
          </text>
        </svg>
      </div>
    );
  }

  // 8. CapCut
  if (normalized.includes('capcut') || badge === 'Cc') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1.5 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: 'transparent'
        }}
        title="CapCut"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* CapCut dual ribbon bowtie */}
          <path
            d="M20 30L50 48L20 66L34 50L20 30Z"
            fill="#171717"
          />
          <path
            d="M80 30L50 48L80 66L66 50L80 30Z"
            fill={monochrome ? '#171717' : '#00E5FF'}
          />
          <circle cx="50" cy="48" r="5" fill={monochrome ? '#171717' : '#FFFFFF'} />
        </svg>
      </div>
    );
  }

  // 9. HTML
  if (normalized.includes('html') || badge === 'HTML') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: 'transparent'
        }}
        title="HTML5"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {monochrome ? (
            <>
              {/* Uncoloured Black and White HTML Shield */}
              <polygon points="18,12 82,12 76,82 50,90 24,82" fill="#171717" />
              <polygon points="50,18 76,18 71,76 50,83" fill="#383838" />
              <polygon points="50,32 34,32 35,46 50,46" fill="#CCCCCC" />
              <polygon points="50,60 41,57 40,51 30,51 32,66 50,71" fill="#CCCCCC" />
              <polygon points="50,32 66,32 65,46 50,46" fill="#FFFFFF" />
              <polygon points="50,60 59,57 60,51 70,51 68,66 50,71" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <polygon points="18,12 82,12 76,82 50,90 24,82" fill="#E44D26" />
              <polygon points="50,18 76,18 71,76 50,83" fill="#F16529" />
              <polygon points="50,32 34,32 35,46 50,46" fill="#EBEBEB" />
              <polygon points="50,60 41,57 40,51 30,51 32,66 50,71" fill="#EBEBEB" />
              <polygon points="50,32 66,32 65,46 50,46" fill="#FFFFFF" />
              <polygon points="50,60 59,57 60,51 70,51 68,66 50,71" fill="#FFFFFF" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // 10. CSS
  if (normalized.includes('css') || badge === 'CSS') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: 'transparent'
        }}
        title="CSS3"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {monochrome ? (
            <>
              {/* Uncoloured Black and White CSS Shield */}
              <polygon points="18,12 82,12 76,82 50,90 24,82" fill="#171717" />
              <polygon points="50,18 76,18 71,76 50,83" fill="#383838" />
              <polygon points="50,32 34,32 35,46 50,46" fill="#CCCCCC" />
              <polygon points="50,60 41,57 40,51 30,51 32,66 50,71" fill="#CCCCCC" />
              <polygon points="50,32 66,32 65,46 50,46" fill="#FFFFFF" />
              <polygon points="50,60 59,57 60,51 70,51 68,66 50,71" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <polygon points="18,12 82,12 76,82 50,90 24,82" fill="#1572B6" />
              <polygon points="50,18 76,18 71,76 50,83" fill="#33A9DC" />
              <polygon points="50,32 34,32 35,46 50,46" fill="#EBEBEB" />
              <polygon points="50,60 41,57 40,51 30,51 32,66 50,71" fill="#EBEBEB" />
              <polygon points="50,32 66,32 65,46 50,46" fill="#FFFFFF" />
              <polygon points="50,60 59,57 60,51 70,51 68,66 50,71" fill="#FFFFFF" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // 11. JavaScript
  if (normalized.includes('javascript') || normalized === 'js' || badge === 'JS') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#F7DF1E',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #D6BC00'
        }}
        title="JavaScript"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="52%"
            y="56%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="38"
            fontWeight="900"
            fill="#171717"
            letterSpacing="-1.5px"
          >
            JS
          </text>
        </svg>
      </div>
    );
  }

  // 12. Figma
  if (normalized.includes('figma') || badge === 'Fg') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1.5 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: 'transparent'
        }}
        title="Figma"
      >
        <svg viewBox="0 0 100 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {monochrome ? (
            <>
              {/* Monochromatic Black & Greyscale Figma logo matching screenshot */}
              <path d="M0 25C0 11.1929 11.1929 0 25 0H50V50H25C11.1929 50 0 38.8071 0 25Z" fill="#171717" />
              <path d="M50 0H75C88.8071 0 100 11.1929 100 25C100 38.8071 88.8071 50 75 50H50V0Z" fill="#404040" />
              <path d="M0 75C0 61.1929 11.1929 50 25 50H50V100H25C11.1929 100 0 88.8071 0 75Z" fill="#666666" />
              <path d="M50 50H75C88.8071 50 100 61.1929 100 75C100 88.8071 88.8071 100 75 100C61.1929 100 50 88.8071 50 75V50Z" fill="#8C8C8C" />
              <path d="M0 125C0 111.193 11.1929 100 25 100H50V125C50 138.807 38.8071 150 25 150C11.1929 150 0 138.807 0 125Z" fill="#262626" />
            </>
          ) : (
            <>
              <path d="M0 25C0 11.1929 11.1929 0 25 0H50V50H25C11.1929 50 0 38.8071 0 25Z" fill="#F24E1E" />
              <path d="M50 0H75C88.8071 0 100 11.1929 100 25C100 38.8071 88.8071 50 75 50H50V0Z" fill="#FF7262" />
              <path d="M0 75C0 61.1929 11.1929 50 25 50H50V100H25C11.1929 100 0 88.8071 0 75Z" fill="#A259FF" />
              <path d="M50 50H75C88.8071 50 100 61.1929 100 75C100 88.8071 88.8071 100 75 100C61.1929 100 50 88.8071 50 75V50Z" fill="#1ABCFE" />
              <path d="M0 125C0 111.193 11.1929 100 25 100H50V125C50 138.807 38.8071 150 25 150C11.1929 150 0 138.807 0 125Z" fill="#0ACF83" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // 13. Blender
  if (normalized.includes('blender') || badge === 'BL') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1.5 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: 'transparent'
        }}
        title="Blender"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="56" r="22" fill={monochrome ? '#171717' : '#EA7600'} />
          <circle cx="50" cy="56" r="12" fill={monochrome ? '#666666' : '#225797'} />
          <path d="M50 22L44 38H56L50 22Z" fill={monochrome ? '#171717' : '#EA7600'} />
          <path d="M26 36L40 46L36 34L26 36Z" fill={monochrome ? '#171717' : '#EA7600'} />
          <path d="M74 36L64 34L60 46L74 36Z" fill={monochrome ? '#171717' : '#EA7600'} />
        </svg>
      </div>
    );
  }

  // 14. Cinema 4D
  if (normalized.includes('cinema') || normalized.includes('c4d') || badge === 'C4D') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform p-1 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#051636',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #0050D8'
        }}
        title="Cinema 4D"
      >
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="14"
            fontWeight="900"
            fill={monochrome ? '#171717' : '#3FA9F5'}
            letterSpacing="-0.5px"
          >
            C4D
          </text>
        </svg>
      </div>
    );
  }

  // 15. Adobe XD
  if (normalized.includes('xd') || badge === 'Xd') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#470137',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #FF61F6'
        }}
        title="Adobe XD"
      >
        <svg viewBox="0 0 40 40" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill={monochrome ? '#171717' : '#FF61F6'}
            letterSpacing="-0.5px"
          >
            Xd
          </text>
        </svg>
      </div>
    );
  }

  // 16. Adobe Lightroom
  if (normalized.includes('lightroom') || badge === 'Lr') {
    return (
      <div
        className={`rounded-xl overflow-hidden flex items-center justify-center transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: monochrome ? '#FFFFFF' : '#001E36',
          border: monochrome ? '1.5px solid #171717' : '1.5px solid #31A8FF'
        }}
        title="Adobe Lightroom"
      >
        <svg viewBox="0 0 40 40" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill={monochrome ? '#171717' : '#31A8FF'}
            letterSpacing="-0.5px"
          >
            Lr
          </text>
        </svg>
      </div>
    );
  }

  // Fallback generic badge
  return (
    <div
      className={`rounded-xl overflow-hidden flex items-center justify-center font-bold text-xs tracking-tight transition-transform ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: monochrome ? '#FFFFFF' : '#1E1E1E',
        color: monochrome ? '#171717' : '#FFFFFF',
        border: '1.5px solid #171717'
      }}
      title={name}
    >
      <span>{badge || name.slice(0, 2).toUpperCase()}</span>
    </div>
  );
};
