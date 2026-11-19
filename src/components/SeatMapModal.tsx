import React, { useMemo, useState } from 'react';
import { X, Check } from 'lucide-react';
import {
  PRICE_TIERS,
  SHOW_SESSIONS,
  PriceTier,
} from '../data/nutcrackerData';

interface SeatNode {
  id: string;
  section: 'Stalls' | 'Dress Circle' | 'Grand Circle';
  row: string;
  number: number;
  tierId: string;
  occupied: boolean;
}

interface SeatMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSessionId: string;
  onSelectSession: (id: string) => void;
  initialTierId: string;
  onConfirmSeats: (tierId: string, seatLabels: string[]) => void;
}

const SEAT_ROWS: {
  section: 'Stalls' | 'Dress Circle' | 'Grand Circle';
  rows: { row: string; tierId: string; count: number }[];
}[] = [
  {
    section: 'Stalls',
    rows: [
      { row: 'C', tierId: 'premium', count: 14 },
      { row: 'D', tierId: 'premium', count: 16 },
      { row: 'H', tierId: 'vip', count: 16 },
      { row: 'J', tierId: 'vip', count: 16 },
      { row: 'L', tierId: 'a-reserve', count: 16 },
      { row: 'P', tierId: 'b-reserve', count: 16 },
    ],
  },
  {
    section: 'Dress Circle',
    rows: [
      { row: 'AA', tierId: 'dress-circle', count: 14 },
      { row: 'BB', tierId: 'dress-circle', count: 14 },
      { row: 'BOX-D', tierId: 'dress-box', count: 4 },
    ],
  },
  {
    section: 'Grand Circle',
    rows: [
      { row: 'GA', tierId: 'c-reserve', count: 14 },
      { row: 'GB', tierId: 'grand-circle', count: 14 },
      { row: 'BOX-G', tierId: 'grand-box', count: 4 },
    ],
  },
];

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  isOpen,
  onClose,
  selectedSessionId,
  onSelectSession,
  initialTierId,
  onConfirmSeats,
}) => {
  const [filterTierId, setFilterTierId] = useState<string>(initialTierId || 'all');
  const [selectedSeats, setSelectedSeats] = useState<SeatNode[]>([]);

  const seatsBySection = useMemo(() => {
    const seedOffset = selectedSessionId.length * 3;
    return SEAT_ROWS.map((group) => ({
      section: group.section,
      rows: group.rows.map((r, rIdx) => {
        const nodes: SeatNode[] = Array.from({ length: r.count }, (_, idx) => {
          const seatNum = idx + 1;
          const pseudoHash = (seatNum * 7 + rIdx * 11 + seedOffset) % 13;
          const occupied = pseudoHash === 0 || pseudoHash === 4 || pseudoHash === 9;
          return {
            id: `${group.section}-${r.row}-${seatNum}`,
            section: group.section,
            row: r.row,
            number: seatNum,
            tierId: r.tierId,
            occupied,
          };
        });
        return { ...r, nodes };
      }),
    }));
  }, [selectedSessionId]);

  if (!isOpen) return null;

  const activeTierFilter = filterTierId === 'all' ? null : filterTierId;

  const toggleSeat = (seat: SeatNode) => {
    if (seat.occupied) return;

    const already = selectedSeats.some((s) => s.id === seat.id);
    if (already) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      return;
    }

    // Keep selections consistent within one tier for clean SISTIC cart line-item
    if (selectedSeats.length > 0 && selectedSeats[0].tierId !== seat.tierId) {
      setSelectedSeats([seat]);
      return;
    }

    if (selectedSeats.length >= 8) return;
    setSelectedSeats((prev) => [...prev, seat]);
  };

  const activeTier: PriceTier | undefined =
    selectedSeats.length > 0
      ? PRICE_TIERS.find((t) => t.id === selectedSeats[0].tierId)
      : PRICE_TIERS.find((t) => t.id === filterTierId);

  const selectedLabels = selectedSeats.map(
    (s) => `${s.section} · Row ${s.row} · Seat ${s.number}`
  );

  const estimatedSubtotal = activeTier
    ? (activeTier.isBox
        ? activeTier.price
        : activeTier.price * selectedSeats.length)
    : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sands Theatre Interactive Seating Plan"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-xl">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Sands Theatre — Interactive Seating Plan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select up to 8 seats in your preferred category
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              aria-label="Performance Date"
              value={selectedSessionId}
              onChange={(e) => {
                onSelectSession(e.target.value);
                setSelectedSeats([]);
              }}
              className="hidden sm:block text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
            >
              {SHOW_SESSIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.dateLabel} · {s.time}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close seat map"
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Tier Legend */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 p-4 sm:p-5 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Filter by Category</span>
              <button
                type="button"
                onClick={() => setFilterTierId('all')}
                className="text-xs font-semibold text-[#E11D38] hover:underline cursor-pointer"
              >
                Show All
              </button>
            </div>

            <div className="space-y-1.5">
              {PRICE_TIERS.map((tier) => {
                const isSelected = filterTierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() =>
                      setFilterTierId((prev) => (prev === tier.id ? 'all' : tier.id))
                    }
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#16181F] bg-white font-semibold'
                        : 'border-slate-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ backgroundColor: tier.colorHex }}
                        aria-hidden="true"
                      />
                      <span className="truncate text-slate-900">{tier.name}</span>
                    </span>
                    <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                      S${tier.price}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Seat Legend (Color + Icon/Pattern for Accessibility) */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-600 inline-flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5" aria-hidden="true" />
                </span>
                Selected
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded border border-slate-400 bg-white inline-block" />
                Available
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-200 text-slate-400 inline-flex items-center justify-center text-[10px]">
                  ×
                </span>
                Sold
              </span>
            </div>
          </div>

          {/* Right: Theatre Seating Grid */}
          <div className="lg:col-span-8 p-4 sm:p-6 bg-white flex flex-col items-center">
            {/* Stage Indicator */}
            <div className="w-full max-w-lg mb-6">
              <div className="h-9 bg-[#16181F] text-white text-xs font-semibold tracking-widest uppercase rounded-t-xl flex items-center justify-center">
                Stage & Orchestra Pit
              </div>
              <div className="h-2 bg-gradient-to-b from-slate-200 to-transparent rounded-b-lg" />
            </div>

            <div className="w-full space-y-6 overflow-x-auto pb-2">
              {seatsBySection.map((sectionGroup) => (
                <div key={sectionGroup.section} className="space-y-2">
                  <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {sectionGroup.section}
                  </div>
                  <div className="space-y-1.5 flex flex-col items-center">
                    {sectionGroup.rows.map((rowObj) => {
                      const tier = PRICE_TIERS.find((t) => t.id === rowObj.tierId)!;
                      const isDimmed =
                        activeTierFilter !== null && activeTierFilter !== rowObj.tierId;

                      return (
                        <div
                          key={rowObj.row}
                          className={`flex items-center gap-1.5 transition-opacity ${
                            isDimmed ? 'opacity-25' : 'opacity-100'
                          }`}
                        >
                          <span className="w-11 text-right text-[11px] font-mono text-slate-500 pr-1.5 shrink-0">
                            {rowObj.row}
                          </span>
                          <div className="flex items-center gap-1">
                            {rowObj.nodes.map((seat, idx) => {
                              const isSelected = selectedSeats.some(
                                (s) => s.id === seat.id
                              );
                              const aisleGap =
                                rowObj.nodes.length >= 12 &&
                                idx === Math.floor(rowObj.nodes.length / 2)
                                  ? 'ml-3'
                                  : '';

                              return (
                                <button
                                  key={seat.id}
                                  type="button"
                                  disabled={seat.occupied}
                                  onClick={() => toggleSeat(seat)}
                                  title={`${seat.section} · Row ${seat.row} · Seat ${seat.number} (${tier.name} - S$${tier.price})`}
                                  className={`w-6 h-6 rounded text-[10px] font-semibold tabular-nums flex items-center justify-center transition-transform cursor-pointer ${aisleGap} ${
                                    seat.occupied
                                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-emerald-600 text-white scale-105'
                                      : 'text-white hover:scale-105'
                                  }`}
                                  style={
                                    !seat.occupied && !isSelected
                                      ? { backgroundColor: tier.colorHex }
                                      : undefined
                                  }
                                >
                                  {seat.occupied ? (
                                    '×'
                                  ) : isSelected ? (
                                    <Check className="w-3 h-3" aria-hidden="true" />
                                  ) : (
                                    seat.number
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-600 min-w-0">
            {selectedSeats.length === 0 ? (
              <span>Click available seats on the seating chart to reserve them.</span>
            ) : (
              <div>
                <span className="font-semibold text-slate-900">
                  {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected (
                  {activeTier?.name}):
                </span>{' '}
                <span className="text-slate-700">{selectedLabels.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {selectedSeats.length > 0 && (
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                S${estimatedSubtotal.toFixed(2)}
              </span>
            )}
            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={() => {
                if (activeTier && selectedLabels.length > 0) {
                  onConfirmSeats(activeTier.id, selectedLabels);
                }
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
            >
              <span>Confirm Seats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
