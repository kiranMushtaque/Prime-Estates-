export interface RoomHotspot {
  id: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  title: string;
  description: string;
}

export interface WalkthroughRoom {
  id: string;
  order: number;
  name: string;
  image: string;
  headline: string;
  badge: string;
  description: string;
  specs?: string;
  features: string[];
  hotspots?: RoomHotspot[];
}

export interface Property {
  id: string;
  title: string;
  tag: string;
  priceFormatted: string; // PKR
  priceRaw: number;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  features: string[];
  description: string;
  coordinates: { x: number; y: number }; // percentage on map
  imageFallbackGradient: string;
  imageUrl: string;
  featured?: boolean;
}

export interface PropertyTypeCategory {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  avgPrice: string;
  features: string[];
  description: string;
  iconName: string;
}

export interface NeighborhoodItem {
  id: string;
  name: string;
  district: string;
  headline: string;
  description: string;
  avgPriceKanal: string;
  transitTime: string;
  highlights: string[];
  imageUrl: string;
}

export interface AgencyStat {
  value: number;
  suffix: string;
  label: string;
  detail: string;
}

export interface MapPoint {
  id: string;
  name: string;
  district: string;
  tag: string;
  type: 'villa' | 'apartment' | 'district' | 'transit';
  coords: { x: number; y: number }; // 0-100 percentage
  description: string;
}
