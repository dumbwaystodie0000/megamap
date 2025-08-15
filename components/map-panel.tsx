"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Layers, School, Train } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import the GoogleMap component to avoid SSR issues
const GoogleMap = dynamic(() => import("./google-map").then(mod => ({ default: mod.GoogleMap })), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>
})

interface MapPanelProps {
  onPropertyClick?: (property: any) => void
  transactionType?: string
}

export function MapPanel({ onPropertyClick, transactionType = "For Sale" }: MapPanelProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  
  // Debug: Log the transaction type
  console.log('MapPanel - TransactionType:', transactionType)

  const handleMarkerClick = (project: any) => {
    if (onPropertyClick) {
      onPropertyClick(project)
    }
  }

  return (
    <div className="h-full relative bg-brand-background-light">
      {/* Google Map with Red Dot Markers */}
      <GoogleMap onMarkerClick={handleMarkerClick} activeLayer={activeLayer} transactionType={transactionType} />
      
      {/* Advanced Map Controls */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[10]">
        <div className="flex flex-col space-y-2">
          <Button
            variant={activeLayer === "heatmap" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveLayer(activeLayer === "heatmap" ? null : "heatmap")}
            className={`justify-start ${activeLayer === "heatmap" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark hover:bg-brand-background-light"}`}
          >
            <Layers className="w-4 h-4 mr-2" />
            Heatmap
          </Button>
          <Button
            variant={activeLayer === "transport" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveLayer(activeLayer === "transport" ? null : "transport")}
            className={`justify-start ${activeLayer === "transport" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark hover:bg-brand-background-light"}`}
          >
            <Train className="w-4 h-4 mr-2" />
            Transport
          </Button>
          <Button
            variant={activeLayer === "schools" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveLayer(activeLayer === "schools" ? null : "schools")}
            className={`justify-start ${activeLayer === "schools" ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "text-brand-text-dark hover:bg-brand-background-light"}`}
          >
            <School className="w-4 h-4 mr-2" />
            Schools
          </Button>
        </div>
      </div>
      
      {/* Update Toggle */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <input type="checkbox" id="update-toggle" className="rounded" />
          <label htmlFor="update-toggle" className="text-sm font-medium text-brand-text-dark">
            Update listing as it moves
          </label>
        </div>
      </div>
    </div>
  )
}
