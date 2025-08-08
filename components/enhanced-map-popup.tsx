import React, { useState, useEffect } from "react";
import { Bed, Bath, Square, MapPin, Building2, Shield, Calendar, ArrowLeft } from "lucide-react";
import type { Property } from "../lib/types";

interface EnhancedMapPopupProps {
  properties: Property[];
  onViewDetails: (property: Property) => void;
  projectId?: string; // Optional project ID to fetch transacted records
}

export default function EnhancedMapPopup({
  properties,
  onViewDetails,
  projectId,
}: EnhancedMapPopupProps) {
  const [showTransacted, setShowTransacted] = useState(false);
  const [transactedListings, setTransactedListings] = useState<any[]>([]);
  const [isLoadingTransacted, setIsLoadingTransacted] = useState(false);
  const [hasSoldUnits, setHasSoldUnits] = useState(false);

  // Calculate active listings breakdown
  const activePlbCount = properties.filter(prop => prop.source === "PLB").length;
  const activeOtherCount = properties.filter(prop => prop.source !== "PLB").length;

  // Calculate transacted listings breakdown (PLB only)
  const transactedPlbCount = transactedListings.filter(listing => listing.agency === "PLB").length;

  // Check if there are PLB sold units for this project
  useEffect(() => {
    if (projectId) {
      const checkSoldUnits = async () => {
        try {
          const { getSoldUnitsByProject } = await import("../lib/unit-mock-up");
          const soldUnits = getSoldUnitsByProject(projectId);
          const plbSoldUnits = soldUnits.filter(unit => unit.agency === "PLB");
          setHasSoldUnits(plbSoldUnits.length > 0);
        } catch (error) {
          console.error("Failed to check sold units:", error);
          setHasSoldUnits(false);
        }
      };
      checkSoldUnits();
    } else {
      setHasSoldUnits(false);
    }
  }, [projectId]);

  // Reset to active listings view when properties change (popup reopened)
  useEffect(() => {
    setShowTransacted(false);
    setTransactedListings([]);
    setIsLoadingTransacted(false);
  }, [properties]);
  if (properties.length === 0) {
    return (
      <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <MapPin className="w-6 h-6 mx-auto mb-1 text-gray-400" />
          <p className="text-sm">No properties found</p>
        </div>
      </div>
    );
  }

  const mainProperty = properties[0];
  const isPLB = mainProperty.source === "PLB";

  // Function to load transacted listings
  const loadTransactedListings = async () => {
    if (projectId && !isLoadingTransacted && transactedListings.length === 0) {
      setIsLoadingTransacted(true);
      try {
        // Import the function dynamically to avoid circular dependencies
        const { generatePopupData } = await import("../lib/unit-mock-up");
        const popupData = generatePopupData(projectId);
        if (popupData && popupData.soldListings.length > 0) {
          setTransactedListings(popupData.soldListings);
        }
      } catch (error) {
        console.error("Failed to load transacted listings:", error);
      } finally {
        setIsLoadingTransacted(false);
      }
    }
  };

  const handleViewTransacted = () => {
    setShowTransacted(true);
    loadTransactedListings();
  };

  const handleBackToActive = () => {
    setShowTransacted(false);
  };

    // If showing transacted listings
  if (showTransacted) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-md">
        {/* Header */}
        <div className="px-2 border-b border-gray-100">
          <p className="text-xs text-gray-600 leading-none">
            {transactedPlbCount} PLB Transacted Records in {mainProperty.name}
          </p>

          {/* Back to Available Listings Link */}
          <div className="mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBackToActive();
              }}
              className="text-blue-600 hover:text-blue-800 text-xs underline"
            >
              Back to Available Listings
            </button>
          </div>
        </div>
        

        {isLoadingTransacted ? (
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">Loading transacted records...</div>
          </div>
        ) : transactedPlbCount > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {transactedListings.filter(listing => listing.agency === "PLB").slice(0, 3).map((listing, index) => (
              <div 
                key={listing.id} 
                className={`border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-l-[#123B79]`}
              >
                <div className="flex items-center justify-center">
                  {/* Property Image - Left side */}
                  <div className="relative w-2/5 h-24 m-1.5 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={listing.images?.[0] || "/placeholder.svg"}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1">
                      <span className="px-1.5 py-0.5 h-4 text-[9px] rounded font-bold bg-[#123B79] text-white">
                        PLB
                      </span>
                    </div>
                  </div>

                  {/* Property Details - Right side */}
                  <div className="flex-1 px-1 pr-3 flex flex-col justify-start min-w-0">
                    <div className="space-y-0.5">
                      {/* Price */}
                      <div>
                        <p className="font-bold text-xs text-gray-900 mb-0.5">
                          <span className="text-xs font-semibold text-gray-500">
                              {listing.price.includes('/month') ? 'Rented at:' : 'Sold at:'}
                          </span>
                          <br />{listing.price}
                        </p>
                      </div>

                      {/* Key Specs */}
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Bed className="h-3 w-3 flex-shrink-0" />
                          <span>{listing.beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-3 w-3 flex-shrink-0" />
                          <span>{listing.baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{listing.size}</span>
                        </div>
                      </div>

                      {/* Sold Duration */}
                      <div className="text-xs text-gray-400">
                        Sold in 1 Month 19 Days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">No PLB transacted records found</div>
          </div>
        )}
      </div>
    );
  }

  // Active listings view
  return (
    <div 
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200 max-w-md"
    >
      {/* Header */}
      <div className="px-2 border-b border-gray-100">
        <p className="text-xs text-gray-600 leading-none">
          {properties.length} available in {mainProperty.name}
        </p>

        {/* Show breakdown for active listings */}
          {activePlbCount > 0 && activeOtherCount > 0 && (
          <p className="text-xs text-gray-500 leading-none mt-1">
            {activePlbCount} PLB • {activeOtherCount} Other
          </p>
        )}

        {/* View Transacted Records Link */}
          {projectId && hasSoldUnits && (
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewTransacted();
                }}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
                >
                View PLB Transacted Records
              </button>
            </div>
          )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {properties.map((property, index) => (
          <div 
            key={index}
            className={`border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
              property.agent?.agencyName === "PLB" ? "border-l-4 border-l-[#123B79]" : "border-l-4 border-l-white"
            }`}
            onClick={() => onViewDetails(property)}
          >
            <div className="flex items-center justify-center">
              {/* Property Image - Left side */}
              <div className="relative w-2/5 h-24 m-1.5 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={property.images?.[0] || "/placeholder.svg"}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                {/* PLB Badge */}
                <div className="absolute top-1 left-1">
                  {property.agent?.agencyName === "PLB" && (
                    <span className="px-1.5 py-0.5 h-4 text-[9px] rounded font-bold bg-[#123B79] text-white">
                      PLB
                    </span>
                  )}
                </div>
              </div>

              {/* Property Details - Right side */}
              <div className="flex-1 px-1 pr-3 flex flex-col justify-start min-w-0">
                <div className="space-y-0.5">
                  {/* Price */}
                  <div>
                    <p className="font-bold text-xs text-gray-900 mb-0.5">
                      <span className="text-xs font-semibold text-gray-500">
                          Asking Price:
                      </span>
                      <br />{property.price}
                    </p>
                  </div>

                  {/* Key Specs */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
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
        ))}
      </div>
    </div>
  );
} 