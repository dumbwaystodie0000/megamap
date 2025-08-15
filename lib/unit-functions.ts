import { projects } from './project-data';
import { units, Unit } from './units-data';
import { getDateRangeFromPreset } from './filter-options';

// Helper functions for unit data
export const getActiveUnits = () => {
  return units.filter(unit => unit.status === "ACTIVE");
};

export const getSoldUnits = () => {
  return units.filter(unit => unit.status === "SOLD");
};

export const getRentalUnits = () => {
  return units.filter(unit => unit.status === "RENTED");
};

// Get both SOLD and RENTED units for transactions page
export const getTransactionUnits = () => {
  return units.filter(unit => unit.status === "SOLD" || unit.status === "RENTED");
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

export const getRentalUnitsByProject = (projectId: string) => {
  return units.filter(unit => unit.projectId === projectId && unit.status === "RENTED");
};

// Get both SOLD and RENTED units by project for transactions page
export const getTransactionUnitsByProject = (projectId: string) => {
  return units.filter(unit => unit.projectId === projectId && (unit.status === "SOLD" || unit.status === "RENTED"));
};

export const getUnitById = (unitId: string | number) => {
  const id = typeof unitId === 'string' ? parseInt(unitId, 10) : unitId;
  return units.find(unit => unit.id === id);
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
      date: "2024-12-01", // Static date instead of dynamic
      address: `${project.address}, #${unit.unitNumber}`,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
};

// Generate transactions page data with combined project and unit information
export const generateTransactionsPageData = () => {
  return getTransactionUnits().map((unit, index) => {
    // Find the corresponding project
    const project = projects.find(p => p.id === unit.projectId);
    if (!project) return null;
    
    return {
      id: index + 1,
      type: unit.price.includes('/month') ? 'rental' : 'sale',
      project: project.name,
      projectId: unit.projectId,
      address: `${project.address}, #${unit.unitNumber}`,
      district: project.district,
      price: unit.price,
      asking_price: unit.asking_price,
      transacted_price: unit.transacted_price,
      year: project.year,
      psf: unit.psf,
      area: unit.size,
      beds: unit.beds,
      baths: unit.baths,
      tenure: project.tenure,
      status: unit.status,
      agency: unit.agency,
      date: "2024-12-01", // Static date instead of dynamic
      agent: unit.agent.name,
      description: unit.description,
      features: unit.features,
      images: unit.images,
      floorPlan: unit.floorPlan,
      virtualTour: unit.virtualTour,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
};

// Generate filtered transactions data based on search parameters
export const generateFilteredTransactionsData = (searchParams: URLSearchParams) => {
  let filteredUnits = getTransactionUnits();

  // Filter by status (SOLD/RENTED)
  const status = searchParams.get("status");
  if (status && status !== "all") {
    filteredUnits = filteredUnits.filter(unit => unit.status === status);
  }

  // Filter by date range
  const dateRange = searchParams.get("dateRange");
  if (dateRange && dateRange !== "all") {
    const { startDate, endDate } = getDateRangeFromPreset(dateRange);
    filteredUnits = filteredUnits.filter(unit => {
      // For now, we'll use the static date. In a real app, you'd use actual transaction dates
      const transactionDate = new Date("2024-12-01");
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  // Filter by PSF range
  const minPsf = searchParams.get("minPsf");
  const maxPsf = searchParams.get("maxPsf");
  if (minPsf && minPsf !== "0") {
    const minPsfNum = parseInt(minPsf);
    filteredUnits = filteredUnits.filter(unit => {
      const psfNum = parseInt(unit.psf.replace(/[$,]/g, ""));
      return psfNum >= minPsfNum;
    });
  }
  if (maxPsf && maxPsf !== "No Limit") {
    const maxPsfNum = parseInt(maxPsf);
    filteredUnits = filteredUnits.filter(unit => {
      const psfNum = parseInt(unit.psf.replace(/[$,]/g, ""));
      return psfNum <= maxPsfNum;
    });
  }

  // Filter by area range
  const minArea = searchParams.get("minArea");
  const maxArea = searchParams.get("maxArea");
  if (minArea && minArea !== "0") {
    const minAreaNum = parseInt(minArea);
    filteredUnits = filteredUnits.filter(unit => {
      const areaNum = parseInt(unit.size.replace(/[^0-9]/g, ""));
      return areaNum >= minAreaNum;
    });
  }
  if (maxArea && maxArea !== "No Limit") {
    const maxAreaNum = parseInt(maxArea);
    filteredUnits = filteredUnits.filter(unit => {
      const areaNum = parseInt(unit.size.replace(/[^0-9]/g, ""));
      return areaNum <= maxAreaNum;
    });
  }

  // Filter by price range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice && minPrice !== "0") {
    const minPriceNum = parseInt(minPrice);
    filteredUnits = filteredUnits.filter(unit => {
      const priceNum = parseInt(unit.transacted_price?.replace(/[$,]/g, "") || unit.price.replace(/[$,]/g, ""));
      return priceNum >= minPriceNum;
    });
  }
  if (maxPrice && maxPrice !== "No Limit") {
    const maxPriceNum = parseInt(maxPrice);
    filteredUnits = filteredUnits.filter(unit => {
      const priceNum = parseInt(unit.transacted_price?.replace(/[$,]/g, "") || unit.price.replace(/[$,]/g, ""));
      return priceNum <= maxPriceNum;
    });
  }

  // Filter by bedrooms
  const beds = searchParams.get("beds");
  if (beds) {
    const selectedBeds = beds.split(",").filter(Boolean);
    if (selectedBeds.length > 0) {
      filteredUnits = filteredUnits.filter(unit => {
        const bedCount = unit.beds.toString();
        return selectedBeds.includes(bedCount);
      });
    }
  }

  // Filter by property type
  const propertyMainType = searchParams.get("propertyMainType");
  if (propertyMainType && propertyMainType !== "all") {
    filteredUnits = filteredUnits.filter(unit => {
      const project = projects.find(p => p.id === unit.projectId);
      if (!project) return false;
      
      if (propertyMainType === "hdb") {
        return project.type.toLowerCase().includes("hdb");
      } else if (propertyMainType === "condo") {
        return project.type.toLowerCase().includes("condo") || project.type.toLowerCase().includes("apartment");
      } else if (propertyMainType === "landed") {
        return project.type.toLowerCase().includes("landed") || project.type.toLowerCase().includes("house");
      }
      return true;
    });
  }

  return filteredUnits.map((unit, index) => {
    // Find the corresponding project
    const project = projects.find(p => p.id === unit.projectId);
    if (!project) return null;
    
    return {
      id: index + 1,
      type: unit.price.includes('/month') ? 'rental' : 'sale',
      project: project.name,
      projectId: unit.projectId,
      address: `${project.address}, #${unit.unitNumber}`,
      district: project.district,
      price: unit.price,
      asking_price: unit.asking_price,
      transacted_price: unit.transacted_price,
      year: project.year,
      psf: unit.psf,
      area: unit.size,
      beds: unit.beds,
      baths: unit.baths,
      tenure: project.tenure,
      status: unit.status,
      agency: unit.agency,
      date: "2024-12-01", // Static date instead of dynamic
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
  // Apply transaction type filtering at the project level
  const projectsWithFilteredUnits = projects.filter(project => {
    const activeUnits = getActiveUnitsByProject(project.id);
    // Filter units based on transaction type
    const filteredUnits = activeUnits.filter(unit => {
      // First check the explicit transactionType field
      if (unit.transactionType === "rental" && transactionType === "For Rent") {
        return true;
      } else if (unit.transactionType === "sale" && transactionType === "For Sale") {
        return true;
      } else if (transactionType === "For Sale") {
        // Fallback to price string check for backward compatibility
        return !unit.price.includes('/month');
      } else if (transactionType === "For Rent") {
        // Fallback to price string check for backward compatibility
        return unit.price.includes('/month');
      }
      return true; // Show all if no filter
    });
    return filteredUnits.length > 0; // Only include projects with matching units
  });

  return projectsWithFilteredUnits.map(project => {
    // Get active units and filter by transaction type
    const allActiveUnits = getActiveUnitsByProject(project.id);
    const activeUnits = allActiveUnits.filter(unit => {
      // First check the explicit transactionType field
      if (unit.transactionType === "rental" && transactionType === "For Rent") {
        return true;
      } else if (unit.transactionType === "sale" && transactionType === "For Sale") {
        return true;
      } else if (transactionType === "For Sale") {
        // Fallback to price string check for backward compatibility
        return !unit.price.includes('/month');
      } else if (transactionType === "For Rent") {
        // Fallback to price string check for backward compatibility
        return unit.price.includes('/month');
      }
      return true; // Show all if no filter
    });
    const soldUnits = getSoldUnitsByProject(project.id);
    
    // Calculate price and size ranges
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
    
    // Check if project has PLB units and other units
    const hasPLBUnits = activeUnits.some(unit => unit.agency === "PLB");
    const hasOtherUnits = activeUnits.some(unit => unit.agency !== "PLB");
    
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
      // Add flags for PLB/Other filtering
      hasPLBUnits,
      hasOtherUnits,
      // Main image for building card
      mainImage: project.images?.[0] || "/placeholder.svg",
    };
  });
};

// Generate property grid data for ResultsBlade (combines project and unit data)
export const generatePropertyGridData = (transactionType: string = "For Sale") => {
  const activeUnits = getActiveUnits().filter(unit => {
    // First check the explicit transactionType field
    if (unit.transactionType === "rental" && transactionType === "For Rent") {
      return true;
    } else if (unit.transactionType === "sale" && transactionType === "For Sale") {
      return true;
    } else if (transactionType === "For Sale") {
      // Fallback to price string check for backward compatibility
      return !unit.price.includes('/month');
    } else if (transactionType === "For Rent") {
      // Fallback to price string check for backward compatibility
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
      images: unit.images || [unit.images[0] || project.images[0] || "/placeholder.svg"], // Add full images array
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
    // First check the explicit transactionType field
    if (unit.transactionType === "rental" && transactionType === "For Rent") {
      return true;
    } else if (unit.transactionType === "sale" && transactionType === "For Sale") {
      return true;
    } else if (transactionType === "For Sale") {
      // Fallback to price string check for backward compatibility
      return !unit.price.includes('/month');
    } else if (transactionType === "For Rent") {
      // Fallback to price string check for backward compatibility
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
    projectId: unit.projectId, // Add the missing projectId field
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
    projectId: unit.projectId, // Add the missing projectId field
    price: unit.price,
    beds: unit.beds,
    baths: unit.baths,
    size: unit.size,
    psf: unit.psf,
    address: `${unit.projectId}, #${unit.unitNumber}`,
    date: "2024-12-01", // Static date instead of dynamic
    agent: unit.agent,
  }));
}; 