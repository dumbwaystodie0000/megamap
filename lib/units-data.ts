import { projects } from './project-data';

export interface Unit {
  id: number;
  projectId: string;
  unitNumber: string;
  price: string;
  size: string;
  psf: string;
  beds: number;
  baths: number;
  status: "ACTIVE" | "SOLD" | "RENTED";
  agency: "PLB" | "OTHER";
  transactionType: "sale" | "rental"; // Added explicit transaction type field
  agent: {
    name: string;
    phone: string;
    email: string;
    agencyName: string;
  };
  features: string[];
  images: string[];
  description: string;
  additionalDetails: string[];
  floorPlan: string;
  virtualTour: string;
  option_date?: string;
  exercised_date?: string;
  exercised_TA_date?: string;
  sold_duration_from_portal_launched_optioned?: string;
  sold_duration_from_portal_launched_exercised?: string;
  transacted_price?: string;
  asking_price?: string;
}

export const units: Unit[] = [
  {
    id: 1,
    projectId: "arc-at-tampines",
    unitNumber: "08-17",
    price: "$4,800/month", // Added /month suffix to clarify it's a rental
    size: "1,130 sqft",
    psf: "$4.25",
    beds: 3,
    baths: 2,
    status: "ACTIVE",
    agency: "PLB",
    transactionType: "rental", // Explicitly marked as rental
    agent: {
      name: "Alexa Loh",
      phone: "+65 9123 4567",
      email: "alexa.loh@propertylimbrothers.com",
      agencyName: "PLB",
    },
    features: ["Renovated", "Enclosed Kitchen", "Unblocked views", "Partially furnished"],
    images: [
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES001.jpg",
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES002.jpg",
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES003.jpg",
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES004.jpg",
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES005.jpg",
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES006.jpg",
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES007.jpg",
      "/unit_images/arc-at-tampines-08-17-rental/ARC AT TAMPINES008.jpg"
    ],
    description: "Enjoy privacy and modern comfort with this 3-bedder + utility unit - Perfect for couples, small families, or working professionals seeking space and serenity.",
    additionalDetails: [
      "Well-maintained & Renovated Condition",
      "Spacious Master Bedroom with Ensuite Bathroom",
      "Living and Dining area with Attached Balcony",
      "Bright and breezy unit with unblocked views"
    ],
    floorPlan: "/floor-plans/arc-at-tampines-08-17.pdf",
    virtualTour: "/virtual-tours/arc-at-tampines-08-17.html",
    exercised_TA_date: "2024-12-01"
  },
  {
    id: 2,
    projectId: "amber-park",
    unitNumber: "08-01",
    price: "$2,800,000",
    size: "1,200 sqft",
    psf: "$2,333",
    beds: 3,
    baths: 2,
    status: "ACTIVE",
    agency: "PLB",
    transactionType: "sale", // Default to sale for existing properties
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com",
      agencyName: "PLB",
    },
    features: ["Corner unit", "Unblocked view", "Renovated", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Spacious corner unit with unblocked city view. Recently renovated with premium finishes.",
    additionalDetails: [
      "Corner unit with dual aspect",
      "Recently renovated with premium finishes",
      "Unblocked city skyline view",
      "Large balcony perfect for outdoor dining"
    ],
    floorPlan: "/floor-plans/amber-park-08-01.pdf",
    virtualTour: "/virtual-tours/amber-park-08-01.html",
    exercised_date: "2024-12-01"
  },
  {
    id: 3,
    projectId: "sail-marina-bay",
    unitNumber: "25-03",
    price: "$3,200,000",
    size: "1,500 sqft",
    psf: "$2,133",
    beds: 3,
    baths: 3,
    status: "ACTIVE",
    agency: "OTHER",
    transactionType: "sale", // Default to sale for existing properties
    agent: {
      name: "John Tan",
      phone: "+65 9123 4567",
      email: "john.tan@other.com",
      agencyName: "OTHER",
    },
    features: ["Marina Bay view", "High floor", "Premium finish", "Study room"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "High-floor unit with stunning Marina Bay view. Premium finishes throughout with dedicated study room.",
    additionalDetails: [
      "25th floor with panoramic Marina Bay view",
      "Premium finishes and fittings throughout",
      "Dedicated study room perfect for work from home",
      "Large master bedroom with ensuite bathroom"
    ],
    floorPlan: "/floor-plans/sail-marina-bay-25-03.pdf",
    virtualTour: "/virtual-tours/sail-marina-bay-25-03.html",
    exercised_date: "2024-12-01"
  },
  {
    id: 4,
    projectId: "reflections-keppel-bay",
    unitNumber: "05-03",
    price: "$2,900,000",
    size: "1,300 sqft",
    psf: "$2,231",
    beds: 3,
    baths: 2,
    status: "ACTIVE",
    agency: "PLB",
    transactionType: "sale", // Default to sale for existing properties
    agent: {
      name: "Emily Wong",
      phone: "+65 9123 4567",
      email: "emily.wong@plb.com",
      agencyName: "PLB",
    },
    features: ["Waterfront view", "Garden facing", "Renovated", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Beautiful waterfront unit with garden view. Recently renovated with modern finishes.",
    additionalDetails: [
      "Waterfront location with sea breeze",
      "Garden facing for privacy and greenery",
      "Recently renovated with modern finishes",
      "Spacious balcony overlooking the water"
    ],
    floorPlan: "/floor-plans/reflections-keppel-bay-05-03.pdf",
    virtualTour: "/virtual-tours/reflections-keppel-bay-05-03.html",
    exercised_date: "2024-12-01"
  },
  {
    id: 5,
    projectId: "wallich-residence",
    unitNumber: "12-05",
    price: "$4,500,000",
    size: "1,800 sqft",
    psf: "$2,500",
    beds: 4,
    baths: 3,
    status: "ACTIVE",
    agency: "OTHER",
    transactionType: "sale", // Default to sale for existing properties
    agent: {
      name: "David Lee",
      phone: "+65 9123 4567",
      email: "david.lee@other.com",
      agencyName: "OTHER",
    },
    features: ["City view", "High floor", "Premium finish", "Study room"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Luxurious high-floor unit with stunning city view. Premium finishes and spacious layout.",
    additionalDetails: [
      "12th floor with panoramic city skyline view",
      "Premium finishes and designer fittings",
      "Spacious layout perfect for families",
      "Dedicated study room and utility area"
    ],
    floorPlan: "/floor-plans/wallich-residence-12-05.pdf",
    virtualTour: "/virtual-tours/wallich-residence-12-05.html"
  },
  {
    id: 6,
    projectId: "one-north-residences",
    unitNumber: "15-08",
    price: "$1,800,000",
    size: "1,100 sqft",
    psf: "$1,636",
    beds: 2,
    baths: 2,
    status: "ACTIVE",
    agency: "PLB",
    transactionType: "sale", // Default to sale for existing properties
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com",
      agencyName: "PLB",
    },
    features: ["Near MRT", "Garden view", "Renovated", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Convenient 2-bedroom unit near One North MRT. Garden view with modern renovations.",
    additionalDetails: [
      "Walking distance to One North MRT station",
      "Peaceful garden view for relaxation",
      "Recently renovated with modern amenities",
      "Compact layout perfect for young professionals"
    ],
    floorPlan: "/floor-plans/one-north-residences-15-08.pdf",
    virtualTour: "/virtual-tours/one-north-residences-15-08.html"
  },
  {
    id: 7,
    projectId: "meyer-mansion",
    unitNumber: "03-12",
    price: "$3,800,000",
    size: "1,600 sqft",
    psf: "$2,375",
    beds: 3,
    baths: 3,
    status: "ACTIVE",
    agency: "PLB",
    transactionType: "sale", // Default to sale for existing properties
    agent: {
      name: "Alexa Loh",
      phone: "+65 9123 4567",
      email: "alexa.loh@propertylimbrothers.com",
      agencyName: "PLB",
    },
    features: ["Sea view", "Corner unit", "Premium finish", "Large balcony"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Exclusive corner unit with sea view. Premium finishes and large balcony for outdoor living.",
    additionalDetails: [
      "Corner unit with dual aspect sea view",
      "Premium finishes and designer fittings",
      "Large balcony perfect for outdoor entertainment",
      "Spacious layout with high ceilings"
    ],
    floorPlan: "/floor-plans/meyer-mansion-03-12.pdf",
    virtualTour: "/virtual-tours/meyer-mansion-03-12.html"
  },
  // Add some SOLD units for transactions page
  {
    id: 8,
    projectId: "amber-park",
    unitNumber: "15-22",
    price: "$2,900,000",
    size: "1,250 sqft",
    psf: "$2,320",
    beds: 3,
    baths: 2,
    status: "SOLD",
    agency: "PLB",
    transactionType: "sale",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com",
      agencyName: "PLB",
    },
    features: ["High floor", "City view", "Renovated", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "High-floor unit with stunning city view. Recently sold with premium renovations.",
    additionalDetails: [
      "15th floor with panoramic city skyline view",
      "Recently renovated with premium finishes",
      "Spacious balcony for outdoor living",
      "Excellent investment potential"
    ],
    floorPlan: "/floor-plans/amber-park-15-22.pdf",
    virtualTour: "/virtual-tours/amber-park-15-22.html",
    transacted_price: "$2,900,000",
    asking_price: "$3,200,000"
  },
  {
    id: 9,
    projectId: "reflections-keppel-bay",
    unitNumber: "08-15",
    price: "$3,100,000",
    size: "1,400 sqft",
    psf: "$2,214",
    beds: 3,
    baths: 2,
    status: "SOLD",
    agency: "PLB",
    transactionType: "sale",
    agent: {
      name: "Emily Wong",
      phone: "+65 9123 4567",
      email: "emily.wong@plb.com",
      agencyName: "PLB",
    },
    features: ["Waterfront", "Sea view", "Premium finish", "Large balcony"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Waterfront unit with stunning sea view. Recently sold with premium finishes.",
    additionalDetails: [
      "Waterfront location with sea breeze",
      "8th floor with unobstructed sea view",
      "Premium finishes and designer fittings",
      "Large balcony perfect for outdoor entertainment"
    ],
    floorPlan: "/floor-plans/reflections-keppel-bay-08-15.pdf",
    virtualTour: "/virtual-tours/reflections-keppel-bay-08-15.html",
    transacted_price: "$3,100,000",
    asking_price: "$3,500,000"
  },
  {
    id: 10,
    projectId: "wallich-residence",
    unitNumber: "18-10",
    price: "$4,800,000",
    size: "1,900 sqft",
    psf: "$2,526",
    beds: 4,
    baths: 3,
    status: "SOLD",
    agency: "OTHER",
    transactionType: "sale",
    agent: {
      name: "David Lee",
      phone: "+65 9123 4567",
      email: "david.lee@other.com",
      agencyName: "OTHER",
    },
    features: ["High floor", "City view", "Premium finish", "Study room"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "High-floor luxury unit with stunning city view. Recently sold with premium finishes.",
    additionalDetails: [
      "18th floor with panoramic city skyline view",
      "Premium finishes and designer fittings",
      "Spacious layout perfect for families",
      "Dedicated study room and utility area"
    ],
    floorPlan: "/floor-plans/wallich-residence-18-10.pdf",
    virtualTour: "/virtual-tours/wallich-residence-18-10.html",
    transacted_price: "$4,800,000",
    asking_price: "$5,200,000"
  },
  {
    id: 11,
    projectId: "one-north-residences",
    unitNumber: "12-05",
    price: "$1,950,000",
    size: "1,150 sqft",
    psf: "$1,696",
    beds: 2,
    baths: 2,
    status: "SOLD",
    agency: "PLB",
    transactionType: "sale",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com",
      agencyName: "PLB",
    },
    features: ["Near MRT", "Garden view", "Renovated", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Convenient 2-bedroom unit near One North MRT. Recently sold with garden view.",
    additionalDetails: [
      "Walking distance to One North MRT station",
      "Peaceful garden view for relaxation",
      "Recently renovated with modern amenities",
      "Compact layout perfect for young professionals"
    ],
    floorPlan: "/floor-plans/one-north-residences-12-05.pdf",
    virtualTour: "/virtual-tours/one-north-residences-12-05.html",
    transacted_price: "$1,950,000",
    asking_price: "$2,100,000"
  },
  {
    id: 12,
    projectId: "meyer-mansion",
    unitNumber: "06-08",
    price: "$3,600,000",
    size: "1,550 sqft",
    psf: "$2,323",
    beds: 3,
    baths: 2,
    status: "SOLD",
    agency: "PLB",
    transactionType: "sale",
    agent: {
      name: "Alexa Loh",
      phone: "+65 9123 4567",
      email: "alexa.loh@propertylimbrothers.com",
      agencyName: "PLB",
    },
    features: ["Sea view", "Mid floor", "Premium finish", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Mid-floor unit with sea view. Recently sold with premium finishes.",
    additionalDetails: [
      "6th floor with sea view",
      "Premium finishes and designer fittings",
      "Balcony perfect for outdoor living",
      "Spacious layout with high ceilings"
    ],
    floorPlan: "/floor-plans/meyer-mansion-06-08.pdf",
    virtualTour: "/virtual-tours/meyer-mansion-06-08.html",
    transacted_price: "$3,600,000",
    asking_price: "$3,900,000"
  },
  // Add some RENTED units for transactions page
  {
    id: 13,
    projectId: "arc-at-tampines",
    unitNumber: "12-08",
    price: "$4,800/month",
    size: "1,130 sqft",
    psf: "$4.25",
    beds: 3,
    baths: 2,
    status: "RENTED",
    agency: "PLB",
    transactionType: "rental",
    agent: {
      name: "Alexa Loh",
      phone: "+65 9123 4567",
      email: "alexa.loh@propertylimbrothers.com",
      agencyName: "PLB",
    },
    features: ["Renovated", "Enclosed Kitchen", "Unblocked views", "Partially furnished"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Recently rented 3-bedroom unit with modern renovations and unblocked views.",
    additionalDetails: [
      "Recently renovated with premium finishes",
      "Enclosed kitchen for better privacy",
      "Unblocked views for natural light",
      "Partially furnished for convenience"
    ],
    floorPlan: "/floor-plans/arc-at-tampines-12-08.pdf",
    virtualTour: "/virtual-tours/arc-at-tampines-12-08.html",
    transacted_price: "$4,800/month",
    asking_price: "$5,200/month"
  },
  {
    id: 14,
    projectId: "one-north-residences",
    unitNumber: "15-12",
    price: "$3,200/month",
    size: "1,150 sqft",
    psf: "$2.78",
    beds: 2,
    baths: 2,
    status: "RENTED",
    agency: "PLB",
    transactionType: "rental",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com",
      agencyName: "PLB",
    },
    features: ["Near MRT", "Garden view", "Renovated", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Convenient 2-bedroom unit near One North MRT. Recently rented with garden view.",
    additionalDetails: [
      "Walking distance to One North MRT station",
      "Peaceful garden view for relaxation",
      "Recently renovated with modern amenities",
      "Compact layout perfect for young professionals"
    ],
    floorPlan: "/floor-plans/one-north-residences-15-12.pdf",
    virtualTour: "/virtual-tours/one-north-residences-15-12.html",
    transacted_price: "$3,200/month",
    asking_price: "$3,500/month"
  },
  {
    id: 15,
    projectId: "amber-park",
    unitNumber: "06-18",
    price: "$5,500/month",
    size: "1,200 sqft",
    psf: "$4.58",
    beds: 3,
    baths: 2,
    status: "RENTED",
    agency: "OTHER",
    transactionType: "rental",
    agent: {
      name: "David Lee",
      phone: "+65 9123 4567",
      email: "david.lee@other.com",
      agencyName: "OTHER",
    },
    features: ["Corner unit", "Unblocked view", "Renovated", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Spacious corner unit with unblocked city view. Recently rented with premium renovations.",
    additionalDetails: [
      "Corner unit with dual aspect",
      "Recently renovated with premium finishes",
      "Unblocked city skyline view",
      "Spacious balcony for outdoor living"
    ],
    floorPlan: "/floor-plans/amber-park-06-18.pdf",
    virtualTour: "/virtual-tours/amber-park-06-18.html",
    transacted_price: "$5,500/month",
    asking_price: "$6,000/month"
  }
]; 