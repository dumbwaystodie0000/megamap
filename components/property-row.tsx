"use client"

import { Badge } from "@/components/ui/badge" // Import Badge component

interface PropertyRowProps {
  project: string
  address: string
  price: string
  size: string
  psf: string // New prop for PSF
  beds: number
  tenure: string
  status: "ACTIVE" | "SOLD"
  agency: "PLB" | "OTHER"
  gridTemplateColumns: string // New prop for grid column definition
}

export function PropertyRow({
  project,
  address,
  price,
  size,
  psf,
  beds,
  tenure,
  status,
  agency,
  gridTemplateColumns, // Destructure new prop
}: PropertyRowProps) {
  const isPLB = agency === "PLB"
  return (
    <div
      className="grid gap-4 py-4 hover:bg-brand-background-light hover:shadow-md transition-all duration-200 group cursor-pointer items-center pl-4 rounded-lg hover:border hover:border-gray-200"
      style={{ gridTemplateColumns: gridTemplateColumns }} // Apply grid columns from prop
    >
      <div className="text-left">
        <div className="font-medium text-brand-text-dark group-hover:text-brand-primary-dark transition-colors duration-200">{project}</div>
        <div className="text-brand-text-dark/70 group-hover:text-brand-text-dark/90 transition-colors duration-200">{address}</div>
      </div>
      <div className="font-medium text-brand-text-dark text-left group-hover:text-brand-primary-dark transition-colors duration-200">{price}</div>
      <div className="text-brand-text-dark text-left group-hover:text-brand-text-dark/90 transition-colors duration-200">{size}</div>
      <div className="text-brand-text-dark text-left group-hover:text-brand-text-dark/90 transition-colors duration-200">{psf}</div> {/* New PSF column */}
      <div className="text-brand-text-dark text-left group-hover:text-brand-text-dark/90 transition-colors duration-200">{beds}</div>
      <div className="text-brand-text-dark text-left group-hover:text-brand-text-dark/90 transition-colors duration-200">{tenure}</div>
      <div className="flex items-center justify-start text-left">
        <Badge
          className={`text-xs transition-all duration-200 ${status === "ACTIVE" ? "bg-brand-accent-green text-white group-hover:bg-brand-accent-green/90" : "bg-brand-background-light text-brand-text-dark group-hover:bg-brand-background-light/80"}`}
        >
          {status}
        </Badge>
      </div>
      <div className="flex items-center justify-start text-left">
        <Badge
          className={`text-xs transition-all duration-200 ${isPLB ? "bg-brand-primary-dark text-white group-hover:bg-brand-primary-dark/90" : "bg-brand-background-light text-brand-text-dark group-hover:bg-brand-background-light/80"}`}
        >
          {agency}
        </Badge>
      </div>
    </div>
  )
}
