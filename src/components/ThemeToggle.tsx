import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200/90 dark:border-neutral-700 shadow-2xs hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-90 transition-all duration-200 cursor-pointer select-none group ${className}`}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun icon for dark mode (clicking will switch to light) */}
      <Sun
        className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 transform ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      {/* Moon icon for light mode (clicking will switch to dark) */}
      <Moon
        className={`w-4 h-4 text-neutral-700 dark:text-neutral-300 absolute transition-all duration-300 transform ${
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
    </button>
  );
};
