import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { EventHero } from './components/EventHero';
import { YearStreakCard } from './components/YearStreakCard';
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
  INITIAL_2026_STREAK_SHOWS,
  CartItem,
  ShowPurchaseRecord,
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
  const [showsBought2026, setShowsBought2026] = useState<ShowPurchaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sistic_2026_streak_shows');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial 2026 shows
    }
    return INITIAL_2026_STREAK_SHOWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'sistic_2026_streak_shows',
        JSON.stringify(showsBought2026)
      );
    } catch {
      // Ignore storage errors
    }
  }, [showsBought2026]);

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

  const handleUpdateCartSession = (id: string, sessionId: string) => {
    const session =
      SHOW_SESSIONS.find((s) => s.id === sessionId) ?? SHOW_SESSIONS[0];
    setSelectedSessionId(session.id);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              sessionId: session.id,
              sessionLabel: `${session.dateLabel} · ${session.time}`,
            }
          : item
      )
    );
  };

  const handleUpdateCartTier = (id: string, tierId: string) => {
    const tier = PRICE_TIERS.find((t) => t.id === tierId) ?? PRICE_TIERS[0];
    setSelectedTierId(tier.id);
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextQty = tier.isBox ? 1 : item.quantity;
        const generatedSeats = Array.from({ length: nextQty }, (_, idx) => {
          if (tier.isBox) {
            return `${tier.section} · Box ${idx + 1} (4 Seats)`;
          }
          const startSeat = 11 + idx;
          return `${tier.section} · Row ${
            tier.id === 'premium' ? 'D' : tier.id === 'vip' ? 'J' : 'L'
          } · Seat ${startSeat}`;
        });
        const discount = computeDiscount(tier.id, tier.price, nextQty);
        return {
          ...item,
          tierId: tier.id,
          tierName: tier.name,
          unitPrice: tier.price,
          bookingFeePerUnit: tier.bookingFee,
          quantity: nextQty,
          seats: generatedSeats,
          promoCode: discount > 0 ? promoCode ?? undefined : undefined,
          discountAmount: discount,
        };
      })
    );
  };

  const handleOrderCompleted = (orderRef: string, purchasedItems: CartItem[]) => {
    const totalTicketsBought = purchasedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const firstSession = purchasedItems[0]?.sessionLabel ?? '26 Nov 2026';
    const newRecord: ShowPurchaseRecord = {
      id: `2026-q4-${Date.now()}`,
      title: 'The Nutcracker — State Ballet of Georgia',
      dateLabel: firstSession.split(' · ')[0] || '26 Nov 2026',
      quarter: 'Q4',
      venue: 'Sands Theatre, Marina Bay Sands',
      tickets: totalTicketsBought || 1,
      orderRef,
    };
    setShowsBought2026((prev) => {
      const next = [...prev, newRecord];
      triggerToast(`2026 Streak updated! ${next.length} shows bought in 2026.`);
      return next;
    });
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
          onBuyTickets={handleAddBestAvailable}
          onOpenSeatMap={() => handleOpenSeatMap()}
        />

        {/* 2026 Year Streak Record & Cute Otter Mascot */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 lg:pt-8">
          <YearStreakCard
            showsBought2026={showsBought2026}
            onBookToExtend={handleAddBestAvailable}
          />
        </div>

        {/* Primary 2-Column SISTIC Event Body */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 lg:py-8">
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
        onUpdateSession={handleUpdateCartSession}
        onUpdateTier={handleUpdateCartTier}
        onRemoveItem={(id) =>
          setCartItems((prev) => prev.filter((item) => item.id !== id))
        }
        onClearCart={() => setCartItems([])}
        onOrderCompleted={handleOrderCompleted}
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
