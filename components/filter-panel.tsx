"use client"

import type React from "react"
import { Search } from "lucide-react" // Declare the Search variable

import { useState, useEffect } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  PROPERTY_SUB_TYPES,
  BEDROOM_OPTIONS,
  minPsfOptions, // Import new PSF options
  maxPsfOptions, // Import new PSF options
  minBuildYearOptions, // Import new Build Year options
  maxBuildYearOptions, // Import new Build Year options
  minPriceOptions, // Import minPriceOptions
  maxPriceOptions, // Import maxPriceOptions
  minAreaOptions, // Import minAreaOptions
  maxAreaOptions, // Import maxAreaOptions
} from "@/lib/filter-options" // Import centralized filter options
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  searchParams: URLSearchParams
  updateSearchParams: (newParams: Record<string, string | string[] | null>) => void
}

export const FilterPanel = ({ isOpen, onClose, searchParams, updateSearchParams }: FilterPanelProps) => {
  // Local state for inputs that are not directly checkboxes/buttons, to avoid re-rendering on every keystroke
  const [localProjectName, setLocalProjectName] = useState("")
  const [localKeyword, setLocalKeyword] = useState("")

  // Derive filter states directly from URL search parameters
  const transactionType = searchParams.get("transactionType") || "For Sale"
  const selectedPropertyMainType = (searchParams.get("propertyMainType") || "all") as keyof typeof PROPERTY_SUB_TYPES
  const selectedPropertySubTypes = searchParams.get("propertySubTypes")?.split(",").filter(Boolean) || []
  const selectedBeds = searchParams.get("beds")?.split(",").filter(Boolean) || []
  const selectedBathrooms = searchParams.get("bathrooms")?.split(",").filter(Boolean) || []
  const selectedTenure = searchParams.get("tenure") || ""
  const selectedFloorLevel = searchParams.get("floorLevel") || ""
  const selectedDistanceToMRT = searchParams.get("distanceToMRT") || "any"
  const selectedLeaseTerm = searchParams.get("leaseTerm")?.split(",").filter(Boolean) || []
  const selectedAvailability = searchParams.get("availability") || ""
  const selectedFurnishing = searchParams.get("furnishing") || ""
  const selectedDistricts = searchParams.get("districts")?.split(",").filter(Boolean) || []
  const selectedAgent = searchParams.get("agent") || "All Agents"
  const selectedMinPsf = searchParams.get("minPsf") || "0" // Default to "0" for "No Min"
  const selectedMaxPsf = searchParams.get("maxPsf") || "No Limit" // Default to "No Limit" for "No Max"
  const selectedMinYear = searchParams.get("minYear") || "any" // Default to "any" for "No Min"
  const selectedMaxYear = searchParams.get("maxYear") || "any" // Default to "any" for "No Max"
  const selectedMinArea = searchParams.get("minArea") || "0" // Default to "0" for "No Min"
  const selectedMaxArea = searchParams.get("maxArea") || "No Limit" // Default to "No Limit" for "No Max"
  const selectedMinPrice = searchParams.get("minPrice") || "0"
  const selectedMaxPrice = searchParams.get("maxPrice") || "No Limit"

  const [expandedSections, setExpandedSections] = useState({
    propertyType: true,
    price: true,
    bedroom: true,
    floorSize: true,
    bathroom: true,
    tenure: true,
    buildYear: false,
    floorLevel: false,
    psf: false,
    distanceToMRT: false,
    leaseTerm: false,
    availability: false,
    furnishing: false,
    keyword: false,
    district: false, // Added district to expanded sections
    agent: false, // Added agent to expanded sections
    projectName: false, // Added project name to expanded sections
  })

  useEffect(() => {
    // Initialize local states from URL params when panel opens or URL changes
    setLocalProjectName(searchParams.get("projectName") || "")
    setLocalKeyword(searchParams.get("keyword") || "")
  }, [searchParams]) // Re-run effect when searchParams change

  type SectionKey = keyof typeof expandedSections;

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleTransactionTypeChange = (type: string) => {
    updateSearchParams({ transactionType: type })
  }

  const handlePropertyMainTypeChange = (mainType: keyof typeof PROPERTY_SUB_TYPES) => {
    updateSearchParams({ propertyMainType: mainType, propertySubTypes: null }) // Clear subtypes when main type changes
  }

  const handlePropertySubTypeChange = (subType: string, checked: boolean) => {
    const newSubTypes = checked
      ? [...selectedPropertySubTypes, subType]
      : selectedPropertySubTypes.filter((s) => s !== subType)
    updateSearchParams({ propertySubTypes: newSubTypes })
  }

  const handleBedroomChange = (bed: string) => {
    const newBeds = selectedBeds.includes(bed) ? selectedBeds.filter((b) => b !== bed) : [...selectedBeds, bed]
    updateSearchParams({ beds: newBeds })
  }

  const handleBathroomChange = (bath: string) => {
    const newBathrooms = selectedBathrooms.includes(bath) 
      ? selectedBathrooms.filter(b => b !== bath) 
      : [...selectedBathrooms, bath]
    updateSearchParams({ bathrooms: newBathrooms.length > 0 ? newBathrooms : null })
  }

  const handleTenureChange = (tenure: string) => {
    updateSearchParams({ tenure: selectedTenure === tenure ? null : tenure })
  }

  const handleFloorLevelChange = (level: string) => {
    updateSearchParams({ floorLevel: selectedFloorLevel === level ? null : level })
  }

  const handleDistanceToMRTChange = (distance: string) => {
    updateSearchParams({ distanceToMRT: distance })
  }

  const handleLeaseTermChange = (term: string, checked: boolean) => {
    const newLeaseTerms = checked ? [...selectedLeaseTerm, term] : selectedLeaseTerm.filter((t) => t !== term)
    updateSearchParams({ leaseTerm: newLeaseTerms })
  }

  const handleAvailabilityChange = (availability: string) => {
    updateSearchParams({ availability: selectedAvailability === availability ? null : availability })
  }

  const handleFurnishingChange = (furnishing: string) => {
    updateSearchParams({ furnishing: selectedFurnishing === furnishing ? null : furnishing })
  }

  const handleDistrictChange = (district: string, checked: boolean) => {
    let newDistricts = [...selectedDistricts]
    
    if (checked) {
      // Add district if it's not already in the array
      if (!newDistricts.includes(district)) {
        newDistricts.push(district)
      }
    } else {
      // Remove district if it's in the array
      newDistricts = newDistricts.filter(d => d !== district)
    }
    
    updateSearchParams({ districts: newDistricts.length > 0 ? newDistricts : null })
  }

  const handleAgentChange = (agent: string) => {
    updateSearchParams({ agent: agent === "All Agents" ? null : agent })
  }

  const handleMinPsfChange = (value: string) => {
    updateSearchParams({ minPsf: value === "0" ? null : value })
  }

  const handleMaxPsfChange = (value: string) => {
    updateSearchParams({ maxPsf: value === "No Limit" ? null : value })
  }

  const handleMinYearChange = (value: string) => {
    updateSearchParams({ minYear: value === "any" ? null : value })
  }

  const handleMaxYearChange = (value: string) => {
    updateSearchParams({ maxYear: value === "any" ? null : value })
  }

  const handleMinPriceChange = (value: string) => {
    updateSearchParams({ minPrice: value === "0" ? null : value })
  }

  const handleMaxPriceChange = (value: string) => {
    updateSearchParams({ maxPrice: value === "No Limit" ? null : value })
  }

  const handleMinAreaChange = (value: string) => {
    updateSearchParams({ minArea: value === "0" ? null : value })
  }

  const handleMaxAreaChange = (value: string) => {
    updateSearchParams({ maxArea: value === "No Limit" ? null : value })
  }

  const handleApplyFilters = () => {
    // Apply all locally managed input filters to URL
    updateSearchParams({
      projectName: localProjectName || null,
      keyword: localKeyword || null,
    })
    onClose() // Close the panel after applying
  }

  const handleClearAllFilters = () => {
    // Clear all filter parameters in the URL
    updateSearchParams({
      transactionType: null,
      minPrice: null,
      maxPrice: null,
      beds: null,
      propertyMainType: null,
      propertySubTypes: null,
      bathrooms: null,
      tenure: null,
      buildYear: null, // Clears minYear and maxYear
      floorLevel: null,
      psf: null, // Clears minPsf and maxPsf
      distanceToMRT: null,
      leaseTerm: null,
      availability: null,
      furnishing: null,
      keyword: null,
      districts: null,
      projectName: null,
      agent: null,
      minYear: null, // Explicitly clear min/max year
      maxYear: null,
      minPsf: null, // Explicitly clear min/max psf
      maxPsf: null,
      minArea: null, // Explicitly clear min/max area
      maxArea: null,
    })
    onClose() // Close the panel after clearing
  }

  const propertySubTypes = PROPERTY_SUB_TYPES

  // District mapping with location information
  const districtMapping = [
    { code: "D01", location: "Raffles Place, Cecil, Marina, People's Park" },
    { code: "D02", location: "Anson, Tanjong Pagar" },
    { code: "D03", location: "Queenstown, Tiong Bahru" },
    { code: "D04", location: "Telok Blangah, Harbourfront" },
    { code: "D05", location: "Pasir Panjang, Hong Leong Garden, Clementi New Town" },
    { code: "D06", location: "High Street, Beach Road" },
    { code: "D07", location: "Middle Road, Golden Mile" },
    { code: "D08", location: "Little India" },
    { code: "D09", location: "Orchard, Cairnhill, River Valley" },
    { code: "D10", location: "Ardmore, Bukit Timah, Holland Road, Tanglin" },
    { code: "D11", location: "Watten Estate, Novena, Thomson" },
    { code: "D12", location: "Balestier, Toa Payoh, Serangoon" },
    { code: "D13", location: "Macpherson, Braddell" },
    { code: "D14", location: "Geylang, Eunos" },
    { code: "D15", location: "Katong, Joo Chiat, Amber Road" },
    { code: "D16", location: "Bedok, Upper East Coast, Eastwood, Kew Drive" },
    { code: "D17", location: "Loyang, Changi" },
    { code: "D18", location: "Tampines, Pasir Ris" },
    { code: "D19", location: "Serangoon Garden, Hougang, Punggol" },
    { code: "D20", location: "Bishan, Ang Mo Kio" },
    { code: "D21", location: "Upper Bukit Timah, Clementi Park, Ulu Pandan" },
    { code: "D22", location: "Jurong" },
    { code: "D23", location: "Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang" },
    { code: "D24", location: "Lim Chu Kang, Tengah" },
    { code: "D25", location: "Kranji, Woodgrove" },
    { code: "D26", location: "Upper Thomson, Springleaf" },
    { code: "D27", location: "Yishun, Sembawang" },
    { code: "D28", location: "Seletar" }
  ]
  
  // Extract just the district codes for backward compatibility
  const districts = districtMapping.map(d => d.code)

  const agents = ["All Agents", "Sarah Lim", "John Tan", "Emily Wong", "David Lee"]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-brand-background-light rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-brand-text-dark">Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5 text-brand-text-dark" />
          </Button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Transaction Type */}
            <div className="flex space-x-2">
              <Button
                variant={transactionType === "For Sale" ? "default" : "outline"}
                onClick={() => handleTransactionTypeChange("For Sale")}
                className={`flex-1 ${
                  transactionType === "For Sale" 
                    ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" 
                    : "bg-transparent text-brand-primary-dark border-brand-primary-dark hover:bg-gray-200"
                }`}
              >
                Buy
              </Button>
              <Button
                variant={transactionType === "For Rent" ? "default" : "outline"}
                onClick={() => handleTransactionTypeChange("For Rent")}
                className={`flex-1 ${
                  transactionType === "For Rent" 
                    ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" 
                    : "bg-transparent text-brand-primary-dark border-brand-primary-dark hover:bg-gray-200"
                }`}
              >
                Rent
              </Button>
            </div>

            {/* Project Name / Address */}
            <FilterSection
              title="Project Name / Address"
              isExpanded={expandedSections.projectName}
              onToggle={() => toggleSection("projectName")}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-dark/50 w-4 h-4" />
                <Input
                  placeholder="e.g. Amber Park, Orchard Road"
                  className="pl-10 border-brand-text-dark/20"
                  value={localProjectName}
                  onChange={(e) => setLocalProjectName(e.target.value)}
                  onBlur={() => updateSearchParams({ projectName: localProjectName || null })}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") updateSearchParams({ projectName: localProjectName || null })
                  }}
                />
              </div>
            </FilterSection>

            {/* District */}
            <FilterSection
              title="District"
              isExpanded={expandedSections.district}
              onToggle={() => toggleSection("district")}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all-districts"
                    checked={selectedDistricts.length === districts.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateSearchParams({ districts: [...districts] })
                      } else {
                        updateSearchParams({ districts: null })
                      }
                    }}
                  />
                  <label htmlFor="select-all-districts" className="text-sm text-brand-text-dark">
                    Select All Districts
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {districtMapping.map((district) => (
                    <div key={district.code} className="flex items-start space-x-2 h-full py-1">
                      <Checkbox
                        id={`district-${district.code}`}
                        checked={selectedDistricts.includes(district.code)}
                        onCheckedChange={(checked) => handleDistrictChange(district.code, checked as boolean)}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <label 
                          htmlFor={`district-${district.code}`} 
                          className="text-xs text-brand-text-dark leading-tight line-clamp-2 h-10 flex flex-col"
                        >
                          <span className="text-sm">{district.code} - {district.location} </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FilterSection>

            {/* Property Type */}
            <FilterSection
              title="Property Type"
              isExpanded={expandedSections.propertyType}
              onToggle={() => toggleSection("propertyType")}
            >
              <div className="space-y-4">
                <div className="flex space-x-2">
                  {(Object.keys(PROPERTY_SUB_TYPES) as (keyof typeof PROPERTY_SUB_TYPES)[]).map((type) => (
                    <Button
                      key={type}
                      variant={selectedPropertyMainType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePropertyMainTypeChange(type)}
                      className={`${
                        selectedPropertyMainType === type
                          ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                          : "bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                      }`}
                    >
                      {type === "hdb" ? "HDB" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>

                {selectedPropertyMainType !== "all" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all-subtypes"
                        checked={
                          selectedPropertySubTypes.length === PROPERTY_SUB_TYPES[selectedPropertyMainType].length &&
                          PROPERTY_SUB_TYPES[selectedPropertyMainType].length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateSearchParams({
                              propertySubTypes: [...PROPERTY_SUB_TYPES[selectedPropertyMainType]],
                            })
                          } else {
                            updateSearchParams({ propertySubTypes: null })
                          }
                        }}
                      />
                      <label htmlFor="select-all-subtypes" className="text-sm text-brand-text-dark">
                        Select All
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2">
                      {propertySubTypes[selectedPropertyMainType].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedPropertySubTypes.includes(type)}
                            onCheckedChange={(checked) => handlePropertySubTypeChange(type, checked as boolean)}
                          />
                          <label htmlFor={type} className="text-sm text-brand-text-dark">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </FilterSection>

            {/* Price (visible for both buy and rent) */}
            <FilterSection title="Price" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-text-dark mb-2 block">Minimum</label>
                  <Select value={selectedMinPrice} onValueChange={handleMinPriceChange}>
                    <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                      <SelectValue placeholder="No Min" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {minPriceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-dark mb-2 block">Maximum</label>
                  <Select value={selectedMaxPrice} onValueChange={handleMaxPriceChange}>
                    <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                      <SelectValue placeholder="No Max" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {maxPriceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FilterSection>

            {/* Bedroom (visible for both buy and rent) */}
            <FilterSection
              title="Bedroom"
              isExpanded={expandedSections.bedroom}
              onToggle={() => toggleSection("bedroom")}
            >
              <div className="flex space-x-2 flex-wrap gap-2">
                {transactionType === "For Rent" && (
                  <Button
                    variant={selectedBeds.includes("Room") ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBedroomChange("Room")}
                    className={`${
                      selectedBeds.includes("Room")
                        ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                        : "bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                    }`}
                  >
                    Room
                  </Button>
                )}
                {BEDROOM_OPTIONS.map((bed) => (
                  <Button
                    key={bed}
                    variant={selectedBeds.includes(bed) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBedroomChange(bed)}
                    className={`${
                      selectedBeds.includes(bed)
                        ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                        : "bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                    }`}
                  >
                    {bed}
                  </Button>
                ))}
              </div>
            </FilterSection>

            {/* Bathroom (visible for both buy and rent) */}
            <FilterSection
              title="Bathroom"
              isExpanded={expandedSections.bathroom}
              onToggle={() => toggleSection("bathroom")}
            >
              <div className="flex space-x-2">
                {["1", "2", "3", "4", "5+"].map((bath) => (
                  <Button
                    key={bath}
                    variant={selectedBathrooms.includes(bath) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBathroomChange(bath)}
                    className={`${
                      selectedBathrooms.includes(bath)
                        ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                        : "bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                    }`}
                  >
                    {bath}
                  </Button>
                ))}
              </div>
            </FilterSection>

            {/* Floor Size (visible for both buy and rent) */}
            <FilterSection
              title="Floor Size"
              isExpanded={expandedSections.floorSize}
              onToggle={() => toggleSection("floorSize")}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-text-dark mb-2 block">Minimum</label>
                  <Select value={selectedMinArea} onValueChange={handleMinAreaChange}>
                    <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                      <SelectValue placeholder="No Min" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {minAreaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-dark mb-2 block">Maximum</label>
                  <Select value={selectedMaxArea} onValueChange={handleMaxAreaChange}>
                    <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                      <SelectValue placeholder="No Max" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {maxAreaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FilterSection>

            {/* PSF (Buy-specific) */}
            {transactionType === "For Sale" && (
              <FilterSection title="PSF" isExpanded={expandedSections.psf} onToggle={() => toggleSection("psf")}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-brand-text-dark mb-2 block">Minimum</label>
                    <Select value={selectedMinPsf} onValueChange={handleMinPsfChange}>
                      <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                        <SelectValue placeholder="No Min" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {minPsfOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-text-dark mb-2 block">Maximum</label>
                    <Select value={selectedMaxPsf} onValueChange={handleMaxPsfChange}>
                      <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                        <SelectValue placeholder="No Max" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {maxPsfOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FilterSection>
            )}

            {/* Distance to MRT (visible for both buy and rent) */}
            <FilterSection
              title="Distance to MRT"
              isExpanded={expandedSections.distanceToMRT}
              onToggle={() => toggleSection("distanceToMRT")}
            >
              <div className="space-y-3">
                {[
                  { value: "any", label: "Any" },
                  { value: "500m", label: "< 500 m (5-7 min walk)" },
                  { value: "1km", label: "< 1 km (10-15 min walk)" },
                  { value: "1.5km", label: "< 1.5 km (15-20 min walk)" },
                  { value: "2km", label: "< 2 km (20-25 min walk)" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={option.value}
                      name="distance"
                      checked={selectedDistanceToMRT === option.value}
                      onChange={() => handleDistanceToMRTChange(option.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={option.value} className="text-sm text-brand-text-dark">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Agent Filter */}
            <FilterSection title="Agent" isExpanded={expandedSections.agent} onToggle={() => toggleSection("agent")}>
              <Select value={selectedAgent} onValueChange={handleAgentChange}>
                <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                  <SelectValue placeholder="Select Agent" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {agents.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterSection>

            {/* Rent-specific sections */}
            {transactionType === "For Rent" && (
              <>
                {/* Availability */}
                <FilterSection
                  title="Availability"
                  isExpanded={expandedSections.availability}
                  onToggle={() => toggleSection("availability")}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {["Immediately", "Within 1 month", "1-2 months", "2-3 months", "After 3 months"].map((option) => (
                      <Button
                        key={option}
                        variant={selectedAvailability === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAvailabilityChange(option)}
                        className="bg-transparent text-xs text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </FilterSection>

                {/* Furnishing */}
                <FilterSection
                  title="Furnishing"
                  isExpanded={expandedSections.furnishing}
                  onToggle={() => toggleSection("furnishing")}
                >
                  <div className="flex space-x-2">
                    {["Unfurnished", "Partially Furnished", "Fully Furnished"].map((option) => (
                      <Button
                        key={option}
                        variant={selectedFurnishing === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFurnishingChange(option)}
                        className="flex-1 bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </FilterSection>

                {/* Keyword */}
                <FilterSection
                  title="Keyword"
                  isExpanded={expandedSections.keyword}
                  onToggle={() => toggleSection("keyword")}
                >
                  <Textarea
                    placeholder="e.g Terrace, Garage, Eateries, etc"
                    className="min-h-[80px] border-brand-text-dark/20"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    onBlur={() => updateSearchParams({ keyword: localKeyword || null })}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") updateSearchParams({ keyword: localKeyword || null })
                    }}
                  />
                </FilterSection>

                {/* Lease Term */}
                <FilterSection
                  title="Lease Term"
                  isExpanded={expandedSections.leaseTerm}
                  onToggle={() => toggleSection("leaseTerm")}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {["1 year", "2 years", "3 or more years", "Short Term", "Flexible"].map((term) => (
                      <div key={term} className="flex items-center space-x-2">
                        <Checkbox
                          id={term}
                          checked={selectedLeaseTerm.includes(term)}
                          onCheckedChange={(checked) => handleLeaseTermChange(term, checked as boolean)}
                        />
                        <label htmlFor={term} className="text-sm text-brand-text-dark">
                          {term}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>
              </>
            )}

            {/* Buy-specific sections */}
            {transactionType === "For Sale" && (
              <>
                {/* Tenure */}
                <FilterSection
                  title="Tenure"
                  isExpanded={expandedSections.tenure}
                  onToggle={() => toggleSection("tenure")}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Freehold",
                      "99-year Leasehold",
                      "103-year Leasehold",
                      "110-year Leasehold",
                      "999-year Leasehold",
                      "Unknown Tenure",
                    ].map((tenure) => (
                      <div key={tenure} className="flex items-center space-x-2">
                        <Checkbox
                          id={tenure}
                          checked={selectedTenure === tenure}
                          onCheckedChange={() => handleTenureChange(tenure)}
                        />
                        <label htmlFor={tenure} className="text-sm text-brand-text-dark">
                          {tenure}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Build Year */}
                <FilterSection
                  title="Build Year"
                  isExpanded={expandedSections.buildYear}
                  onToggle={() => toggleSection("buildYear")}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-brand-text-dark mb-2 block">Minimum</label>
                      <Select value={selectedMinYear} onValueChange={handleMinYearChange}>
                        <SelectTrigger className="border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="No Min" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {minBuildYearOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-text-dark mb-2 block">Maximum</label>
                      <Select value={selectedMaxYear} onValueChange={handleMaxYearChange}>
                        <SelectTrigger className="border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="No Max" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {maxBuildYearOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </FilterSection>

                {/* Floor Level */}
                <FilterSection
                  title="Floor Level"
                  isExpanded={expandedSections.floorLevel}
                  onToggle={() => toggleSection("floorLevel")}
                >
                  <div className="flex space-x-2">
                    {["Ground", "Low", "Mid", "High", "Penthouse"].map((level) => (
                      <Button
                        key={level}
                        variant={selectedFloorLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFloorLevelChange(level)}
                        className={`${
                          selectedFloorLevel.includes(level)
                            ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                            : "bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </FilterSection>
              </>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="p-6 border-t flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
            onClick={handleClearAllFilters}
          >
            Clear
          </Button>
          <Button
            className="flex-1 bg-brand-accent-orange text-white hover:bg-brand-accent-orange/90"
            onClick={handleApplyFilters}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button onClick={onToggle} className="flex items-center justify-between w-full text-left">
        <h3 className="text-base font-semibold text-brand-text-dark">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-brand-text-dark/50" />
        ) : (
          <ChevronDown className="w-4 h-4 text-brand-text-dark/50" />
        )}
      </button>
      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  )
}
