"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/project-data";
import { createCustomIcon } from "../lib/map-icons";
import type { Property } from "../lib/types";
import EnhancedMapPopup from "./enhanced-map-popup";
import { getActiveUnitsByProject, type Unit } from "@/lib/unit-mock-up";

interface SimpleMapProps {
  onMarkerClick?: (property: any) => void;
  activeLayer?: string | null;
  transactionType?: string;
}

export function SimpleMap({ onMarkerClick, activeLayer, transactionType = "For Sale" }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Debug: Log the transaction type
  console.log('SimpleMap - TransactionType:', transactionType)

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    // Only initialize map if it doesn't exist
    if (mapInstanceRef.current) {
      return; // Don't reinitialize if map already exists
    }

    // Check if the map container already has a map instance
    if ((mapRef.current as any)._leaflet_id) {
      return; // Map already initialized
    }

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      // Import Leaflet CSS - handle gracefully if it fails
      try {
        require("leaflet/dist/leaflet.css");
      } catch (error) {
        console.log("Leaflet CSS import failed, continuing without it");
      }

      // Add custom CSS for marker hover effects
      const style = document.createElement('style');
      style.textContent = `
        .custom-marker {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .custom-marker:hover {
          transform: scale(1.2);
          z-index: 1000 !important;
        }
        .custom-marker:hover .marker-dot {
          background-color: #ef4444 !important;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.6) !important;
        }
        .transport-marker:hover .marker-dot {
          background-color: #3b82f6 !important;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.6) !important;
        }
        .school-marker:hover .marker-dot {
          background-color: #10b981 !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.6) !important;
        }
      `;
      document.head.appendChild(style);

      // Fix for default markers in Leaflet
      if (L.Icon.Default) {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
      }

      // Initialize map centered on Singapore
      const map = L.map(mapRef.current!).setView([1.3521, 103.8198], 12);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

              // Add property markers with red dots and improved hover effects
        projects.forEach((project) => {
          // Create red dot icon with improved hover effect
          const redDotIcon = L.divIcon({
            className: "custom-marker leaflet-zoom-animated leaflet-interactive",
            html: `
              <div class="relative flex items-center justify-center">
                <div class="marker-dot w-5 h-5 rounded-full border-2 border-white shadow-md" style="background-color: #dc2626;"></div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
          });

          // Get active units for this project
          const projectUnits = getActiveUnitsByProject(project.id);
          
          // If no active units, skip this project
          if (projectUnits.length === 0) {
            return;
          }
          
                  // Convert all active units to Property format for EnhancedMapPopup
        const propertyDataArray: Property[] = projectUnits.map(unit => ({
          id: parseInt(unit.id.replace(/\D/g, '')), // Convert unit ID to number
          name: project.name,
          address: project.address,
          lat: project.coordinates[0],
          lng: project.coordinates[1],
          source: "PLB" as const,
          status: "ACTIVE" as const,
          price: unit.price,
          size: unit.size,
          psf: unit.psf,
          beds: unit.beds,
          baths: unit.baths,
          tenure: project.tenure,
          district: project.district,
          year: project.year,
          type: project.type,
          description: unit.description,
          features: unit.features,
          images: unit.images,
          agent: unit.agent,
          floorPlan: unit.floorPlan,
          virtualTour: unit.virtualTour,
          additionalDetails: unit.additionalDetails,
        }));

          const marker = L.marker(project.coordinates as [number, number], { icon: redDotIcon })
            .addTo(map);

          // Create popup content using React component
          const popupContent = document.createElement('div');
          const root = document.createElement('div');
          popupContent.appendChild(root);

          // Use ReactDOM to render the EnhancedMapPopup
          import("react-dom/client").then((ReactDOM) => {
            const reactRoot = ReactDOM.createRoot(root);
            reactRoot.render(
              React.createElement(EnhancedMapPopup, {
                properties: propertyDataArray,
                projectId: project.id,
                onViewDetails: (property: Property) => {
                  if (onMarkerClick) {
                    onMarkerClick(property);
                  }
                },
              })
            );
          });

          marker.bindPopup(popupContent);

        // Remove the direct click handler - let the popup handle property selection
        // The onViewDetails callback in the popup will handle opening property details
      });

      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    }).catch((error) => {
      console.error("Failed to load Leaflet:", error);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapLoaded(false);
      }
    };
  }, [transactionType]); // Add transactionType to dependencies to re-initialize when it changes

  // Handle layer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || typeof window === "undefined") return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Remove existing layers except base tile layer
      if (map && typeof map.eachLayer === 'function') {
        map.eachLayer((layer: any) => {
          if (layer instanceof L.TileLayer && layer.getAttribution && layer.getAttribution()?.includes("OpenStreetMap")) {
            return; // Keep base tile layer
          }
          if (map && typeof map.removeLayer === 'function') {
            map.removeLayer(layer);
          }
        });
      }

      // Add property markers back with improved hover effects
      projects.forEach((project) => {
        const redDotIcon = L.divIcon({
          className: "custom-marker leaflet-zoom-animated leaflet-interactive",
          html: `
            <div class="relative flex items-center justify-center">
              <div class="marker-dot w-5 h-5 rounded-full border-2 border-white shadow-md" style="background-color: #dc2626;"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10],
        });

                // Get active units for this project and filter by transaction type
        const projectUnits = getActiveUnitsByProject(project.id);
        const filteredUnits = projectUnits.filter(unit => {
          if (transactionType === "For Sale") {
            return !unit.price.includes('/month');
          } else if (transactionType === "For Rent") {
            return unit.price.includes('/month');
          }
          return true; // Show all if no filter
        });
        
        // Debug: Log filtering results
        console.log(`Project: ${project.name}, TransactionType: ${transactionType}, Total units: ${projectUnits.length}, Filtered units: ${filteredUnits.length}`);
        
        // If no units match the transaction type, skip this project
        if (filteredUnits.length === 0) {
          return;
        }
        
                           // Convert filtered units to Property format for EnhancedMapPopup
         const propertyDataArray: Property[] = filteredUnits.map(unit => ({
           id: parseInt(unit.id.replace(/\D/g, '')), // Convert unit ID to number
           name: project.name,
           address: project.address,
           lat: project.coordinates[0],
           lng: project.coordinates[1],
           source: "PLB" as const,
           status: "ACTIVE" as const,
           price: unit.price,
           size: unit.size,
           psf: unit.psf,
           beds: unit.beds,
           baths: unit.baths,
           tenure: project.tenure,
           district: project.district,
           year: project.year,
           type: project.type,
           description: unit.description,
           features: unit.features,
           images: unit.images,
                       agent: unit.agent,
            floorPlan: unit.floorPlan,
            virtualTour: unit.virtualTour,
            additionalDetails: unit.additionalDetails,
          }));

        const marker = L.marker(project.coordinates as [number, number], { icon: redDotIcon })
          .addTo(map);

        // Create popup content using React component
        const popupContent = document.createElement('div');
        const root = document.createElement('div');
        popupContent.appendChild(root);

        // Use ReactDOM to render the EnhancedMapPopup
        import("react-dom/client").then((ReactDOM) => {
          const reactRoot = ReactDOM.createRoot(root);
          reactRoot.render(
                          React.createElement(EnhancedMapPopup, {
                properties: propertyDataArray,
                projectId: project.id,
                onViewDetails: (property: Property) => {
                  if (onMarkerClick) {
                    onMarkerClick(property);
                  }
                },
              })
          );
        });

        marker.bindPopup(popupContent);

        // Remove the direct click handler - let the popup handle property selection
        // The onViewDetails callback in the popup will handle opening property details
      });

      // Add layer-specific overlays with improved hover effects
      if (activeLayer === "transport") {
        // Add transport layer (MRT stations, bus stops)
        const transportStations = [
          { name: "Kembangan MRT", coords: [1.3214, 103.9129] as [number, number] },
          { name: "Eunos MRT", coords: [1.3197, 103.9031] as [number, number] },
          { name: "Raffles Place MRT", coords: [1.2841, 103.8515] as [number, number] },
          { name: "Marina Bay MRT", coords: [1.2831, 103.8516] as [number, number] },
          { name: "Tanjong Pagar MRT", coords: [1.2841, 103.8436] as [number, number] },
          { name: "Outram Park MRT", coords: [1.2801, 103.8394] as [number, number] },
        ];

        transportStations.forEach((station) => {
          L.marker(station.coords, {
            icon: L.divIcon({
              className: "transport-marker leaflet-zoom-animated leaflet-interactive",
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="marker-dot w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                </div>
              `,
              iconSize: [16, 16],
            }),
          })
            .addTo(map)
            .bindPopup(`<div class="p-2"><strong>${station.name}</strong></div>`);
        });
      }

      if (activeLayer === "schools") {
        // Add schools layer
        const schools = [
          { name: "Tanjong Katong Primary School", coords: [1.3081, 103.8997] as [number, number] },
          { name: "Haig Girls' School", coords: [1.3056, 103.8972] as [number, number] },
          { name: "Victoria School", coords: [1.2831, 103.8516] as [number, number] },
          { name: "Raffles Institution", coords: [1.2711, 103.8244] as [number, number] },
          { name: "St. Margaret's Primary School", coords: [1.2841, 103.8436] as [number, number] },
        ];

        schools.forEach((school) => {
          L.marker(school.coords, {
            icon: L.divIcon({
              className: "school-marker leaflet-zoom-animated leaflet-interactive",
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="marker-dot w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                </div>
              `,
              iconSize: [16, 16],
            }),
          })
            .addTo(map)
            .bindPopup(`<div class="p-2"><strong>${school.name}</strong></div>`);
        });
      }

      if (activeLayer === "heatmap") {
        // Add heatmap effect by clustering nearby properties
        const heatmapData = projects.map((project) => ({
          lat: project.coordinates[0],
          lng: project.coordinates[1],
          value: 1, // You could weight this based on price or other factors
        }));

        // Simple heatmap effect using circles with opacity
        heatmapData.forEach((point) => {
          L.circle([point.lat, point.lng], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.3,
            radius: 500,
          }).addTo(map);
        });
      }
    });
  }, [activeLayer, isMapLoaded]);

  return <div ref={mapRef} className="w-full h-full" />;
}

// Add default export for easier importing
export default SimpleMap; 