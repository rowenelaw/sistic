export interface ShowSession {
  id: string;
  dateLabel: string;
  dayShort: string;
  dateNum: string;
  monthLabel: string;
  time: string;
  status: 'Available' | 'Selling Fast' | 'Limited';
  priceMultiplier?: number;
}

export interface PriceTier {
  id: string;
  name: string;
  section: 'Stalls' | 'Dress Circle' | 'Grand Circle';
  price: number;
  bookingFee: number;
  isBox?: boolean;
  seatsPerUnit: number;
  colorHex: string;
  note?: string;
  remaining: number;
}

export interface PromoOffer {
  code: string;
  title: string;
  discountPercent: number;
  applicableTiers: string[];
  description: string;
  validThrough: string;
}

export interface CartItem {
  id: string;
  sessionId: string;
  sessionLabel: string;
  tierId: string;
  tierName: string;
  unitPrice: number;
  bookingFeePerUnit: number;
  quantity: number;
  seats: string[];
  promoCode?: string;
  discountAmount: number;
}

export interface RelatedEvent {
  id: string;
  title: string;
  category: string;
  dates: string;
  venue: string;
  priceFrom: number;
  image: string;
}

export interface ShowPurchaseRecord {
  id: string;
  title: string;
  dateLabel: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  venue: string;
  tickets: number;
  orderRef: string;
}

export const HERO_IMAGE = '/src/assets/images/nutcracker_hero_stage_1795062508254.jpg';
export const SNOW_IMAGE = '/src/assets/images/nutcracker_snow_scene_1795062508583.jpg';
export const TREE_IMAGE = '/src/assets/images/nutcracker_christmas_tree_1795062508604.jpg';
export const THEATRE_IMAGE = '/src/assets/images/sands_theatre_interior_1795062508988.jpg';
export const OTTER_MASCOT_IMAGE = '/src/assets/images/sistic_otter_mascot_1795063429850.jpg';

export const INITIAL_2026_STREAK_SHOWS: ShowPurchaseRecord[] = [
  {
    id: '2026-q1-phantom',
    title: 'The Phantom of the Opera',
    dateLabel: '14 Mar 2026',
    quarter: 'Q1',
    venue: 'Sands Theatre, Marina Bay Sands',
    tickets: 2,
    orderRef: 'SG-2026-184210',
  },
  {
    id: '2026-q2-sso',
    title: 'Singapore Symphony Orchestra Gala',
    dateLabel: '20 Jun 2026',
    quarter: 'Q2',
    venue: 'Esplanade Concert Hall',
    tickets: 2,
    orderRef: 'SG-2026-492031',
  },
  {
    id: '2026-q3-giselle',
    title: 'Giselle — Classical Ballet',
    dateLabel: '12 Sep 2026',
    quarter: 'Q3',
    venue: 'Sands Theatre, Marina Bay Sands',
    tickets: 2,
    orderRef: 'SG-2026-731509',
  },
];

export const SHOW_SESSIONS: ShowSession[] = [
  {
    id: 'thu-26-1930',
    dateLabel: 'Thu, 26 Nov 2026',
    dayShort: 'THU',
    dateNum: '26',
    monthLabel: 'NOV',
    time: '7:30 PM',
    status: 'Available',
  },
  {
    id: 'fri-27-1930',
    dateLabel: 'Fri, 27 Nov 2026',
    dayShort: 'FRI',
    dateNum: '27',
    monthLabel: 'NOV',
    time: '7:30 PM',
    status: 'Selling Fast',
  },
  {
    id: 'sat-28-1400',
    dateLabel: 'Sat, 28 Nov 2026',
    dayShort: 'SAT',
    dateNum: '28',
    monthLabel: 'NOV',
    time: '2:00 PM',
    status: 'Limited',
  },
  {
    id: 'sat-28-1930',
    dateLabel: 'Sat, 28 Nov 2026',
    dayShort: 'SAT',
    dateNum: '28',
    monthLabel: 'NOV',
    time: '7:30 PM',
    status: 'Selling Fast',
  },
  {
    id: 'sun-29-1300',
    dateLabel: 'Sun, 29 Nov 2026',
    dayShort: 'SUN',
    dateNum: '29',
    monthLabel: 'NOV',
    time: '1:00 PM',
    status: 'Available',
  },
  {
    id: 'sun-29-1730',
    dateLabel: 'Sun, 29 Nov 2026',
    dayShort: 'SUN',
    dateNum: '29',
    monthLabel: 'NOV',
    time: '5:30 PM',
    status: 'Available',
  },
];

export const PRICE_TIERS: PriceTier[] = [
  {
    id: 'premium',
    name: 'Premium (with Souvenir Programme)',
    section: 'Stalls',
    price: 208,
    bookingFee: 6,
    seatsPerUnit: 1,
    colorHex: '#EEBA7B',
    note: 'Includes official glossy Souvenir Programme & prime front-centre Stalls seating (Rows C–G).',
    remaining: 14,
  },
  {
    id: 'vip',
    name: 'VIP',
    section: 'Stalls',
    price: 188,
    bookingFee: 6,
    seatsPerUnit: 1,
    colorHex: '#9BB8EB',
    note: 'Centre Stalls rows H–M offering balanced sightlines across the full stage.',
    remaining: 26,
  },
  {
    id: 'a-reserve',
    name: 'A Reserve',
    section: 'Stalls',
    price: 168,
    bookingFee: 6,
    seatsPerUnit: 1,
    colorHex: '#6EAE6B',
    note: 'Mid-Stalls and front wing seating with clear acoustic projection.',
    remaining: 42,
  },
  {
    id: 'dress-circle',
    name: 'Dress Circle',
    section: 'Dress Circle',
    price: 158,
    bookingFee: 6,
    seatsPerUnit: 1,
    colorHex: '#CB88DF',
    note: 'Elevated front balcony seating with sweeping views of corps de ballet formations.',
    remaining: 31,
  },
  {
    id: 'dress-box',
    name: 'Dress Circle Box (4 Seats)',
    section: 'Dress Circle',
    price: 632,
    bookingFee: 24,
    isBox: true,
    seatsPerUnit: 4,
    colorHex: '#B165C9',
    note: 'Private 4-seat Dress Circle balcony box (S$158 per seat, sold as a complete box).',
    remaining: 3,
  },
  {
    id: 'b-reserve',
    name: 'B Reserve',
    section: 'Stalls',
    price: 128,
    bookingFee: 6,
    seatsPerUnit: 1,
    colorHex: '#E5DC94',
    note: 'Rear Stalls seating under the Dress Circle overhang.',
    remaining: 54,
  },
  {
    id: 'c-reserve',
    name: 'C Reserve',
    section: 'Grand Circle',
    price: 78,
    bookingFee: 4,
    seatsPerUnit: 1,
    colorHex: '#A5DEE6',
    note: 'Front Grand Circle upper tier seating.',
    remaining: 65,
  },
  {
    id: 'grand-box',
    name: 'Grand Circle Box (4 Seats)',
    section: 'Grand Circle',
    price: 312,
    bookingFee: 16,
    isBox: true,
    seatsPerUnit: 4,
    colorHex: '#5EC4D1',
    note: 'Private 4-seat Grand Circle balcony box (S$78 per seat, sold as a complete box).',
    remaining: 4,
  },
  {
    id: 'grand-circle',
    name: 'Grand Circle',
    section: 'Grand Circle',
    price: 48,
    bookingFee: 2,
    seatsPerUnit: 1,
    colorHex: '#84CED9',
    note: 'Upper Grand Circle rear rows; great value for families.',
    remaining: 38,
  },
];

export const PROMO_OFFERS: PromoOffer[] = [
  {
    code: 'SANDS15',
    title: 'Sands LifeStyle Member Privilege — 15% Off',
    discountPercent: 15,
    applicableTiers: ['premium', 'vip', 'a-reserve', 'dress-circle'],
    description: 'Enjoy 15% savings on Premium, VIP, A Reserve, and Dress Circle tickets across all performances.',
    validThrough: '29 Nov 2026',
  },
  {
    code: 'UOB10',
    title: 'UOB Cardmembers Special — 10% Off',
    discountPercent: 10,
    applicableTiers: ['vip', 'a-reserve', 'dress-circle', 'b-reserve'],
    description: 'Exclusive 10% savings when paying with any UOB Credit or Debit Card issued in Singapore, Malaysia, Thailand, or Indonesia.',
    validThrough: '29 Nov 2026',
  },
  {
    code: 'BALLET15',
    title: 'Festive Family & Group Bundle — 15% Off',
    discountPercent: 15,
    applicableTiers: ['a-reserve', 'b-reserve', 'c-reserve'],
    description: '15% savings when purchasing 4 or more tickets in A Reserve, B Reserve, or C Reserve.',
    validThrough: '29 Nov 2026',
  },
];

export const VENUE_FAQS = [
  {
    q: 'What is the duration of The Nutcracker?',
    a: 'The performance runs approximately 115 minutes, including one 20-minute intermission between Act I and Act II.',
  },
  {
    q: 'Is there an age limit for admission?',
    a: 'Recommended for patrons aged 4 years and above. Infants in arms and children below 4 years old will not be admitted. Every patron, regardless of age, must hold a valid ticket.',
  },
  {
    q: 'What does the Premium ticket include?',
    a: 'Each Premium ticket (S$208) includes prime front-centre Stalls seating and one official commemorative Souvenir Programme, redeemable at the Sands Theatre foyer merchandise counter on the day of your show.',
  },
  {
    q: 'Can I bring a camera or record the performance?',
    a: 'Photography, video recording, and audio recording of any kind are strictly prohibited inside the auditorium during the performance.',
  },
  {
    q: 'How do I get to Sands Theatre by MRT?',
    a: 'Take the Circle Line (CC) or Downtown Line (DT) to Bayfront MRT Station (CE1/DT16) and take Exit C or D into The Shoppes at Marina Bay Sands. Sands Theatre is located at B1-69/70.',
  },
];

export const RELATED_EVENTS: RelatedEvent[] = [
  {
    id: 'swan-lake-2026',
    title: 'Swan Lake — Classical Gala',
    category: 'Theatre & Dance',
    dates: '4 – 6 Dec 2026',
    venue: 'Sands Theatre, Marina Bay Sands',
    priceFrom: 68,
    image: SNOW_IMAGE,
  },
  {
    id: 'vienna-philharmonic-gala',
    title: 'New Year Viennese Waltz Concert',
    category: 'Classical Music',
    dates: '28 – 30 Dec 2026',
    venue: 'Esplanade Concert Hall',
    priceFrom: 58,
    image: TREE_IMAGE,
  },
  {
    id: 'sands-backstage-tour',
    title: 'Sands Theatre Grand Stage Experience',
    category: 'Experiences',
    dates: '12 Dec 2026',
    venue: 'Sands Theatre, Marina Bay Sands',
    priceFrom: 38,
    image: THEATRE_IMAGE,
  },
];
