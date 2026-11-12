import React from 'react';
import { X, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { ServiceDetail } from '../data/portfolioData.ts';

interface ServiceDetailModalProps {
  service: ServiceDetail | null;
  onClose: () => void;
  onInquire: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onInquire
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-neutral-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Service Capability
            </span>
            <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
              {service.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Detailed description */}
          <p className="text-sm text-neutral-600 leading-relaxed">
            {service.fullDescription}
          </p>

          {/* Deliverables */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Key Deliverables &amp; Outcomes
            </h4>
            <div className="space-y-2">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Primary Tooling &amp; Workflow
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {service.tools.map((tool) => (
                <span
                  key={tool}
                  className="bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-md font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Inquire action */}
        <div className="p-5 sm:p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Typical sprint: 1–3 weeks</span>
          </div>

          <button
            onClick={() => {
              const title = service.title;
              onClose();
              onInquire(title);
            }}
            className="inline-flex items-center gap-2 bg-[#171717] hover:bg-neutral-900 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span>Inquire This Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
