"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { GlobalSearchHeader } from "@/components/global-search-header"
import { ResultsBlade } from "@/components/results-blade"
import { MapPanel } from "@/components/map-panel"
import { BuildingDetailsPanel } from "@/components/building-details-panel"
import { PropertyDetailsPanel } from "@/components/property-details-panel"
import { SaveToCollectionDialog } from "@/components/save-to-collection-dialog"
import { generateBuildingDetailsData } from "@/lib/unit-mock-up"

type ViewMode = "building" | "grid" | "table"
type PanelType = "none" | "building-details" | "property-details"

export default function PropertyPortal() {
  const searchParams = useSearchParams()
  const transactionType = searchParams.get("transactionType") || "For Sale"
  
  // Debug: Log the transaction type
  console.log('App - TransactionType:', transactionType)
  
  const [viewMode, setViewMode] = useState<ViewMode>("building")
  const [isBladeCollapsed, setIsBladeCollapsed] = useState(false)
  const [activePanel, setActivePanel] = useState<PanelType>("none")
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [showMap, setShowMap] = useState(true) // New state for map toggle

  const handleShowMapChange = (show: boolean) => {
    setShowMap(show)
  }

  // State for SaveToCollectionDialog
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveDialogItemType, setSaveDialogItemType] = useState<"building" | "property" | null>(null)
  const [saveDialogItemData, setSaveDialogItemData] = useState<any>(null)

  const getBladeWidth = () => {
    if (isBladeCollapsed) return "w-20"
    if (!showMap) return "w-full" // When map is off, take full width
    switch (viewMode) {
      case "building":
      case "grid":
        return "w-1/4"
      case "table":
        return "w-1/2"
      default:
        return "w-1/4"
    }
  }

  const handleBuildingDetailsClick = (buildingData: any) => {
    // Use the actual building data passed from the results blade
    const actualBuildingData = generateBuildingDetailsData(buildingData.id);
    
    if (actualBuildingData) {
      setSelectedBuilding(actualBuildingData);
      setActivePanel("building-details");
    }
  }

  const handlePropertyDetailsClick = (propertyData: any) => {
    // Use the actual property data passed from the results blade or map
    setSelectedProperty({
      id: propertyData.id,
      price: propertyData.price,
      title: propertyData.title || propertyData.name,
      address: propertyData.address,
      beds: propertyData.beds,
      baths: propertyData.baths,
      size: propertyData.size,
      type: propertyData.type,
      tenure: propertyData.tenure,
      year: propertyData.year,
      status: propertyData.status || "ACTIVE",
      agency: propertyData.agency,
      description: propertyData.description,
      features: propertyData.features || [],
      images: propertyData.images || ["/placeholder.svg"],
      agent: propertyData.agent,
      floorPlan: propertyData.floorPlan,
      virtualTour: propertyData.virtualTour,
      additionalDetails: propertyData.additionalDetails,
    })
    setActivePanel("property-details")
  }

  const closePanels = () => {
    setActivePanel("none")
    setSelectedBuilding(null)
    setSelectedProperty(null)
  }

  const handleSaveToCollection = (itemType: "building" | "property", itemData: any) => {
    setSaveDialogItemType(itemType)
    setSaveDialogItemData(itemData)
    setShowSaveDialog(true)
  }

  const handleSaveDialogClose = () => {
    setShowSaveDialog(false)
    setSaveDialogItemType(null)
    setSaveDialogItemData(null)
  }

  const handleSaveDialogConfirm = (selectedCollectionIds: string[], newCollectionName: string) => {
    console.log(
      `Saving ${saveDialogItemType} to collections:`,
      selectedCollectionIds,
      "New collection:",
      newCollectionName,
      "Item data:",
      saveDialogItemData,
    )
    // Here you would implement the actual logic to save to your backend/state
    handleSaveDialogClose()
  }

  return (
    <div className="h-screen bg-white">
      <Header />
      <GlobalSearchHeader showMap={showMap} onShowMapChange={handleShowMapChange} />
      <div className={`flex h-[calc(100vh-153px)] ${!showMap ? 'max-w-7xl mx-auto' : ''}`}>
        {" "}
        {/* Adjusted height for sticky elements */}
        <div className={`${getBladeWidth()} transition-all duration-300 ease-in-out ${showMap ? 'border-r border-gray-200' : ''}`}>
          {activePanel === "building-details" && selectedBuilding ? (
            <BuildingDetailsPanel
              buildingData={selectedBuilding}
              onClose={closePanels}
              onListingClick={handlePropertyDetailsClick}
              onSaveToCollection={handleSaveToCollection} // Pass handler
            />
          ) : activePanel === "property-details" && selectedProperty ? (
            <PropertyDetailsPanel
              propertyData={selectedProperty}
              onClose={closePanels}
              onSaveToCollection={handleSaveToCollection} // Pass handler
            />
          ) : (
            <ResultsBlade
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isCollapsed={isBladeCollapsed}
              onToggleCollapse={() => setIsBladeCollapsed(!isBladeCollapsed)}
              onBuildingDetailsClick={handleBuildingDetailsClick}
              onPropertyDetailsClick={handlePropertyDetailsClick}
              onSaveToCollection={handleSaveToCollection} // Pass handler to ResultsBlade
              transactionType={transactionType}
              showMap={showMap} // Pass showMap state
            />
          )}
        </div>
        <div className={`flex-1 ${showMap ? '' : 'hidden'}`}>
          <MapPanel onPropertyClick={handlePropertyDetailsClick} transactionType={transactionType} />
        </div>
      </div>

      {/* Save to Collection Dialog */}
      <SaveToCollectionDialog
        isOpen={showSaveDialog}
        onClose={handleSaveDialogClose}
        onConfirm={handleSaveDialogConfirm}
        itemType={saveDialogItemType}
        itemData={saveDialogItemData}
      />
    </div>
  )
}
