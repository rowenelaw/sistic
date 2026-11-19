import React, { useState } from 'react';
import { ShoppingBag, Search, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onJumpToTab: (tab: 'synopsis' | 'pricing' | 'admission' | 'promotions' | 'venue') => void;
}

const DIRECTORY_ITEMS = [
  {
    title: 'The Nutcracker — State Ballet of Georgia',
    category: 'Theatre & Dance',
    dates: '26 – 29 Nov 2026',
    venue: 'Sands Theatre, Marina Bay Sands',
    price: 'From S$48',
    current: true,
  },
  {
    title: 'Swan Lake — Classical Gala',
    category: 'Theatre & Dance',
    dates: '4 – 6 Dec 2026',
    venue: 'Sands Theatre, Marina Bay Sands',
    price: 'From S$68',
    current: false,
  },
  {
    title: 'New Year Viennese Waltz Concert',
    category: 'Concerts',
    dates: '28 – 30 Dec 2026',
    venue: 'Esplanade Concert Hall',
    price: 'From S$58',
    current: false,
  },
  {
    title: 'Singapore Symphony Orchestra: Winter Classics',
    category: 'Concerts',
    dates: '18 – 19 Dec 2026',
    venue: 'Victoria Concert Hall',
    price: 'From S$35',
    current: false,
  },
];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onJumpToTab,
}) => {
  const [directoryFilter, setDirectoryFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filteredDirectory = DIRECTORY_ITEMS.filter((item) => {
    const matchesCategory =
      !directoryFilter ||
      directoryFilter === 'All' ||
      item.category === directoryFilter;
    const matchesQuery =
      !query.trim() ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.venue.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#top"
          className="text-2xl font-bold tracking-tight text-[#E11D38] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D38]"
        >
          SISTIC
        </a>

        {/* Zone 2: 5 Concise Single-Line Nav Links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700"
        >
          <button
            type="button"
            onClick={() => setDirectoryFilter((prev) => (prev === 'All' ? null : 'All'))}
            className="hover:text-[#E11D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Events
          </button>
          <button
            type="button"
            onClick={() =>
              setDirectoryFilter((prev) =>
                prev === 'Theatre & Dance' ? null : 'Theatre & Dance'
              )
            }
            className="hover:text-[#E11D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Theatre & Dance
          </button>
          <button
            type="button"
            onClick={() =>
              setDirectoryFilter((prev) => (prev === 'Concerts' ? null : 'Concerts'))
            }
            className="hover:text-[#E11D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Concerts
          </button>
          <button
            type="button"
            onClick={() => {
              setDirectoryFilter(null);
              onJumpToTab('venue');
            }}
            className="hover:text-[#E11D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Venues
          </button>
          <button
            type="button"
            onClick={() => {
              setDirectoryFilter(null);
              onJumpToTab('promotions');
            }}
            className="hover:text-[#E11D38] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Promotions
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#E11D38] hover:bg-[#C4142D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D38]"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span className="tabular-nums">
              My Tickets{cartCount > 0 ? ` (${cartCount})` : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable SISTIC Event Finder Panel triggered by Events / Category Links */}
      {directoryFilter && (
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search SISTIC events or venues..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#E11D38]"
                />
              </div>
              <div className="flex items-center gap-2">
                {['All', 'Theatre & Dance', 'Concerts'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDirectoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      directoryFilter === cat
                        ? 'bg-[#16181F] text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDirectoryFilter(null)}
                  aria-label="Close event finder"
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredDirectory.map((ev) => (
                <div
                  key={ev.title}
                  className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between gap-2"
                >
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      {ev.category} · {ev.dates}
                    </p>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">{ev.venue}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-900 tabular-nums">
                      {ev.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDirectoryFilter(null)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#E11D38] hover:underline cursor-pointer"
                    >
                      {ev.current ? 'Viewing Now' : 'Preview'}
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
