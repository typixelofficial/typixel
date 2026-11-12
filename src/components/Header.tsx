import React, { useState } from 'react';
import { Check, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  email?: string;
  onOpenSocial?: (platform: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenBlog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  email = 'typixelofficial@gmail.com',
  onOpenSocial,
  onNavigateSection,
  onOpenBlog
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="w-full flex items-center justify-between gap-3 pt-1 sm:pt-2 px-1 sm:px-2 select-none flex-wrap">
      {/* Left zone: Email pill with embedded Copy button */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="bg-[#F3F2EE] hover:bg-[#EFECE6] border border-neutral-300/40 rounded-full px-3.5 py-1.5 flex items-center gap-2.5 transition-colors">
          <span className="text-[11px] sm:text-xs text-neutral-700 font-normal tracking-tight">
            {email}
          </span>
          <button
            onClick={handleCopy}
            type="button"
            className="bg-white hover:bg-neutral-100 text-neutral-800 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-neutral-200 shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              'Copy'
            )}
          </button>
        </div>
      </div>

      {/* Right zone: Navigation & Social links */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
        {/* SEO Blog Trigger on menu section */}
        <button
          onClick={onOpenBlog}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F3F2EE] hover:bg-[#EAE8E2] text-neutral-800 rounded-full text-xs font-semibold border border-neutral-300/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          title="Open SEO Blog"
        >
          <BookOpen className="w-3.5 h-3.5 text-neutral-700" />
          <span>SEO Blog</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-500 font-medium">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (onOpenSocial) {
                e.preventDefault();
                onOpenSocial('LinkedIn');
              }
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Linkedin
          </a>
          <span className="text-neutral-300 select-none">/</span>
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (onOpenSocial) {
                e.preventDefault();
                onOpenSocial('Dribbble');
              }
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Dribbble
          </a>
          <span className="text-neutral-300 select-none">/</span>
          <a
            href="https://instagram.com/typixelofficial"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (onOpenSocial) {
                e.preventDefault();
                onOpenSocial('Instagram');
              }
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Instagram
          </a>
        </div>
      </div>
    </header>
  );
};
