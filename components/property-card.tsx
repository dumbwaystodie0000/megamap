"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  price: string
  title: string
  address: string
  beds: number
  baths: number
  size: string
  type: string
  tenure: string
  year: string
  image: string
  status: "ACTIVE" | "SOLD"
  agency: "PLB" | "OTHER"
  onSaveToCollection: (itemType: "property", itemData: any) => void // New prop
  showMap?: boolean // Whether map is visible
}

export function PropertyCard({
  price,
  title,
  address,
  beds,
  baths,
  size,
  type,
  tenure,
  year,
  image,
  status,
  agency,
  onSaveToCollection,
  showMap = true,
}: PropertyCardProps) {
  const isPLB = agency === "PLB"

  const handleSaveClick = () => {
    onSaveToCollection("property", {
      price,
      title,
      address,
      beds,
      baths,
      size,
      type,
      tenure,
      year,
      image,
      status,
      agency,
    })
  }

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden group ${
        showMap 
          ? 'flex flex-col md:flex-row' 
          : 'flex flex-col'
      } ${
        isPLB
          ? "border-brand-primary-dark shadow-lg hover:shadow-2xl" // Updated color
          : "border-gray-200 hover:border-gray-300 hover:shadow-2xl"
      }`}
    >
      <div className={`relative ${showMap ? 'w-full md:w-1/2 lg:w-2/5 flex-shrink-0' : 'w-full'} flex-shrink-0`}>
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-200 ${
            showMap ? 'h-48 md:h-full' : 'h-48'
          }`}
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              status === "ACTIVE" ? "bg-brand-accent-green text-white" : "bg-brand-text-dark/70 text-white" // Updated colors
            }`}
          >
            {status}
          </span>
          {isPLB && <span className="px-2 py-1 text-xs font-medium bg-brand-primary-dark text-white rounded">PLB</span>}{" "}
          {/* Updated colors */}
        </div>
      </div>

      <div className={`p-4 flex-1 ${isPLB ? "bg-brand-accent-blue-25" : ""} relative`}>
        {" "}
        {/* Updated color */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 text-brand-primary-dark/70 hover:text-brand-accent-orange" // Updated color
          onClick={handleSaveClick}
        >
          <Heart className="w-4 h-4" />
        </Button>
        <div className="text-base font-bold text-brand-primary-dark mb-1">{price}</div> {/* Reduced font size here */}
        <div className="text-sm font-semibold text-brand-primary-dark mb-1">{title}</div>
        <div className="text-xs text-brand-primary-dark/70 mb-3">{address}</div>
        <div className="flex items-center space-x-4 text-xs text-brand-primary-dark/70 mb-3">
          {" "}
          <span>{beds} beds</span>
          <span>{baths} baths</span>
          <span>{size}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-brand-primary-dark/70 mb-1">
          {" "}
          <span>{type}</span>
        </div>
        <div className="flex items-center justify-start gap-2 text-[11px] text-brand-primary-dark/70">
          {" "}
          <span>{tenure}</span>
          <span>TOP: {year}</span>
        </div>
      </div>
    </div>
  )
}
