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

export interface SavedSearch {
  id: string | number;
  name: string;
  folderId: string;
  createdAt?: string;
  notificationType?: "Daily" | "Weekly" | "Instant" | null;
  matchType?: "AND" | "OR"; // AND means all criteria must match, OR means any criteria can match
  filters?: {
    transactionType?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string[];
    propertyMainType?: string;
    propertySubTypes?: string[];
    minPsf?: string;
    maxPsf?: string;
    minYear?: string;
    maxYear?: string;
    minArea?: string;
    maxArea?: string;
    projectName?: string;
    agent?: string;
    distanceToMRT?: string;
    leaseTerm?: string[];
    availability?: string;
    furnishing?: string;
    keyword?: string;
    floorLevel?: string;
    tenure?: string;
    bathrooms?: string[];
    districts?: string[];
    [key: string]: string | string[] | undefined; // Index signature for flexibility
  };
  // Legacy fields for mock data compatibility
  priceRange?: string;
  bedrooms?: string;
  tenure?: string;
  propertyType?: string;
  location?: string;
  savedDate?: string;
  notification?: string;
}

export interface SavedSearchFolder {
  id: string;
  name: string;
  count: number;
}