"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, LayoutGrid, List, Building, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { EnhancedBuildingCard } from "@/components/enhanced-building-card"
import { PropertyRow } from "@/components/property-row"
import { 
  generateBuildingResultsData, 
  generatePropertyGridData, 
  generatePropertyTableData 
} from "@/lib/unit-mock-up"

type ViewMode = "building" | "grid" | "table"

interface ResultsBladeProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onBuildingDetailsClick?: (buildingData: any) => void
  onPropertyDetailsClick?: (propertyData: any) => void
  onSaveToCollection: (itemType: "building" | "property", itemData: any) => void
  transactionType?: string // Transaction type filter (For Sale/For Rent)
  // Map synchronization props
  visibleProjectIds?: string[] // Projects currently visible on map
  syncWithMap?: boolean // Whether to sync with map view
  showMap?: boolean // Whether map is visible
}

export function ResultsBlade({
  viewMode,
  onViewModeChange,
  isCollapsed,
  onToggleCollapse,
  onBuildingDetailsClick,
  onPropertyDetailsClick,
  onSaveToCollection,
  transactionType = "For Sale",
  visibleProjectIds = [],
  syncWithMap = false,
  showMap = true,
}: ResultsBladeProps) {
  const [activeTab, setActiveTab] = useState("all")
  
  // Get data based on current view mode and transaction type
  const buildingData = generateBuildingResultsData(transactionType)
  const propertyGridData = generatePropertyGridData(transactionType)
  const propertyTableData = generatePropertyTableData(transactionType)
  
  // Filter data based on map synchronization
  const filteredBuildingData = syncWithMap && visibleProjectIds.length > 0
    ? buildingData.filter(building => visibleProjectIds.includes(building.id))
    : buildingData
    
  const filteredPropertyGridData = syncWithMap && visibleProjectIds.length > 0
    ? propertyGridData.filter(property => visibleProjectIds.includes(property.projectId))
    : propertyGridData
    
  const filteredPropertyTableData = syncWithMap && visibleProjectIds.length > 0
    ? propertyTableData.filter(property => visibleProjectIds.includes(property.projectId))
    : propertyTableData
  
  // Filter by active tab
  const getFilteredBuildingData = () => {
    if (activeTab === "plb") {
      return filteredBuildingData.filter(building => building.hasPLBUnits)
    } else if (activeTab === "others") {
      return filteredBuildingData.filter(building => building.hasOtherUnits)
    }
    return filteredBuildingData
  }
  
  const getFilteredPropertyGridData = () => {
    if (activeTab === "plb") {
      return filteredPropertyGridData.filter(property => property.agency === "PLB")
    } else if (activeTab === "others") {
      return filteredPropertyGridData.filter(property => property.agency !== "PLB")
    }
    return filteredPropertyGridData
  }
  
  const getFilteredPropertyTableData = () => {
    if (activeTab === "plb") {
      return filteredPropertyTableData.filter(property => property.agency === "PLB")
    } else if (activeTab === "others") {
      return filteredPropertyTableData.filter(property => property.agency !== "PLB")
    }
    return filteredPropertyTableData
  }
  
  // Calculate counts for tabs based on view mode
  const getCounts = () => {
    if (viewMode === "building") {
      return {
        all: filteredBuildingData.length,
        plb: filteredBuildingData.filter(building => building.hasPLBUnits).length,
        others: filteredBuildingData.filter(building => building.hasOtherUnits).length
      }
    } else {
      // For grid and table views, count active listings
      const allListings = viewMode === "grid" ? filteredPropertyGridData : filteredPropertyTableData
      const plbListings = allListings.filter(property => property.agency === "PLB")
      const othersListings = allListings.filter(property => property.agency !== "PLB")
      
      return {
        all: allListings.length,
        plb: plbListings.length,
        others: othersListings.length
      }
    }
  }
  
  const { all: allCount, plb: plbCount, others: othersCount } = getCounts()

  if (isCollapsed) {
    return (
      <div className="h-full bg-white p-4 flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-brand-text-dark/70 hover:text-brand-primary-dark"
        >
          {" "}
          {/* Updated colors */}
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex flex-col space-y-4">
          <Button
            variant={viewMode === "building" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("building")}
            className={`w-12 h-12 ${viewMode === "building" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark/70 hover:bg-brand-background-light"}`} // Updated colors
          >
            <Building className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`w-12 h-12 ${viewMode === "grid" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark/70 hover:bg-brand-background-light"}`} // Updated colors
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className={`w-12 h-12 ${viewMode === "table" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark/70 hover:bg-brand-background-light"}`} // Updated colors
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header with Collapse Button and View Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-text-dark">All Listings</h2> {/* Updated color */}
            <p className="text-sm text-brand-text-dark/70">
              {syncWithMap && visibleProjectIds.length > 0 
                ? `${allCount} ${viewMode === "building" ? "Buildings" : "Listings"} Found (Map View)` 
                : `${allCount} ${viewMode === "building" ? "Buildings" : "Listings"} Found`}
            </p> {/* Updated color */}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
            >
              {" "}
              {/* Updated colors */}
              Sort
            </Button>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "building" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("building")}
                className={`rounded-none ${viewMode === "building" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark/70 hover:bg-brand-background-light"}`} // Updated colors
              >
                <Building className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className={`rounded-none ${viewMode === "grid" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark/70 hover:bg-brand-background-light"}`} // Updated colors
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("table")}
                className={`rounded-none ${viewMode === "table" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark/70 hover:bg-brand-background-light"}`} // Updated colors
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            {showMap && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="text-brand-text-dark/70 hover:text-brand-primary-dark"
              >
                {" "}
                {/* Updated colors */}
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-4 mt-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 text-sm font-medium flex items-center space-x-1 ${
              activeTab === "all"
                ? "text-brand-accent-orange border-b-2 border-brand-accent-orange"
                : "text-brand-text-dark/70 hover:text-brand-primary-dark" // Updated colors
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>All Listings ({allCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("plb")}
            className={`px-3 py-1 text-sm font-medium ${
              activeTab === "plb"
                ? "text-brand-primary-dark border-b-2 border-brand-primary-dark"
                : "text-brand-text-dark/70 hover:text-brand-primary-dark" // Updated colors
            }`}
          >
            PLB {plbCount}
          </button>
          <button
            onClick={() => setActiveTab("others")}
            className={`px-3 py-1 text-sm font-medium ${
              activeTab === "others"
                ? "text-brand-text-dark border-b-2 border-brand-text-dark"
                : "text-brand-text-dark/70 hover:text-brand-primary-dark" // Updated colors
            }`}
          >
            Others {othersCount}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === "building" && (
          <BuildingResults 
            buildings={getFilteredBuildingData()}
            onBuildingDetailsClick={onBuildingDetailsClick} 
            onSaveToCollection={onSaveToCollection} 
            showMap={showMap}
          />
        )}
        {viewMode === "grid" && (
          <GridResults 
            properties={getFilteredPropertyGridData()}
            onPropertyDetailsClick={onPropertyDetailsClick} 
            onSaveToCollection={onSaveToCollection} 
            showMap={showMap}
          />
        )}
        {viewMode === "table" && (
          <TableResults 
            properties={getFilteredPropertyTableData()}
          />
        )}
      </div>
      

    </div>
  )
}

function BuildingResults({
  buildings,
  onBuildingDetailsClick,
  onSaveToCollection,
  showMap,
}: {
  buildings: any[]
  onBuildingDetailsClick?: (data: any) => void
  onSaveToCollection: (itemType: "building", itemData: any) => void
  showMap: boolean
}) {
  return (
    <div className={`p-4 ${showMap ? 'space-y-8' : 'grid grid-cols-3 gap-6'}`}>
      {buildings.map((building) => (
        <div key={building.id} onClick={() => onBuildingDetailsClick?.(building)}>
          <EnhancedBuildingCard
            name={building.name}
            address={building.address}
            type={building.type}
            year={building.year}
            tenure={building.tenure}
            activeListings={building.activeListings}
            priceRange={building.priceRange}
            sizeRange={building.sizeRange}
            pastTransactions={building.pastTransactions}
            mainImage={building.mainImage}
            onSaveToCollection={onSaveToCollection}
            showMap={showMap}
          />
        </div>
      ))}
    </div>
  )
}

function GridResults({
  properties,
  onPropertyDetailsClick,
  onSaveToCollection,
  showMap,
}: {
  properties: any[]
  onPropertyDetailsClick?: (data: any) => void
  onSaveToCollection: (itemType: "property", itemData: any) => void
  showMap: boolean
}) {
  return (
    <div className={`p-4 grid ${showMap ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
      {properties.map((property) => (
        <div key={property.id} onClick={() => onPropertyDetailsClick?.(property)}>
          <PropertyCard
            price={property.price}
            title={property.title}
            address={property.address}
            beds={property.beds}
            baths={property.baths}
            size={property.size}
            type={property.type}
            tenure={property.tenure}
            year={property.year}
            image={property.image}
            status={property.status}
            agency={property.agency}
            onSaveToCollection={onSaveToCollection}
            showMap={showMap}
          />
        </div>
      ))}
    </div>
  )
}

function TableResults({ properties }: { properties: any[] }) {
  // Define grid columns to ensure consistent width and alignment
  // Using fixed pixel widths for better control as per user's request for "spreadsheet-like"
  const gridColumns =
    "minmax(200px, 1.5fr) minmax(120px, 1fr) minmax(100px, 0.8fr) minmax(80px, 0.7fr) minmax(80px, 0.6fr) minmax(100px, 0.8fr) minmax(80px, 0.7fr) minmax(80px, 0.7fr)"

  return (
    <div className="h-full overflow-auto">
      <div className="p-4">
        <div className="min-w-[1000px]">
          {/* Sticky Header */}
          <div
            className="sticky top-0 z-10 grid gap-4 py-2 text-sm font-medium text-brand-text-dark/70 border-b bg-brand-accent-blue-25 pl-4"
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="text-left">Project</div>
            <div className="text-left">Price</div>
            <div className="text-left">Size</div>
            <div className="text-left">PSF</div>
            <div className="text-left">Bedrooms</div>
            <div className="text-left">Tenure</div>
            <div className="text-left">Status</div>
            <div className="text-left">Source</div>
          </div>

          {/* PropertyRow components */}
          <div className="space-y-1 text-xs">
            {properties.map((property, index) => (
              <PropertyRow
                key={index}
                gridTemplateColumns={gridColumns}
                {...property}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
