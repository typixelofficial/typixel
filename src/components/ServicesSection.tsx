import React from 'react';
import { SERVICES_DATA, ServiceDetail } from '../data/portfolioData.ts';

interface ServicesSectionProps {
  onSelectService: (service: ServiceDetail) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-3 sm:px-6">
      {/* Centered Headline */}
      <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-neutral-800 leading-[1.22] tracking-[-0.02em]">
          Collaborate with brands and agencies<br />
          to create impactful results.
        </h2>
      </div>

      {/* Tilted Services Divider */}
      <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center my-10 sm:my-12">
        {/* Subtle horizontal hairline */}
        <div className="w-full border-t border-neutral-300/70" />

        {/* Floating tilted "Services" pill badge */}
        <div className="absolute top-1/2 -translate-y-1/2">
          <div className="bg-white/95 backdrop-blur-xs px-4 py-1 rounded-full border border-neutral-200/90 shadow-2xs transform -rotate-3 select-none">
            <span className="text-[11px] sm:text-xs font-medium text-neutral-700 tracking-tight">
              Services
            </span>
          </div>
        </div>
      </div>

      {/* 4 Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 max-w-4xl mx-auto pt-4">
        {SERVICES_DATA.map((service, idx) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className="group cursor-pointer rounded-2xl p-4 -m-4 hover:bg-white/60 transition-all duration-200 flex flex-col"
          >
            {/* Custom minimalist line icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 text-neutral-800 mb-4 flex items-center justify-start group-hover:scale-105 transition-transform duration-200">
              {idx === 0 && (
                /* UX & UI */
                <svg className="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="15" rx="2" />
                  <line x1="2" y1="8" x2="22" y2="8" />
                  <circle cx="5" cy="5.5" r="0.75" fill="currentColor" />
                  <circle cx="8" cy="5.5" r="0.75" fill="currentColor" />
                  <rect x="5" y="11" width="5" height="4" rx="0.5" />
                  <line x1="13" y1="11" x2="19" y2="11" />
                  <line x1="13" y1="14" x2="17" y2="14" />
                </svg>
              )}

              {idx === 1 && (
                /* Web & Mobile App */
                <svg className="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="8" height="14" rx="1.5" />
                  <circle cx="6" cy="16.5" r="0.6" fill="currentColor" />
                  <line x1="4.5" y1="7.5" x2="7.5" y2="7.5" />
                  <path d="M12 7H21C21.5523 7 22 7.44772 22 8V17C22 17.5523 21.5523 18 21 18H12" />
                  <line x1="15" y1="21" x2="19" y2="21" />
                  <line x1="17" y1="18" x2="17" y2="21" />
                </svg>
              )}

              {idx === 2 && (
                /* Creative Direction */
                <svg className="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                  <path d="M9 3v3" />
                  <circle cx="12" cy="10" r="1.5" />
                </svg>
              )}

              {idx === 3 && (
                /* Brand Identity */
                <svg className="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3.6 9h16.8" />
                  <path d="M3.6 15h16.8" />
                  <path d="M11.5 3a17 17 0 0 0 0 18" />
                  <path d="M12.5 3a17 17 0 0 1 0 18" />
                </svg>
              )}
            </div>

            {/* Service Title */}
            <h3 className="text-base sm:text-[17px] font-bold text-neutral-900 tracking-tight mb-2 group-hover:text-black">
              {service.title}
            </h3>

            {/* Service Tagline */}
            <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
              {service.tagline}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
