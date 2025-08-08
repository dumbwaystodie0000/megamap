// Import project data
import { projects } from './project-data';

// Unit data structure - unit-level information only
export interface Unit {
  id: string;
  projectId: string;
  unitNumber: string;
  price: string;
  size: string;
  psf: string;
  beds: number;
  baths: number;
  status: string; // "ACTIVE" or "SOLD"
  agency: string;
  agent: {
    name: string;
    phone: string;
    email: string;
    agencyName: string;
  };
  features: string[];
  images: string[];
  description: string;
  floorPlan?: string;
  virtualTour?: string;
  additionalDetails?: string[];
}

// Unit definitions - includes both active listings and sold transactions
export const units: Unit[] = [
  {
    id: "amber-park-08-01",
    projectId: "amber-park",
    unitNumber: "08-01",
    price: "$3,800,000",
    size: "1,636 sqft",
    psf: "$2,323",
    beds: 3,
    baths: 3,
    status: "ACTIVE",
    agency: "PLB",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com.sg",
      agencyName: "PLB",
    },
    features: ["High floor", "Renovated kitchen", "Balcony", "Built-in wardrobes"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "A spacious 3-bedroom unit with modern finishes and a great view. Ideal for families looking for comfort and convenience.",
    floorPlan: "/placeholder.svg?height=400&width=600",
    virtualTour: "https://example.com/virtual-tour-amber-park-08-01",
    additionalDetails: []
  },
  {
    id: "amber-park-12-05",
    projectId: "amber-park",
    unitNumber: "12-05",
    price: "$4,200,000",
    size: "2,000 sqft",
    psf: "$2,100",
    beds: 4,
    baths: 4,
    status: "ACTIVE",
    agency: "OTHER",
    agent: {
      name: "John Tan",
      phone: "+65 8765 4321",
      email: "john.tan@otheragency.com.sg",
      agencyName: "Other Agency",
    },
    features: ["Penthouse", "Private lift", "Rooftop terrace", "Smart home system"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Luxurious 4-bedroom penthouse unit with panoramic city views. Perfect for entertaining and upscale living.",
    additionalDetails: []
  },
  {
    id: "meyer-mansion-12-05",
    projectId: "meyer-mansion",
    unitNumber: "12-05",
    price: "$4,200,000",
    size: "1,862 sqft",
    psf: "$2,255",
    beds: 3,
    baths: 3,
    status: "ACTIVE",
    agency: "OTHER",
    agent: {
      name: "John Tan",
      phone: "+65 8765 4321",
      email: "john.tan@otheragency.com.sg",
      agencyName: "Other Agency",
    },
    features: ["High floor", "City view", "Modern kitchen", "Balcony"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Elegant 3-bedroom unit with city views and modern amenities.",
    additionalDetails: []
  },
  {
    id: "sail-marina-bay-30-01",
    projectId: "sail-marina-bay",
    unitNumber: "30-01",
    price: "$8,000/month",
    size: "1,200 sqft",
    psf: "$6.5",
    beds: 2,
    baths: 2,
    status: "ACTIVE",
    agency: "PLB",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com.sg",
      agencyName: "",
    },
    features: ["Marina Bay view", "Fully furnished", "High floor", "Modern kitchen"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Stunning 2-bedroom unit in The Sail, offering unparalleled views of Marina Bay. Fully furnished and ready for immediate move-in.",
    additionalDetails: []
  },
  {
    id: "wallich-residence-50-01",
    projectId: "wallich-residence",
    unitNumber: "50-01",
    price: "$15,000/month",
    size: "1,500 sqft",
    psf: "$10.0",
    beds: 3,
    baths: 3,
    status: "ACTIVE",
    agency: "PLB",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com.sg",
      agencyName: "PLB",
    },
    features: ["Direct MRT access", "High floor", "City views", "Integrated smart home"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "High-floor 3-bedroom unit in Wallich Residence, offering direct access to Tanjong Pagar MRT and a vibrant urban lifestyle.",
    additionalDetails: []
  },
    {
    id: "amber-park-05-03",
    projectId: "amber-park",
    unitNumber: "05-03",
    price: "$3,600,000",
    size: "1,500 sqft",
    psf: "$2,400",
    beds: 3,
    baths: 2,
    status: "SOLD",
    agency: "PLB",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com.sg",
      agencyName: "PLB",
    },
    features: ["High floor", "Renovated kitchen", "Balcony", "Built-in wardrobes"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "A spacious 3-bedroom unit with modern finishes and a great view. Sold in November 2023.",
    additionalDetails: []
  },
  {
    id: "reflections-keppel-bay-05-03",
    projectId: "reflections-keppel-bay",
    unitNumber: "05-03",
    price: "$5,500,000",
    size: "2,600 sqft",
    psf: "$2,100",
    beds: 5,
    baths: 5,
    status: "SOLD",
    agency: "OTHER",
    agent: {
      name: "John Tan",
      phone: "+65 8765 4321",
      email: "john.tan@otheragency.com.sg",
      agencyName: "Other Agency",
    },
    features: ["Waterfront view", "Private pool", "Spacious living area", "Smart home system"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Expansive 5-bedroom unit in the iconic Reflections at Keppel Bay. Enjoy waterfront living with luxurious amenities.",
    additionalDetails: []
  },
  {
    id: "amber-park-10-02",
    projectId: "amber-park",
    unitNumber: "10-02",
    price: "$3,750,000",
    size: "1,636 sqft",
    psf: "$2,292",
    beds: 3,
    baths: 3,
    status: "SOLD",
    agency: "PLB",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com.sg",
      agencyName: "PLB",
    },
    features: ["High floor", "Renovated kitchen", "Balcony", "Built-in wardrobes"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "A spacious 3-bedroom unit with modern finishes and a great view. Sold in December 2023.",
    additionalDetails: []
  },
  {
    id: "sail-marina-bay-25-03",
    projectId: "sail-marina-bay",
    unitNumber: "25-03",
    price: "$7,500/month",
    size: "1,100 sqft",
    psf: "$6.8",
    beds: 2,
    baths: 2,
    status: "SOLD",
    agency: "PLB",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com.sg",
      agencyName: "PLB",
    },
    features: ["Marina Bay view", "Fully furnished", "High floor", "Modern kitchen"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Stunning 2-bedroom unit in The Sail, offering unparalleled views of Marina Bay. Rented in January 2024.",
    additionalDetails: []
  },
  {
    id: "wallich-residence-45-02",
    projectId: "wallich-residence",
    unitNumber: "45-02",
    price: "$14,500/month",
    size: "1,400 sqft",
    psf: "$10.4",
    beds: 3,
    baths: 3,
    status: "SOLD",
    agency: "PLB",
    agent: {
      name: "Sarah Lim",
      phone: "+65 9123 4567",
      email: "sarah.lim@plb.com.sg",
      agencyName: "PLB",
    },
    features: ["Direct MRT access", "High floor", "City views", "Integrated smart home"],
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "High-floor 3-bedroom unit in Wallich Residence, offering direct access to Tanjong Pagar MRT. Rented in February 2024.",
    additionalDetails: []
  },
  {
    id: "one-north-residences-01-05",
    projectId: "one-north-residences",
    unitNumber: "01-05",
    price: "$1,330,000",
    size: "904 sqft",
    psf: "$1,471.24",
    beds: 1,
    baths: 1,
    status: "ACTIVE",
    agency: "PLB",
    agent: {
      name: "Charline Wong",
      phone: "+65 9046 2188",
      email: "charline.wong@propertylimbrothers.com",
      agencyName: "PLB",
    },
    features: ["Ground Floor", "Duplex", "High Ceiling", "Tastefully Renovated"],
    images: ["https://www.propertylimbrothers.com/wp-content/uploads/2025/05/One-North-Residences001-1.jpg"],
    description: "Experience stylish duplex living in this tastefully renovated 1-bedroom ground floor unit at One-North Residences. Spanning 904 sqft, this home features soaring 5m ceilings, a spacious open-plan layout, and a private upper-floor bedroom. Enjoy abundant natural light, tranquil facing, and the potential to add a study. Located in the heart of One-North, it's just a short walk to Buona Vista and One-North MRT stations. Perfect for professionals seeking a modern lifestyle with convenience, greenery, and vibrant surroundings.",
    floorPlan: "https://www.propertylimbrothers.com/wp-content/uploads/2025/05/One-north-Residences-01-05_floor-plan-wm_11zon-scaled.jpg",
    virtualTour: "<iframe width='853' height='480' src='https://www.propertylimbrothers.com/3d-tour/one-north-residences/fullscreen/’ frameborder='0' allow='vr' allowfullscreen='allowfullscreen'></iframe>",
    additionalDetails: ["Tastefully Renovated & Ready for Move-In", "High Ceiling Over 5m", "Large Panels of Window with Natural Day Light", "Living Room Facing: South West", "Quiet Tranquil Facing"]
  },
  {
    id: "one-north-residences-06-13",
    projectId: "one-north-residences",
    unitNumber: "06-13",
    price: "$980,000",
    size: "592 sqft",
    psf: "$1,655.41",
    beds: 1,
    baths: 1,
    status: "ACTIVE",
    agency: "PLB",
    agent: {
      name: "Sebastian Lau",
      phone: "+65 9092 7388",
      email: "sebastian.lau@propertylimbrothers.com",
      agencyName: "PLB",
    },
    features: ["Mid Floor", "Quiet Facing", "Open Layout", "Move-in Condition"],
    images: ["https://www.propertylimbrothers.com/wp-content/uploads/2025/03/ONE-NORTH-RESIDENCES001.jpg"],
    description: "Enjoy unblocked views across the landscaped facilities from the unit. Privacy is a prime feature thanks to its offset line of sight and quiet-facing orientation. The decked-out planter space is ideal for laundry or a lounge setup, while the efficient layout ensures the master can be enclosed for added separation.",
    floorPlan: "https://www.propertylimbrothers.com/wp-content/uploads/2025/03/One-North-Residences-06-13_floor-plan-wm-scaled.jpg",
    virtualTour: "<iframe width='853' height='480' src='https://realsee.ai/bbEERvRA' frameborder='0' allow='vr' allowfullscreen='allowfullscreen'></iframe>",
    additionalDetails: ["Main Door Facing: South-East", "Balcony Facing: North-West", "Plentiful Amenities", "390M to One-North MRT", "Corporate Lease (Till Apr 2026)"]
  },
  
];

// Helper functions for unit data
export const getActiveUnits = () => {
  return units.filter(unit => unit.status === "ACTIVE");
};

export const getSoldUnits = () => {
  return units.filter(unit => unit.status === "SOLD");
};

export const getUnitsByProject = (projectId: string) => {
  return units.filter(unit => unit.projectId === projectId);
};

export const getActiveUnitsByProject = (projectId: string) => {
  return units.filter(unit => unit.projectId === projectId && unit.status === "ACTIVE");
};

export const getSoldUnitsByProject = (projectId: string) => {
  return units.filter(unit => unit.projectId === projectId && unit.status === "SOLD");
};

export const getUnitById = (unitId: string) => {
  return units.find(unit => unit.id === unitId);
};

// Generate table data for ResultsBlade (active listings only)
export const generateActiveTableData = () => {
  return getActiveUnits().map(unit => {
    return {
      id: unit.id,
      projectId: unit.projectId,
      unitNumber: unit.unitNumber,
      price: unit.price,
      size: unit.size,
      psf: unit.psf,
      beds: unit.beds,
      baths: unit.baths,
      status: unit.status,
      agency: unit.agency,
      agent: unit.agent,
      features: unit.features,
      images: unit.images,
      description: unit.description,
      floorPlan: unit.floorPlan,
      virtualTour: unit.virtualTour,
    };
  });
};

// Generate transactions data (sold units only)
export const generateTransactionsData = () => {
  return getSoldUnits().map(unit => {
    // Find the corresponding project
    const project = projects.find(p => p.id === unit.projectId);
    if (!project) return null;
    
    return {
      id: unit.id,
      projectId: unit.projectId,
      unitNumber: unit.unitNumber,
      price: unit.price,
      size: unit.size,
      psf: unit.psf,
      beds: unit.beds,
      baths: unit.baths,
      status: unit.status,
      agency: unit.agency,
      agent: unit.agent,
      features: unit.features,
      images: unit.images,
      description: unit.description,
      floorPlan: unit.floorPlan,
      virtualTour: unit.virtualTour,
      // Add properties needed by building-details-panel
      date: new Date().toISOString().split('T')[0], // Mock date
      address: `${project.address}, #${unit.unitNumber}`,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
};

// Generate transactions page data with combined project and unit information
export const generateTransactionsPageData = () => {
  return getSoldUnits().map((unit, index) => {
    // Find the corresponding project
    const project = projects.find(p => p.id === unit.projectId);
    if (!project) return null;
    
    return {
      id: index + 1,
      type: unit.price.includes('/month') ? 'rental' : 'sale',
      project: project.name,
      address: `${project.address}, #${unit.unitNumber}`,
      district: project.district,
      price: unit.price,
      year: project.year,
      psf: unit.psf,
      area: unit.size,
      beds: unit.beds,
      baths: unit.baths,
      tenure: project.tenure,
      status: unit.status,
      agency: unit.agency,
      date: new Date().toISOString().split('T')[0], // Mock date
      agent: unit.agent.name,
      description: unit.description,
      features: unit.features,
      images: unit.images,
      floorPlan: unit.floorPlan,
      virtualTour: unit.virtualTour,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
};

// Generate building listings for BuildingDetailsPanel (active listings only)
export const generateActiveBuildingListings = () => {
  return getActiveUnits().map(unit => {
    return {
      id: unit.id,
      projectId: unit.projectId,
      unitNumber: unit.unitNumber,
      price: unit.price,
      size: unit.size,
      psf: unit.psf,
      beds: unit.beds,
      baths: unit.baths,
      status: unit.status,
      agency: unit.agency,
      agent: unit.agent,
      features: unit.features,
      images: unit.images,
      description: unit.description,
      floorPlan: unit.floorPlan,
      virtualTour: unit.virtualTour,
    };
  });
};

// Generate popup data for enhanced map popup (combines project and unit data)
export const generatePopupData = (projectId: string) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;
  
  const activeUnits = getActiveUnitsByProject(projectId);
  const soldUnits = getSoldUnitsByProject(projectId);
  
  return {
    project: {
      id: project.id,
      name: project.name,
      address: project.address,
      district: project.district,
      tenure: project.tenure,
      year: project.year,
      type: project.type,
      coordinates: project.coordinates,
      amenities: project.amenities,
      nearbySchools: project.nearbySchools,
      transport: project.transport,
      description: project.description,
      images: project.images,
    },
    activeUnits: activeUnits.length,
    soldUnits: soldUnits.length,
    activeListings: activeUnits,
    soldListings: soldUnits,
  };
}; 

// Generate building-level data for ResultsBlade (aggregates units by project)
export const generateBuildingResultsData = (transactionType: string = "For Sale") => {
  // Get all projects that have active units matching the transaction type
  const projectsWithActiveUnits = projects.filter(project => {
    const activeUnits = getActiveUnitsByProject(project.id);
    const filteredUnits = activeUnits.filter(unit => {
      if (transactionType === "For Sale") {
        return !unit.price.includes('/month');
      } else if (transactionType === "For Rent") {
        return unit.price.includes('/month');
      }
      return true; // Show all if no filter
    });
    return filteredUnits.length > 0;
  });

  return projectsWithActiveUnits.map(project => {
    const activeUnits = getActiveUnitsByProject(project.id);
    const soldUnits = getSoldUnitsByProject(project.id);
    
    // Calculate price and size ranges
    const activePrices = activeUnits.map(unit => parseFloat(unit.price.replace(/[^0-9.]/g, "")));
    const activeSizes = activeUnits.map(unit => parseFloat(unit.size.replace(/[^0-9.]/g, "")));
    
    const minPrice = Math.min(...activePrices);
    const maxPrice = Math.max(...activePrices);
    const minSize = Math.min(...activeSizes);
    const maxSize = Math.max(...activeSizes);
    
    // Format price range
    const priceRange = minPrice === maxPrice 
      ? `$${(minPrice / 1000000).toFixed(1)}M` 
      : `$${(minPrice / 1000000).toFixed(1)}M - $${(maxPrice / 1000000).toFixed(1)}M`;
    
    // Format size range
    const sizeRange = minSize === maxSize 
      ? `${minSize.toLocaleString()}` 
      : `${minSize.toLocaleString()} - ${maxSize.toLocaleString()}`;
    
    return {
      id: project.id,
      name: project.name,
      address: project.address,
      type: project.type,
      year: project.year,
      tenure: project.tenure,
      activeListings: activeUnits.length,
      priceRange,
      sizeRange,
      pastTransactions: soldUnits.length,
      mainImage: project.images[0] || "/placeholder.svg",
      coordinates: project.coordinates,
      // For filtering by agency
      hasPLBUnits: activeUnits.some(unit => unit.agent.agencyName === "PLB"),
      hasOtherUnits: activeUnits.some(unit => unit.agent.agencyName !== "PLB"),
      // Store all units for detailed view
      activeUnits,
      soldUnits,
    };
  });
};

// Generate property-level data for Grid view
export const generatePropertyGridData = (transactionType: string = "For Sale") => {
  const activeUnits = getActiveUnits().filter(unit => {
    if (transactionType === "For Sale") {
      return !unit.price.includes('/month');
    } else if (transactionType === "For Rent") {
      return unit.price.includes('/month');
    }
    return true; // Show all if no filter
  });
  
  return activeUnits.map(unit => {
    const project = projects.find(p => p.id === unit.projectId);
    if (!project) return null;
    
    return {
      id: unit.id,
      price: unit.price,
      title: project.name,
      address: `${project.address}, #${unit.unitNumber}`,
      beds: unit.beds,
      baths: unit.baths,
      size: unit.size,
      type: project.type,
      tenure: project.tenure,
      year: project.year,
      image: unit.images[0] || project.images[0] || "/placeholder.svg",
      status: unit.status,
      agency: unit.agent.agencyName,
      projectId: unit.projectId,
      coordinates: project.coordinates,
      // For property details
      description: unit.description,
      features: unit.features,
      agent: unit.agent,
      floorPlan: unit.floorPlan,
      virtualTour: unit.virtualTour,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
};

// Generate table data for Table view
export const generatePropertyTableData = (transactionType: string = "For Sale") => {
  const activeUnits = getActiveUnits().filter(unit => {
    if (transactionType === "For Sale") {
      return !unit.price.includes('/month');
    } else if (transactionType === "For Rent") {
      return unit.price.includes('/month');
    }
    return true; // Show all if no filter
  });
  
  return activeUnits.map(unit => {
    const project = projects.find(p => p.id === unit.projectId);
    if (!project) return null;
    
    return {
      id: unit.id,
      project: project.name,
      address: `${project.address}, #${unit.unitNumber}`,
      price: unit.price,
      size: unit.size,
      psf: unit.psf,
      beds: unit.beds,
      baths: unit.baths,
      tenure: project.tenure,
      status: unit.status,
      agency: unit.agent.agencyName,
      projectId: unit.projectId,
      coordinates: project.coordinates,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
}; 

// Generate building details data for BuildingDetailsPanel
export const generateBuildingDetailsData = (projectId: string) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;
  
  const activeUnits = getActiveUnitsByProject(projectId);
  const soldUnits = getSoldUnitsByProject(projectId);
  
  // Calculate price and size ranges for active units
  const activePrices = activeUnits.map(unit => parseFloat(unit.price.replace(/[^0-9.]/g, "")));
  const activeSizes = activeUnits.map(unit => parseFloat(unit.size.replace(/[^0-9.]/g, "")));
  
  const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : 0;
  const maxPrice = activePrices.length > 0 ? Math.max(...activePrices) : 0;
  const minSize = activeSizes.length > 0 ? Math.min(...activeSizes) : 0;
  const maxSize = activeSizes.length > 0 ? Math.max(...activeSizes) : 0;
  
  // Format price range
  const priceRange = minPrice === maxPrice 
    ? `$${(minPrice / 1000000).toFixed(1)}M` 
    : `$${(minPrice / 1000000).toFixed(1)}M - $${(maxPrice / 1000000).toFixed(1)}M`;
  
  // Format size range
  const sizeRange = minSize === maxSize 
    ? `${minSize.toLocaleString()}` 
    : `${minSize.toLocaleString()} - ${maxSize.toLocaleString()}`;
  
  return {
    id: project.id,
    name: project.name,
    address: project.address,
    type: project.type,
    year: project.year,
    tenure: project.tenure,
    activeListings: activeUnits.length,
    pastTransactions: soldUnits.length,
    priceRange,
    sizeRange,
    description: project.description,
    amenities: project.amenities.map(amenity => ({
      name: amenity,
      icon: null // You can map icons if needed
    })),
    nearbySchools: project.nearbySchools,
    transport: project.transport,
    images: project.images || ["/placeholder.svg"], // Ensure images is always an array
    // Store the actual units for listings and transactions tabs
    activeUnits,
    soldUnits,
  };
};

// Generate active listings data for a specific project
export const generateActiveListingsData = (projectId: string) => {
  const activeUnits = getActiveUnitsByProject(projectId);
  
  return activeUnits.map(unit => ({
    id: unit.id,
    price: unit.price,
    beds: unit.beds,
    baths: unit.baths,
    size: unit.size,
    psf: unit.psf,
    address: `${unit.projectId}, #${unit.unitNumber}`,
    images: unit.images,
    agent: unit.agent,
    description: unit.description,
    features: unit.features,
    floorPlan: unit.floorPlan,
    virtualTour: unit.virtualTour,
  }));
};

// Generate sold transactions data for a specific project
export const generateSoldTransactionsData = (projectId: string) => {
  const soldUnits = getSoldUnitsByProject(projectId);
  
  return soldUnits.map(unit => ({
    id: unit.id,
    price: unit.price,
    beds: unit.beds,
    baths: unit.baths,
    size: unit.size,
    psf: unit.psf,
    address: `${unit.projectId}, #${unit.unitNumber}`,
    date: new Date().toISOString().split('T')[0], // Mock date for now
    agent: unit.agent,
  }));
}; 