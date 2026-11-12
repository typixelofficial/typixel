import React from 'react';
import { ExperiencedTool } from '../data/toolsData.ts';
import { AppLogo } from './AppLogo.tsx';

interface ExperiencedAppsSectionProps {
  tools: ExperiencedTool[];
}

export const ExperiencedAppsSection: React.FC<ExperiencedAppsSectionProps> = ({
  tools
}) => {
  // Multiply tools to create a continuous, seamless -50% marquee loop
  const displayTools = [...tools, ...tools, ...tools, ...tools];

  return (
    <section className="w-full my-6 sm:my-8 bg-white rounded-[32px] sm:rounded-[40px] pt-6 sm:pt-7 pb-6 sm:pb-8 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-300">
      {/* Section label matching image.png */}
      <div className="px-6 sm:px-10 mb-5 sm:mb-6">
        <span className="inline-block bg-[#171717] text-white font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded tracking-wider uppercase select-none shadow-2xs">
          EXPERIENCED TOOLS &amp; SOFTWARE
        </span>
      </div>

      {/* Moving Marquee of App Logos (Moving like company logos, authentic vivid brand colors) */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge gradient fades for smooth infinite entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track-tools items-center py-2">
          {displayTools.map((tool, index) => (
            <div
              key={`${tool.id}-${index}`}
              className="mx-3 sm:mx-5 shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-115 cursor-pointer relative group/item select-none"
              title={tool.name}
            >
              <AppLogo
                name={tool.name}
                badge={tool.badge}
                iconUrl={tool.iconUrl}
                size={54}
                monochrome={false}
                className="shadow-sm group-hover/item:shadow-lg transition-all duration-200"
              />

              {/* Minimal floating tooltip on hover showing only the app name */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-neutral-900 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-md z-20">
                {tool.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
