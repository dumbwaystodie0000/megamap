"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BuildingCardProps {
  name: string
  address: string
  priceRange: string
  activeListings: number
  pastTransactions: number
  image: string
}

export function BuildingCard({
  name,
  address,
  priceRange,
  activeListings,
  pastTransactions,
  image,
}: BuildingCardProps) {
  return (
    <div className="bg-brand-background-light rounded-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-4 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-text-dark mb-1 group-hover:text-brand-primary-dark transition-colors duration-200">{name}</h3>
          <p className="text-sm text-brand-text-dark/70 group-hover:text-brand-text-dark/90 transition-colors duration-200">{address}</p>
        </div>
        <Button variant="ghost" size="sm" className="hover:bg-brand-accent-orange/10 hover:text-brand-accent-orange transition-all duration-200 rounded-full">
          <Heart className="w-4 h-4 text-brand-text-dark/70 hover:text-brand-accent-orange transition-colors duration-200" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="group-hover:bg-white/50 transition-all duration-200 rounded-lg p-2">
          <div className="text-sm font-medium text-brand-text-dark">Active Listing</div>
          <div className="text-lg font-bold text-brand-primary-dark group-hover:text-brand-primary-dark/90 transition-colors duration-200">{activeListings}</div>
          <div className="text-sm text-brand-text-dark/70 group-hover:text-brand-text-dark/80 transition-colors duration-200">Price Range</div>
        </div>
        <div className="group-hover:bg-white/50 transition-all duration-200 rounded-lg p-2">
          <div className="text-sm font-medium text-brand-text-dark">Transacted</div>
          <div className="text-lg font-bold text-brand-text-dark group-hover:text-brand-text-dark/90 transition-colors duration-200">{pastTransactions}</div>
          <div className="text-sm text-brand-text-dark/70 group-hover:text-brand-text-dark/80 transition-colors duration-200">{priceRange}</div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent border-brand-primary-dark text-brand-primary-dark hover:bg-brand-accent-blue-25 hover:border-brand-primary-dark/80 hover:text-brand-primary-dark/90 transition-all duration-200 group-hover:shadow-md"
      >
        View Details
      </Button>
    </div>
  )
}
