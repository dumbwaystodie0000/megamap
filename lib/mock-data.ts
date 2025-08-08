// Import the new structured data from separated files
import { projects } from './project-data';
import { 
  generateActiveTableData, 
  generateActiveBuildingListings, 
  generateTransactionsData,
  generateTransactionsPageData
} from './unit-mock-up';

// Mock data for ResultsBlade (TableResults) - now using structured data
export const mockTableData = generateActiveTableData();

// Mock data for BuildingDetailsPanel - now using structured data
export const mockBuildingListings = generateActiveBuildingListings();

// Mock data for BuildingDetailsPanel transactions - now using structured data
export const mockBuildingTransactions = generateTransactionsData();

// Mock data for app/transactions/page.tsx - now using structured data
export const mockTransactionsPageData = generateTransactionsPageData();

export const mockAgents = ["All Agents", "Sarah Lim", "John Tan", "Emily Wong", "David Lee"]

// Mock agent data for components that need detailed agent information
export const mockAgentData = {
  name: "John Tan",
  phone: "+65 9123 4567",
  email: "john.tan@plb.com",
  agencyName: "PLB",
}

// Mock data for SaveToCollectionDialog
export const mockCollectionsData = [
  {
    id: "1",
    name: "Astoria Park",
    itemCount: 1,
    updatedDate: "24 Jul 2025",
    thumbnail: "/placeholder.svg?height=60&width=80&text=Astoria%20Park",
  },
  { id: "2", name: "Collection 3", itemCount: 0, updatedDate: "23 Jul 2025", thumbnail: null },
  { id: "3", name: "Collection 2", itemCount: 0, updatedDate: "22 Jul 2025", thumbnail: null },
]

// Mock data for app/saved-searches/page.tsx
export const mockSavedSearches = [
  {
    id: 1,
    name: "Peiyee 1-3 Bedrooms Search",
    priceRange: "$0 - $10,000,000",
    bedrooms: "1, 2, 3 bedrooms",
    tenure: "Any tenure",
    propertyType: "Condominium, Apartment",
    location: "D1 - Marina Bay, D4 - Keppel Bay",
    savedDate: "23 Jul 2024",
    notification: "Daily",
  },
  {
    id: 2,
    name: "Downtown Luxury Condos",
    priceRange: "$2,000,000 - $8,000,000",
    bedrooms: "2, 3, 4 bedrooms",
    tenure: "99-year tenure",
    propertyType: "Condominium",
    location: "D1 - Marina Bay, D2 - Tanjong Pagar",
    savedDate: "20 Jul 2024",
    notification: "Weekly",
  },
  {
    id: 3,
    name: "Landed Properties",
    priceRange: "$5,000,000 - $15,000,000",
    bedrooms: "3, 4, 5 bedrooms",
    tenure: "Freehold tenure",
    propertyType: "Landed",
    location: "D10 - Bukit Timah, D11 - Newton",
    savedDate: "18 Jul 2024",
    notification: "Instant",
  },
]

export const mockFolders = [
  { name: "My Saved Searches", count: 3 },
  { name: "Downtown Projects", count: 0 },
  { name: "Family Homes", count: 0 },
  { name: "Investment Properties", count: 0 },
]

// Mock data for PrintablePropertyReport
export const mockReportAmenities = [
  { name: "Car Park", icon: "Car" }, // Using string for icon name as it's not a React component here
  { name: "WiFi", icon: "Wifi" },
  { name: "Gymnasium", icon: "Dumbbell" },
  { name: "BBQ Area", icon: "Utensils" },
  { name: "Shopping Mall Nearby", icon: "ShoppingBag" },
  { name: "Swimming Pool", icon: null },
  { name: "Tennis Court", icon: null },
  { name: "Playground", icon: null },
  { name: "24/7 Security", icon: null },
]

export const mockReportNearbySchools = [
  "Tanjong Katong Primary School (0.5 km)",
  "Haig Girls' School (1.2 km)",
  "Victoria School (2.0 km)",
]

export const mockReportTransport = [
  "Kembangan MRT - 5 mins walk",
  "Eunos MRT - 8 mins walk",
  "Multiple bus stops nearby",
]
