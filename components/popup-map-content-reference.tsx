"use client";

import { Bed, Bath } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import type { Property } from "../lib/types"; // Make sure this path is correct

// Define a type for your transacted listings for better type safety
// You might need to adjust this based on your actual data structure
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
}

export default function EnhancedMapPopup({
  properties,
  onViewDetails,
  projectId,
}: EnhancedMapPopupProps) {
  const [showTransacted, setShowTransacted] = useState(false);
  const [transactedListings, setTransactedListings] = useState<TransactedListing[]>([]);
  const [isLoadingTransacted, setIsLoadingTransacted] = useState(false);
  const [hasPlbSoldUnits, setHasPlbSoldUnits] = useState(false);

  const mainProperty = properties[0];
  const projectName = mainProperty?.name || "this location";

  // Check if there are PLB sold units for this project to decide if the "View Transacted" button should be shown
  useEffect(() => {
    if (projectId) {
      const checkSoldUnits = async () => {
        try {
          // Assuming this async import works in your setup
          const { getSoldUnitsByProject } = await import("../lib/unit-mock-up");
          const soldUnits = getSoldUnitsByProject(projectId) as TransactedListing[];
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
                ...listing,
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
  
  // Counts for the header display
  const activeTotalCount = properties.length;
  const transactedPlbCount = transactedListings.filter(l => l.agency === 'PLB').length;

  // Case 1: A single active property is available (e.g., Meyer Mansion)
  if (activeTotalCount === 1 && !showTransacted) {
    const property = mainProperty;
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-full max-w-sm">
        <div className="px-3 py-1.5 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800 leading-tight">
            1 available in {projectName}
          </p>
        </div>
        <div className="flex p-2">
            {/* Property Image */}
            <div className="relative w-2/5 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                    src={property.images?.[0] || "/placeholder.svg"}
                    alt={property.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="bg-gray-100"
                />
            </div>
            {/* Property Details */}
            <div className="flex-1 pl-3 flex flex-col justify-center">
                <p className="text-xs font-semibold text-gray-500">Asking Price:</p>
                <p className="font-bold text-lg text-gray-900 mb-2">
                    {property.price}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4 text-gray-500"/>
                        <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-gray-500"/>
                        <span>{property.baths}</span>
                    </div>
                    <span className="text-sm">{property.size}</span>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Case 2 & 3: Multiple listings view (Active or Transacted for e.g., The Canopy)
  const displayedListings = showTransacted ? transactedListings : properties;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-full max-w-sm">
        {/* Header Section */}
        <div className="px-3 py-1.5 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 leading-tight">
                {showTransacted
                ? `${transactedPlbCount} PLB Transacted Records in ${projectName}`
                : `${activeTotalCount} available in ${projectName}`}
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
                    const isPLB = showTransacted ? (item as TransactedListing).agency === 'PLB' : (item as Property).agent?.agencyName === 'PLB';
                    const key = `item-${item.id}-${index}`;
                    
                    const itemAsProperty = item as Property;
                    const itemAsTransacted = item as TransactedListing;

                    return (
                        <div
                            key={key}
                            className={`flex p-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${isPLB ? 'border-l-4 border-l-[#123B79]' : ''}`}
                            onClick={() => !showTransacted && onViewDetails(itemAsProperty)}
                        >
                            {/* Image */}
                            <div className="relative w-2/5 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                    src={item.images?.[0] || "/placeholder.svg"}
                                    alt={projectName}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="bg-gray-100"
                                />
                                {isPLB && (
                                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] rounded-sm font-bold bg-[#123B79] text-white leading-none">
                                        PLB
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 pl-3 flex flex-col justify-center">
                                <p className="text-xs font-semibold text-gray-500">
                                    {showTransacted ? 'Sold at:' : 'Asking Price:'}
                                </p>
                                <p className="font-bold text-lg text-gray-900 mb-1">
                                    {item.price}
                                </p>
                                <div className="flex items-center space-x-3 text-sm text-gray-600 mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <Bed className="h-4 w-4 text-gray-500"/>
                                        <span>{item.beds}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Bath className="h-4 w-4 text-gray-500"/>
                                        <span>{item.baths}</span>
                                    </div>
                                    <span className="text-sm">{item.size}</span>
                                </div>
                                {showTransacted && itemAsTransacted.soldDuration && (
                                    <p className="text-xs text-gray-400">
                                        {itemAsTransacted.soldDuration}
                                    </p>
                                )}
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