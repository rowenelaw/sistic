import React, { useState } from 'react';
import { OTTER_MASCOT_IMAGE, ShowPurchaseRecord } from '../data/nutcrackerData';
import { Award, ChevronDown, Check, Ticket } from 'lucide-react';

interface YearStreakCardProps {
  showsBought2026: ShowPurchaseRecord[];
  onBookToExtend: () => void;
}

const QUARTERS: ('Q1' | 'Q2' | 'Q3' | 'Q4')[] = ['Q1', 'Q2', 'Q3', 'Q4'];

export const YearStreakCard: React.FC<YearStreakCardProps> = ({
  showsBought2026,
  onBookToExtend,
}) => {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const totalShows = showsBought2026.length;
  const totalTickets = showsBought2026.reduce((sum, s) => sum + s.tickets, 0);
  const completedQuarters = new Set(showsBought2026.map((s) => s.quarter));
  const hasNutcracker = showsBought2026.some((s) =>
    s.title.toLowerCase().includes('nutcracker')
  );

  return (
    <section
      aria-label="2026 Year Streak Record"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Cute Otter Mascot & 2026 Streak Summary */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F8FAFC] border border-slate-200 shrink-0 flex items-center justify-center">
            {!imgError ? (
              <img
                src={OTTER_MASCOT_IMAGE}
                alt="Cute Singapore otter mascot wearing a red bow tie and holding a golden theatre ticket"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <Ticket className="w-8 h-8 text-[#E11D38]" aria-hidden="true" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E11D38]">
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2026 Year Streak Record</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
              {totalShows} {totalShows === 1 ? 'Show' : 'Shows'} Bought in 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              <span className="tabular-nums font-medium text-slate-800">
                {completedQuarters.size}/4 quarters active
              </span>
              <span aria-hidden="true" className="mx-1.5 text-slate-400">·</span>
              <span className="tabular-nums">{totalTickets} total tickets</span>
              <span aria-hidden="true" className="mx-1.5 text-slate-400">·</span>
              <span>
                {hasNutcracker
                  ? 'Full 2026 Grand Slam unlocked!'
                  : 'Book The Nutcracker to complete your Q4 streak'}
              </span>
            </p>
          </div>
        </div>

        {/* Right: 2026 Quarterly Streak Track & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-2" aria-label="2026 Quarterly Streak">
            {QUARTERS.map((q) => {
              const done = completedQuarters.has(q);
              return (
                <div
                  key={q}
                  className={`px-3 py-2 rounded-lg border text-center min-w-[54px] ${
                    done
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="text-[11px] font-bold">{q}</div>
                  <div className="text-[10px] font-medium mt-0.5 flex items-center justify-center gap-0.5">
                    {done ? (
                      <>
                        <Check className="w-2.5 h-2.5" aria-hidden="true" />
                        <span>Done</span>
                      </>
                    ) : (
                      <span>Open</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {!hasNutcracker && (
              <button
                type="button"
                onClick={onBookToExtend}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Extend to {totalShows + 1}
              </button>
            )}
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>2026 History</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  expanded ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable 2026 Shows Bought Log */}
      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-5 py-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-semibold">Quarter</th>
                  <th className="py-2 pr-4 font-semibold">Show Title</th>
                  <th className="py-2 pr-4 font-semibold">Venue</th>
                  <th className="py-2 pr-4 font-semibold">Date</th>
                  <th className="py-2 pr-4 font-semibold text-right">Tickets</th>
                  <th className="py-2 font-semibold text-right">Order Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {showsBought2026.map((record) => (
                  <tr key={record.id}>
                    <td className="py-2.5 pr-4 font-semibold text-slate-700">
                      {record.quarter} 2026
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-slate-900">
                      {record.title}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600">{record.venue}</td>
                    <td className="py-2.5 pr-4 text-slate-600 tabular-nums whitespace-nowrap">
                      {record.dateLabel}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-semibold text-slate-900 tabular-nums">
                      {record.tickets}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-500">
                      {record.orderRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
