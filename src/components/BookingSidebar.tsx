import React, { useEffect, useState } from 'react';
import {
  SHOW_SESSIONS,
  PRICE_TIERS,
  PROMO_OFFERS,
  ShowSession,
  PriceTier,
} from '../data/nutcrackerData';
import { IsometricSeatDiagram } from './IsometricSeatDiagram';
import { Grid3X3, Minus, Plus, CheckCircle2, AlertCircle, Check } from 'lucide-react';

interface BookingSidebarProps {
  selectedSessionId: string;
  onSelectSession: (id: string) => void;
  selectedTierId: string;
  onSelectTier: (id: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  promoCode: string | null;
  onApplyPromoCode: (code: string | null) => void;
  onOpenSeatMap: (tierId?: string) => void;
  onAddToCart: () => void;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  selectedSessionId,
  onSelectSession,
  selectedTierId,
  onSelectTier,
  quantity,
  onQuantityChange,
  promoCode,
  onApplyPromoCode,
  onOpenSeatMap,
  onAddToCart,
}) => {
  const [promoInput, setPromoInput] = useState(promoCode ?? '');
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (promoCode) {
      setPromoInput(promoCode);
      const found = PROMO_OFFERS.find((o) => o.code === promoCode);
      if (found) {
        if (found.applicableTiers.includes(selectedTierId)) {
          setPromoFeedback({
            type: 'success',
            message: `${found.code} applied (${found.discountPercent}% off ticket subtotal).`,
          });
        } else {
          setPromoFeedback({
            type: 'error',
            message: `${found.code} applies to select tiers only (see Promotions tab).`,
          });
        }
      }
    }
  }, [promoCode, selectedTierId]);

  const selectedSession: ShowSession =
    SHOW_SESSIONS.find((s) => s.id === selectedSessionId) ?? SHOW_SESSIONS[0];
  const selectedTier: PriceTier =
    PRICE_TIERS.find((t) => t.id === selectedTierId) ?? PRICE_TIERS[0];

  const activeOffer = promoCode
    ? PROMO_OFFERS.find((p) => p.code.toUpperCase() === promoCode.toUpperCase())
    : null;

  const isOfferEligible =
    activeOffer && activeOffer.applicableTiers.includes(selectedTier.id);

  const rawSubtotal = selectedTier.price * quantity;
  const discountAmount = isOfferEligible
    ? Math.round((rawSubtotal * activeOffer.discountPercent) / 100)
    : 0;
  const totalBookingFee = selectedTier.bookingFee * quantity;
  const finalTotal = rawSubtotal - discountAmount + totalBookingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromoCode(null);
      setPromoFeedback(null);
      return;
    }
    const found = PROMO_OFFERS.find((o) => o.code === cleaned);
    if (!found) {
      setPromoFeedback({
        type: 'error',
        message: 'Invalid code. Try SANDS15, UOB10, or BALLET15.',
      });
      return;
    }
    onApplyPromoCode(found.code);
    if (!found.applicableTiers.includes(selectedTier.id)) {
      setPromoFeedback({
        type: 'error',
        message: `${found.code} applies to select tiers only (see Promotions tab).`,
      });
    } else {
      setPromoFeedback({
        type: 'success',
        message: `${found.code} applied (${found.discountPercent}% off ticket subtotal).`,
      });
    }
  };

  return (
    <aside
      id="booking-panel"
      aria-label="Buy Tickets"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 lg:sticky lg:top-20 space-y-5"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Select Tickets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant e-Ticket delivery via SISTIC
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-700 tabular-nums">
          From S$48
        </span>
      </div>

      {/* Step 1: Date & Showtime Dropdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="session-select" className="text-xs font-semibold text-slate-700">
            1. Show Date & Time
          </label>
          <span
            className={`text-xs font-semibold ${
              selectedSession.status === 'Limited'
                ? 'text-amber-700'
                : selectedSession.status === 'Selling Fast'
                ? 'text-[#E11D38]'
                : 'text-emerald-700'
            }`}
          >
            {selectedSession.status}
          </span>
        </div>

        <select
          id="session-select"
          value={selectedSession.id}
          onChange={(e) => onSelectSession(e.target.value)}
          className="w-full px-3 py-2.5 text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#E11D38]"
        >
          {SHOW_SESSIONS.map((session) => (
            <option key={session.id} value={session.id}>
              {session.dateLabel} · {session.time} ({session.status})
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Colour-Coded Seat Category Selection + Isometric Seat Map Diagram */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            2. Seat Category (Colour-Coded)
          </span>
          <button
            type="button"
            onClick={() => onOpenSeatMap(selectedTier.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#E11D38] hover:underline cursor-pointer"
          >
            <Grid3X3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exact Seats</span>
          </button>
        </div>

        {/* Isometric Seat Map Diagram */}
        <IsometricSeatDiagram
          selectedTierId={selectedTier.id}
          onSelectTier={onSelectTier}
        />

        {/* Colour-Coded Category List */}
        <div
          role="radiogroup"
          aria-label="Seat Category"
          className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100"
        >
          {PRICE_TIERS.map((tier) => {
            const isSelected = tier.id === selectedTier.id;
            return (
              <button
                key={tier.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectTier(tier.id)}
                className={`w-full px-3 py-2 flex items-center justify-between gap-2 text-left text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/70 font-semibold'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0 border border-black/15 flex items-center justify-center text-slate-900"
                    style={{ backgroundColor: tier.colorHex }}
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                  </span>
                  <span className="truncate text-slate-900">
                    {tier.name.split(' (')[0]}
                  </span>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    · {tier.section}
                  </span>
                </span>
                <span className="font-bold text-slate-900 tabular-nums shrink-0">
                  S${tier.price}
                </span>
              </button>
            );
          })}
        </div>

        {selectedTier.note && (
          <p className="text-xs text-slate-500 leading-relaxed">{selectedTier.note}</p>
        )}
      </div>

      {/* Step 3: Quantity Stepper */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="block text-xs font-semibold text-slate-700">
            3. {selectedTier.isBox ? 'Number of Boxes (4 seats each)' : 'Number of Tickets'}
          </span>
          <span className="text-[11px] text-slate-500 tabular-nums">
            {selectedTier.remaining} {selectedTier.isBox ? 'boxes' : 'seats'} left at this tier
          </span>
        </div>

        <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="p-2.5 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3.5 text-sm font-bold text-slate-900 tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() =>
              onQuantityChange(Math.min(selectedTier.isBox ? 2 : 8, quantity + 1))
            }
            className="p-2.5 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            disabled={quantity >= (selectedTier.isBox ? 2 : 8)}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-1">
        <label htmlFor="promo-input" className="text-xs font-semibold text-slate-700 block">
          Promo / Partner Code (Optional)
        </label>
        <div className="flex gap-2">
          <input
            id="promo-input"
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="e.g. SANDS15 or UOB10"
            className="flex-1 min-w-0 px-3 py-2 text-xs uppercase bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#E11D38]"
          />
          <button
            type="submit"
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Apply
          </button>
        </div>
        {promoFeedback && (
          <p
            className={`text-xs flex items-center gap-1 ${
              promoFeedback.type === 'success' ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {promoFeedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{promoFeedback.message}</span>
          </p>
        )}
      </form>

      {/* Price Summary */}
      <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>
            {quantity} × {selectedTier.name.split(' (')[0]}
          </span>
          <span className="font-medium text-slate-900 tabular-nums">
            S${rawSubtotal.toFixed(2)}
          </span>
        </div>

        {discountAmount > 0 && activeOffer && (
          <div className="flex justify-between text-emerald-700">
            <span>Promo ({activeOffer.code} · {activeOffer.discountPercent}% off)</span>
            <span className="font-medium tabular-nums">
              -S${discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>SISTIC Booking Fee</span>
          <span className="font-medium text-slate-900 tabular-nums">
            S${totalBookingFee.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
          <span className="font-bold text-slate-900">Estimated Total</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">
            S${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-lg transition-colors cursor-pointer"
        >
          Add Best Available Seats
        </button>
        <button
          type="button"
          onClick={() => onOpenSeatMap(selectedTier.id)}
          className="w-full py-2.5 px-4 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
        >
          Pick Exact Seats on Map
        </button>
      </div>
    </aside>
  );
};
