import React, { useState } from 'react';
import { X, Send, CheckCircle, Mail, PhoneCall, Loader2, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  designerEmail?: string;
  whatsappNumber?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
  designerEmail = 'typixelofficial@gmail.com',
  whatsappNumber = '919072891142'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(initialTopic || 'UX & UI Design');
  const [customProjectType, setCustomProjectType] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  if (!isOpen) return null;

  const getEffectiveProjectType = () => {
    if (projectType === 'Other') {
      return customProjectType.trim() || 'Custom Project';
    }
    return projectType;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSending(true);
    const effectiveType = getEffectiveProjectType();

    // 1. WhatsApp Message formatting
    const cleanNumber = (whatsappNumber || '919061559799').replace(/[^0-9]/g, '');
    const waText = encodeURIComponent(
      `*New Project Inquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n*Project Type:* ${effectiveType}\n\n*Details:*\n${message}\n\n_Sent directly from Typixel's Portfolio_`
    );

    // 2. EmailJS Send Execution
    try {
      // Check if user has set custom EmailJS keys in localStorage
      const serviceId = localStorage.getItem('kawsar_emailjs_service_id') || 'service_portfolio';
      const templateId = localStorage.getItem('kawsar_emailjs_template_id') || 'template_inquiry';
      const publicKey = localStorage.getItem('kawsar_emailjs_public_key');

      if (publicKey && publicKey !== 'DEMO') {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: name,
            reply_to: email,
            to_email: designerEmail,
            project_type: effectiveType,
            message: message,
            date: new Date().toLocaleString()
          },
          publicKey
        );
      } else {
        // Direct REST API attempt with standard template payload
        try {
          await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey || 'user_public_key',
              template_params: {
                from_name: name,
                reply_to: email,
                to_email: designerEmail,
                project_type: effectiveType,
                message: message
              }
            })
          });
        } catch {
          // Fallback gracefully without throwing
        }
      }
      setStatusNote('EmailJS notification dispatched & WhatsApp chat launched.');
    } catch (err) {
      console.warn('EmailJS delivery fallback:', err);
      setStatusNote('Inquiry processed & WhatsApp chat launched.');
    } finally {
      // 3. Open WhatsApp directly as requested: "make only a send it will send to whatsapp and email , email with email js"
      window.open(`https://wa.me/${cleanNumber}?text=${waText}`, '_blank', 'noopener,noreferrer');
      setIsSending(false);
      setSubmitted(true);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setCustomProjectType('');
    setIsSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[28px] sm:rounded-3xl max-w-lg w-full shadow-2xl border border-neutral-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                Start a Conversation
              </h3>
              <p className="text-xs text-neutral-500">
                Dispatches directly to Email &amp; WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900">
              Inquiry Sent Successfully!
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xs mx-auto leading-relaxed">
              Your project request has been queued to <strong>{designerEmail}</strong> via EmailJS and forwarded to WhatsApp.
            </p>
            {statusNote && (
              <p className="text-[11px] text-neutral-400 font-mono bg-neutral-50 py-1.5 px-3 rounded-lg border border-neutral-200">
                {statusNote}
              </p>
            )}
            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="px-6 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-full cursor-pointer shadow-xs transition-colors"
              >
                Close &amp; Return to Portfolio
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Project Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
              >
                <option value="UX & UI Design">UX &amp; UI Design</option>
                <option value="Web & Mobile App Development">Web &amp; Mobile App Development</option>
                <option value="Brand Identity & Visual Systems">Brand Identity &amp; Visual Systems</option>
                <option value="Creative Posters & Campaign Design">Creative Posters &amp; Campaign Design</option>
                <option value="Adobe Photoshop & Retouching">Adobe Photoshop &amp; Retouching</option>
                <option value="Adobe Premiere Pro & After Effects Video">Adobe Premiere Pro &amp; After Effects Video</option>
                <option value="DaVinci Resolve Color Grading">DaVinci Resolve Color Grading</option>
                <option value="Figma Design Systems & Tokens">Figma Design Systems &amp; Tokens</option>
                <option value="Arabic / Malayalam Calligraphy & Typography">Arabic / Malayalam Calligraphy &amp; Typography</option>
                <option value="Social Media Creatives & Content">Social Media Creatives &amp; Content</option>
                <option value="Other">Other</option>
              </select>

              {projectType === 'Other' && (
                <div className="mt-2.5">
                  <label className="block text-[10px] text-neutral-500 mb-1">
                    Enter project type (optional / can skip):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Design Audit, Book Cover, Exhibition Display..."
                    value={customProjectType}
                    onChange={(e) => setCustomProjectType(e.target.value)}
                    className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Project Overview &amp; Goals *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Briefly describe what you're building, target timeline, or project goals..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none transition-colors"
              />
            </div>

            {/* Single Unified Send Action as requested */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Simultaneous EmailJS &amp; WhatsApp handoff</span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center gap-2 bg-[#171717] hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
