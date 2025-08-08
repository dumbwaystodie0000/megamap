"use client"

import { Eye, Trash2, Bell, DollarSign, Bed, Home, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SavedSearchCardProps {
  search: {
    id: number
    name: string
    priceRange: string
    bedrooms: string
    tenure: string
    propertyType: string
    location: string
    savedDate: string
    notification: string
  }
}

export function SavedSearchCard({ search }: SavedSearchCardProps) {
  const getNotificationColor = (notification: string) => {
    switch (notification) {
      case "Daily":
        return "bg-brand-accent-green-25 text-brand-accent-green"
      case "Weekly":
        return "bg-brand-accent-blue-25 text-brand-accent-blue"
      case "Instant":
        return "bg-brand-accent-orange-25 text-brand-accent-orange"
      default:
        return "bg-brand-background-light text-brand-text-dark"
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-brand-text-dark mb-2 group-hover:text-brand-primary-dark transition-colors duration-200">{search.name}</h3>
          <div className="space-y-2 text-sm text-brand-text-dark/70 group-hover:text-brand-text-dark/80 transition-colors duration-200">
            <div className="flex items-center hover:text-brand-text-dark/90 transition-colors duration-200">
              <DollarSign className="w-4 h-4 mr-2 text-brand-primary-dark group-hover:text-brand-primary-dark/90 transition-colors duration-200" />
              <span>{search.priceRange}</span>
            </div>
            <div className="flex items-center hover:text-brand-text-dark/90 transition-colors duration-200">
              <Bed className="w-4 h-4 mr-2 text-brand-primary-dark group-hover:text-brand-primary-dark/90 transition-colors duration-200" />
              <span>{search.bedrooms}</span>
            </div>
            <div className="flex items-center hover:text-brand-text-dark/90 transition-colors duration-200">
              <Home className="w-4 h-4 mr-2 text-brand-primary-dark group-hover:text-brand-primary-dark/90 transition-colors duration-200" />
              <span>{search.propertyType}</span>
            </div>
            <div className="flex items-center hover:text-brand-text-dark/90 transition-colors duration-200">
              <MapPin className="w-4 h-4 mr-2 text-brand-primary-dark group-hover:text-brand-primary-dark/90 transition-colors duration-200" />
              <span>{search.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-brand-text-dark/70 hover:text-brand-primary-dark hover:bg-brand-accent-blue-25 transition-all duration-200 rounded-full">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-brand-text-dark/70 hover:text-brand-primary-dark hover:bg-brand-accent-blue-25 transition-all duration-200 rounded-full">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 group-hover:border-gray-300 transition-colors duration-200">
        <div className="flex items-center space-x-4 text-sm text-brand-text-dark/70 group-hover:text-brand-text-dark/80 transition-colors duration-200">
          <span>📅 Saved {search.savedDate}</span>
          <Badge className={`${getNotificationColor(search.notification)} group-hover:scale-105 transition-transform duration-200`}>
            <Bell className="w-3 h-3 mr-1" />
            {search.notification}
          </Badge>
        </div>
      </div>
    </div>
  )
}
