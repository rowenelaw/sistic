import React, { useState } from 'react';
import { RELATED_EVENTS } from '../data/nutcrackerData';
import { ArrowRight } from 'lucide-react';

interface RelatedEventsSectionProps {
  onBookCurrent: () => void;
}

export const RelatedEventsSection: React.FC<RelatedEventsSectionProps> = ({
  onBookCurrent,
}) => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 border-t border-slate-200">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            More Classical & Sands Theatre Performances
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Explore upcoming seasonal productions on SISTIC Singapore
          </p>
        </div>
      </div>

      {selectedNotice && (
        <div className="mb-6 p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-700">
            <strong className="font-semibold text-slate-900">{selectedNotice}</strong> — Priority
            on-sale opens soon on SISTIC. Currently booking:{' '}
            <button
              type="button"
              onClick={onBookCurrent}
              className="font-semibold text-[#E11D38] hover:underline cursor-pointer"
            >
              The Nutcracker (26–29 Nov 2026)
            </button>
            .
          </span>
          <button
            type="button"
            onClick={() => setSelectedNotice(null)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RELATED_EVENTS.map((ev) => (
          <article
            key={ev.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
          >
            <div>
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                {!imgErrors[ev.id] ? (
                  <img
                    src={ev.image}
                    alt={ev.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [ev.id]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                    {ev.title}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1.5">
                <p className="text-xs text-slate-500">
                  {ev.category} · {ev.dates}
                </p>
                <h3 className="text-base font-semibold text-slate-900 leading-snug">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-600">{ev.venue}</p>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                From S${ev.priceFrom}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNotice(ev.title)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#E11D38] hover:underline cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
