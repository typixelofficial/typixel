import React, { useState } from 'react';
import { Lock, Send, Sparkles, ArrowUpRight } from 'lucide-react';

interface ContactCardProps {
  onOpenEmailModal?: () => void;
  onOpenWhatsApp?: () => void;
  onOpenSocial?: (platform: string) => void;
  onOpenAdmin?: () => void;
  whatsappNumber?: string;
  designerEmail?: string;
}

const SERVICE_OPTIONS = [
  'UX & UI Design',
  'Brand Identity & Logo',
  'Video Editing & Motion',
  'Commercial Posters & Ads',
  'Web & App Development',
  'Other / Custom Brief'
];

const TIMELINE_OPTIONS = [
  'Flexible Timeline',
  'Urgent (Within 1-2 weeks)',
  'Within 1 month',
  'Budget: Under $1,000',
  'Budget: $1,000 – $3,000',
  'Budget: $3,000+'
];

export const ContactCard: React.FC<ContactCardProps> = ({
  onOpenSocial,
  onOpenAdmin,
  whatsappNumber = '919072891142',
  designerEmail = 'typixelofficial@gmail.com',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState(SERVICE_OPTIONS[0]);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINE_OPTIONS[0]);
  const [message, setMessage] = useState('');

  // Construct the templated chat message integrating all form inputs
  const buildTemplatedMessage = () => {
    const trimmedName = name.trim() || '[Your Name]';
    const trimmedEmail = email.trim() || 'Not specified';
    const trimmedPhone = phone.trim() || 'Not specified';
    const trimmedMessage = message.trim() || '[Project Details]';

    return (
      `*New Project Inquiry — Typixel Portfolio*\n\n` +
      `👤 *Client / Name:* ${trimmedName}\n` +
      `📧 *Email:* ${trimmedEmail}\n` +
      `📞 *Phone / WhatsApp:* ${trimmedPhone}\n` +
      `🎨 *Service Requested:* ${selectedService}\n` +
      `⏱️ *Timeline / Budget:* ${selectedTimeline}\n\n` +
      `📝 *Project Overview & Goals:*\n` +
      `${trimmedMessage}\n\n` +
      `---\n` +
      `_Sent directly via Typixel Portfolio Form_`
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const templatedMessage = buildTemplatedMessage();
    const cleanNumber = (whatsappNumber || '919072891142').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(templatedMessage);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;

    // Directly open WhatsApp with tailored project brief
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {/* Main White Project Card Form Container */}
      <div className="w-full bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-12 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-300">
        
        {/* Top Header Badge & Title */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F7F6F2] border border-neutral-200/60 shadow-2xs flex items-center justify-center text-2xl sm:text-3xl mb-5 hover:scale-105 transition-all">
            {/* Handshake Graphic */}
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
              <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L15 14" />
              <path d="m2 13 6 6" />
              <path d="m19 13 3-3" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-neutral-800 leading-[1.18] tracking-[-0.03em]">
            Tell me about your next<br className="hidden sm:inline" /> project
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-500 max-w-md leading-relaxed">
            Fill in the details below to generate a tailored brief and send it directly via WhatsApp.
          </p>
        </div>


        {/* Project Inquiry Form */}
        <form onSubmit={handleSend} className="max-w-2xl mx-auto space-y-6 text-left">
          
          {/* Service Selector Chips */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Select Service Required
            </label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((svc) => {
                const isActive = selectedService === svc;
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => setSelectedService(svc)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'bg-[#F7F6F2] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 border border-neutral-200/60'
                    }`}
                  >
                    {svc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Your Name / Brand *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan or Nexa Agency"
                className="w-full text-xs sm:text-[13px] bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full text-xs sm:text-[13px] bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          {/* Phone & Timeline / Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Phone or WhatsApp Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0192 or your WhatsApp"
                className="w-full text-xs sm:text-[13px] bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Estimated Budget or Timeline
              </label>
              <select
                value={selectedTimeline}
                onChange={(e) => setSelectedTimeline(e.target.value)}
                className="w-full text-xs sm:text-[13px] bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors cursor-pointer"
              >
                {TIMELINE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Details textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Project Overview &amp; Deliverables *
              </label>
              <span className="text-[11px] text-neutral-400 font-mono">
                {message.length} chars
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about what you are building, design goals, target audience, brand assets, or any reference links..."
              className="w-full text-xs sm:text-[13px] bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none transition-colors"
            />
          </div>



          {/* Submission and Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Directly opens WhatsApp chat with project brief</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Primary Send Button */}
              <button
                type="submit"
                disabled={!name.trim() || !message.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white px-8 py-3 rounded-full text-xs sm:text-[13px] font-bold tracking-tight shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Send</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Bar */}
      <footer className="w-full flex items-center justify-between gap-4 pt-8 pb-3 px-3 sm:px-6 select-none text-[11px] sm:text-xs text-neutral-500 font-normal">
        <div className="flex items-center gap-2">
          <span>© 2026 Typixel. All rights reserved.</span>
          {onOpenAdmin && (
            <button
              onClick={() => {
                window.location.hash = 'admincontrol';
                onOpenAdmin();
              }}
              className="text-neutral-400/60 hover:text-neutral-700 transition-colors p-0.5 rounded cursor-pointer"
              title="Typixel Admin Control (admincontrol)"
              aria-label="Typixel Admin Control"
            >
              <Lock className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
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
      </footer>
    </div>
  );
};
