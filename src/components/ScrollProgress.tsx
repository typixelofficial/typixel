import React, { useState, useEffect } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progressPercent = Math.min(100, Math.max(0, (currentScroll / scrollTotal) * 100));
      setProgress(progressPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] sm:h-[3px] bg-neutral-900/5 pointer-events-none"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-black transition-all duration-75 ease-out origin-left shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
