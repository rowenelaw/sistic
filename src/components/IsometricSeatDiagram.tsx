import React, { useState } from 'react';
import { PRICE_TIERS } from '../data/nutcrackerData';

interface IsometricSeatDiagramProps {
  selectedTierId: string;
  onSelectTier: (tierId: string) => void;
  compact?: boolean;
}

interface IsoZone {
  id: string;
  tierId: string;
  label: string;
  topPoints: string;
  sideLeftPoints?: string;
  sideRightPoints?: string;
  labelX: number;
  labelY: number;
}

// Isometric theatre zones projected from an elevated 30-degree perspective
// Stage is at the front-bottom-left; tiers rise toward the upper-right.
const ISO_ZONES: IsoZone[] = [
  // Stalls (Ground sloping plane)
  {
    id: 'premium',
    tierId: 'premium',
    label: 'Premium',
    topPoints: '126,184 188,150 226,172 164,206',
    sideLeftPoints: '126,184 164,206 164,212 126,190',
    sideRightPoints: '164,206 226,172 226,178 164,212',
    labelX: 176,
    labelY: 180,
  },
  {
    id: 'vip',
    tierId: 'vip',
    label: 'VIP',
    topPoints: '166,162 224,130 264,152 206,184',
    sideLeftPoints: '166,162 206,184 206,190 166,168',
    sideRightPoints: '206,184 264,152 264,158 206,190',
    labelX: 214,
    labelY: 160,
  },
  {
    id: 'a-reserve',
    tierId: 'a-reserve',
    label: 'A Res',
    topPoints: '208,138 262,108 304,132 250,162',
    sideLeftPoints: '208,138 250,162 250,168 208,144',
    sideRightPoints: '250,162 304,132 304,138 250,168',
    labelX: 256,
    labelY: 137,
  },
  {
    id: 'b-reserve',
    tierId: 'b-reserve',
    label: 'B Res',
    topPoints: '252,114 300,88 342,112 294,138',
    sideLeftPoints: '252,114 294,138 294,144 252,120',
    sideRightPoints: '294,138 342,112 342,118 294,144',
    labelX: 297,
    labelY: 115,
  },
  // Dress Circle (Elevated middle balcony tier)
  {
    id: 'dress-circle',
    tierId: 'dress-circle',
    label: 'Dress Circle',
    topPoints: '198,84 274,42 332,75 256,117',
    sideLeftPoints: '198,84 256,117 256,127 198,94',
    sideRightPoints: '256,117 332,75 332,85 256,127',
    labelX: 264,
    labelY: 81,
  },
  {
    id: 'dress-box-left',
    tierId: 'dress-box',
    label: 'Box',
    topPoints: '164,102 192,87 212,98 184,113',
    sideLeftPoints: '164,102 184,113 184,121 164,110',
    sideRightPoints: '184,113 212,98 212,106 184,121',
    labelX: 188,
    labelY: 102,
  },
  {
    id: 'dress-box-right',
    tierId: 'dress-box',
    label: 'Box',
    topPoints: '316,84 344,69 364,80 336,95',
    sideLeftPoints: '316,84 336,95 336,103 316,92',
    sideRightPoints: '336,95 364,80 364,88 336,103',
    labelX: 340,
    labelY: 84,
  },
  // Grand Circle (Highest upper balcony tier)
  {
    id: 'c-reserve',
    tierId: 'c-reserve',
    label: 'C Res',
    topPoints: '234,36 294,3 342,30 282,63',
    sideLeftPoints: '234,36 282,63 282,72 234,45',
    sideRightPoints: '282,63 342,30 342,39 282,72',
    labelX: 288,
    labelY: 35,
  },
  {
    id: 'grand-circle',
    tierId: 'grand-circle',
    label: 'Grand Circle',
    topPoints: '284,64 344,31 384,54 324,87',
    sideLeftPoints: '284,64 324,87 324,96 284,73',
    sideRightPoints: '324,87 384,54 384,63 324,96',
    labelX: 334,
    labelY: 60,
  },
  {
    id: 'grand-box',
    tierId: 'grand-box',
    label: 'G.Box',
    topPoints: '202,52 228,38 246,48 220,62',
    sideLeftPoints: '202,52 220,62 220,70 202,60',
    sideRightPoints: '220,62 246,48 246,56 220,70',
    labelX: 224,
    labelY: 52,
  },
];

export const IsometricSeatDiagram: React.FC<IsometricSeatDiagramProps> = ({
  selectedTierId,
  onSelectTier,
  compact = false,
}) => {
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);

  const previewTierId = hoveredTierId ?? selectedTierId;
  const previewTier = PRICE_TIERS.find((t) => t.id === previewTierId) ?? PRICE_TIERS[0];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold text-slate-700">
          Isometric Seat Map (Click zone)
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 tabular-nums">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: previewTier.colorHex }}
            aria-hidden="true"
          />
          <span className="truncate max-w-[135px]">
            {previewTier.name.split(' (')[0]} · S${previewTier.price}
          </span>
        </span>
      </div>

      <svg
        viewBox="40 0 365 245"
        role="img"
        aria-label="Isometric seat map diagram of Sands Theatre showing stage, stalls, dress circle, and grand circle"
        className={`w-full select-none ${compact ? 'h-36' : 'h-44'}`}
      >
        {/* Subtle Auditorium Floor Shadow */}
        <polygon
          points="56,194 286,66 392,126 162,240"
          fill="#E2E8F0"
          opacity="0.55"
        />

        {/* Isometric Stage & Orchestra Pit */}
        <g>
          <polygon
            points="58,186 124,149 178,180 112,217"
            fill="#16181F"
            stroke="#334155"
            strokeWidth="1"
          />
          <polygon
            points="58,186 112,217 112,226 58,195"
            fill="#0F172A"
          />
          <polygon
            points="112,217 178,180 178,189 112,226"
            fill="#1E293B"
          />
          <text
            x="118"
            y="186"
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="0.8"
          >
            STAGE
          </text>
        </g>

        {/* Isometric Seating Zones */}
        {ISO_ZONES.map((zone) => {
          const tier = PRICE_TIERS.find((t) => t.id === zone.tierId);
          if (!tier) return null;

          const isSelected = selectedTierId === zone.tierId;
          const isHovered = hoveredTierId === zone.tierId;
          const active = isSelected || isHovered;

          return (
            <g
              key={zone.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${tier.name} at S$${tier.price}`}
              onClick={() => onSelectTier(zone.tierId)}
              onMouseEnter={() => setHoveredTierId(zone.tierId)}
              onMouseLeave={() => setHoveredTierId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTier(zone.tierId);
                }
              }}
              className="cursor-pointer focus:outline-none"
              style={{
                transform: active ? 'translateY(-3px)' : 'translateY(0px)',
                transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {zone.sideLeftPoints && (
                <polygon
                  points={zone.sideLeftPoints}
                  fill={tier.colorHex}
                  fillOpacity={active ? 0.85 : 0.65}
                />
              )}
              {zone.sideRightPoints && (
                <polygon
                  points={zone.sideRightPoints}
                  fill="#0F172A"
                  fillOpacity={active ? 0.35 : 0.45}
                />
              )}
              <polygon
                points={zone.topPoints}
                fill={tier.colorHex}
                fillOpacity={active ? 1 : 0.82}
                stroke={isSelected ? '#FFFFFF' : '#F8FAFC'}
                strokeWidth={isSelected ? '2' : '1'}
              />
              <text
                x={zone.labelX}
                y={zone.labelY}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={zone.label.length > 7 ? '7.2' : '8'}
                fontWeight="700"
                style={{ pointerEvents: 'none' }}
              >
                {zone.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
