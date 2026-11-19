import React, { useState } from 'react';
import {
  PRICE_TIERS,
  PROMO_OFFERS,
  VENUE_FAQS,
  SNOW_IMAGE,
  TREE_IMAGE,
  THEATRE_IMAGE,
  PriceTier,
} from '../data/nutcrackerData';
import { ChevronDown, MapPin, Train, Info, Check, Tag } from 'lucide-react';

export type EventTabKey = 'synopsis' | 'pricing' | 'admission' | 'promotions' | 'venue';

interface EventDetailsTabsProps {
  activeTab: EventTabKey;
  onTabChange: (tab: EventTabKey) => void;
  onSelectTier: (tierId: string) => void;
  onApplyPromo: (code: string) => void;
  activePromoCode: string | null;
  onOpenSeatMap: (tierId?: string) => void;
}

const TABS: { key: EventTabKey; label: string }[] = [
  { key: 'synopsis', label: 'Synopsis' },
  { key: 'pricing', label: 'Ticket Pricing' },
  { key: 'admission', label: 'Admission Rules' },
  { key: 'promotions', label: 'Promotions' },
  { key: 'venue', label: 'Venue & FAQ' },
];

export const EventDetailsTabs: React.FC<EventDetailsTabsProps> = ({
  activeTab,
  onTabChange,
  onSelectTier,
  onApplyPromo,
  activePromoCode,
  onOpenSeatMap,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const markImgError = (key: string) =>
    setImgErrors((prev) => ({ ...prev, [key]: true }));

  return (
    <div id="event-details" className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* SISTIC Tab Strip */}
      <div
        role="tablist"
        aria-label="Event Information"
        className="flex items-center overflow-x-auto border-b border-slate-200 px-2 sm:px-6 bg-white"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'border-[#E11D38] text-[#E11D38]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8">
        {activeTab === 'synopsis' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                A Timeless Festive Classic Returns to Marina Bay Sands
              </h2>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Direct from Tbilisi, the internationally acclaimed{' '}
                <strong className="font-semibold text-slate-900">State Ballet of Georgia</strong>{' '}
                brings its celebrated large-scale production of{' '}
                <em className="italic">The Nutcracker</em> to Singapore’s Sands Theatre for a strictly
                limited four-day season from 26 to 29 November 2026.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Led by legendary Prima Ballerina{' '}
                <strong className="font-semibold text-slate-900">Nina Ananiashvili</strong>, this
                touring company of 60 classical dancers transports audiences of all ages into a
                storybook world of glittering Christmas magic, accompanied by Pyotr Ilyich
                Tchaikovsky’s unforgettable orchestral score.
              </p>
            </div>

            {/* Production Photography Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <figure className="space-y-2.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  {!imgErrors.tree ? (
                    <img
                      src={TREE_IMAGE}
                      alt="Act I Christmas Eve salon scene with Clara holding the Nutcracker doll"
                      referrerPolicy="no-referrer"
                      onError={() => markImgError('tree')}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      Act I: Christmas Eve Salon
                    </div>
                  )}
                </div>
                <figcaption className="text-xs text-slate-600">
                  Act I — The Stahlbaum Christmas Eve celebration where Clara receives her enchanted
                  Nutcracker.
                </figcaption>
              </figure>

              <figure className="space-y-2.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  {!imgErrors.snow ? (
                    <img
                      src={SNOW_IMAGE}
                      alt="Corps de ballet performing the Waltz of the Snowflakes"
                      referrerPolicy="no-referrer"
                      onError={() => markImgError('snow')}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      Act I Finale: Waltz of the Snowflakes
                    </div>
                  )}
                </div>
                <figcaption className="text-xs text-slate-600">
                  The corps de ballet in the breathtaking Waltz of the Snowflakes before entering the
                  Kingdom of Sweets.
                </figcaption>
              </figure>
            </div>

            {/* Act Breakdown */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Act I · Christmas Eve & The Land of Snow
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  At the festive Stahlbaum family gathering, the mysterious Herr Drosselmeyer gifts
                  young Clara a wooden nutcracker. As the clock strikes midnight, the towering
                  Christmas tree grows to enchanted proportions, the Nutcracker comes to life to
                  vanquish the Mouse King, and transforms into a gallant Prince guiding Clara through
                  a swirling winter forest.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Act II · The Kingdom of Sweets
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Welcomed by the Sugar Plum Fairy, Clara is honoured with a dazzling suite of
                  divertissements from Spain, Arabia, Russia, and China, culminating in the sweeping
                  Waltz of the Flowers and the iconic Grand Pas de Deux.
                </p>
              </div>
            </div>

            {/* Production Credits */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Production Credits</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Performing Company</dt>
                  <dd className="font-medium text-slate-900 mt-0.5">State Ballet of Georgia</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Artistic Director</dt>
                  <dd className="font-medium text-slate-900 mt-0.5">Nina Ananiashvili</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Promoter</dt>
                  <dd className="font-medium text-slate-900 mt-0.5">Base Entertainment Asia</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ticket Pricing & Categories</h2>
                <p className="text-sm text-slate-600 mt-1">
                  All prices are in Singapore Dollars (SGD) and exclude the SISTIC booking fee.
                  Dynamic pricing applies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenSeatMap()}
                className="px-4 py-2 text-xs font-semibold text-[#E11D38] border border-[#E11D38] hover:bg-[#E11D38] hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                View Sands Theatre Seat Map
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4 text-right">Ticket Price</th>
                    <th className="py-3 px-4 text-right">Booking Fee</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {PRICE_TIERS.map((tier: PriceTier) => (
                    <tr key={tier.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-sm shrink-0"
                            style={{ backgroundColor: tier.colorHex }}
                            aria-hidden="true"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{tier.name}</div>
                            {tier.note && (
                              <div className="text-xs text-slate-500 mt-0.5 max-w-md">
                                {tier.note}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {tier.section}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        S${tier.price}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 tabular-nums whitespace-nowrap">
                        S${tier.bookingFee}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectTier(tier.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-md transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                SISTIC Booking Fee Schedule
              </p>
              <p>
                Tickets priced at S$100 and above: S$6 per ticket · Tickets priced S$50 to
                S$99.99: S$4 per ticket · Tickets below S$50: S$2 per ticket.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'admission' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Admission & Theatre Rules</h2>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  Age Rating & Child Admission
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Recommended for audiences aged 4 years and above. No admission for infants in arms
                  and children below 4 years old. Children aged 4 and above must purchase a valid
                  ticket for entry.
                </p>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  Latecomers & Re-Entry Policy
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Doors open 30 minutes before curtain rise. Latecomers will only be admitted during
                  a suitable pause in the performance at the discretion of Front of House staff and
                  may be seated in designated holding seats until intermission.
                </p>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  Photography & Recording
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Flash photography, video recording, and audio recording are strictly prohibited
                  during the performance. Mobile phones must be switched to silent mode before
                  entering the auditorium.
                </p>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  Bag Check & Wheelchair Access
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Security bag inspections apply upon entry to Sands Theatre. For wheelchair-accessible
                  seating bookings, please select Stalls Row M Companion seats or contact the SISTIC
                  Hotline (+65 6348 5555).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Partner Privileges & Promotions</h2>
              <p className="text-sm text-slate-600 mt-1">
                Apply an eligible promotional code directly to your booking session. Privileges cannot
                be combined with other offers.
              </p>
            </div>

            <div className="space-y-4">
              {PROMO_OFFERS.map((offer) => {
                const isApplied = activePromoCode === offer.code;
                return (
                  <div
                    key={offer.code}
                    className={`border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isApplied
                        ? 'border-[#E11D38] bg-rose-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Tag className="w-3.5 h-3.5 text-[#E11D38]" aria-hidden="true" />
                        <span className="font-mono font-semibold text-slate-800">{offer.code}</span>
                        <span aria-hidden="true">·</span>
                        <span>Valid until {offer.validThrough}</span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">{offer.title}</h3>
                      <p className="text-sm text-slate-600">{offer.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplyPromo(offer.code)}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#16181F] hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <span>Apply {offer.code}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'venue' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Sands Theatre, Marina Bay Sands
              </h2>

              <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                {!imgErrors.theatre ? (
                  <img
                    src={THEATRE_IMAGE}
                    alt="Interior auditorium view of Sands Theatre showing Stalls, Dress Circle, and Grand Circle seating"
                    referrerPolicy="no-referrer"
                    onError={() => markImgError('theatre')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-300">
                    Sands Theatre Auditorium
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-200 rounded-lg p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <MapPin className="w-4 h-4 text-[#E11D38]" aria-hidden="true" />
                    <span>Theatre Address</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    10 Bayfront Avenue, B1-69/70 The Shoppes at Marina Bay Sands, Singapore 018956
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Train className="w-4 h-4 text-[#E11D38]" aria-hidden="true" />
                    <span>Getting There by MRT</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Bayfront MRT Station (CE1 / DT16). Follow Exit C or D directly into B1 of The
                    Shoppes towards Sands Theatre.
                  </p>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {VENUE_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={faq.q}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
