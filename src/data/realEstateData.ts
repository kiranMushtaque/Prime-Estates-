import { WalkthroughRoom, Property, PropertyTypeCategory, NeighborhoodItem, AgencyStat, MapPoint } from '../types';

// ============================================================================
// 7 WALKTHROUGH ROOMS (EXACT ORDER AS REQUESTED)
// ============================================================================
export const WALKTHROUGH_ROOMS: WalkthroughRoom[] = [
  {
    id: 'exterior',
    order: 1,
    name: 'Exterior',
    image: '/src/assets/images/walkthrough/01-exterior.jpg',
    headline: 'Step inside your next home.',
    badge: 'CORAL RIDGE · AZURE BAY',
    specs: '1 Kanal · 4,800 Sq Ft · Oceanfront',
    description: 'A contemporary cliffside sanctuary overlooking Azure Bay. Warm stone masonry, expansive timber decking, and an infinity lap pool seamlessly merging into the Pacific sunset horizon.',
    features: ['Oceanfront Infinity Pool', 'Bespoke Stone Masonry', 'Sunset Horizon Vista'],
    hotspots: [
      {
        id: 'ext-pool',
        x: 46,
        y: 68,
        title: '18 m Infinity Pool',
        description: 'Heated saltwater lap pool cantilevered directly above the ocean surf.'
      },
      {
        id: 'ext-masonry',
        x: 76,
        y: 52,
        title: 'Bespoke Stone Masonry',
        description: 'Hand-chiseled coastal limestone providing deep thermal mass and insulation.'
      },
      {
        id: 'ext-deck',
        x: 28,
        y: 78,
        title: 'Teak Ocean Decking',
        description: 'Sustainably harvested marine-grade teak with concealed fasteners.'
      }
    ]
  },
  {
    id: 'entrance',
    order: 2,
    name: 'The Entrance',
    image: '/src/assets/images/walkthrough/02-entrance.jpg',
    headline: 'The Entrance',
    badge: 'ARCHITECTURAL PORTAL · 12 FT',
    specs: 'Oversized Pivot Portal · Foyer',
    description: 'An oversized solid teak pivot door welcomes you into a double-height stone atrium. Warm cove illumination washes across raw quartzite feature walls and floating steps.',
    features: ['Teak Pivot Portal', 'Quartzite Accent Wall', 'Concealed Ambient Lighting'],
    hotspots: [
      {
        id: 'ent-door',
        x: 53,
        y: 45,
        title: '12-Ft Teak Pivot Portal',
        description: 'Motorized biometric entry door crafted from aged solid timber.'
      },
      {
        id: 'ent-wall',
        x: 28,
        y: 36,
        title: 'Quartzite Feature Wall',
        description: 'Book-matched quartzite facade with warm 2700K indirect wash lighting.'
      },
      {
        id: 'ent-steps',
        x: 68,
        y: 76,
        title: 'Floating Terrazzo Treads',
        description: 'Monolithic steps with concealed under-tread acoustic lighting.'
      }
    ]
  },
  {
    id: 'living',
    order: 3,
    name: 'Living Room',
    image: '/src/assets/images/walkthrough/03-living.jpg',
    headline: 'Living Room - 24 x 18 ft',
    badge: 'GRAND OCEAN ATRIUM',
    specs: '24 x 18 ft · Double-Height',
    description: 'Floor-to-ceiling glass reveals uninterrupted maritime panoramas. Anchored by an imported low-slung sectional, honed basalt hearth, and natural acoustic cedar ceiling louvers.',
    features: ['Panoramic Marine Glazing', 'Basalt Open Hearth', 'Cedar Acoustic Ceiling'],
    hotspots: [
      {
        id: 'liv-floor',
        x: 42,
        y: 84,
        title: 'Italian Marble Floor',
        description: 'Honed Calacatta marble slabs with embedded radiant subfloor heating.'
      },
      {
        id: 'liv-glass',
        x: 64,
        y: 42,
        title: 'Floor-to-Ceiling Glass',
        description: 'Low-iron, UV-shielded structural glazing offering unobstructed ocean horizons.'
      },
      {
        id: 'liv-hearth',
        x: 82,
        y: 65,
        title: 'Basalt Open Hearth',
        description: 'Fluted volcanic stone fireplace with linear concealed gas flame line.'
      }
    ]
  },
  {
    id: 'kitchen',
    order: 4,
    name: "Chef's Kitchen",
    image: '/src/assets/images/walkthrough/04-kitchen.jpg',
    headline: "Chef's Kitchen",
    badge: 'CULINARY ATELIER',
    specs: 'Monolithic Quartz Island · Scullery',
    description: 'A seamless culinary sculpture designed with monolithic Calacatta quartz countertops, fluted oak millwork, warm bronze pendant fixtures, and integrated German refrigeration.',
    features: ['Monolithic Quartz Island', 'Fluted Oak Millwork', 'Concealed Chef Scullery'],
    hotspots: [
      {
        id: 'kit-island',
        x: 48,
        y: 64,
        title: 'Monolithic Quartz Island',
        description: 'Single-slab seamless waterfall counter with integrated induction cooktop.'
      },
      {
        id: 'kit-scullery',
        x: 78,
        y: 44,
        title: 'Concealed Chef Scullery',
        description: 'Hidden pantry and secondary preparation kitchen behind flush fluted oak doors.'
      },
      {
        id: 'kit-fixtures',
        x: 32,
        y: 35,
        title: 'Brushed Bronze Pendants',
        description: 'Hand-blown artisan glass globes with champagne bronze fittings.'
      }
    ]
  },
  {
    id: 'bedroom',
    order: 5,
    name: 'Master Suite',
    image: '/src/assets/images/walkthrough/05-bedroom.jpg',
    headline: 'Master Suite',
    badge: 'LEVEL 2 · PRIVATE WING',
    specs: 'Corner Panoramic Bedroom · Dressing Salon',
    description: 'Wake to crashing waves and golden morning radiance. The cantilevered master suite features wrap-around corner glass, an integrated velvet platform bed, and private dressing walk-in.',
    features: ['Wrap-Around Ocean Glass', 'Floating Platform Bed', 'Direct Terrace Access'],
    hotspots: [
      {
        id: 'bed-bed',
        x: 46,
        y: 66,
        title: 'Floating Platform Bed',
        description: 'Custom suede velvet bed frame cantilevered with integrated bedside lighting.'
      },
      {
        id: 'bed-glass',
        x: 78,
        y: 45,
        title: 'Corner Panoramic Glass',
        description: 'Pillarless corner curtain-wall offering sunrise-to-sunset coastal vistas.'
      },
      {
        id: 'bed-deck',
        x: 24,
        y: 74,
        title: 'Private Balcony Portal',
        description: 'Direct step-out access to the cantilevered upper morning balcony.'
      }
    ]
  },
  {
    id: 'bathroom',
    order: 6,
    name: 'Spa Bathroom',
    image: '/src/assets/images/walkthrough/06-bathroom.jpg',
    headline: 'Spa Bathroom',
    badge: 'SANCTUARY SUITE',
    specs: 'Soaking Tub · Dual Stone Vanity',
    description: 'Sculpted from warm travertine and grey flamed granite. Featuring a standalone oval soaking tub positioned against a private sea-facing glass wall and rain-fall thermostatic showers.',
    features: ['Freestanding Soaking Tub', 'Honed Travertine Walls', 'Frameless Rainfall Shower'],
    hotspots: [
      {
        id: 'bath-tub',
        x: 52,
        y: 68,
        title: 'Freestanding Soaking Tub',
        description: 'Carved natural resin soaking tub oriented toward panoramic horizon views.'
      },
      {
        id: 'bath-shower',
        x: 28,
        y: 40,
        title: 'Rainfall Sky Shower',
        description: 'Ceiling-flush 24-inch rain head with digital thermostatic water control.'
      },
      {
        id: 'bath-vanity',
        x: 80,
        y: 58,
        title: 'Dual Fluted Vanity',
        description: 'Floating Italian stone double basins with brushed gold wall-mount fixtures.'
      }
    ]
  },
  {
    id: 'terrace',
    order: 7,
    name: 'Sunset Terrace',
    image: '/src/assets/images/walkthrough/07-terrace.jpg',
    headline: 'Sunset Terrace',
    badge: 'SKY LOUNGE & POOL DECK',
    specs: 'Outdoor Fire Pit · Alfresco Dining',
    description: 'The journey culminates on the open-air ocean terrace. Gaze across Azure Bay as evening embers glow in the basalt fire pit and ocean breezes greet the sunset.',
    features: ['Sunken Basalt Fire Pit', 'Infinity Edge Waterline', 'Panoramic Coral Ridge Vistas'],
    hotspots: [
      {
        id: 'ter-pool',
        x: 34,
        y: 65,
        title: '18 m Infinity Pool',
        description: 'Zero-edge pool seamlessly merging with the Azure Bay ocean horizon.'
      },
      {
        id: 'ter-fire',
        x: 68,
        y: 74,
        title: 'Sunken Fire Pit',
        description: 'Recessed circular basalt seating area with integrated gas fire embers.'
      },
      {
        id: 'ter-railing',
        x: 84,
        y: 46,
        title: 'Frameless Glass Balustrade',
        description: 'Structural laminated hurricane glass preserving 180° uninterrupted views.'
      }
    ]
  }
];

// ============================================================================
// 4 PROPERTY TYPES
// ============================================================================
export const PROPERTY_TYPES: PropertyTypeCategory[] = [
  {
    id: 'villas',
    title: 'Coastal Villas',
    subtitle: 'Seafront & Cliffside Mansions',
    count: '18 Available',
    avgPrice: 'PKR 24 Cr - 65 Cr',
    features: ['Direct Bay Access', 'Private Infinity Pools', '1 & 2 Kanal Footprints'],
    description: 'Signature architectural residences nestled along Coral Ridge and Peninsula Point with private beach paths and sunset orientations.',
    iconName: 'Home'
  },
  {
    id: 'apartments',
    title: 'Sky Residences',
    subtitle: 'Penthouses & Terraced Suites',
    count: '24 Available',
    avgPrice: 'PKR 12 Cr - 35 Cr',
    features: ['Marina Panoramas', 'Private Yacht Berths', 'Full Concierge Security'],
    description: 'High-altitude duplexes in Marina Crest featuring 360-degree water views, floor-to-ceiling glass curtains, and high-speed elevator access.',
    iconName: 'Building'
  },
  {
    id: 'plots',
    title: 'Prime Plots',
    subtitle: 'Custom Architectural Enclaves',
    count: '12 Available',
    avgPrice: 'PKR 8 Cr - 28 Cr',
    features: ['Clean Seafront Titles', 'Underground Utility Grids', 'Gated Sector Access'],
    description: 'Limited 1-Kanal and 2-Kanal beachfront parcels in Palm Heights and Coral Ridge ready for bespoke architectural commissions.',
    iconName: 'Compass'
  },
  {
    id: 'commercial',
    title: 'Commercial Hubs',
    subtitle: 'Boutique Offices & Marina Retail',
    count: '9 Available',
    avgPrice: 'PKR 15 Cr - 80 Cr',
    features: ['Old Harbour Waterfront', 'High Yield Footfall', 'Executive Parking'],
    description: 'Prime commercial assets along the Marina Crest boardwalk and Old Harbour promenade with guaranteed long-term institutional tenancy.',
    iconName: 'Briefcase'
  }
];

// ============================================================================
// 5 FEATURED LISTINGS IN AZURE BAY (PRICES IN PKR)
// ============================================================================
export const FEATURED_PROPERTIES: Property[] = [
  {
    id: 'cliffside-villa',
    title: 'The Cliffside Villa',
    tag: 'FEATURED MASTERPIECE',
    priceFormatted: 'PKR 28.5 Crore',
    priceRaw: 285000000,
    location: 'Coral Ridge, Azure Bay',
    district: 'Coral Ridge',
    bedrooms: 5,
    bathrooms: 6,
    area: '1 Kanal (4,800 sq ft)',
    features: ['Oceanfront Infinity Pool', 'Basalt Fire Pit', 'Burmese Teak Louvers', 'Dual Chef Kitchens'],
    description: 'The premier residence showcased in our walkthrough. Modern stone, natural cedar, and panoramic sunset glass gazing directly into the Azure Bay coastline.',
    coordinates: { x: 26, y: 34 },
    imageUrl: '/src/assets/images/walkthrough/01-exterior.jpg',
    imageFallbackGradient: 'from-amber-950/80 via-stone-900 to-black',
    featured: true
  },
  {
    id: 'azure-horizon-penthouse',
    title: 'The Marina Horizon Penthouse',
    tag: 'WATERFRONT DUPLEX',
    priceFormatted: 'PKR 19.5 Crore',
    priceRaw: 195000000,
    location: 'Marina Crest, Azure Bay',
    district: 'Marina Crest',
    bedrooms: 4,
    bathrooms: 5,
    area: '3,800 sq ft',
    features: ['360° Marina Vistas', 'Private Rooftop Plunge Pool', 'Dedicated Yacht Berth', 'Direct Lift'],
    description: 'Perched on the 32nd level of the Marina Crest tower, this duplex penthouse offers dramatic coastal and yacht basin vistas with private sky deck.',
    coordinates: { x: 58, y: 48 },
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    imageFallbackGradient: 'from-blue-950/80 via-slate-900 to-black',
    featured: true
  },
  {
    id: 'palm-crest-estate',
    title: 'The Palm Heights Manor',
    tag: 'FAMILY ESTATE',
    priceFormatted: 'PKR 34.0 Crore',
    priceRaw: 340000000,
    location: 'Palm Heights, Azure Bay',
    district: 'Palm Heights',
    bedrooms: 6,
    bathrooms: 7,
    area: '2 Kanal (9,200 sq ft)',
    features: ['Internal Courtyard', 'Olympic Swimming Pool', 'Solar Microgrid', 'Subterranean 4-Car Garage'],
    description: 'Set within the verdant pine slopes of Palm Heights. A sprawling family sanctuary with manicured Mediterranean gardens, cinema suite, and security pavilion.',
    coordinates: { x: 42, y: 22 },
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    imageFallbackGradient: 'from-emerald-950/80 via-stone-900 to-black',
    featured: true
  },
  {
    id: 'peninsula-sanctuary',
    title: 'Peninsula Point Villa',
    tag: 'ULTRA LUXURY',
    priceFormatted: 'PKR 45.0 Crore',
    priceRaw: 450000000,
    location: 'Coral Ridge Promontory, Azure Bay',
    district: 'Coral Ridge',
    bedrooms: 6,
    bathrooms: 8,
    area: '2 Kanal (10,500 sq ft)',
    features: ['Private Beach Access', 'Helipad Access', 'Wine Cellar', 'Spa & Hammam'],
    description: 'Commanding the southernmost edge of Coral Ridge. 270 degrees of Pacific ocean views, private steps down to the secluded cove beach, and absolute privacy.',
    coordinates: { x: 20, y: 45 },
    imageUrl: '/src/assets/images/walkthrough/07-terrace.jpg',
    imageFallbackGradient: 'from-amber-900/80 via-stone-900 to-black',
    featured: true
  },
  {
    id: 'old-harbour-waterfront',
    title: 'Old Harbour Heritage Loft',
    tag: 'COASTAL LOFT',
    priceFormatted: 'PKR 16.8 Crore',
    priceRaw: 168000000,
    location: 'Old Harbour District, Azure Bay',
    district: 'Old Harbour District',
    bedrooms: 3,
    bathrooms: 4,
    area: '2,900 sq ft',
    features: ['Exposed Brick & Iron', 'Historic Mooring Berth', 'Custom Timber Millwork', 'Terrace Bar'],
    description: 'Historic seaside charm merged with contemporary industrial minimalism. Direct views over the heritage maritime docks and boardwalk.',
    coordinates: { x: 72, y: 65 },
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    imageFallbackGradient: 'from-stone-900 via-neutral-900 to-black',
    featured: true
  }
];

// ============================================================================
// 3 FICTIONAL NEIGHBORHOODS (EXACTLY AS SPECIFIED)
// ============================================================================
export const NEIGHBORHOODS: NeighborhoodItem[] = [
  {
    id: 'coral-ridge',
    name: 'Coral Ridge',
    district: 'Cliffside Coastal Enclave',
    headline: 'Cliffside Villas with Dramatic Sea Views',
    description: 'Elevated along the rugged coastal bluffs, Coral Ridge is Azure Bay’s most celebrated residential address. Dramatic sea cliffs, natural Mediterranean stone facades, and guaranteed ocean sunsets create an incomparable sanctuary.',
    avgPriceKanal: 'PKR 25 - 45 Crore',
    transitTime: '18 mins to Airport',
    highlights: [
      'Unobstructed 180° Pacific Ocean views',
      'Private cliffside path to secluded coves',
      'Architectural review board guaranteeing privacy'
    ],
    imageUrl: '/src/assets/images/walkthrough/01-exterior.jpg'
  },
  {
    id: 'marina-crest',
    district: 'Waterfront & Promenade',
    name: 'Marina Crest',
    headline: 'Waterfront Apartments & Private Marina',
    description: 'The vibrant cosmopolitan heart of Azure Bay. Modernist high-rise glass towers overlook an 80-berth luxury yacht marina, Michelin-starred coastal bistros, and a pedestrian boardwalk lined with palm colonnades.',
    avgPriceKanal: 'PKR 18 - 32 Crore',
    transitTime: '12 mins to Airport',
    highlights: [
      '80-slip yacht club & marina promenade',
      'Private concierge and direct water taxis',
      'Vibrant fine dining and luxury boutiques'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'palm-heights',
    name: 'Palm Heights',
    district: 'Parkland & School Enclave',
    headline: 'Family Homes Near Parks and Top Academies',
    description: 'A serene wooded haven rising gently into the coastal foothills. Shaded by ancient pines and towering palms, this neighborhood offers tranquil avenues, international private academies, and expansive 1-2 Kanal gated family compounds.',
    avgPriceKanal: 'PKR 20 - 36 Crore',
    transitTime: '15 mins to Airport',
    highlights: [
      'Adjoining Azure Bay Botanical Reserve',
      'Top-tier international private academies',
      '24/7 dedicated neighborhood security patrol'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  }
];

// ============================================================================
// 5 MAP PINS FOR ABSTRACT AZURE BAY MAP
// ============================================================================
export const MAP_LOCATIONS: MapPoint[] = [
  {
    id: 'coral-ridge',
    name: 'Coral Ridge',
    district: 'Cliffside Coastal',
    tag: 'The Cliffside Villa',
    type: 'villa',
    coords: { x: 26, y: 34 },
    description: 'Elevated ocean cliffs, luxury cantilevered villas, and direct sunset vistas.'
  },
  {
    id: 'marina-crest',
    name: 'Marina Crest',
    district: 'Marina Promenade',
    tag: 'Sky Horizon Duplexes',
    type: 'apartment',
    coords: { x: 58, y: 48 },
    description: 'Waterfront promenade, luxury yacht berths, and glass-curtain penthouses.'
  },
  {
    id: 'palm-heights',
    name: 'Palm Heights',
    district: 'Hillside Parkland',
    tag: 'Palm Heights Manor',
    type: 'district',
    coords: { x: 42, y: 22 },
    description: 'Wooded parklands, premier academies, and tranquil family compounds.'
  },
  {
    id: 'azure-bay-airport',
    name: 'Azure Bay Airport',
    district: 'International Transit Hub',
    tag: 'Executive Jet Terminal',
    type: 'transit',
    coords: { x: 80, y: 20 },
    description: 'International hub with private VIP aviation terminal and expressway link.'
  },
  {
    id: 'old-harbour',
    name: 'Old Harbour District',
    district: 'Historic Coast',
    tag: 'Waterfront Lofts',
    type: 'district',
    coords: { x: 72, y: 65 },
    description: 'Historic maritime quayside, seafood ateliers, and restored coastal lofts.'
  }
];

// ============================================================================
// AGENCY STATS
// ============================================================================
export const AGENCY_STATS: AgencyStat[] = [
  {
    value: 500,
    suffix: '+',
    label: 'Properties Sold',
    detail: 'Turnkey beachfront villas & penthouses'
  },
  {
    value: 1200,
    suffix: '+',
    label: 'Happy Clients',
    detail: 'High-net-worth families & expatriates'
  },
  {
    value: 10,
    suffix: '+',
    label: 'Years of Excellence',
    detail: 'Established advisory in Azure Bay'
  },
  {
    value: 160,
    suffix: 'B+',
    label: 'PKR Volume Closed',
    detail: 'Total verified transaction value'
  }
];
