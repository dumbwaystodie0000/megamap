"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { GlobalSearchHeader } from "@/components/global-search-header"
import { ResultsBlade } from "@/components/results-blade"
import { MapPanel } from "@/components/map-panel"
import { BuildingDetailsPanel } from "@/components/building-details-panel"
import { PropertyDetailsPanel } from "@/components/property-details-panel"
import { SaveToCollectionDialog } from "@/components/save-to-collection-dialog"
import { generateBuildingDetailsData } from "@/lib/unit-mock-up"
import { getProjectById } from "@/lib/project-data"

type ViewMode = "building" | "grid" | "table"
type PanelType = "none" | "building-details" | "property-details"

function PropertyPortalContent() {
  const searchParams = useSearchParams()
  // Get the transactionType from URL parameters or use "For Sale" as default
  const transactionType = searchParams.get("transactionType") || "For Sale"
  
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
    
    // Responsive width logic based on view mode and screen size
    switch (viewMode) {
      case "building":
      case "grid":
        // Use responsive classes: smaller on mobile, larger on desktop
        return "min-w-[320px] w-full sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem]"
      case "table":
        // Table view needs more space for columns
        return "min-w-[400px] w-full sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] 2xl:w-[40rem]"
      default:
        return "min-w-[320px] w-full sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem]"
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
    const projectData = getProjectById(propertyData.projectId);
    
    const mergedPropertyData = {
      ...propertyData,
      type: projectData?.type || "N/A",
      tenure: projectData?.tenure || "N/A",
      year: projectData?.year || "N/A",
      district: projectData?.district || "N/A",
    };
    
    setSelectedProperty(mergedPropertyData);
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
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
        <GlobalSearchHeader showMap={showMap} onShowMapChange={handleShowMapChange} />
      </Suspense>
      <div className={`flex h-[calc(100vh-153px)] ${!showMap ? 'max-w-7xl mx-auto' : ''}`}>
        {" "}
        {/* Adjusted height for sticky elements */}
        <div className={`${getBladeWidth()} flex-shrink-0 transition-all duration-300 ease-in-out ${showMap ? 'border-r border-gray-200' : ''}`}>
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

export default function PropertyPortal() {
  return (
    <Suspense fallback={<div className="h-screen bg-white flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>}>
      <PropertyPortalContent />
    </Suspense>
  )
}
