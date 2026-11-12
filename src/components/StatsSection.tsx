import React, { useState, useEffect, useRef } from 'react';
import { Users, Briefcase, Sparkles, Trophy, Calendar, CheckCircle2 } from 'lucide-react';

interface StatItemProps {
  target: number;
  suffix?: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const AnimatedCounter: React.FC<StatItemProps> = ({ target, suffix = '', label, description, icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1600; // ms
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div
      ref={ref}
      className="bg-[#F8F7F4] hover:bg-[#F4F2EC] transition-all duration-300 rounded-2xl p-5 sm:p-6 border border-neutral-200/70 flex flex-col justify-between group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-neutral-200/80 flex items-center justify-center text-neutral-800 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      <div>
        {/* Strictly single-line number and suffix with whitespace-nowrap and flex items-baseline */}
        <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-sans tabular-nums whitespace-nowrap flex items-baseline">
          <span>{count}</span>
          <span className="text-2xl sm:text-3xl font-bold text-neutral-700 ml-0.5 whitespace-nowrap">
            {suffix}
          </span>
        </div>
        <p className="text-[12px] sm:text-xs text-neutral-500 mt-1.5 leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
};

export const StatsSection: React.FC = () => {
  const [activeYear, setActiveYear] = useState<number>(3);

  const timelineYears = [
    {
      year: 1,
      label: 'Year 1',
      period: '2021-2022',
      title: 'Foundation & Visual Identity',
      summary: 'Brand guidelines, typography systems, vector illustration, and print collateral.',
      highlights: ['35+ Identity Kits', 'Visual Language Discovery', 'Adobe Suite Mastery']
    },
    {
      year: 2,
      label: 'Year 2',
      period: '2022-2023',
      title: 'Digital UI & Web Platforms',
      summary: 'Responsive web apps, mobile UI for fintech, design tokens, and Figma architectures.',
      highlights: ['Design Systems for Startups', 'Awwwards Recognition', 'Front-End Prototypes']
    },
    {
      year: 3,
      label: 'Year 3+',
      period: '2023-Present',
      title: 'Scale & Global Partnerships',
      summary: 'Strategic end-to-end product design, high-volume posters, enterprise brand campaigns.',
      highlights: ['50+ Satisfied Clients', 'International Campaigns', 'Code & Motion Integration']
    }
  ];

  return (
    <section className="w-full my-6 sm:my-8 bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-12 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-300">
      {/* Top Header: Big Typographic Statement */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-100">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#F3F2EE] px-3 py-1 rounded-full text-xs font-semibold text-neutral-700 mb-3 border border-neutral-200/60">
            <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
            <span>Proven Track Record</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-neutral-900 leading-[1.14] tracking-[-0.03em]">
            Three years.<br />
            <span className="text-neutral-500 font-medium">Of dedicated design execution.</span>
          </h2>
        </div>

        {/* Big stylized number accent - all on a single line */}
        <div className="inline-flex items-center gap-2.5 bg-[#F8F7F4] border border-neutral-200/80 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl self-start md:self-auto whitespace-nowrap transition-colors">
          <span className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight tabular-nums whitespace-nowrap">
            3<span className="text-neutral-400 font-normal">+</span>
          </span>
          <span className="text-xs sm:text-sm text-neutral-700 font-semibold whitespace-nowrap">
            years in graphic &amp; product design
          </span>
        </div>
      </div>

      {/* 4 Animated Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 my-8">
        <AnimatedCounter
          target={50}
          suffix="+"
          label="Happy Clients"
          description="Global brands, startups, agencies, and cultural organizations."
          icon={<Users className="w-4 h-4" />}
        />

        {/* Guaranteed single line: 3+ Years on Work Experience */}
        <AnimatedCounter
          target={3}
          suffix="+ Years"
          label="Work Experience"
          description="Continuous commercial design, branding, and UI engineering."
          icon={<Calendar className="w-4 h-4" />}
        />

        <AnimatedCounter
          target={70}
          suffix="+"
          label="Projects Delivered"
          description="Posters, marketing campaigns, websites, and mobile interfaces."
          icon={<Briefcase className="w-4 h-4" />}
        />

        <AnimatedCounter
          target={100}
          suffix="%"
          label="Satisfaction Rate"
          description="On-time delivery with iterative collaboration and clean handoff."
          icon={<Trophy className="w-4 h-4" />}
        />
      </div>

      {/* Visual Experience Timeline */}
      <div className="bg-[#FAF9F6] rounded-2xl p-5 sm:p-7 border border-neutral-200/60 mt-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
              Career Milestones &amp; Growth Track
            </h3>
            <p className="text-xs text-neutral-500">
              Interactive progression from freelance designer to lead digital artisan.
            </p>
          </div>

          {/* Interactive Step Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-neutral-200/80 w-fit">
            {timelineYears.map((t) => (
              <button
                key={t.year}
                onClick={() => setActiveYear(t.year)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeYear === t.year
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Year Detail Box */}
        {(() => {
          const current = timelineYears.find((y) => y.year === activeYear) || timelineYears[0];
          return (
            <div className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-2xs transition-all">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-neutral-400">
                  {current.period}
                </span>
                <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                  Phase 0{current.year}
                </span>
              </div>

              <h4 className="text-base font-bold text-neutral-900 mb-1">
                {current.title}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {current.summary}
              </p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                {current.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-700 bg-[#F5F4F0] px-3 py-1 rounded-full font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
