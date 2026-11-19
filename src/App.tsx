import { useState } from 'react';
import { Header } from './components/Header';
import { EventHero } from './components/EventHero';
import { EventDetailsTabs, EventTabKey } from './components/EventDetailsTabs';
import { BookingSidebar } from './components/BookingSidebar';
import { SeatMapModal } from './components/SeatMapModal';
import { CartDrawer } from './components/CartDrawer';
import { RelatedEventsSection } from './components/RelatedEventsSection';
import { Footer } from './components/Footer';
import {
  SHOW_SESSIONS,
  PRICE_TIERS,
  PROMO_OFFERS,
  CartItem,
} from './data/nutcrackerData';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<EventTabKey>('synopsis');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(SHOW_SESSIONS[0].id);
  const [selectedTierId, setSelectedTierId] = useState<string>(PRICE_TIERS[2].id);
  const [quantity, setQuantity] = useState<number>(2);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  const [seatMapOpen, setSeatMapOpen] = useState(false);
  const [seatMapInitialTier, setSeatMapInitialTier] = useState<string>('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const jumpToTab = (tab: EventTabKey) => {
    setActiveTab(tab);
    const el = document.getElementById('event-details');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenSeatMap = (tierId?: string) => {
    setSeatMapInitialTier(tierId ?? 'all');
    setSeatMapOpen(true);
  };

  const computeDiscount = (tierId: string, unitPrice: number, qty: number) => {
    if (!promoCode) return 0;
    const offer = PROMO_OFFERS.find((o) => o.code === promoCode);
    if (!offer || !offer.applicableTiers.includes(tierId)) return 0;
    return Math.round((unitPrice * qty * offer.discountPercent) / 100);
  };

  const handleAddBestAvailable = () => {
    const session =
      SHOW_SESSIONS.find((s) => s.id === selectedSessionId) ?? SHOW_SESSIONS[0];
    const tier =
      PRICE_TIERS.find((t) => t.id === selectedTierId) ?? PRICE_TIERS[0];

    const generatedSeats = Array.from({ length: quantity }, (_, idx) => {
      if (tier.isBox) {
        return `${tier.section} · Box ${idx + 1} (4 Seats)`;
      }
      const startSeat = 11 + idx;
      return `${tier.section} · Row ${tier.id === 'premium' ? 'D' : tier.id === 'vip' ? 'J' : 'L'} · Seat ${startSeat}`;
    });

    const discountAmount = computeDiscount(tier.id, tier.price, quantity);

    const newItem: CartItem = {
      id: `${session.id}-${tier.id}-${Date.now()}`,
      sessionId: session.id,
      sessionLabel: `${session.dateLabel} · ${session.time}`,
      tierId: tier.id,
      tierName: tier.name,
      unitPrice: tier.price,
      bookingFeePerUnit: tier.bookingFee,
      quantity,
      seats: generatedSeats,
      promoCode: discountAmount > 0 ? promoCode ?? undefined : undefined,
      discountAmount,
    };

    setCartItems((prev) => [...prev, newItem]);
    setCartOpen(true);
    triggerToast(`Added ${quantity} × ${tier.name} to your ticket bag.`);
  };

  const handleConfirmSeatsFromMap = (tierId: string, seatLabels: string[]) => {
    const session =
      SHOW_SESSIONS.find((s) => s.id === selectedSessionId) ?? SHOW_SESSIONS[0];
    const tier = PRICE_TIERS.find((t) => t.id === tierId) ?? PRICE_TIERS[0];
    const qty = tier.isBox ? 1 : seatLabels.length;
    const discountAmount = computeDiscount(tier.id, tier.price, qty);

    const newItem: CartItem = {
      id: `${session.id}-${tier.id}-${Date.now()}`,
      sessionId: session.id,
      sessionLabel: `${session.dateLabel} · ${session.time}`,
      tierId: tier.id,
      tierName: tier.name,
      unitPrice: tier.price,
      bookingFeePerUnit: tier.bookingFee,
      quantity: qty,
      seats: seatLabels,
      promoCode: discountAmount > 0 ? promoCode ?? undefined : undefined,
      discountAmount,
    };

    setCartItems((prev) => [...prev, newItem]);
    setSeatMapOpen(false);
    setCartOpen(true);
    triggerToast(`Reserved ${seatLabels.length} seat(s) in ${tier.name}.`);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = Math.max(1, Math.min(8, item.quantity + delta));
          const discount = item.promoCode
            ? Math.round(
                (item.unitPrice *
                  nextQty *
                  (PROMO_OFFERS.find((o) => o.code === item.promoCode)
                    ?.discountPercent ?? 0)) /
                  100
              )
            : 0;
          return {
            ...item,
            quantity: nextQty,
            discountAmount: discount,
          };
        })
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F9] text-[#16181F]">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onJumpToTab={jumpToTab}
      />

      <main className="flex-1">
        <EventHero
          onBuyTickets={scrollToBooking}
          onOpenSeatMap={() => handleOpenSeatMap()}
        />

        {/* Primary 2-Column SISTIC Event Body */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <EventDetailsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSelectTier={(tierId) => {
                  setSelectedTierId(tierId);
                  scrollToBooking();
                  triggerToast('Seating category updated in booking panel.');
                }}
                onApplyPromo={(code) => {
                  setPromoCode(code);
                  triggerToast(`Promo code ${code} applied.`);
                }}
                activePromoCode={promoCode}
                onOpenSeatMap={handleOpenSeatMap}
              />
            </div>

            <div className="lg:col-span-4">
              <BookingSidebar
                selectedSessionId={selectedSessionId}
                onSelectSession={setSelectedSessionId}
                selectedTierId={selectedTierId}
                onSelectTier={(id) => {
                  setSelectedTierId(id);
                  setQuantity(1);
                }}
                quantity={quantity}
                onQuantityChange={setQuantity}
                promoCode={promoCode}
                onApplyPromoCode={setPromoCode}
                onOpenSeatMap={handleOpenSeatMap}
                onAddToCart={handleAddBestAvailable}
              />
            </div>
          </div>
        </section>

        <RelatedEventsSection onBookCurrent={scrollToBooking} />
      </main>

      <Footer
        onJumpToTab={jumpToTab}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Interactive Seat Map Modal */}
      <SeatMapModal
        isOpen={seatMapOpen}
        onClose={() => setSeatMapOpen(false)}
        selectedSessionId={selectedSessionId}
        onSelectSession={setSelectedSessionId}
        initialTierId={seatMapInitialTier}
        onConfirmSeats={handleConfirmSeatsFromMap}
      />

      {/* Slide-Over Ticket Bag & Checkout Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={(id) =>
          setCartItems((prev) => prev.filter((item) => item.id !== id))
        }
        onClearCart={() => setCartItems([])}
      />

      {/* Subtle Action Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#16181F] text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
