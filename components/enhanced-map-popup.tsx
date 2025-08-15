"use client";

import { Bed, Bath } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import type { Property } from "../lib/types";

// Define a type for your transacted listings for better type safety
interface TransactedListing {
  id: string;
  images?: string[];
  price: string;
  beds: number;
  baths: number;
  size: string;
  agency: string;
  soldDuration?: string; // e.g., "1 Month 19 Days"
}

interface EnhancedMapPopupProps {
  properties: Property[]; // Assumed to be the ACTIVE listings
  onViewDetails: (property: Property) => void;
  projectId?: string; // Optional project ID to fetch transacted records
  onClose?: () => void; // Optional callback for closing the popup
  transactionType?: string; // Add transaction type to determine if this is transactions page
}

// Helper function to get project name
const getProjectName = (property: Property) => {
  return property.name || "this location";
};

export default function EnhancedMapPopup({
  properties,
  onViewDetails,
  projectId,
  onClose,
  transactionType,
}: EnhancedMapPopupProps) {
  const [showTransacted, setShowTransacted] = useState(false);
  const [transactedListings, setTransactedListings] = useState<TransactedListing[]>([]);
  const [isLoadingTransacted, setIsLoadingTransacted] = useState(false);
  const [hasPlbSoldUnits, setHasPlbSoldUnits] = useState(false);
  
  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  
  // Function to show next image
  const showNextImage = (itemId: string | number, images: string[] = []) => {
    if (!images.length) return;
    
    setCurrentImageIndex(prev => {
      const currentIndex = prev[itemId] || 0;
      return {
        ...prev,
        [itemId]: (currentIndex + 1) % images.length
      };
    });
  };
  
  // Function to show previous image
  const showPrevImage = (itemId: string | number, images: string[] = []) => {
    if (!images.length) return;
    
    setCurrentImageIndex(prev => {
      const currentIndex = prev[itemId] || 0;
      return {
        ...prev,
        [itemId]: (currentIndex - 1 + images.length) % images.length
      };
    });
  };

  const mainProperty = properties[0];
  const projectName = mainProperty?.name || "this location";
  
  // Calculate counts
  const activeTotalCount = properties.length;
  const transactedPlbCount = transactedListings.filter(l => l.agency === 'PLB').length;
  
  // For single property view
  const isSingleProperty = activeTotalCount === 1 && !showTransacted;
  const isPLBListing = isSingleProperty && mainProperty?.source === "PLB";

  // Check if there are PLB sold units for this project to decide if the "View Transacted" button should be shown
  useEffect(() => {
    if (projectId) {
      const checkSoldUnits = async () => {
        try {
          // Assuming this async import works in your setup
          const { getSoldUnitsByProject } = await import("../lib/unit-mock-up");
          const soldUnits = getSoldUnitsByProject(projectId);
          const plbSoldUnits = soldUnits.filter(unit => unit.agency === "PLB");
          setHasPlbSoldUnits(plbSoldUnits.length > 0);
        } catch (error) {
          console.error("Failed to check for sold units:", error);
          setHasPlbSoldUnits(false);
        }
      };
      checkSoldUnits();
    } else {
      setHasPlbSoldUnits(false);
    }
  }, [projectId]);

  // Reset view to active listings when the popup is re-opened for a new set of properties
  useEffect(() => {
    setShowTransacted(false);
  }, [properties]);

  const handleViewTransacted = async () => {
    setShowTransacted(true);
    // Fetch only if data isn't already loaded
    if (transactedListings.length === 0 && projectId) {
      setIsLoadingTransacted(true);
      try {
        const { generatePopupData } = await import("../lib/unit-mock-up");
        const popupData = generatePopupData(projectId);
        if (popupData && popupData.soldListings) {
            // A mock duration for styling purposes, replace with real data if available
            const listingsWithDuration = popupData.soldListings.map((listing: any, index: number) => ({
                id: listing.id.toString(), // Convert number to string to match interface
                images: listing.images,
                price: listing.price,
                beds: listing.beds,
                baths: listing.baths,
                size: listing.size,
                agency: listing.agency,
                soldDuration: `Sold in 1 Month ${Math.floor(Math.random() * 20) + 5} Days`
            }));
            setTransactedListings(listingsWithDuration);
        }
      } catch (error) {
        console.error("Failed to load transacted listings:", error);
      } finally {
        setIsLoadingTransacted(false);
      }
    }
  };

  const handleBackToActive = () => {
    setShowTransacted(false);
  };
  


  // Case 1: A single active property is available (e.g., Meyer Mansion)
  if (activeTotalCount === 1 && !showTransacted) {
    const property = mainProperty;
    return (
      <div className="relative map-popup-content bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-full max-w-md">
        {onClose && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-1 right-1 z-10 bg-white/80 hover:bg-white rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <div className="px-2 py-2 border-b border-gray-100">
          <p className="px-0 text-xs text-gray-600 leading-none">
            {transactionType === "transactions" 
              ? `1 transacted record in ${getProjectName(property)}`
              : `1 available in ${getProjectName(property)}`
            }
          </p>
        </div>
        <div className="flex items-center justify-center">
            {/* Property Image */}
            <div className="relative w-2/5 h-24 m-1.5 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                    src={property.images?.[currentImageIndex[property.id] || 0] || "/placeholder.svg"}
                    alt={property.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-300 hover:scale-105"
                />
                
                {/* PLB Badge for PLB listings */}
                {isPLBListing && (
                  <div className="absolute top-1 left-1">
                    <div className="bg-[#123B79] text-white text-[10px] font-bold px-1.5 rounded flex items-center justify-center h-4">
                      PLB
                    </div>
                  </div>
                )}
                
                {/* Navigation arrows for image carousel */}
                {property.images && property.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          showPrevImage(property.id, property.images);
                        }}
                        className="p-1 bg-white/80 rounded-full ml-1 cursor-pointer hover:bg-white/100"
                      >
                          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          showNextImage(property.id, property.images);
                        }}
                        className="p-1 bg-white/80 rounded-full mr-1 cursor-pointer hover:bg-white/100"
                      >
                          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </button>
                  </div>
                )}
            </div>
            {/* Property Details */}
            <div className="flex-1 px-1 pr-3 flex flex-col justify-start min-w-0">
              <div className="space-y-0.5">
              <p className="font-bold text-sm text-gray-900">
                  <span className="text-xs font-semibold text-gray-500">
                    {transactionType === "transactions" ? "Transacted Price:" : "Asking Price:"}
                  </span>
                  <br />{property.price}
                </p>
                {/* Bedroom, Bathroom, Size */}
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Bed className="h-3 w-3 flex-shrink-0" />
                    <span>{property.beds}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-3 w-3 flex-shrink-0" />
                    <span>{property.baths}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>{property.size}</span>
                </div>
              </div>
              </div>
            </div>
        </div>
      </div>
    );
  }

  // Case 2 & 3: Multiple listings view (Active or Transacted for e.g., The Canopy)
  const displayedListings = showTransacted ? transactedListings : properties;

  return (
    <div className="relative map-popup-content bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-full max-w-sm">
        {onClose && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-1 right-1 z-10 bg-white/80 hover:bg-white rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Header Section */}
        <div className="px-2 py-2 border-b border-gray-100">
            <p className="px-0 text-xs text-gray-600 leading-none">
                {transactionType === "transactions"
                ? `${activeTotalCount} transacted records in ${getProjectName(mainProperty)}`
                : showTransacted
                ? `${transactedPlbCount} PLB Transacted Records in ${getProjectName(mainProperty)}`
                : `${activeTotalCount} available in ${getProjectName(mainProperty)}`}
            </p>
            {showTransacted ? (
                <button
                    onClick={handleBackToActive}
                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                >
                    Back to Available Listings
                </button>
            ) : (
                hasPlbSoldUnits && (
                    <button
                        onClick={handleViewTransacted}
                        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                    >
                        View PLB Transacted Records
                    </button>
                )
            )}
        </div>

        {/* Listings Section */}
        <div className="max-h-[320px] overflow-y-auto">
            {isLoadingTransacted ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
                displayedListings.map((item, index) => {
                    const isPLB = showTransacted ? (item as TransactedListing).agency === 'PLB' : (item as Property).source === 'PLB';
                    const key = `item-${item.id}-${index}`;
                    
                    const itemAsProperty = item as Property;
                    const itemAsTransacted = item as TransactedListing;

                    return (
                        <div
                            key={key}
                            className={`border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${isPLB ? 'border-l-4 border-l-[#123B79]' : 'border-l-4 border-l-white'}`}
                            onClick={() => !showTransacted && onViewDetails(itemAsProperty)}
                        >
                            <div className="flex items-center justify-center">
                                {/* Property Image - Left side */}
                                <div className="relative w-2/5 h-24 m-1.5 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.images?.[currentImageIndex[item.id] || 0] || "/placeholder.svg"}
                                        alt={projectName}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="transition-transform duration-300 hover:scale-105"
                                    />
                                    {isPLB && (
                                        <div className="absolute top-1 left-1">
                                            <div className="bg-[#123B79] text-white text-[10px] font-bold px-1.5 rounded flex items-center justify-center h-4">
                                                PLB
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Navigation arrows for image carousel */}
                                    {item.images && item.images.length > 1 && (
                                      <div className="absolute inset-0 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              showPrevImage(item.id, item.images);
                                            }}
                                            className="p-1 bg-white/80 rounded-full ml-1 cursor-pointer hover:bg-white/100"
                                          >
                                              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                          </button>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              showNextImage(item.id, item.images);
                                            }}
                                            className="p-1 bg-white/80 rounded-full mr-1 cursor-pointer hover:bg-white/100"
                                          >
                                              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                          </button>
                                      </div>
                                    )}
                                </div>

                                {/* Property Details - Right side */}
                                <div className="flex-1 px-1 pr-3 flex flex-col justify-start min-w-0">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-sm text-gray-900">
                                            <span className="text-xs font-semibold text-gray-500">
                                                {showTransacted ? 'Sold at:' : 'Asking Price:'}
                                            </span>
                                            <br />{typeof item.price === 'string' ? item.price : item.price}
                                        </p>

                                        {/* Bedroom, Bathroom, Size */}
                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Bed className="h-3 w-3 flex-shrink-0" />
                                                <span>{item.beds}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bath className="h-3 w-3 flex-shrink-0" />
                                                <span>{item.baths}</span>
                                            </div>
                                            <span>{item.size}</span>
                                        </div>
                                        
                                        {/* Sold Duration */}
                                        {showTransacted && itemAsTransacted.soldDuration && (
                                            <p className="text-xs text-gray-400">
                                                {itemAsTransacted.soldDuration}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
             {displayedListings.length === 0 && !isLoadingTransacted && (
                <div className="p-4 text-center text-gray-500">No records to display.</div>
            )}
        </div>
    </div>
  );
}