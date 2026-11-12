import React, { useState, useEffect } from 'react';

interface WhatsAppFloatingProps {
  whatsappNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({
  whatsappNumber = '919072891142',
  defaultMessage = "Hi Typixel! I saw your portfolio and would love to connect."
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear once user scrolls down past the initial hero view (~250px)
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(defaultMessage);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className={`fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_8px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.5)] border border-white/30 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer group ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* WhatsApp SVG Brand Icon */}
      <svg
        className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current text-white group-hover:scale-110 transition-transform duration-200"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>

      {/* Floating subtle tooltip matching ScrollToTop */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-neutral-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
        WhatsApp
      </span>
    </button>
  );
};
