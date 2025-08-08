"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  Heart,
  Calendar,
  Home,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Share2,
  School,
  Train,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  generateActiveListingsData, 
  generateSoldTransactionsData 
} from "@/lib/unit-mock-up"

interface BuildingDetailsPanelProps {
  buildingData: {
    id: string
    name: string
    address: string
    type: string
    year: string
    tenure: string
    activeListings: number
    pastTransactions: number
    priceRange: string
    sizeRange: string
    description: string
    amenities: { name: string; icon: React.ElementType | null }[]
    nearbySchools: string[]
    transport: string[]
    images: string[]
  }
  onClose: () => void
  onListingClick: (propertyData: any) => void // New prop for handling listing clicks
  onSaveToCollection: (itemType: "building", itemData: any) => void // New prop
}

export function BuildingDetailsPanel({
  buildingData,
  onClose,
  onListingClick,
  onSaveToCollection,
}: BuildingDetailsPanelProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % buildingData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + buildingData.images.length) % buildingData.images.length)
  }

  const handleSaveClick = () => {
    // Get actual data for the building
    const activeListings = generateActiveListingsData(buildingData.id);
    const soldTransactions = generateSoldTransactionsData(buildingData.id);
    
    onSaveToCollection("building", {
      name: buildingData.name,
      address: buildingData.address,
      type: buildingData.type,
      year: buildingData.year,
      tenure: buildingData.tenure,
      activeListings: buildingData.activeListings,
      priceRange: buildingData.priceRange,
      sizeRange: buildingData.sizeRange,
      pastTransactions: buildingData.pastTransactions,
      mainImage: buildingData.images[0],
      thumbnails: buildingData.images,
      totalImages: buildingData.images.length,
      // Use actual data for associated listings and transactions
      associatedListings: activeListings,
      associatedTransactions: soldTransactions,
    })
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 text-brand-text-dark/70" /> {/* Updated color */}
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-brand-text-dark">{buildingData.name}</h2> {/* Updated color */}
            <p className="text-sm text-brand-text-dark/70">{buildingData.address}</p> {/* Updated color */}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 text-brand-text-dark/70 hover:text-brand-primary-dark" /> {/* Updated colors */}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSaveClick}>
            <Heart className="w-4 h-4 text-brand-text-dark/70 hover:text-brand-accent-orange" /> {/* Updated colors */}
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <img
          src={buildingData.images[currentImageIndex] || "/placeholder.svg"}
          alt={`${buildingData.name} photo ${currentImageIndex + 1}`}
          className="w-full h-64 object-cover"
        />

        {buildingData.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/30 hover:text-white text-white h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/30 hover:text-white text-white h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1} / {buildingData.images.length}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-brand-background-light text-brand-text-dark">
            {buildingData.type}
          </Badge>{" "}
          {/* Updated colors */}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-6 px-4">
          {["overview", "listings", "transactions", "amenities"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "text-brand-primary-dark border-b-2 border-brand-primary-dark"
                  : "text-brand-text-dark/70 hover:text-brand-primary-dark" // Updated colors
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-accent-blue-25 p-4 rounded-lg">
                {" "}
                {/* Updated color */}
                <div className="text-sm font-medium text-brand-primary-dark mb-1">Active Listing</div>{" "}
                {/* Updated color */}
                <div className="text-xl font-bold text-brand-primary-dark">{buildingData.activeListings}</div>{" "}
                {/* Updated color */}
                <div className="text-xs text-brand-text-dark/70 mt-1">Price: <br /> {buildingData.priceRange}</div>{" "}
                {/* Updated color */}
                <div className="text-xs text-brand-text-dark/70 mt-1">Size: <br /> {buildingData.sizeRange}</div>{" "}
                {/* Updated color */}
              </div>
              <div className="bg-brand-background-light p-4 rounded-lg">
                {" "}
                {/* Updated color */}
                <div className="text-sm font-medium text-brand-text-dark mb-1">Transacted</div>{" "}
                {/* Updated color */}
                <div className="text-xl font-bold text-brand-text-dark">{buildingData.pastTransactions}</div>{" "}
                {/* Updated color */}
                <div className="text-xs text-brand-text-dark/70 mt-1">Last 12 months</div> {/* Updated color */}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-text-dark">Property Details</h3> {/* Updated color */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-brand-text-dark/50" /> {/* Updated color */}
                  <span>Built: {buildingData.year}</span>
                </div>
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2 text-brand-text-dark/50" /> {/* Updated color */}
                  <span>{buildingData.tenure}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-text-dark">About</h3> {/* Updated color */}
              <p className="text-sm text-brand-text-dark/70 leading-relaxed">{buildingData.description}</p>{" "}
              {/* Updated color */}
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="space-y-6">
            {(() => {
              const activeListings = generateActiveListingsData(buildingData.id);
              return (
                <>
                  <h3 className="font-semibold text-brand-text-dark">Active Listings ({activeListings.length})</h3>{" "}
                  {/* Updated color */}
                  {activeListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                      onClick={() => onListingClick(listing)} // Call onListingClick
                    >
                      <img
                        src={listing.images[0] || "/placeholder.svg"}
                        alt="Listing"
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="font-bold text-base text-brand-text-dark">{listing.price}</div> {/* Updated color */}
                        <div className="text-xs text-brand-text-dark/70">
                          {" "}
                          {/* Updated color */}
                          {listing.beds} beds • {listing.baths} baths • {listing.size}
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button
                            size="sm"
                            className="bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white text-xs"
                          >
                            {" "}
                            {/* Updated colors */}
                            <Phone className="w-2 h-2 mr-0.5" />
                            Call Agent
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent text-xs border-brand-primary-dark text-brand-primary-dark hover:bg-brand-accent-blue-25"
                          >
                            {" "}
                            {/* Updated colors */}
                            <Mail className="w-2 h-2 mr-0.5" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-4">
            {(() => {
              const soldTransactions = generateSoldTransactionsData(buildingData.id);
              return (
                <>
                  <h3 className="font-semibold text-brand-text-dark">
                    Recent Transactions ({soldTransactions.length})
                  </h3>{" "}
                  {/* Updated color */}
                  <div className="space-y-3">
                    {soldTransactions.map((transaction) => (
                      <div key={transaction.id} className="border-b border-gray-100 pb-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-brand-text-dark">{transaction.price}</span> {/* Updated color */}
                          <span className="text-xs text-brand-text-dark/70">{transaction.date}</span> {/* Updated color */}
                        </div>
                        <div className="text-xs text-brand-text-dark/50">
                          {" "}
                          {/* Updated color */}
                          {transaction.beds} beds • {transaction.baths} baths • {transaction.size} ({transaction.psf} PSF)
                        </div>
                        <div className="text-xs text-brand-text-dark/50 mt-1">{transaction.address}</div>{" "}
                        {/* Updated color */}
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {activeTab === "amenities" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-brand-text-dark mb-3">Amenities</h3> {/* Updated color */}
              <div className="grid grid-cols-2 gap-4">
                {buildingData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-brand-text-dark">
                    {" "}
                    {/* Updated color */}
                    {amenity.icon && <amenity.icon className="w-4 h-4 text-brand-primary-dark" />} {/* Updated color */}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-brand-text-dark mb-3">Nearby Schools</h3> {/* Updated color */}
              <div className="space-y-2">
                {buildingData.nearbySchools.map((school, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-brand-text-dark/70">
                    {" "}
                    {/* Updated color */}
                    <School className="w-4 h-4 text-brand-text-dark/50" /> {/* Updated color */}
                    <span>{school}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-brand-text-dark mb-3">Transport</h3> {/* Updated color */}
              <div className="space-y-2">
                {buildingData.transport.map((transport, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-brand-text-dark/70">
                    {" "}
                    {/* Updated color */}
                    <Train className="w-4 h-4 text-brand-text-dark/50" /> {/* Updated color */}
                    <span>{transport}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
