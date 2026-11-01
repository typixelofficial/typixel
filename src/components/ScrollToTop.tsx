import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button only when user scrolls down past the hero section (~450px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#171717] hover:bg-black text-white shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer group ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 text-neutral-200 group-hover:text-white group-hover:-translate-y-0.5 transition-transform duration-200" />
      
      {/* Floating subtle tooltip */}
      <span className="absolute -top-8 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-neutral-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
        Top
      </span>
    </button>
  );
};
