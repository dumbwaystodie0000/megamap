"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight, LayoutGrid, List, Building, Globe, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [sortOption, setSortOption] = useState<string>("")
  
  // Define sorting options for each view mode
  const getSortOptions = useCallback(() => {
    if (viewMode === "building") {
      return [
        { value: "name-asc", label: "Name (A-Z)" },
        { value: "name-desc", label: "Name (Z-A)" },
        { value: "active-listings-low", label: "Active Listings (Low-High)" },
        { value: "active-listings-high", label: "Active Listings (High-Low)" },
        { value: "total-units-low", label: "Total Units (Low-High)" },
        { value: "total-units-high", label: "Total Units (High-Low)" },
      ]
    } else if (viewMode === "grid") {
      return [
        { value: "newest", label: "Newest" },
        { value: "lowest-price", label: "Lowest Price" },
        { value: "highest-price", label: "Highest Price" },
        { value: "psf-low", label: "PSF (low-high)" },
        { value: "psf-high", label: "PSF (high-low)" },
        { value: "size-high", label: "Size (high-low)" },
        { value: "size-low", label: "Size (low-high)" },
      ]
    } else {
      // table view
      return [
        { value: "newest", label: "Newest" },
        { value: "lowest-price", label: "Lowest Price" },
        { value: "highest-price", label: "Highest Price" },
        { value: "psf-low", label: "PSF (low-high)" },
        { value: "psf-high", label: "PSF (high-low)" },
        { value: "size-high", label: "Size (high-low)" },
        { value: "size-low", label: "Size (low-high)" },
      ]
    }
  }, [viewMode])
  
  // Set default sort option when view mode changes
  useEffect(() => {
    const options = getSortOptions()
    if (options.length > 0) {
      setSortOption(options[0].value)
    }
  }, [viewMode, getSortOptions])
  
  // Sort data based on selected sort option
  const sortData = (data: any[], sortBy: string) => {
    if (!sortBy || !data || data.length === 0) return data
    
    const sortedData = [...data]
    
    switch (sortBy) {
      // Building view sorting
      case "name-asc":
        return sortedData.sort((a, b) => {
          if (!a?.name || !b?.name) return 0
          return a.name.localeCompare(b.name)
        })
      case "name-desc":
        return sortedData.sort((a, b) => {
          if (!a?.name || !b?.name) return 0
          return b.name.localeCompare(a.name)
        })
      case "active-listings-low":
        return sortedData.sort((a, b) => (a?.activeListings || 0) - (b?.activeListings || 0))
      case "active-listings-high":
        return sortedData.sort((a, b) => (b?.activeListings || 0) - (a?.activeListings || 0))
      case "total-units-low":
        return sortedData.sort((a, b) => (a?.totalUnits || 0) - (b?.totalUnits || 0))
      case "total-units-high":
        return sortedData.sort((a, b) => (b?.totalUnits || 0) - (a?.totalUnits || 0))
      
      // Grid and Table view sorting
      case "newest":
        return sortedData.sort((a, b) => {
          const yearA = a?.year ? new Date(a.year).getTime() : 0
          const yearB = b?.year ? new Date(b.year).getTime() : 0
          return yearB - yearA
        })
      case "lowest-price":
        return sortedData.sort((a, b) => {
          const priceA = a?.price ? parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0 : 0
          const priceB = b?.price ? parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0 : 0
          return priceA - priceB
        })
      case "highest-price":
        return sortedData.sort((a, b) => {
          const priceA = a?.price ? parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0 : 0
          const priceB = b?.price ? parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0 : 0
          return priceB - priceA
        })
      case "psf-low":
        return sortedData.sort((a, b) => (a?.psf || 0) - (b?.psf || 0))
      case "psf-high":
        return sortedData.sort((a, b) => (b?.psf || 0) - (a?.psf || 0))
      case "size-high":
        return sortedData.sort((a, b) => {
          const sizeA = a?.size ? parseFloat(a.size.replace(/[^0-9.]/g, '')) || 0 : 0
          const sizeB = b?.size ? parseFloat(b.size.replace(/[^0-9.]/g, '')) || 0 : 0
          return sizeB - sizeA
        })
      case "size-low":
        return sortedData.sort((a, b) => {
          const sizeA = a?.size ? parseFloat(a.size.replace(/[^0-9.]/g, '')) || 0 : 0
          const sizeB = b?.size ? parseFloat(b.size.replace(/[^0-9.]/g, '')) || 0 : 0
          return sizeA - sizeB
        })
      
      default:
        return data
    }
  }
  
  // Get data based on current view mode and transaction type
  const buildingData = useMemo(() => generateBuildingResultsData(transactionType), [transactionType])
  const propertyGridData = useMemo(() => generatePropertyGridData(transactionType), [transactionType])
  const propertyTableData = useMemo(() => generatePropertyTableData(transactionType), [transactionType])
  
  // Filter data based on map synchronization
  const filteredBuildingData = useMemo(() => {
    return syncWithMap && visibleProjectIds.length > 0
      ? buildingData.filter(building => visibleProjectIds.includes(building.id))
      : buildingData
  }, [buildingData, syncWithMap, visibleProjectIds])
    
  const filteredPropertyGridData = useMemo(() => {
    return syncWithMap && visibleProjectIds.length > 0
      ? propertyGridData.filter(property => visibleProjectIds.includes(property.projectId))
      : propertyGridData;
  }, [propertyGridData, syncWithMap, visibleProjectIds])
    
  const filteredPropertyTableData = useMemo(() => {
    return syncWithMap && visibleProjectIds.length > 0
      ? propertyTableData.filter(property => visibleProjectIds.includes(property.projectId))
      : propertyTableData
  }, [propertyTableData, syncWithMap, visibleProjectIds])
  
  // Filter by active tab
  const getFilteredBuildingData = useCallback(() => {
    let data = filteredBuildingData
    if (activeTab === "plb") {
      data = data.filter(building => building.hasPLBUnits)
    } else if (activeTab === "others") {
      data = data.filter(building => building.hasOtherUnits)
    }
    return sortData(data, sortOption)
  }, [filteredBuildingData, activeTab, sortOption])
  
  const getFilteredPropertyGridData = useCallback(() => {
    let data = filteredPropertyGridData
    if (activeTab === "plb") {
      data = data.filter(property => property.agency === "PLB")
    } else if (activeTab === "others") {
      data = data.filter(property => property.agency !== "PLB")
    }
    return sortData(data, sortOption)
  }, [filteredPropertyGridData, activeTab, sortOption])
  
  const getFilteredPropertyTableData = useCallback(() => {
    let data = filteredPropertyTableData
    if (activeTab === "plb") {
      data = data.filter(property => property.agency === "PLB")
    } else if (activeTab === "others") {
      data = data.filter(property => property.agency !== "PLB")
    }
    return sortData(data, sortOption)
  }, [filteredPropertyTableData, activeTab, sortOption])
  
  // Calculate counts for tabs based on view mode
  const getCounts = useCallback(() => {
    if (viewMode === "building") {
      return {
        all: buildingData.length, // Use base data, not filtered data
        plb: buildingData.filter(building => building.hasPLBUnits).length,
        others: buildingData.filter(building => building.hasOtherUnits).length
      }
    } else {
      // For grid and table views, count active listings
      const allListings = viewMode === "grid" ? propertyGridData : propertyTableData
      const plbListings = allListings.filter(property => property.agency === "PLB")
      const othersListings = allListings.filter(property => property.agency !== "PLB")
      
      return {
        all: allListings.length,
        plb: plbListings.length,
        others: othersListings.length
      }
    }
  }, [viewMode, buildingData, propertyGridData, propertyTableData]) // Remove filtered data dependencies
  
  const { all: allCount, plb: plbCount, others: othersCount } = useMemo(() => getCounts(), [getCounts])

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
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-brand-text-dark truncate">All Listings</h2> {/* Updated color */}
            <p className="text-xs sm:text-sm text-brand-text-dark/70 truncate">
              {syncWithMap && visibleProjectIds.length > 0 
                ? `${allCount} ${viewMode === "building" ? "Buildings" : "Listings"} Found (Map View)` 
                : `${allCount} ${viewMode === "building" ? "Buildings" : "Listings"} Found`}
            </p> {/* Updated color */}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                  {getSortOptions().map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <div className="flex items-center space-x-2 sm:space-x-4 mt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium flex items-center space-x-1 flex-shrink-0 ${
              activeTab === "all"
                ? "text-brand-accent-orange border-b-2 border-brand-accent-orange"
                : "text-brand-text-dark/70 hover:text-brand-primary-dark" // Updated colors
            }`}
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">All {viewMode === "building" ? "Buildings" : "Listings"} ({allCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("plb")}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium flex-shrink-0 ${
              activeTab === "plb"
                ? "text-brand-primary-dark border-b-2 border-brand-primary-dark"
                : "text-brand-text-dark/70 hover:text-brand-primary-dark" // Updated colors
            }`}
          >
            PLB {plbCount}
          </button>
          <button
            onClick={() => setActiveTab("others")}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium flex-shrink-0 ${
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
    <div className={`p-3 sm:p-4 ${showMap ? 'space-y-6 sm:space-y-8' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'}`}>
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
    <div className={`p-3 sm:p-4 grid ${showMap ? 'grid-cols-1 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'}`}>
      {properties.map((property) => (
        <div key={property.id} onClick={() => {
          onPropertyDetailsClick?.(property);
        }}>
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
      <div className="p-3 sm:p-4">
        <div className="min-w-[800px] sm:min-w-[1000px]">
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
