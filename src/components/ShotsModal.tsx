import React, { useState, useRef } from 'react';
import {
  X,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  Play,
  Film,
  Volume2,
  VolumeX
} from 'lucide-react';
import { PORTFOLIO_SHOTS, ProjectShot } from '../data/portfolioData.ts';

interface ShotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: (topic: string) => void;
}

export const ShotsModal: React.FC<ShotsModalProps> = ({ isOpen, onClose, onInquire }) => {
  const [filter, setFilter] = useState<string>('All');
  const [activeMediaShot, setActiveMediaShot] = useState<ProjectShot | null>(null);
  const [isSubModalMuted, setIsSubModalMuted] = useState<boolean>(true);
  const subModalVideoRef = useRef<HTMLVideoElement | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Motion & Video', 'Branding', 'UX/UI'];
  const filteredShots =
    filter === 'All'
      ? PORTFOLIO_SHOTS
      : PORTFOLIO_SHOTS.filter((s) => s.category === filter);

  const toggleSubModalMute = () => {
    if (!subModalVideoRef.current) return;
    const next = !subModalVideoRef.current.muted;
    subModalVideoRef.current.muted = next;
    setIsSubModalMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#FAFAF9] rounded-[28px] sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 bg-[#FAFAF9]/95 backdrop-blur-sm z-20 px-6 sm:px-8 py-5 border-b border-neutral-200/80 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                Latest Shots &amp; Case Studies
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Motion video reels, commercial branding systems, and digital product designs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Segmented Control */}
        <div className="px-6 sm:px-8 pt-5 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
              }`}
            >
              {cat === 'Motion & Video' && <Film className="w-3 h-3 text-purple-400" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Shots Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredShots.map((shot) => {
            const isVideo = shot.mediaType === 'video' || Boolean(shot.videoUrl);

            return (
              <div
                key={shot.id}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200/70 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Artwork / Media Preview Container */}
                <div
                  className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${shot.gradient} p-5 sm:p-6 flex flex-col justify-between text-white cursor-pointer`}
                  onClick={() => {
                    setActiveMediaShot(shot);
                    setIsSubModalMuted(true);
                  }}
                >
                  {isVideo && shot.videoUrl ? (
                    <video
                      src={shot.videoUrl}
                      poster={shot.imageUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : shot.imageUrl ? (
                    <img
                      src={shot.imageUrl}
                      alt={shot.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-85 transition-all duration-500"
                    />
                  ) : null}

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {isVideo ? (
                        <>
                          <Film className="w-2.5 h-2.5 text-purple-400" />
                          <span>Autoplay Video Reel</span>
                        </>
                      ) : (
                        <span>{shot.category}</span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      {shot.year}
                    </span>
                  </div>

                  {/* Center Media Play/Open Icon */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    {isVideo && (
                      <div className="w-11 h-11 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                        <Play className="w-5 h-5 fill-white translate-x-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Bottom title inside thumbnail */}
                  <div className="relative z-10">
                    <div className="text-[11px] font-mono text-white/70 mb-0.5">{shot.client}</div>
                    <div className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform leading-tight">
                      {shot.title}
                    </div>
                    {shot.stats && (
                      <div className="mt-1.5 text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>{shot.stats}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {shot.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {shot.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables / Media Actions */}
                  <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                    {isVideo && shot.videoUrl ? (
                      <button
                        onClick={() => {
                          setActiveMediaShot(shot);
                          setIsSubModalMuted(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-purple-700" />
                        <span>Watch Video</span>
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-neutral-400">
                        Design Case Study
                      </span>
                    )}

                    <button
                      onClick={() => {
                        onClose();
                        onInquire(shot.title);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black cursor-pointer group/btn"
                    >
                      <span>Discuss Similar</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-neutral-100/60 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-500 flex-wrap gap-2">
          <span>{filteredShots.length} projects displayed from GitHub repository</span>
          <button
            onClick={() => {
              onClose();
              onInquire('Custom Project Request');
            }}
            className="font-medium text-neutral-800 hover:text-black flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Need a custom video or design? Let's talk</span>
          </button>
        </div>
      </div>

      {/* Sub-modal for Direct Video Playback inside ShotsModal */}
      {activeMediaShot && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveMediaShot(null)}
        >
          <div
            className="bg-neutral-900 text-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-neutral-700 flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                  {activeMediaShot.category}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {activeMediaShot.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveMediaShot(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player with Autoplay Muted & Sound Toggle */}
            {activeMediaShot.videoUrl ? (
              <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[500px]">
                <video
                  ref={subModalVideoRef}
                  src={activeMediaShot.videoUrl}
                  controls
                  autoPlay
                  muted={isSubModalMuted}
                  loop
                  playsInline
                  className="w-full max-h-[500px] object-contain"
                />

                <button
                  type="button"
                  onClick={toggleSubModalMute}
                  className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-transform active:scale-95"
                >
                  {isSubModalMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tap to Unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sound On</span>
                    </>
                  )}
                </button>
              </div>
            ) : activeMediaShot.imageUrl ? (
              <div className="rounded-2xl overflow-hidden flex items-center justify-center max-h-[500px]">
                <img
                  src={activeMediaShot.imageUrl}
                  alt={activeMediaShot.title}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <span className="text-xs text-neutral-400">{activeMediaShot.client} · {activeMediaShot.year}</span>
              <button
                onClick={() => {
                  const title = activeMediaShot.title;
                  setActiveMediaShot(null);
                  onClose();
                  onInquire(title);
                }}
                className="px-4 py-1.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-neutral-200 transition-colors"
              >
                Inquire on this Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
