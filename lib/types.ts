export interface Property {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  location?: [number, number]; // Alternative to lat/lng
  source: "PLB" | "PG" | "OTHER";
  status: "ACTIVE" | "SOLD" | "RENTED";
  price: string;
  size: string;
  psf: string;
  beds: number;
  baths: number;
  tenure: string;
  district: string;
  year: string;
  type: string;
  description?: string;
  features?: string[];
  images?: string[];
  agent?: {
    name: string;
    phone: string;
    email: string;
    agencyName: string;
  };
  floorPlan?: string;
  virtualTour?: string;
  additionalDetails?: string[];
} 