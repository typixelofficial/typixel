import { useState, useEffect } from 'react';
import { HeroCard } from './components/HeroCard.tsx';
import { StatsSection } from './components/StatsSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { SlidingShowcase } from './components/SlidingShowcase.tsx';
import { ExperiencedAppsSection } from './components/ExperiencedAppsSection.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { ContactCard } from './components/ContactCard.tsx';
import { ShotsModal } from './components/ShotsModal.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { ServiceDetailModal } from './components/ServiceDetailModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { ScrollToTop } from './components/ScrollToTop.tsx';
import { WhatsAppFloating } from './components/WhatsAppFloating.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { ServiceDetail } from './data/portfolioData.ts';
import {
  ShowcaseItem,
  getStoredProjectsRow1,
  getStoredProjectsRow2
} from './data/showcaseData.ts';
import {
  ContactConfig,
  getStoredContactConfig
} from './data/contactConfig.ts';
import {
  ExperiencedTool,
  getStoredTools
} from './data/toolsData.ts';
import {
  BlogPost,
  getStoredBlogPosts
} from './data/blogData.ts';

const SectionDivider: React.FC = () => (
  <div className="w-full flex items-center justify-center px-4 sm:px-8 py-0.5" aria-hidden="true">
    <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent shadow-[0_1px_0_rgba(255,255,255,0.7)]" />
  </div>
);

export default function App() {
  const [isShotsOpen, setIsShotsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [inquiryTopic, setInquiryTopic] = useState('');
  const [isBlogOpen, setIsBlogOpen] = useState(false);

  // Dynamic projects state persisted across reloads
  const [row1Projects, setRow1Projects] = useState<ShowcaseItem[]>(() => getStoredProjectsRow1());
  const [row2Projects, setRow2Projects] = useState<ShowcaseItem[]>(() => getStoredProjectsRow2());

  // Dynamic contact configuration (email & whatsapp number)
  const [contactConfig, setContactConfig] = useState<ContactConfig>(() => getStoredContactConfig());

  // Experienced Tools state (Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, DaVinci, Canva, CapCut, HTML, CSS, JS, Figma)
  const [tools, setTools] = useState<ExperiencedTool[]>(() => getStoredTools());

  // Blog Posts state (with high reachable trending SEO keywords)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());

  // Listen for hidden keyboard shortcuts (Alt+A or Shift+A) and URL hash (#admin or ?admin=true or #blog)
  useEffect(() => {
    // Ensure document root doesn't have dark class
    document.documentElement.classList.remove('dark');

    const checkHashOrQuery = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      const isAdminRoute =
        hash === '#admincontrol' ||
        hash === '#admin' ||
        path.includes('/admincontrol') ||
        params.get('admincontrol') === 'true' ||
        params.get('admin') === 'true';

      setIsAdminOpen(isAdminRoute);

      const isBlogRoute =
        hash.startsWith('#blog') ||
        path.includes('/blog') ||
        params.get('blog') === 'true';

      setIsBlogOpen(isBlogRoute);
    };
    checkHashOrQuery();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => {
          const next = !prev;
          if (next) {
            window.location.hash = 'admincontrol';
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHashOrQuery);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHashOrQuery);
    };
  }, []);

  const handleOpenInquiry = (topic: string) => {
    setInquiryTopic(topic);
    setIsContactOpen(true);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Hi Typixel! I saw your portfolio and would love to discuss a project with you."
    );
    window.open(`https://wa.me/${contactConfig.whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSocial = (platform: string) => {
    let url = 'https://linkedin.com';
    if (platform === 'Dribbble') url = 'https://dribbble.com';
    if (platform === 'Instagram') url = 'https://instagram.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleProjectsUpdated = (newRow1: ShowcaseItem[], newRow2: ShowcaseItem[]) => {
    setRow1Projects(newRow1);
    setRow2Projects(newRow2);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // SEPARATE PAGE FOR ADMIN (admincontrol)
  // Must see login first before viewing or editing any content
  if (isAdminOpen) {
    return (
      <AdminPanel
        isOpen={true}
        onClose={() => {
          setIsAdminOpen(false);
          if (
            window.location.hash.toLowerCase() === '#admincontrol' ||
            window.location.hash.toLowerCase() === '#admin'
          ) {
            history.replaceState(null, '', window.location.pathname);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        row1Projects={row1Projects}
        row2Projects={row2Projects}
        onProjectsUpdated={handleProjectsUpdated}
        contactConfig={contactConfig}
        onContactConfigUpdated={setContactConfig}
        tools={tools}
        onToolsUpdated={setTools}
        blogPosts={blogPosts}
        onBlogPostsUpdated={setBlogPosts}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#DEDCD7] sm:py-8 sm:px-4 md:px-8 flex justify-center items-center selection:bg-neutral-900 selection:text-white transition-colors duration-300">
      {/* Slim subtle scroll progress indicator at the very top of screen */}
      <ScrollProgress />

      {/* Framed Canvas Container matching the exact portfolio aesthetic */}
      <div className="w-full max-w-[960px] bg-[#EAE9E5] sm:rounded-[44px] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.07)] sm:border sm:border-white/70 p-3 sm:p-5 md:p-6 space-y-6 sm:space-y-8">
        {isBlogOpen ? (
          /* DEDICATED SEO BLOG PAGE - ONLY OPENS ON SEO BLOG MENU CLICK */
          <div className="w-full animate-in fade-in duration-300">
            <BlogSection
              posts={blogPosts}
              onOpenArticleInquiry={(topic) => handleOpenInquiry(topic)}
              onOpenAdmin={() => {
                window.location.hash = 'admincontrol';
                setIsAdminOpen(true);
              }}
              onBackToPortfolio={() => {
                setIsBlogOpen(false);
                if (window.location.hash.startsWith('#blog')) {
                  history.replaceState(null, '', window.location.pathname);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          <>
            {/* 1. Top White Card: Header, Avatar, Headline, Latest Shots, Logos Bar */}
            <HeroCard
              email={contactConfig.email}
              onOpenShots={() => setIsShotsOpen(true)}
              onOpenSocial={handleSocial}
              onNavigateSection={handleNavigateSection}
              onOpenBlog={() => {
                setIsBlogOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <SectionDivider />

            {/* 2. Experience & Impact Stats Section: Animated Countdown (3+ Years on a single line) */}
            <StatsSection />

            <SectionDivider />

            {/* 3. Middle Section: Collaboration statement, Tilted Services divider, 4 Services */}
            <ServicesSection onSelectService={(service) => setSelectedService(service)} />

            <SectionDivider />

            {/* 4. Sliding Showcase Section: Videos, Brand PDFs, Posters & Logos */}
            <div id="showcase-section" className="scroll-mt-6">
              <SlidingShowcase
                onInquire={handleOpenInquiry}
                row1={row1Projects}
                row2={row2Projects}
                onOpenAdmin={() => {
                  window.location.hash = 'admincontrol';
                  setIsAdminOpen(true);
                }}
              />
            </div>

            <SectionDivider />

            {/* 5. Experienced Tools & Software moving logo marquee (Adding tools only via Admin) */}
            <div id="tools-section">
              <ExperiencedAppsSection tools={tools} />
            </div>

            <SectionDivider />

            {/* 6. Last Section: Tell me about your next project (Direct WhatsApp Brief Form) */}
            <div id="contact-section" className="scroll-mt-6">
              <ContactCard
                onOpenEmailModal={() => handleOpenInquiry('New Project')}
                onOpenWhatsApp={handleWhatsApp}
                onOpenSocial={handleSocial}
                onOpenAdmin={() => {
                  window.location.hash = 'admincontrol';
                  setIsAdminOpen(true);
                }}
                whatsappNumber={contactConfig.whatsappNumber}
                designerEmail={contactConfig.email}
              />
            </div>
          </>
        )}
      </div>

      {/* Interactive Modals */}
      <ShotsModal
        isOpen={isShotsOpen}
        onClose={() => setIsShotsOpen(false)}
        onInquire={handleOpenInquiry}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialTopic={inquiryTopic}
        designerEmail={contactConfig.email}
        whatsappNumber={contactConfig.whatsappNumber}
      />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onInquire={handleOpenInquiry}
      />

      {/* Floating WhatsApp button (opposite side of Scroll to Top: bottom-left) */}
      <WhatsAppFloating whatsappNumber={contactConfig.whatsappNumber} />

      {/* Floating Scroll To Top button (appears past hero section: bottom-right) */}
      <ScrollToTop />
    </main>
  );
}
