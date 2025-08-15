"use client"

import { useState } from "react"
import { Search, Eye, Trash2, Bell, Edit } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockSavedSearches, mockFolders } from "@/lib/mock-data" // Import mock data
import { useRouter } from "next/navigation"

export default function SavedSearchesPage() {
  const [savedSearches] = useState(mockSavedSearches) // Use imported mock data
  const [folders] = useState(mockFolders) // Use imported mock data
  const router = useRouter()

  return (
    <div className="min-h-screen bg-brand-background-light">
      {" "}
      {/* Updated color */}
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark">Saved Searches</h1> {/* Updated color */}
            <p className="text-brand-text-dark/70 mt-1">Manage and view your saved property searches</p>{" "}
            {/* Updated color */}
          </div>
          <Button className="bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white">
            {" "}
            {/* Updated colors */}
            <Edit className="w-4 h-4 mr-2" />
            Create New Search
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-brand-text-dark mb-4">Folders</h3> {/* Updated color */}
              {/* Search Folders */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-dark/50 w-4 h-4" />{" "}
                {/* Updated color */}
                <Input placeholder="Search folders..." className="pl-10 border-brand-text-dark/20" />{" "}
                {/* Updated color */}
              </div>
              {/* Folder List */}
              <div className="space-y-1">
                {folders.map((folder, index) => (
                  <div
                    key={folder.name}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                      index === 0
                        ? "bg-brand-accent-blue-25 text-brand-primary-dark"
                        : "hover:bg-brand-background-light text-brand-text-dark" // Updated colors
                    }`}
                  >
                    <span className="text-sm font-medium">{folder.name}</span>
                    <span className="text-sm text-brand-text-dark/70">{folder.count}</span> {/* Updated color */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}

            {/* Search Cards */}
            <div className="space-y-4">
              {savedSearches.map((search) => (
                <SavedSearchCard key={search.id} search={search} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedSearchCard({ search }: { search: any }) {
  const router = useRouter()
  
  const getNotificationColor = (notification: string) => {
    switch (notification) {
      case "Daily":
        return "bg-brand-accent-green-25 text-brand-accent-green" // Updated colors
      case "Weekly":
        return "bg-brand-accent-blue-25 text-brand-accent-blue" // Updated colors
      case "Instant":
        return "bg-brand-accent-orange-25 text-brand-accent-orange" // Updated colors
      default:
        return "bg-brand-background-light text-brand-text-dark" // Updated colors
    }
  }
  
  const handleViewSearch = () => {
    // In a real app, we would retrieve the actual filters from the database
    // For now, we'll use the mock data to construct a URL with search parameters
    
    // Create URL search params based on the saved search
    const params = new URLSearchParams()
    
    // Add parameters from the mock data
    if (search.priceRange) {
      const [minPrice, maxPrice] = search.priceRange.replace(/\$/g, '').split(' - ')
      params.set('minPrice', minPrice.replace(/,/g, ''))
      params.set('maxPrice', maxPrice.replace(/,/g, ''))
    }
    
    if (search.bedrooms) {
      const beds = search.bedrooms.replace(/ bedrooms?/g, '').split(', ')
      params.set('beds', beds.join(','))
    }
    
    if (search.propertyType) {
      const propertyTypes = search.propertyType.split(', ')
      if (propertyTypes.includes('Condominium')) {
        params.set('propertyMainType', 'condo')
        params.set('propertySubTypes', 'Condominium')
      } else if (propertyTypes.includes('Landed')) {
        params.set('propertyMainType', 'landed')
      } else if (propertyTypes.includes('HDB')) {
        params.set('propertyMainType', 'hdb')
      }
    }
    
    if (search.location) {
      const districts = search.location.match(/D\d+/g)
      if (districts && districts.length > 0) {
        params.set('districts', districts.join(','))
      }
    }
    
    // Navigate to the search page with these parameters
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-brand-text-dark mb-2">{search.name}</h3> {/* Updated color */}
          <div className="space-y-2 text-sm text-brand-text-dark/70">
            {" "}
            {/* Updated color */}
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">💰</span>
              <span>{search.priceRange}</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">🛏️</span>
              <span>{search.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">🏠</span>
              <span>{search.propertyType}</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">📍</span>
              <span>{search.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand-text-dark/70 hover:text-brand-primary-dark"
            onClick={handleViewSearch}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-brand-text-dark/70 hover:text-brand-primary-dark">
            {" "}
            {/* Updated colors */}
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-brand-text-dark/70">
          {" "}
          {/* Updated color */}
          <span>📅 Saved {search.savedDate}</span>
          <Badge className={getNotificationColor(search.notification)}>
            <Bell className="w-3 h-3 mr-1" />
            {search.notification}
          </Badge>
        </div>
      </div>
    </div>
  )
}
