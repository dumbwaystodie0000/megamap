"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { projects } from "@/lib/project-data";
import type { Property } from "@/lib/types";

import { getActiveUnitsByProject, getSoldUnitsByProject, getTransactionUnitsByProject, type Unit } from "@/lib/unit-mock-up";

interface GoogleMapProps {
  onMarkerClick?: (property: any) => void;
  activeLayer?: string | null;
  transactionType?: string;
}



// Map component that receives Google Maps instance
function MapComponent({ 
  onMarkerClick, 
  activeLayer, 
  transactionType = "For Sale" 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);



  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Define Singapore bounds to restrict the map view
    const singaporeBounds = {
      north: 1.4700, // Northernmost point of Singapore
      south: 1.2000, // Southernmost point of Singapore
      east: 104.1000,  // Easternmost point of Singapore
      west: 103.6000   // Westernmost point of Singapore
    };

    // Initialize Google Map centered on Singapore
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 1.3521, lng: 103.8198 },
      zoom: 12,
      minZoom: 10, // Prevent zooming out too far - keeps Singapore in focus
      maxZoom: 20, // Allow reasonable zoom in for street level
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      // Restrict map bounds to Singapore area
      restriction: {
        latLngBounds: singaporeBounds,
        strictBounds: false // Allow some flexibility but keep focus on Singapore
      },
      // Disable map dragging outside bounds
      draggable: true,
      // Allow natural map interaction on non-mobile devices
      gestureHandling: 'greedy'
    });

    mapInstanceRef.current = map;

    // Initialize InfoWindow
    infoWindowRef.current = new google.maps.InfoWindow();

    // Add bounds change listener to ensure map stays focused on Singapore
    map.addListener('bounds_changed', () => {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        
        // If map is dragged too far from Singapore, gently nudge it back
        if (ne.lat() > singaporeBounds.north + 0.5 || 
            sw.lat() < singaporeBounds.south - 0.5 ||
            ne.lng() > singaporeBounds.east + 0.5 || 
            sw.lng() < singaporeBounds.west - 0.5) {
          
          // Smoothly pan back to Singapore center
          map.panTo({ lat: 1.3521, lng: 103.8198 });
        }
      }
    });

  }, []);

  // Clear all markers
  const clearMapElements = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Remove existing legends
    const existingSchoolsLegend = mapRef.current?.querySelector('.schools-legend-overlay');
    if (existingSchoolsLegend) {
      existingSchoolsLegend.remove();
    }
  }, []);

  // Add property markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    clearMapElements();

    // Add property markers
    projects.forEach((project) => {
      // Check if this project has any units matching the transaction type
      let allUnits;
      if (transactionType === "transactions") {
        // For transactions page, show sold/rented units
        allUnits = getTransactionUnitsByProject(project.id);
      } else {
        // For main page, show active units
        allUnits = getActiveUnitsByProject(project.id);
      }
      
      const matchingUnits = allUnits.filter(unit => {
        if (transactionType === "transactions") {
          // Show all sold/rented units for transactions page
          return true;
        }
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

      // Skip project if no matching units
      if (matchingUnits.length === 0) {
        return;
      }
      const marker = new google.maps.Marker({
        position: { lat: project.coordinates[0], lng: project.coordinates[1] },
        map: mapInstanceRef.current,
        title: project.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#dc2626",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }
      });

      // Add click handler for property details
      marker.addListener("click", () => {
        // Center map on marker when clicked
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setZoom(15);
          mapInstanceRef.current.panTo({ lat: project.coordinates[0], lng: project.coordinates[1] });
        }
        
        if (onMarkerClick) {
          // Get units for this project that match the transaction type
          let allUnits;
          if (transactionType === "transactions") {
            allUnits = getTransactionUnitsByProject(project.id);
          } else {
            allUnits = getActiveUnitsByProject(project.id);
          }
          
          const filteredUnits = allUnits.filter(unit => {
            if (transactionType === "transactions") {
              return true; // Show all sold/rented units for transactions page
            }
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
          
          if (filteredUnits.length > 0) {
            onMarkerClick(filteredUnits[0]); // Pass the first filtered unit
          }
        }

        // Show project info in InfoWindow using our new popup design
        if (infoWindowRef.current) {
          // Get all units for this project and filter by transaction type
          let allUnits;
          if (transactionType === "transactions") {
            allUnits = getTransactionUnitsByProject(project.id);
          } else {
            allUnits = getActiveUnitsByProject(project.id);
          }
          
          const units = allUnits.filter(unit => {
            if (transactionType === "transactions") {
              return true; // Show all sold/rented units for transactions page
            }
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
          
          // Convert units to Property format for our popup component
          const properties = units.map(unit => {
            if (transactionType === "transactions") {
              // For transactions page, use transacted price and format data differently
              return {
                id: unit.id,
                name: project.name,
                address: project.address,
                lat: project.coordinates[0],
                lng: project.coordinates[1],
                source: unit.agency as "PLB" | "PG" | "OTHER",
                status: unit.status as "ACTIVE" | "SOLD" | "RENTED",
                price: unit.transacted_price || unit.price, // Use transacted price for transactions
                size: unit.size,
                psf: unit.psf,
                beds: unit.beds,
                baths: unit.baths,
                tenure: project.tenure,
                district: project.district,
                year: project.year,
                type: project.type,
                images: unit.images,
                agent: {
                  name: unit.agent.name,
                  phone: unit.agent.phone,
                  email: unit.agent.email,
                  agencyName: unit.agent.agencyName,
                },
                floorPlan: unit.floorPlan,
                virtualTour: unit.virtualTour,
                additionalDetails: unit.additionalDetails,
                // Add transaction-specific data
                transactionType: transactionType,
                projectId: project.id,
                unitCount: units.length,
              };
            } else {
              // For main page, use regular format
              return {
                id: unit.id,
                name: project.name,
                address: project.address,
                lat: project.coordinates[0],
                lng: project.coordinates[1],
                source: unit.agency as "PLB" | "PG" | "OTHER",
                status: unit.status as "ACTIVE" | "SOLD" | "RENTED",
                price: unit.price,
                size: unit.size,
                psf: unit.psf,
                beds: unit.beds,
                baths: unit.baths,
                tenure: project.tenure,
                district: project.district,
                year: project.year,
                type: project.type,
                images: unit.images,
                agent: {
                  name: unit.agent.name,
                  phone: unit.agent.phone,
                  email: unit.agent.email,
                  agencyName: unit.agent.agencyName,
                },
                floorPlan: unit.floorPlan,
                virtualTour: unit.virtualTour,
                additionalDetails: unit.additionalDetails,
              };
            }
          });

          // Create popup content using React component - async approach
          const renderPopup = async () => {
            try {
              const popupContainer = document.createElement('div');
              
              // Apply custom styling to control Google Maps InfoWindow appearance
              popupContainer.style.margin = '0';
              popupContainer.style.padding = '0'; // Remove padding completely
              popupContainer.style.minWidth = '320px';
              popupContainer.style.maxWidth = '400px';
              
              // Import all dependencies
              const [ReactDOM, React, EnhancedMapPopupModule] = await Promise.all([
                import("react-dom/client"),
                import("react"),
                import("./enhanced-map-popup")
              ]);
              
              const EnhancedMapPopup = EnhancedMapPopupModule.default;
              const root = ReactDOM.createRoot(popupContainer);
              
              // Render the component
              root.render(
                React.createElement(EnhancedMapPopup, {
                  properties: properties,
                  projectId: project.id,
                  transactionType: transactionType,
                  onViewDetails: (property) => {
                    if (onMarkerClick) {
                      onMarkerClick(property);
                    }
                  },
                  onClose: () => {
                    if (infoWindowRef.current) {
                      infoWindowRef.current.close();
                    }
                  }
                })
              );

              // Wait a moment for React to render
              setTimeout(() => {
                if (infoWindowRef.current) {
                  // Set custom options for the InfoWindow
                  const infoWindowOptions = {
                    disableAutoPan: false,
                    pixelOffset: new google.maps.Size(0, 0), // Adjust offset for smaller tail
                    maxWidth: 400
                  };
                  
                  // Apply the options
                  Object.keys(infoWindowOptions).forEach(key => {
                    infoWindowRef.current.set(key, infoWindowOptions[key]);
                  });
                  
                  infoWindowRef.current.setContent(popupContainer);
                  infoWindowRef.current.open(mapInstanceRef.current, marker);
                  
                  // Add style fix after InfoWindow is opened to override Google's default styles
                  setTimeout(() => {
                    // Find and style the InfoWindow container
                    const infoWindows = document.querySelectorAll('.gm-style-iw');
                    infoWindows.forEach(iw => {
                      (iw as HTMLElement).style.padding = '0'; // Remove padding completely
                      (iw as HTMLElement).style.margin = '0';
                      (iw as HTMLElement).style.minWidth = '320px';
                      (iw as HTMLElement).style.maxWidth = '400px';
                      
                      // Only clear padding on specific elements, not user-styled content
                      // This allows our component's internal padding to work properly
                      const infoWindowContainers = iw.querySelectorAll('.gm-style-iw-d, .gm-style-iw-c');
                      infoWindowContainers.forEach(container => {
                        (container as HTMLElement).style.padding = '0';
                      });
                      
                      // Don't override padding on our map popup content elements
                      const mapPopupElements = document.querySelectorAll('.map-popup-content p, .map-popup-content div.px-2, .map-popup-content div.py-2');
                      mapPopupElements.forEach(el => {
                        // Remove the inline style that zeroes padding
                        (el as HTMLElement).style.removeProperty('padding');
                      });
                    });
                    
                    // Remove the tail/arrow shadow element
                    const iwTails = document.querySelectorAll('.gm-style-iw-t');
                    iwTails.forEach(iwt => {
                      (iwt as HTMLElement).style.padding = '0';
                      (iwt as HTMLElement).style.margin = '0';
                    });
                  }, 50);
                }
              }, 100);
              
            } catch (error) {
              console.error("Failed to render popup:", error);
              // Fallback to simple content
              const fallbackContent = `
                <div style="padding: 10px; max-width: 300px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${project.name}</h3>
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${project.address}</p>
                  <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Active Listings:</strong> ${units.length}</p>
                  <p style="margin: 0; font-size: 14px;"><strong>Property Type:</strong> ${project.type}</p>
                </div>
              `;
              if (infoWindowRef.current) {
                infoWindowRef.current.setContent(fallbackContent);
                infoWindowRef.current.open(mapInstanceRef.current, marker);
              }
            }
          };

          renderPopup();
        }
      });

      markersRef.current.push(marker);
    });

  }, [onMarkerClick, transactionType, clearMapElements]);

  // Add transport layer using Google's native transit layer
  useEffect(() => {
    if (!mapInstanceRef.current || activeLayer !== "transport") return;

    // Create and add Google's native transit layer
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(mapInstanceRef.current);

    // Cleanup function to remove transit layer when component unmounts or layer changes
    return () => {
      transitLayer.setMap(null);
    };
  }, [activeLayer]);



  // Add schools layer
  useEffect(() => {
    if (!mapInstanceRef.current || activeLayer !== "schools") return;

    // Load and render schools from GeoJSON files
    Promise.all([
      fetch('/school_info/primary_info-school_info.geojson'),
      fetch('/school_info/secondary_other_info-school_info.geojson')
    ]).then(responses => Promise.all(responses.map(r => r.json())))
    .then(([primarySchools, secondarySchools]) => {
      // Function to get icon size based on current zoom level
      const getIconSize = (zoom: number) => {
        if (zoom <= 10) return 20;      // Very zoomed out - small icons
        if (zoom <= 12) return 28;      // Zoomed out - medium-small icons
        if (zoom <= 14) return 29;      // Medium zoom - medium icons (36 * 0.8 = 28.8, rounded to 29)
        if (zoom <= 16) return 38;      // Zoomed in - large icons (48 * 0.8 = 38.4, rounded to 38)
        return 56;                      // Very zoomed in - extra large icons
      };

              // Function to update all school marker sizes
        const updateSchoolMarkerSizes = () => {
          const currentZoom = mapInstanceRef.current?.getZoom() || 12;
          const newSize = getIconSize(currentZoom);
          
          // Update primary school markers
          primarySchools.features.forEach((feature: any, index: number) => {
            const marker = markersRef.current.find(m => 
              m.getTitle() === feature.properties.school_name
            );
            if (marker) {
              marker.setIcon({
                url: '/primary_school_pin.svg',
                scaledSize: new google.maps.Size(newSize, newSize),
                anchor: new google.maps.Point(newSize / 2, newSize / 2),
              });
            }
          });

          // Update secondary school markers
          secondarySchools.features.forEach((feature: any, index: number) => {
            const marker = markersRef.current.find(m => 
              m.getTitle() === feature.properties.school_name
            );
            if (marker) {
              marker.setIcon({
                url: '/secondary_other_school_pin.svg',
                scaledSize: new google.maps.Size(newSize, newSize),
                anchor: new google.maps.Point(newSize / 2, newSize / 2),
              });
            }
          });
        };

      // Create custom icons for different school types with initial size
      const initialSize = getIconSize(mapInstanceRef.current?.getZoom() || 12);
      const primarySchoolIcon = {
        url: '/primary_school_pin.svg',
        scaledSize: new google.maps.Size(initialSize, initialSize),
        anchor: new google.maps.Point(initialSize / 2, initialSize / 2),
      };

      const secondarySchoolIcon = {
        url: '/secondary_other_school_pin.svg',
        scaledSize: new google.maps.Size(initialSize, initialSize),
        anchor: new google.maps.Point(initialSize / 2, initialSize / 2),
      };

      // Process primary schools
      primarySchools.features.forEach((feature: any) => {
        const coords = feature.geometry.coordinates;
        const properties = feature.properties;
        
        // Reverse coordinates: GeoJSON uses [lng, lat], Google Maps uses {lat, lng}
        const lat = coords[1];
        const lng = coords[0];
        
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          title: properties.school_name,
          icon: primarySchoolIcon
        });

        marker.addListener("click", () => {
          // Center map on school marker when clicked
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setZoom(15);
            mapInstanceRef.current.panTo({ lat, lng });
          }
          
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`
              <div style="padding: 12px; min-width: 200px;">
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #000000;">${properties.school_name}</div>
                <div style="color: #666; margin-bottom: 4px; font-size: 14px;">Primary School</div>
                <div style="color: #666; font-size: 12px;">Postal Code: ${properties.postal_code}</div>
              </div>
            `);
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }
        });

        markersRef.current.push(marker);
      });

      // Process secondary and other schools
      secondarySchools.features.forEach((feature: any) => {
        const coords = feature.geometry.coordinates;
        const properties = feature.properties;
        
        // Reverse coordinates: GeoJSON uses [lng, lat], Google Maps uses {lat, lng}
        const lat = coords[1];
        const lng = coords[0];
        
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          title: properties.school_name,
          icon: secondarySchoolIcon
        });

        marker.addListener("click", () => {
          // Center map on school marker when clicked
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setZoom(15);
            mapInstanceRef.current.panTo({ lat, lng });
          }
          
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`
              <div style="padding: 12px; min-width: 200px;">
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #000000;">${properties.school_name}</div>
                <div style="color: #666; margin-bottom: 4px; font-size: 14px;">${properties.mainlevel_code}</div>
                <div style="color: #666; font-size: 12px;">Postal Code: ${properties.postal_code}</div>
              </div>
            `);
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }
        });

        markersRef.current.push(marker);
      });

      // Add zoom change listener to update marker sizes
      if (mapInstanceRef.current) {
        mapInstanceRef.current.addListener('zoom_changed', updateSchoolMarkerSizes);
      }

      // Add schools legend
      const legendDiv = document.createElement('div');
      legendDiv.className = 'schools-legend-overlay';
      legendDiv.innerHTML = `
        <div class="bg-white p-3 rounded-lg shadow-lg border" style="min-width: 200px; position: absolute; bottom: 20px; right: 20px; z-index: 1000;">
          <div class="font-bold text-sm mb-2 text-gray-800">Schools</div>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <img src="/primary_school_pin.svg" alt="Primary" class="w-5 h-5" />
              <span class="text-xs text-gray-600">Primary Schools</span>
            </div>
            <div class="flex items-center space-x-2">
              <img src="/secondary_other_school_pin.svg" alt="Secondary" class="w-5 h-5" />
              <span class="text-xs text-gray-600">Secondary & Other Schools</span>
            </div>
          </div>
        </div>
      `;
      
      // Add legend to map container
      if (mapRef.current) {
        mapRef.current.appendChild(legendDiv);
      }
    }).catch(error => {
      console.error('Failed to load schools data:', error);
    });

  }, [activeLayer]);

  // Add heatmap layer
  useEffect(() => {
    if (!mapInstanceRef.current || activeLayer !== "heatmap") return;

    projects.forEach((project) => {
      const circle = new google.maps.Circle({
        strokeColor: "#ff0000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "#ff0000",
        fillOpacity: 0.3,
        map: mapInstanceRef.current,
        center: { lat: project.coordinates[0], lng: project.coordinates[1] },
        radius: 500,
      });

      // Store in markersRef for cleanup (since we don't have a separate ref for circles)
      markersRef.current.push(circle as any);
    });

  }, [activeLayer]);

  return (
    <>
      <style jsx>{`
        .schools-legend-overlay {
          pointer-events: none;
        }
        .schools-legend-overlay > div {
          pointer-events: auto;
        }
      `}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}

// Render function for loading states
const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50">
          <div className="text-center">
            <p className="text-red-600 font-medium">Failed to load Google Maps</p>
            <p className="text-red-500 text-sm mt-2">Please check your API key and internet connection</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

// Main component with Google Maps wrapper
export function GoogleMap(props: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <p className="text-yellow-600 font-medium">Google Maps API Key Missing</p>
          <p className="text-yellow-500 text-sm mt-2">Please add NEXT_PUBLIC_GOOGLE_KEY to your .env.local file</p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper 
      apiKey={apiKey} 
      render={render}
      libraries={["geometry"]}
    >
      <MapComponent {...props} />
    </Wrapper>
  );
}

export default GoogleMap;