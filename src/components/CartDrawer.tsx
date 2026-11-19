import React, { useState } from 'react';
import { CartItem } from '../data/nutcrackerData';
import { X, Trash2, Minus, Plus, CheckCircle2, Ticket } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paynow' | 'grabpay'>('card');
  const [orderRef, setOrderRef] = useState('');
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<{
    items: CartItem[];
    total: number;
    buyerName: string;
    buyerEmail: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalFees = items.reduce(
    (sum, item) => sum + item.bookingFeePerUnit * item.quantity,
    0
  );
  const grandTotal = subtotal - totalDiscount + totalFees;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `SG-2026-${Math.floor(100000 + Math.random() * 899999)}`;
    setOrderRef(ref);
    setConfirmedSnapshot({
      items: [...items],
      total: grandTotal,
      buyerName: fullName.trim() || 'Guest Patron',
      buyerEmail: email.trim() || 'patron@example.com',
    });
    onClearCart();
    setStep('confirmed');
  };

  const resetAndClose = () => {
    setStep('bag');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SISTIC Ticket Bag"
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
    >
      <div className="w-full max-w-md bg-white h-full flex flex-col border-l border-slate-200 shadow-2xl">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {step === 'bag' && 'My SISTIC Tickets'}
              {step === 'checkout' && 'Patron Details & Payment'}
              {step === 'confirmed' && 'Booking Confirmed'}
            </h2>
            <p className="text-xs text-slate-500">
              The Nutcracker · Sands Theatre
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close ticket drawer"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 'confirmed' && confirmedSnapshot ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-2">
                <CheckCircle2
                  className="w-10 h-10 text-emerald-600 mx-auto"
                  aria-hidden="true"
                />
                <h3 className="text-lg font-bold text-slate-900">
                  Order #{orderRef} Confirmed
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your SISTIC e-Tickets have been issued to{' '}
                  <strong className="font-semibold text-slate-900">
                    {confirmedSnapshot.buyerEmail}
                  </strong>
                  . Present the e-Ticket QR code at Sands Theatre entrance.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-200">
                <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Patron: {confirmedSnapshot.buyerName}</span>
                  <span className="tabular-nums">
                    Total Paid: S${confirmedSnapshot.total.toFixed(2)}
                  </span>
                </div>
                {confirmedSnapshot.items.map((item) => (
                  <div key={item.id} className="p-4 space-y-1 text-sm">
                    <div className="font-semibold text-slate-900">
                      {item.quantity} × {item.tierName}
                    </div>
                    <div className="text-xs text-slate-600">{item.sessionLabel}</div>
                    <div className="text-xs font-mono text-slate-500">
                      Seats: {item.seats.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-2.5 text-sm font-semibold text-white bg-[#16181F] hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Return to Event Page
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <Ticket className="w-10 h-10 text-slate-300" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-900">
                Your ticket bag is empty
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Select a performance date and seating category to add tickets for The Nutcracker.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-lg cursor-pointer"
              >
                Browse Showtimes
              </button>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.tierName}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {item.sessionLabel}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">
                        {item.seats.join(', ')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.tierName}`}
                      className="p-1.5 text-slate-400 hover:text-[#E11D38] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="inline-flex items-center border border-slate-300 rounded-md">
                      <button
                        type="button"
                        aria-label="Decrease ticket quantity"
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="p-1.5 text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase ticket quantity"
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="p-1.5 text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        S${(item.unitPrice * item.quantity - item.discountAmount).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-500 tabular-nums">
                        + S${(item.bookingFeePerUnit * item.quantity).toFixed(2)} booking fee
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form id="sistic-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label htmlFor="buyer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as per NRIC / Passport)
                </label>
                <input
                  id="buyer-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Wei Ming Tan"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E11D38]"
                />
              </div>

              <div>
                <label htmlFor="buyer-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (for e-Ticket delivery)
                </label>
                <input
                  id="buyer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E11D38]"
                />
              </div>

              <div>
                <label htmlFor="buyer-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  id="buyer-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+65 9123 4567"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#E11D38]"
                />
              </div>

              <div className="pt-2">
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  Payment Method
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit / Debit' },
                    { id: 'paynow', label: 'PayNow QR' },
                    { id: 'grabpay', label: 'GrabPay' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as 'card' | 'paynow' | 'grabpay')}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        paymentMethod === m.id
                          ? 'border-[#E11D38] bg-rose-50/60 text-[#E11D38]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ticket Subtotal</span>
                <span className="tabular-nums font-medium text-slate-900">
                  S${subtotal.toFixed(2)}
                </span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Savings</span>
                  <span className="tabular-nums font-medium">
                    -S${totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>SISTIC Booking Fee</span>
                <span className="tabular-nums font-medium text-slate-900">
                  S${totalFees.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Payable</span>
                <span className="tabular-nums">S${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 text-sm font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-lg transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="px-4 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="sistic-checkout-form"
                  className="flex-1 py-3 text-sm font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-lg transition-colors cursor-pointer"
                >
                  Complete Order (S${grandTotal.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
