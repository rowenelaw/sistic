import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Share2, Bookmark, Check, Ticket } from 'lucide-react';
import { HERO_IMAGE } from '../data/nutcrackerData';

interface EventHeroProps {
  onBuyTickets: () => void;
  onOpenSeatMap: () => void;
}

export const EventHero: React.FC<EventHeroProps> = ({
  onBuyTickets,
  onOpenSeatMap,
}) => {
  const [imgError, setImgError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="top" className="bg-white border-b border-slate-200">
      {/* Breadcrumb Bar */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 text-xs text-slate-500">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <a href="#top" className="hover:text-slate-900 transition-colors">
            Home
          </a>
          <span aria-hidden="true">/</span>
          <a href="#event-details" className="hover:text-slate-900 transition-colors">
            Theatre & Dance
          </a>
          <span aria-hidden="true">/</span>
          <a href="#event-details" className="hover:text-slate-900 transition-colors">
            Classical Ballet
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium">The Nutcracker</span>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${saved ? 'fill-[#E11D38] text-[#E11D38]' : ''}`}
              aria-hidden="true"
            />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Theatrical Banner */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-8">
        <div className="relative rounded-xl overflow-hidden bg-[#14161D] min-h-[380px] sm:min-h-[440px] lg:min-h-[470px] flex items-end">
          {/* Background Stage Image with Zero-Broken-Image Fallback */}
          {!imgError ? (
            <img
              src={HERO_IMAGE}
              alt="The Nutcracker performed by the State Ballet of Georgia on stage beneath a glowing Christmas tree"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B121B] via-[#171923] to-[#0E1016] flex items-center justify-center">
              <Ticket className="w-16 h-16 text-white/15" aria-hidden="true" />
            </div>
          )}

          {/* Measured Scrim for WCAG AA Contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#111319]/95 via-[#111319]/65 to-[#111319]/20"
            aria-hidden="true"
          />

          {/* Event Title & Key Info */}
          <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-medium text-amber-200/95 tracking-wide mb-2">
                State Ballet of Georgia · Presented by Base Entertainment Asia
              </p>

              <h1
                className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.1] mb-3"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                The Nutcracker
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl mb-5">
                A dazzling holiday classical production featuring 60 dancers under the artistic
                direction of Nina Ananiashvili, set to Tchaikovsky’s beloved score.
              </p>

              {/* Clean Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-300" aria-hidden="true" />
                  <span>26 – 29 Nov 2026</span>
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-300" aria-hidden="true" />
                  <span>Sands Theatre, Marina Bay Sands</span>
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-300" aria-hidden="true" />
                  <span>Approx. 115 mins (incl. 20-min intermission)</span>
                </span>
              </div>
            </div>

            {/* Primary Purchase Trigger Strip */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <div className="text-left lg:text-right text-white">
                <span className="block text-xs text-slate-300">Tickets from</span>
                <span className="text-2xl font-bold tabular-nums">S$48</span>
                <span className="text-xs text-slate-300 ml-1.5">(excl. booking fee)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenSeatMap}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Seat Map
                </button>
                <button
                  type="button"
                  onClick={onBuyTickets}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                >
                  Buy Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
