import React from 'react';
import { EventTabKey } from './EventDetailsTabs';

interface FooterProps {
  onJumpToTab: (tab: EventTabKey) => void;
  onOpenCart: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onJumpToTab, onOpenCart }) => {
  return (
    <footer className="bg-[#16181F] text-slate-300 border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="text-xl font-bold tracking-tight text-white">SISTIC</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Singapore’s leading ticketing service and entertainment guide for concerts, theatre,
            ballet, family shows, and live experiences.
          </p>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Event Guide
          </h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <button
                type="button"
                onClick={() => onJumpToTab('synopsis')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Synopsis & Credits
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onJumpToTab('pricing')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ticket Categories
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onJumpToTab('promotions')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Partner Promotions
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Venue & Support
          </h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <button
                type="button"
                onClick={() => onJumpToTab('venue')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Sands Theatre Directions
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onJumpToTab('admission')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Admission Rules
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenCart}
                className="hover:text-white transition-colors cursor-pointer"
              >
                My Ticket Bag
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            SISTIC Hotline
          </h3>
          <p className="text-sm font-semibold text-white tabular-nums">+65 6348 5555</p>
          <p className="text-xs text-slate-400">
            Monday – Saturday: 10:00 AM – 6:00 PM
            <br />
            Sunday & Public Holidays: Closed
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2026 SISTIC.com Pte Ltd. All rights reserved.</span>
          <span>Official Event Replication · The Nutcracker (nutcracker1126)</span>
        </div>
      </div>
    </footer>
  );
};
