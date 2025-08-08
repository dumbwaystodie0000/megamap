"use client"

import { useState } from "react"
import { Heart, MapPin, Calendar, Home, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnhancedBuildingCardProps {
  name: string
  address: string
  type: string
  year: string
  tenure: string
  activeListings: number
  priceRange: string
  sizeRange: string
  pastTransactions: number
  mainImage: string
  thumbnails?: string[]
  totalImages?: number
  onSaveToCollection: (itemType: "building", itemData: any) => void
  showMap?: boolean // Whether map is visible
}

// Changed export from 'function' to 'const'
export const EnhancedBuildingCard = ({
  name,
  address,
  type,
  year,
  tenure,
  activeListings,
  priceRange,
  sizeRange,
  pastTransactions,
  mainImage,
  thumbnails = [
    "/placeholder.svg?height=120&width=160",
    "/placeholder.svg?height=120&width=160",
    "/placeholder.svg?height=120&width=160",
    "/placeholder.svg?height=120&width=160",
    "/placeholder.svg?height=120&width=160",
  ],
  totalImages = 8,
  onSaveToCollection,
  showMap = true,
}: EnhancedBuildingCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % thumbnails.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + thumbnails.length) % thumbnails.length)
  }

  const handleSaveClick = () => {
    onSaveToCollection("building", {
      name,
      address,
      type,
      year,
      tenure,
      activeListings,
      priceRange,
      sizeRange,
      pastTransactions,
      mainImage,
      thumbnails,
      totalImages,
      associatedListings: [
        { id: "L1", title: `${name} Unit 08-01`, price: "$3.8M", beds: 3, baths: 3, size: "1,636 sqft" },
        { id: "L2", title: `${name} Unit 12-05`, price: "$4.2M", beds: 4, baths: 4, size: "2,000 sqft" },
      ],
      associatedTransactions: [
        { id: "T1", date: "2024-06-15", price: "$3.75M", size: "1,636 sqft" },
        { id: "T2", date: "2024-03-20", price: "$4.1M", size: "2,000 sqft" },
      ],
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group">
      {/* Main Image with Property Type Badge */}
      <div className="relative">
        <img
          src={thumbnails[currentImageIndex] || mainImage || "/placeholder.svg"}
          alt={`${name} photo ${currentImageIndex + 1}`}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            showMap ? 'h-64' : 'h-48'
          }`}
        />

        {/* Navigation Arrows */}
        {thumbnails.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white hover:text-white h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Photo Counter */}
        {thumbnails.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded group-hover:bg-black/70 transition-all duration-200">
            {currentImageIndex + 1} / {thumbnails.length}
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-sm font-medium bg-white/90 backdrop-blur-sm text-brand-text-dark rounded-full group-hover:bg-white transition-all duration-200">
            {type}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 text-white hover:text-brand-accent-orange hover:bg-white/20 backdrop-blur-sm transition-all duration-200 rounded-full"
          onClick={handleSaveClick}
        >
          <Heart className="w-4 h-4" />
        </Button>

        {/* Project Name, Address, Built Year, and Tenure Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-text-dark to-transparent p-4 group-hover:from-brand-text-dark/90 transition-all duration-200">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors duration-200">{name}</h3>
          <div className="flex items-center text-white/90 text-xs mb-2 group-hover:text-white/80 transition-colors duration-200">
            <MapPin className="w-2 h-2 mr-1" />
            {address}
          </div>
          <div className="flex items-center space-x-4 text-white/90 text-xs">
            <div className="flex items-center">
              <Calendar className="w-2 h-2 mr-1" />
              Built: {year}
            </div>
            <div className="flex items-center">
              <Home className="w-2 h-2 mr-1" />
              {tenure}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${showMap ? 'p-4' : 'p-3'}`}>
        {/* Statistics Grid */}
        <div className={`${showMap ? 'space-y-4 mb-4' : 'space-y-3 mb-3'}`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-accent-blue-25 p-3 rounded-lg group-hover:bg-brand-accent-blue-50 transition-all duration-200">
              <div className="text-sm font-medium text-brand-primary-dark mb-1">Active Listing</div>
              <div className="text-lg font-bold text-brand-primary-dark group-hover:text-brand-primary-dark/90 transition-colors duration-200">{activeListings}</div>
              <div className="text-xs text-brand-text-dark/70 mt-1 group-hover:text-brand-text-dark/80 transition-colors duration-200">Price: <br /> {priceRange}</div>
              <div className="text-xs text-brand-text-dark/70 group-hover:text-brand-text-dark/80 transition-colors duration-200">Size (sqft): <br /> {sizeRange}</div>
            </div>
            <div className="bg-brand-background-light p-3 rounded-lg group-hover:bg-brand-background-light/80 transition-all duration-200">
              <div className="text-sm font-medium text-brand-text-dark mb-1">Transacted</div>
              <div className="text-lg font-bold text-brand-text-dark group-hover:text-brand-text-dark/90 transition-colors duration-200">{pastTransactions}</div>
              {pastTransactions === 0 ? (
                <div className="text-xs text-brand-text-dark/50 mt-1">No records found</div>
              ) : (
                <>
                  <div className="text-xs text-brand-text-dark/70 mt-1 group-hover:text-brand-text-dark/80 transition-colors duration-200">Price: <br /> {priceRange}</div>
                  <div className="text-xs text-brand-text-dark/70 group-hover:text-brand-text-dark/80 transition-colors duration-200">Size (sqft): <br /> {sizeRange}</div>
                </>
              )}
            </div>
          </div>


        </div>

        {/* View Details Button */}
        <Button
          variant="outline"
          className="w-full bg-transparent border-brand-primary-dark text-brand-primary-dark hover:bg-brand-accent-blue-25 hover:border-brand-primary-dark/80 hover:text-brand-primary-dark/90 transition-all duration-200 group-hover:shadow-md"
        >
          <Home className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  )
}
