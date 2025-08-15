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

    // Clean up previous legend if it exists
    const existingLegend = mapRef.current.querySelector('.mrt-legend-overlay');
    if (existingLegend) {
      existingLegend.remove();
    }

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
        .school-marker img {
          transition: all 0.2s ease;
        }
        .school-marker:hover img {
          transform: scale(1.2);
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
        }
        .mrt-station-marker {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .mrt-station-marker:hover {
          transform: scale(1.3);
          z-index: 1000 !important;
        }
        .mrt-station-marker:hover .marker-dot {
          box-shadow: 0 0 12px rgba(0,0,0,0.8) !important;
        }
        .mrt-line-label {
          pointer-events: none;
          z-index: 500;
        }
        .mrt-line-label div {
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .mrt-station-code-label {
          pointer-events: none;
          z-index: 400;
        }
        .mrt-station-code-label div {
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          font-weight: 700;
        }
        .mrt-legend-overlay {
          pointer-events: none;
        }
        .mrt-legend-overlay > div {
          pointer-events: auto;
        }
        .schools-legend-overlay {
          pointer-events: none;
        }
        .schools-legend-overlay > div {
          pointer-events: auto;
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

      // Create base layers for map types
      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
      
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
      
      const terrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd'
      });
      
      // Add default layer
      osmLayer.addTo(map);
      
      // Create map type control with smaller font
      const mapTypeControlDiv = document.createElement('div');
      mapTypeControlDiv.className = 'leaflet-control-layers leaflet-control';
      mapTypeControlDiv.style.cssText = 'border-radius: 4px; background: white; box-shadow: 0 1px 5px rgba(0,0,0,0.4);';
      
      const mapTypeControl = document.createElement('div');
      mapTypeControl.className = 'map-type-control';
      mapTypeControl.style.cssText = 'display: flex; padding: 5px;';
      
      // Map button
      const mapButton = document.createElement('div');
      mapButton.textContent = 'Map';
      mapButton.style.cssText = 'padding: 2px 8px; cursor: pointer; font-size: 11px; font-weight: 500; background: #f0f0f0; border-radius: 3px 0 0 3px; border: 1px solid #ccc;';
      mapButton.onclick = () => {
        map.removeLayer(satelliteLayer);
        map.removeLayer(terrainLayer);
        map.addLayer(osmLayer);
        
        mapButton.style.background = '#f0f0f0';
        satelliteButton.style.background = 'white';
        terrainButton.style.background = 'white';
      };
      
      // Satellite button
      const satelliteButton = document.createElement('div');
      satelliteButton.textContent = 'Satellite';
      satelliteButton.style.cssText = 'padding: 2px 8px; cursor: pointer; font-size: 11px; font-weight: 500; background: white; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;';
      satelliteButton.onclick = () => {
        map.removeLayer(osmLayer);
        map.removeLayer(terrainLayer);
        map.addLayer(satelliteLayer);
        
        mapButton.style.background = 'white';
        satelliteButton.style.background = '#f0f0f0';
        terrainButton.style.background = 'white';
      };
      
      // Terrain button
      const terrainButton = document.createElement('div');
      terrainButton.textContent = 'Terrain';
      terrainButton.style.cssText = 'padding: 2px 8px; cursor: pointer; font-size: 11px; font-weight: 500; background: white; border-radius: 0 3px 3px 0; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;';
      terrainButton.onclick = () => {
        map.removeLayer(osmLayer);
        map.removeLayer(satelliteLayer);
        map.addLayer(terrainLayer);
        
        mapButton.style.background = 'white';
        satelliteButton.style.background = 'white';
        terrainButton.style.background = '#f0f0f0';
      };
      
      mapTypeControl.appendChild(mapButton);
      mapTypeControl.appendChild(satelliteButton);
      mapTypeControl.appendChild(terrainButton);
      mapTypeControlDiv.appendChild(mapTypeControl);
      
      // Add labels toggle
      const labelsDiv = document.createElement('div');
      labelsDiv.style.cssText = 'padding: 6px 8px; font-size: 11px; display: flex; align-items: center; border-top: 1px solid #ddd;';
      
      const labelsCheckbox = document.createElement('input');
      labelsCheckbox.type = 'checkbox';
      labelsCheckbox.id = 'labels-toggle';
      labelsCheckbox.checked = true;
      labelsCheckbox.style.cssText = 'margin-right: 5px;';
      
      const labelsLabel = document.createElement('label');
      labelsLabel.htmlFor = 'labels-toggle';
      labelsLabel.textContent = 'Labels';
      labelsLabel.style.cssText = 'font-size: 11px; cursor: pointer;';
      
      labelsDiv.appendChild(labelsCheckbox);
      labelsDiv.appendChild(labelsLabel);
      mapTypeControlDiv.appendChild(labelsDiv);
      
      // Add terrain toggle
      const terrainDiv = document.createElement('div');
      terrainDiv.style.cssText = 'padding: 6px 8px; font-size: 11px; display: flex; align-items: center; border-top: 1px solid #ddd;';
      
      const terrainCheckbox = document.createElement('input');
      terrainCheckbox.type = 'checkbox';
      terrainCheckbox.id = 'terrain-toggle';
      terrainCheckbox.checked = false;
      terrainCheckbox.style.cssText = 'margin-right: 5px;';
      
      const terrainLabel = document.createElement('label');
      terrainLabel.htmlFor = 'terrain-toggle';
      terrainLabel.textContent = 'Terrain';
      terrainLabel.style.cssText = 'font-size: 11px; cursor: pointer;';
      
      terrainDiv.appendChild(terrainCheckbox);
      terrainDiv.appendChild(terrainLabel);
      mapTypeControlDiv.appendChild(terrainDiv);
      
      // Add the control to the map
      const controlContainer = map.getContainer().querySelector('.leaflet-top.leaflet-right');
      if (controlContainer) {
        controlContainer.appendChild(mapTypeControlDiv);
      }

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
          id: parseInt(String(unit.id).replace(/\D/g, '')), // Convert unit ID to number
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
            .addTo(map)
            .on('click', () => {
              // Center map on marker when clicked
              map.setView(project.coordinates as [number, number], 15);
            });

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
                onClose: () => marker.closePopup()
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

      // Remove existing legends
      const existingMRTLegend = mapRef.current?.querySelector('.mrt-legend-overlay');
      if (existingMRTLegend) {
        existingMRTLegend.remove();
      }
      
      const existingSchoolsLegend = mapRef.current?.querySelector('.schools-legend-overlay');
      if (existingSchoolsLegend) {
        existingSchoolsLegend.remove();
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
        
        // Debug: Log filtering results
        console.log(`Project: ${project.name}, TransactionType: ${transactionType}, Total units: ${projectUnits.length}, Filtered units: ${filteredUnits.length}`);
        
        // If no units match the transaction type, skip this project
        if (filteredUnits.length === 0) {
          return;
        }
        
                           // Convert filtered units to Property format for EnhancedMapPopup
      const propertyDataArray: Property[] = filteredUnits.map(unit => ({
           id: parseInt(String(unit.id).replace(/\D/g, '')), // Convert unit ID to number
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
          .addTo(map)
          .on('click', () => {
            // Center map on marker when clicked
            map.setView(project.coordinates as [number, number], 15);
          });

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
                onClose: () => marker.closePopup()
        })
      );
    });

        marker.bindPopup(popupContent);

        // Remove the direct click handler - let the popup handle property selection
        // The onViewDetails callback in the popup will handle opening property details
      });

      // Add layer-specific overlays with improved hover effects
      if (activeLayer === "transport") {
        // Add MRT transport layer with connected lines
    import("@/lib/mrt-data").then(({ mrtLines, mrtStations, getLineColor, getLineName }) => {
      // Draw MRT lines
      mrtLines.forEach((line) => {
            // Get stations for this line
        const lineStations = mrtStations.filter(station => station.lineCode === line.code);
        
        if (lineStations.length > 1) {
              // Create polyline connecting stations in order
              const coordinates = lineStations.map(station => station.coordinates);
              
              // Draw the MRT line
              L.polyline(coordinates, {
                color: line.color,
                weight: 4,
                opacity: 0.8,
                className: `mrt-line-${line.code.toLowerCase()}`
              }).addTo(map);
              
              // Add line label at the middle point (only visible when zoomed in)
              if (coordinates.length > 0) {
                const midIndex = Math.floor(coordinates.length / 2);
                const midPoint = coordinates[midIndex];
                
                const lineLabel = L.marker(midPoint, {
                  icon: L.divIcon({
                    className: "mrt-line-label",
                    html: `
                      <div class="bg-white px-2 py-1 rounded text-xs font-bold border-2 shadow-lg" 
                           style="border-color: ${line.color}; color: ${line.color};">
                        ${line.code}
                      </div>
                    `,
                    iconSize: [36, 20],
                    iconAnchor: [18, 10]
                  })
                });
                
                // Function to show/hide line labels based on zoom level
                const updateLineLabelVisibility = () => {
                  const currentZoom = map.getZoom();
                  if (currentZoom >= 15) { // Show line labels when zoomed in to level 15 or higher
                    lineLabel.addTo(map);
                  } else {
                    lineLabel.remove();
                  }
                };
                
                // Initial visibility check
                updateLineLabelVisibility();
                
                // Listen for zoom changes
                map.on('zoomend', updateLineLabelVisibility);
              }
            }
          });
          
          // Add MRT station markers with labels
      mrtStations.forEach((station) => {
        const lineColor = getLineColor(station.lineCode);
        const isInterchange = station.interchange;

            // Create station marker
            const marker = L.marker(station.coordinates, {
              icon: L.divIcon({
                className: "mrt-station-marker leaflet-zoom-animated leaflet-interactive",
                html: `
                  <div class="relative flex items-center justify-center text-[8px]">
                    <div class="marker-dot w-3 h-3 rounded-full border-2 border-white shadow-md" 
                         style="background-color: ${lineColor}; ${isInterchange ? 'box-shadow: 0 0 8px rgba(0,0,0,0.5);' : ''}"></div>
                    ${isInterchange ? '<div class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white"></div>' : ''}
                  </div>
                `,
                iconSize: [16, 16],
              }),
            });
            
            marker.addTo(map);
            

            
            // Add station code label below the marker (only visible when zoomed in)
            const codeLabel = L.marker(station.coordinates, {
              icon: L.divIcon({
                className: "mrt-station-code-label",
                html: `
                  <div class="px-1 py-0.5 rounded text-[8px] text-center font-bold text-white shadow-sm" 
                       style="background-color: ${lineColor};">
                    ${station.id}
                  </div>
                `,
                iconSize: [32, 16],
                iconAnchor: [16, -3]
              })
            });
            
            // Function to show/hide station codes based on zoom level
            const updateCodeLabelVisibility = () => {
              const currentZoom = map.getZoom();
              if (currentZoom >= 15) { // Show station codes when zoomed in to level 13 or higher
                codeLabel.addTo(map);
              } else {
                codeLabel.remove();
              }
            };
            
            // Initial visibility check
            updateCodeLabelVisibility();
            
            // Listen for zoom changes
            map.on('zoomend', updateCodeLabelVisibility);
            
            // Add popup with station info
            const popupContent = `
              <div class="p-3 min-w-[200px]">
                <div class="font-bold text-lg mb-2">${station.name}</div>
                <div class="text-sm text-gray-600 mb-1">${getLineName(station.lineCode)}</div>
                <div class="text-xs text-gray-500">Station Code: ${station.id}</div>
                ${isInterchange ? '<div class="text-xs text-yellow-600 font-semibold mt-1">🔄 Interchange Station</div>' : ''}
              </div>
            `;
            
            marker.bindPopup(popupContent);
          });
          
          // Add MRT line legend using a simple div overlay
          const legendDiv = document.createElement('div');
          legendDiv.className = 'mrt-legend-overlay';
          legendDiv.innerHTML = `
            <div class="bg-white p-3 rounded-lg shadow-lg border" style="min-width: 200px; position: absolute; bottom: 20px; right: 20px; z-index: 1000;">
              <div class="font-bold text-sm mb-2 text-gray-800">MRT Lines</div>
              <div class="space-y-1">
                ${mrtLines.map(line => `
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 rounded-full" style="background-color: ${line.color};"></div>
                    <span class="text-xs font-medium" style="color: ${line.color};">${line.code}</span>
                    <span class="text-xs text-gray-600">${line.name}</span>
                  </div>
                `).join('')}
              </div>
              <div class="mt-2 pt-2 border-t border-gray-200">
                <div class="text-xs text-gray-500">
                  <div>• Line labels: Zoom ≥12</div>
                  <div>• Station codes: Zoom ≥15</div>
                </div>
              </div>
            </div>
          `;
          
          // Add legend to map container
          if (mapRef.current) {
            mapRef.current.appendChild(legendDiv);
          }
        });
      }

      if (activeLayer === "schools") {
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
            const currentZoom = map.getZoom();
            const newSize = getIconSize(currentZoom);
            
            // Update all school markers with new size
            map.eachLayer((layer: any) => {
              if (layer._icon && layer._icon.className && layer._icon.className.includes('school-marker')) {
                const img = layer._icon.querySelector('img');
                if (img) {
                  img.style.width = `${newSize}px`;
                  img.style.height = `${newSize}px`;
                }
              }
            });
          };

          // Create custom icons for different school types with initial size
          const initialSize = getIconSize(map.getZoom());
          const primarySchoolIcon = L.divIcon({
            className: "school-marker leaflet-zoom-animated leaflet-interactive",
            html: `
              <div class="relative flex items-center justify-center">
                <img src="/primary_school_pin.svg" alt="Primary School" style="width: ${initialSize}px; height: ${initialSize}px;" />
              </div>
            `,
            iconSize: [initialSize, initialSize],
            iconAnchor: [initialSize / 2, initialSize / 2],
            popupAnchor: [0, -initialSize / 2],
          });

          const secondarySchoolIcon = L.divIcon({
            className: "school-marker leaflet-zoom-animated leaflet-interactive",
            html: `
              <div class="relative flex items-center justify-center">
                <img src="/secondary_other_school_pin.svg" alt="Secondary School" style="width: ${initialSize}px; height: ${initialSize}px;" />
              </div>
            `,
            iconSize: [initialSize, initialSize],
            iconAnchor: [initialSize / 2, initialSize / 2],
            popupAnchor: [0, -initialSize / 2],
          });

          // Process primary schools
          primarySchools.features.forEach((feature: any) => {
            const coords = feature.geometry.coordinates;
            const properties = feature.properties;
            
            // Reverse coordinates: GeoJSON uses [lng, lat], Leaflet uses [lat, lng]
            const [lat, lng] = [coords[1], coords[0]];
            
            const marker = L.marker([lat, lng], { icon: primarySchoolIcon })
              .addTo(map)
              .bindPopup(`
                <div class="p-3 min-w-[200px]">
                  <div class="font-bold text-lg mb-2 text-teal-700">${properties.school_name}</div>
                  <div class="text-sm text-gray-600 mb-1">Primary School</div>
                  <div class="text-xs text-gray-500">Postal Code: ${properties.postal_code}</div>
                </div>
              `);
          });

          // Process secondary and other schools
          secondarySchools.features.forEach((feature: any) => {
            const coords = feature.geometry.coordinates;
            const properties = feature.properties;
            
            // Reverse coordinates: GeoJSON uses [lng, lat], Leaflet uses [lat, lng]
            const [lat, lng] = [coords[1], coords[0]];
            
            const marker = L.marker([lat, lng], { icon: secondarySchoolIcon })
              .addTo(map)
              .bindPopup(`
                <div class="p-3 min-w-[200px]">
                  <div class="font-bold text-lg mb-2 text-red-700">${properties.school_name}</div>
                  <div class="text-sm text-gray-600 mb-1">${properties.mainlevel_code}</div>
                  <div class="text-xs text-gray-500">Postal Code: ${properties.postal_code}</div>
                </div>
              `);
          });

          // Add zoom change listener to update marker sizes
          map.on('zoomend', updateSchoolMarkerSizes);

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
                              <div class="mt-2 pt-2 border-t border-gray-200">
                  <div class="text-xs text-gray-500">
                    <div>• Primary: ${primarySchools.features.length} schools</div>
                    <div>• Secondary & Other: ${secondarySchools.features.length} schools</div>
                    <div class="mt-1 text-blue-600">• Markers scale with zoom level</div>
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