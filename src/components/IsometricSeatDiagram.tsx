import React, { useState } from 'react';
import { PRICE_TIERS } from '../data/nutcrackerData';

interface IsometricSeatDiagramProps {
  selectedTierId: string;
  onSelectTier: (tierId: string) => void;
  compact?: boolean;
}

interface CurvedIsoBlock {
  id: string;
  tierId: string;
  topPath: string;
  sidePath: string;
  topColor: string;
  sideColor: string;
}

// Replicates the SISTIC Sands Theatre STALLS (GROUND LEVEL) isometric seat map reference:
// Curved grey 3D horseshoe base, Doors 1–8 perimeter arrows, STAGE at bottom-right,
// and colour-coded 3D extruded seating blocks (Peach, Blue, Green, Purple, Yellow, Cyan).
const ISO_BLOCKS: CurvedIsoBlock[] = [
  // --- REAR CYAN BLOCKS (C Reserve / Grand Circle) ---
  {
    id: 'rear-cyan-left',
    tierId: 'c-reserve',
    topColor: '#A5DEE6',
    sideColor: '#7CBCC6',
    topPath: 'M 252 105 Q 256 76 300 66 L 312 88 Q 278 98 274 122 Z',
    sidePath: 'M 252 105 L 274 122 L 274 137 L 252 120 Z',
  },
  {
    id: 'rear-cyan-centre',
    tierId: 'grand-circle',
    topColor: '#A5DEE6',
    sideColor: '#7CBCC6',
    topPath: 'M 306 64 Q 348 52 388 53 L 395 73 Q 355 74 318 85 Z',
    sidePath: 'M 306 64 L 318 85 L 318 98 L 306 78 Z',
  },
  {
    id: 'rear-cyan-right',
    tierId: 'grand-box',
    topColor: '#A5DEE6',
    sideColor: '#7CBCC6',
    topPath: 'M 393 53 Q 425 54 452 67 L 456 87 Q 428 75 400 73 Z',
    sidePath: 'M 393 53 L 400 73 L 400 86 L 393 67 Z',
  },

  // --- CREAM YELLOW BLOCKS (B Reserve) ---
  {
    id: 'yellow-rear-centre-top',
    tierId: 'b-reserve',
    topColor: '#E5DC94',
    sideColor: '#C5BC72',
    topPath: 'M 320 88 Q 362 76 402 76 L 409 94 Q 368 95 330 107 Z',
    sidePath: 'M 320 88 L 330 107 L 330 120 L 320 101 Z',
  },
  {
    id: 'yellow-rear-centre-mid',
    tierId: 'b-reserve',
    topColor: '#E5DC94',
    sideColor: '#C5BC72',
    topPath: 'M 332 109 Q 372 97 411 97 L 417 115 Q 378 115 342 127 Z',
    sidePath: 'M 332 109 L 342 127 L 342 140 L 332 122 Z',
  },
  {
    id: 'yellow-right-outer',
    tierId: 'b-reserve',
    topColor: '#E5DC94',
    sideColor: '#C5BC72',
    topPath: 'M 417 85 Q 454 90 486 116 L 472 132 Q 445 112 422 106 Z',
    sidePath: 'M 472 132 L 486 116 L 486 129 L 472 144 Z',
  },
  {
    id: 'yellow-left-upper',
    tierId: 'b-reserve',
    topColor: '#E5DC94',
    sideColor: '#C5BC72',
    topPath: 'M 277 132 L 330 112 L 348 135 L 334 141 L 347 156 L 315 170 Z',
    sidePath: 'M 277 132 L 315 170 L 315 184 L 277 147 Z',
  },
  {
    id: 'yellow-left-lower',
    tierId: 'b-reserve',
    topColor: '#E5DC94',
    sideColor: '#C5BC72',
    topPath: 'M 321 174 L 345 164 L 368 188 L 345 198 Z',
    sidePath: 'M 321 174 L 345 198 L 345 211 L 321 187 Z',
  },
  {
    id: 'yellow-right-corner',
    tierId: 'b-reserve',
    topColor: '#E5DC94',
    sideColor: '#C5BC72',
    topPath: 'M 472 136 L 496 132 L 512 152 L 488 158 Z',
    sidePath: 'M 488 158 L 512 152 L 512 162 L 488 168 Z',
  },

  // --- ORCHID PURPLE CENTRE BLOCK (Dress Circle / Feature Box) ---
  {
    id: 'purple-centre',
    tierId: 'dress-circle',
    topColor: '#CB88DF',
    sideColor: '#A664BA',
    topPath: 'M 347 131 Q 386 119 422 118 L 430 142 Q 394 143 359 154 Z',
    sidePath: 'M 347 131 L 359 154 L 359 170 L 347 148 Z M 359 154 Q 394 143 430 142 L 430 157 Q 394 158 359 170 Z',
  },

  // --- SAGE GREEN FLANK BLOCKS (A Reserve) ---
  {
    id: 'green-left-inner-pocket',
    tierId: 'a-reserve',
    topColor: '#6EAE6B',
    sideColor: '#528D4F',
    topPath: 'M 336 142 L 353 136 L 365 150 L 348 156 Z',
    sidePath: 'M 336 142 L 348 156 L 348 166 L 336 152 Z',
  },
  {
    id: 'green-right-inner-pocket',
    tierId: 'dress-box',
    topColor: '#6EAE6B',
    sideColor: '#528D4F',
    topPath: 'M 426 112 L 456 108 L 470 124 L 440 128 Z',
    sidePath: 'M 440 128 L 470 124 L 470 135 L 440 139 Z',
  },
  {
    id: 'green-left-flank',
    tierId: 'a-reserve',
    topColor: '#6EAE6B',
    sideColor: '#528D4F',
    topPath: 'M 346 164 L 375 154 L 407 188 L 378 201 Z',
    sidePath: 'M 346 164 L 378 201 L 378 214 L 346 177 Z',
  },
  {
    id: 'green-right-flank',
    tierId: 'a-reserve',
    topColor: '#6EAE6B',
    sideColor: '#528D4F',
    topPath: 'M 443 142 L 478 134 L 520 172 L 486 183 Z',
    sidePath: 'M 486 183 L 520 172 L 520 183 L 486 194 Z',
  },

  // --- PERIWINKLE BLUE CENTRE BLOCK (VIP) ---
  {
    id: 'blue-centre-vip',
    tierId: 'vip',
    topColor: '#9BB8EB',
    sideColor: '#7997CD',
    topPath: 'M 374 164 Q 410 153 442 153 L 471 186 Q 438 187 404 198 Z',
    sidePath: 'M 374 164 L 404 198 L 404 209 L 374 176 Z',
  },

  // --- WARM PEACH FRONT BLOCKS (Premium) ---
  {
    id: 'peach-centre-main',
    tierId: 'premium',
    topColor: '#EEBA7B',
    sideColor: '#CF9A5B',
    topPath: 'M 405 199 Q 440 188 472 187 L 491 210 Q 456 212 423 224 Z',
    sidePath: 'M 405 199 L 423 224 L 423 234 L 405 210 Z',
  },
  {
    id: 'peach-centre-front-row',
    tierId: 'premium',
    topColor: '#EEBA7B',
    sideColor: '#CF9A5B',
    topPath: 'M 426 226 Q 460 214 494 213 L 506 227 Q 470 229 437 241 Z',
    sidePath: 'M 426 226 L 437 241 L 437 251 L 426 236 Z M 437 241 Q 470 229 506 227 L 506 237 Q 470 239 437 251 Z',
  },
  {
    id: 'peach-left-wing-1',
    tierId: 'premium',
    topColor: '#EEBA7B',
    sideColor: '#CF9A5B',
    topPath: 'M 377 202 L 403 192 L 414 205 L 388 216 Z',
    sidePath: 'M 377 202 L 388 216 L 388 226 L 377 212 Z',
  },
  {
    id: 'peach-left-wing-2',
    tierId: 'premium',
    topColor: '#EEBA7B',
    sideColor: '#CF9A5B',
    topPath: 'M 387 218 L 409 209 L 422 224 L 401 234 Z',
    sidePath: 'M 387 218 L 401 234 L 401 243 L 387 227 Z',
  },
  {
    id: 'peach-left-front-box',
    tierId: 'premium',
    topColor: '#EEBA7B',
    sideColor: '#CF9A5B',
    topPath: 'M 410 234 L 426 228 L 435 239 L 419 246 Z',
    sidePath: 'M 410 234 L 419 246 L 419 254 L 410 242 Z',
  },
  {
    id: 'peach-right-wing',
    tierId: 'premium',
    topColor: '#EEBA7B',
    sideColor: '#CF9A5B',
    topPath: 'M 483 184 L 519 174 L 535 190 L 499 201 Z',
    sidePath: 'M 499 201 L 535 190 L 535 200 L 499 211 Z',
  },
  {
    id: 'peach-right-front-box',
    tierId: 'premium',
    topColor: '#EEBA7B',
    sideColor: '#CF9A5B',
    topPath: 'M 499 203 L 528 195 L 538 207 L 510 216 Z',
    sidePath: 'M 510 216 L 538 207 L 538 216 L 510 225 Z',
  },
];

// Curved perimeter entry arrows (Doors 1–8) matching the reference diagram
const DOOR_ARROWS = [
  { label: 'DOOR 1', x: 562, y: 175, arrowPath: 'M 548 182 Q 536 184 528 190', headPoints: '528,190 536,184 534,193' },
  { label: 'DOOR 2', x: 518, y: 76, arrowPath: 'M 505 84 Q 496 92 492 102', headPoints: '492,102 492,93 500,97' },
  { label: 'DOOR 3', x: 464, y: 34, arrowPath: 'M 454 41 Q 447 49 444 59', headPoints: '444,59 443,50 451,54' },
  { label: 'DOOR 4', x: 356, y: 18, arrowPath: 'M 352 24 Q 348 33 348 42', headPoints: '348,42 343,34 353,34' },
  { label: 'DOOR 5', x: 256, y: 36, arrowPath: 'M 262 43 Q 270 50 274 59', headPoints: '274,59 266,54 275,50' },
  { label: 'DOOR 6', x: 204, y: 112, arrowPath: 'M 224 112 Q 236 112 246 116', headPoints: '246,116 238,119 240,110' },
  { label: 'DOOR 7', x: 230, y: 174, arrowPath: 'M 250 166 Q 262 162 273 163', headPoints: '273,163 265,168 266,158' },
  { label: 'DOOR 8', x: 328, y: 266, arrowPath: 'M 342 252 Q 348 242 347 232', headPoints: '347,232 342,240 352,240' },
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
    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold text-slate-700">
          Sands Theatre Isometric Seat Map
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 tabular-nums">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0 border border-slate-300"
            style={{ backgroundColor: previewTier.colorHex }}
            aria-hidden="true"
          />
          <span className="truncate max-w-[140px]">
            {previewTier.name.split(' (')[0]} · S${previewTier.price}
          </span>
        </span>
      </div>

      <svg
        viewBox="15 8 565 276"
        role="img"
        aria-label="Sands Theatre isometric stalls and doors seat map diagram"
        className={`w-full select-none ${compact ? 'h-40' : 'h-48'}`}
      >
        {/* Left Title matching reference layout */}
        <text
          x="74"
          y="148"
          textAnchor="middle"
          fill="#262930"
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.5"
        >
          STALLS
        </text>
        <text
          x="74"
          y="165"
          textAnchor="middle"
          fill="#475569"
          fontSize="10.5"
          fontWeight="500"
        >
          (GROUND LEVEL)
        </text>

        {/* Grey 3D Curved Horseshoe Auditorium Slab */}
        <g>
          {/* Extruded outer grey depth edge */}
          <path
            d="M 229 102 C 228 175 280 230 398 273 L 552 214 L 552 224 L 398 282 C 276 238 228 184 229 114 Z"
            fill="#9CA3AF"
          />
          {/* Top grey floor slab */}
          <path
            d="M 230 98 C 232 45 368 25 462 60 C 520 82 544 134 552 214 L 398 273 C 280 230 228 172 230 98 Z"
            fill="#E5E7EB"
            stroke="#D1D5DB"
            strokeWidth="1"
          />
        </g>

        {/* Doors 1–8 Curved Perimeter Arrows */}
        {DOOR_ARROWS.map((door) => (
          <g key={door.label}>
            <text
              x={door.x}
              y={door.y}
              textAnchor="middle"
              fill="#374151"
              fontSize="9.5"
              fontWeight="600"
            >
              {door.label}
            </text>
            <path
              d={door.arrowPath}
              fill="none"
              stroke="#6B7280"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points={door.headPoints} fill="#6B7280" />
          </g>
        ))}

        {/* Interactive 3D Isometric Seating Blocks */}
        {ISO_BLOCKS.map((block) => {
          const tier = PRICE_TIERS.find((t) => t.id === block.tierId);
          if (!tier) return null;
          const isSelected = selectedTierId === block.tierId;
          const isHovered = hoveredTierId === block.tierId;
          const isActive = isSelected || isHovered;

          return (
            <g
              key={block.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${tier.name} (S$${tier.price})`}
              onClick={() => onSelectTier(block.tierId)}
              onMouseEnter={() => setHoveredTierId(block.tierId)}
              onMouseLeave={() => setHoveredTierId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTier(block.tierId);
                }
              }}
              className="cursor-pointer focus:outline-none"
              style={{
                transform: isActive ? 'translateY(-3px)' : 'translateY(0px)',
                transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <path
                d={block.sidePath}
                fill={block.sideColor}
                opacity={isActive ? 1 : 0.85}
              />
              <path
                d={block.topPath}
                fill={block.topColor}
                opacity={isActive ? 1 : 0.9}
                stroke={isSelected ? '#16181F' : '#FFFFFF'}
                strokeWidth={isSelected ? '1.8' : '0.7'}
              />
            </g>
          );
        })}

        {/* STAGE Label at bottom-right front */}
        <text
          x="485"
          y="269"
          textAnchor="middle"
          fill="#262930"
          fontSize="14.5"
          fontWeight="600"
          letterSpacing="0.8"
        >
          STAGE
        </text>
      </svg>
    </div>
  );
};
