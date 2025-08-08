"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Layers } from "lucide-react";
import type { Property } from "../lib/types";
import { createCustomIcon } from "../lib/map-icons";
import { BRAND_CONSTANTS } from "../lib/constants";
import EnhancedMapPopup from "./enhanced-map-popup";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => ({ default: mod.MapContainer })), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => ({ default: mod.TileLayer })), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => ({ default: mod.Marker })), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => ({ default: mod.Popup })), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(mod => ({ default: mod.Circle })), { ssr: false });

// Dynamically import react-leaflet hooks
const useMap = dynamic(() => import("react-leaflet").then(mod => ({ default: mod.useMap })), { ssr: false });

// Dynamically import Leaflet
const L = dynamic(() => import("leaflet"), { ssr: false });

// Map center coordinates for Singapore
const SINGAPORE_CENTER: [number, number] = [1.3521, 103.8198];

// Clustering component
function ClusterLayer({
  properties,
  onMarkerClick,
  onMarkerHover,
  hoveredPropertyId,
  onMapBoundsChange,
  isCollectionView = false,
}: {
  properties: Property[];
  onMarkerClick: (property: Property) => void;
  onMarkerHover: (property: Property | null) => void;
  hoveredPropertyId: number | null;
  onMapBoundsChange?: (bounds: any) => void;
  isCollectionView?: boolean;
}) {
  const [clusters, setClusters] = useState<any[]>([]);
  const [zoom, setZoom] = useState(12);

  // Initialize custom clustering by project
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Group properties by project name or address (regardless of source)
    const projectGroups = new Map<string, Property[]>();

    properties.forEach((property) => {
      // Group by project name or address only, not by source
      const projectKey = property.name || property.address;
      if (!projectGroups.has(projectKey)) {
        projectGroups.set(projectKey, []);
      }
      projectGroups.get(projectKey)!.push(property);
    });

    // Create custom clusters for properties from the same project (PLB + other listings combined)
    const customClusters: any[] = [];

    projectGroups.forEach((projectProperties, projectKey) => {
      if (projectProperties.length === 1) {
        // Single property - no clustering needed
        const property = projectProperties[0];
        const lat = Array.isArray(property.location)
          ? property.location[0]
          : property.lat;
        const lng = Array.isArray(property.location)
          ? property.location[1]
          : property.lng;

        customClusters.push({
          type: "Feature" as const,
          properties: {
            cluster: false,
            property,
            id: property.id,
            projectKey,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [lng, lat],
          },
        });
      } else {
        // Multiple properties from same project (PLB + other listings) - create cluster
        const avgLat =
          projectProperties.reduce((sum, p) => {
            const lat = Array.isArray(p.location) ? p.location[0] : p.lat;
            return sum + lat;
          }, 0) / projectProperties.length;
        const avgLng =
          projectProperties.reduce((sum, p) => {
            const lng = Array.isArray(p.location) ? p.location[1] : p.lng;
            return sum + lng;
          }, 0) / projectProperties.length;

        customClusters.push({
          type: "Feature" as const,
          properties: {
            cluster: true,
            point_count: projectProperties.length,
            properties: projectProperties,
            projectKey,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [avgLng, avgLat],
          },
        });
      }
    });

    setClusters(customClusters);
  }, [properties]);

  const getMarkerIcon = (property: Property, isHovered: boolean) => {
    // Always use simple red dot for all markers
    return createCustomIcon("SIMPLE", undefined, isHovered);
  };

  const getClusterIcon = (cluster: any) => {
    const count = cluster.properties.point_count;
    // Use simple red dot with count for clusters
    return createCustomIcon("SIMPLE", count);
  };

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <>
      {clusters.map((cluster, index) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          // Find all properties that are within the cluster radius AND from the same project
          const clusterRadius = 10; // meters, should match supercluster radius
          const clusterProjectKey = cluster.properties.projectKey; // Get the project key for this cluster

          const clusterProperties = properties.filter((property) => {
            const propertyProjectKey = property.name || property.address;

            // Only include properties from the same project (regardless of source)
            if (propertyProjectKey !== clusterProjectKey) {
              return false;
            }

            // Check if within cluster radius
            const propertyLat = Array.isArray(property.location)
              ? property.location[0]
              : property.lat;
            const propertyLng = Array.isArray(property.location)
              ? property.location[1]
              : property.lng;

            const distance =
              Math.sqrt(
                Math.pow(propertyLat - lat, 2) + Math.pow(propertyLng - lng, 2),
              ) * 111000; // Convert to meters (roughly)
            return distance <= clusterRadius;
          });

          return (
            <Marker
              key={`cluster-${index}`}
              position={[lat, lng]}
              icon={getClusterIcon(cluster)}
              eventHandlers={{
                click: () => {
                  // Handle cluster click
                  console.log("Cluster clicked:", cluster);
                },
              }}
            >
              {!isCollectionView && (
                <Popup>
                  <EnhancedMapPopup
                    properties={clusterProperties}
                    onViewDetails={onMarkerClick}
                  />
                </Popup>
              )}
            </Marker>
          );
        }

        const property = cluster.properties.property;
        const isHovered = hoveredPropertyId === property.id;

        // Find all properties at the same location regardless of source (PLB + other listings)
        const propertiesAtLocation = properties.filter((p) => {
          const pLat = Array.isArray(p.location) ? p.location[0] : p.lat;
          const pLng = Array.isArray(p.location) ? p.location[1] : p.lng;
          return Math.abs(pLat - lat) < 0.0001 && Math.abs(pLng - lng) < 0.0001;
        });

        return (
          <Marker
            key={property.id}
            position={[lat, lng]}
            icon={getMarkerIcon(property, isHovered)}
            eventHandlers={{
              click: () => {
                onMarkerClick(property);
              },
              mouseover: () => onMarkerHover(property),
              mouseout: () => onMarkerHover(null),
            }}
          >
            {!isCollectionView && (
              <Popup>
                <EnhancedMapPopup
                  properties={propertiesAtLocation}
                  onViewDetails={onMarkerClick}
                />
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
}

// Component to recenter map
function MapController({
  center,
  zoom,
}: {
  center: [number, number] | null;
  zoom?: number;
}) {
  // Dynamically import useMap to avoid SSR issues
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("react-leaflet").then(({ useMap }) => {
      const useMapHook = useMap;
      const mapInstance = useMapHook();
      setMap(mapInstance);
    });
  }, []);

  useEffect(() => {
    if (map && center && typeof window !== "undefined") {
      map.flyTo(center, zoom || 13);
    }
  }, [center, zoom, map]);

  return null;
}

// Component to change the map provider
function MapProviderController({ provider }: { provider: string }) {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("react-leaflet").then(({ useMap }) => {
      const useMapHook = useMap;
      const mapInstance = useMapHook();
      setMap(mapInstance);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !map) return;

    // Remove all existing tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add the new tile layer
    const mapProviders: Record<string, any> = {
      openStreetMap: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ["a", "b", "c"],
      },
      esriWorldStreet: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri",
      },
      esriWorldImagery: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri",
      },
      cartoDBVoyager: {
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://carto.com/attributions">CartoDB</a>',
        subdomains: ["a", "b", "c", "d"],
      },
    };

    const { url, attribution, subdomains } =
      mapProviders[provider] || mapProviders.openStreetMap;
    const tileLayerOptions: any = {
      attribution,
      ...(subdomains ? { subdomains } : {}),
    };

    L.tileLayer(url, tileLayerOptions).addTo(map);
  }, [map, provider]);

  return null;
}

interface PropertyMapProps {
  properties: Property[];
  onMarkerClick: (property: Property) => void;
  onMarkerHover: (property: Property | null) => void;
  hoveredPropertyId: number | null;
  mapCenter: [number, number];
  mapZoom: number;
  radiusCenter: [number, number] | null;
  radiusValue: number;
  currentMapProvider: string;
  showMapProviders: boolean;
  onShowMapProviders: (show: boolean) => void;
  onMapProviderChange: (provider: string) => void;
  onMapBoundsChange?: (bounds: any) => void;
  isCollectionView?: boolean;
}

export default function PropertyMap({
  properties,
  onMarkerClick,
  onMarkerHover,
  hoveredPropertyId,
  mapCenter,
  mapZoom,
  radiusCenter,
  radiusValue,
  currentMapProvider,
  showMapProviders,
  onShowMapProviders,
  onMapProviderChange,
  onMapBoundsChange,
  isCollectionView,
}: PropertyMapProps) {
  const [isMapReady, setIsMapReady] = useState(false);

  // Don't render on server side
  if (typeof window === "undefined") {
    return <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="relative h-full w-full">
      {/* Map Provider Selector */}
      <div className="absolute top-4 right-4 z-20">
        <button
          className="bg-white shadow-md px-3 py-2 rounded border text-sm flex items-center gap-2"
          onClick={() => onShowMapProviders(!showMapProviders)}
        >
          <Layers className="h-4 w-4" />
          Map Style
        </button>

        {showMapProviders && (
          <div className="absolute top-10 right-0 bg-white p-2 rounded-md shadow-md w-40 z-30">
            <div className="flex flex-col gap-1">
              {[
                "openStreetMap",
                "esriWorldStreet",
                "esriWorldImagery",
                "cartoDBVoyager",
              ].map((provider) => (
                <button
                  key={provider}
                  className={`text-left px-2 py-1 rounded text-xs ${
                    currentMapProvider === provider
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    onMapProviderChange(provider);
                    onShowMapProviders(false);
                  }}
                >
                  {provider === "openStreetMap"
                    ? "Street Map"
                    : provider === "esriWorldStreet"
                      ? "ESRI Streets"
                      : provider === "esriWorldImagery"
                        ? "Satellite"
                        : "URA Style"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <MapContainer
        key="map-container"
        center={SINGAPORE_CENTER}
        zoom={BRAND_CONSTANTS.DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        whenCreated={() => setIsMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={mapZoom} />
        <MapProviderController provider={currentMapProvider} />

        {/* Radius circle */}
        {radiusCenter && radiusValue > 0 && (
          <Circle
            center={radiusCenter}
            radius={radiusValue * 1000}
            pathOptions={{
              fillColor: "blue",
              fillOpacity: 0.1,
              color: "blue",
              weight: 1,
            }}
          />
        )}

        {/* Property markers with clustering */}
        {isMapReady && (
          <ClusterLayer
            properties={properties}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
            hoveredPropertyId={hoveredPropertyId}
            onMapBoundsChange={onMapBoundsChange}
            isCollectionView={isCollectionView}
          />
        )}
      </MapContainer>
    </div>
  );
} 