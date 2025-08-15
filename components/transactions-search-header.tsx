"use client"

import { useState } from "react"
import { Search, Filter, X, ChevronDown, MapPin, Home, Building, Car, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  BEDROOM_OPTIONS,
  PROPERTY_SUB_TYPES,
  minPriceOptions,
  maxPriceOptions,
  minPsfOptions,
  maxPsfOptions,
  minAreaOptions,
  maxAreaOptions,
  dateRangePresets,
  type PropertyMainType,
} from "@/lib/filter-options"

// Status options for transactions
const TRANSACTION_STATUSES = ["SOLD", "RENTED"] as const

interface TransactionsSearchHeaderProps {
  showMap?: boolean
  onShowMapChange?: (show: boolean) => void
}

export function TransactionsSearchHeader({ showMap = true, onShowMapChange }: TransactionsSearchHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Helper to update URL search parameters
  const updateSearchParams = (newParams: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const key in newParams) {
      const value = newParams[key]
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","))
      } else {
        params.set(key, value)
      }
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Derive filter states from URL search parameters
  const transactionStatus = (searchParams.get("status") || "SOLD") as (typeof TRANSACTION_STATUSES)[number]
  const minPrice = searchParams.get("minPrice") || "0"
  const maxPrice = searchParams.get("maxPrice") || "No Limit"
  const selectedBeds = searchParams.get("beds")?.split(",").filter(Boolean) || []
  const selectedPropertyMainType = (searchParams.get("propertyMainType") || "all") as PropertyMainType
  const selectedPropertySubTypes = searchParams.get("propertySubTypes")?.split(",").filter(Boolean) || []
  
  // New filter states
  const dateRangePreset = searchParams.get("dateRange") || "all"
  const minPsf = searchParams.get("minPsf") || "0"
  const maxPsf = searchParams.get("maxPsf") || "No Limit"
  const minArea = searchParams.get("minArea") || "0"
  const maxArea = searchParams.get("maxArea") || "No Limit"

  // Handlers for filter changes
  const handleTransactionStatusChange = (status: (typeof TRANSACTION_STATUSES)[number]) => {
    updateSearchParams({ status })
  }

  const handlePriceApply = () => {
    updateSearchParams({ minPrice, maxPrice })
  }

  const handleBedroomsChange = (bed: string, checked: boolean) => {
    const newBeds = checked ? [...selectedBeds, bed as any] : selectedBeds.filter((b) => b !== bed)
    updateSearchParams({ beds: newBeds })
  }

  const handlePropertyMainTypeChange = (mainType: PropertyMainType) => {
    updateSearchParams({ propertyMainType: mainType, propertySubTypes: null })
  }

  const handlePropertySubTypeChange = (subType: string, checked: boolean) => {
    const newSubTypes = checked
      ? [...selectedPropertySubTypes, subType]
      : selectedPropertySubTypes.filter((s) => s !== subType)
    updateSearchParams({ propertySubTypes: newSubTypes })
  }

  const handleClearAllSubtypes = () => {
    updateSearchParams({ propertySubTypes: null })
  }

  // New filter handlers
  const handleDateRangeChange = (preset: string) => {
    updateSearchParams({ dateRange: preset })
  }

  const handlePsfApply = () => {
    updateSearchParams({ minPsf, maxPsf })
  }

  const handleAreaApply = () => {
    updateSearchParams({ minArea, maxArea })
  }

  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("status")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("beds")
    params.delete("propertyMainType")
    params.delete("propertySubTypes")
    params.delete("dateRange")
    params.delete("minPsf")
    params.delete("maxPsf")
    params.delete("minArea")
    params.delete("maxArea")
    params.delete("district")
    params.delete("minYear")
    params.delete("maxYear")
    params.delete("projectName")
    params.delete("agent")
    params.delete("distanceToMRT")
    params.delete("leaseTerm")
    params.delete("availability")
    params.delete("furnishing")
    params.delete("keyword")
    params.delete("floorLevel")
    params.delete("tenure")
    params.delete("bathroom")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Derive active filters for display from URL parameters
  const activeFilters: string[] = []
  if (transactionStatus !== "SOLD") {
    activeFilters.push(transactionStatus)
  }
  if (minPrice !== "0" || maxPrice !== "No Limit") {
    let priceFilter = ""
    if (minPrice === "0") {
      priceFilter = `Max ${maxPriceOptions.find((opt) => opt.value === maxPrice)?.label || maxPrice}`
    } else if (maxPrice === "No Limit") {
      priceFilter = `Min ${minPriceOptions.find((opt) => opt.value === minPrice)?.label || minPrice}`
    } else {
      priceFilter = `${minPriceOptions.find((opt) => opt.value === minPrice)?.label || minPrice} - ${maxPriceOptions.find((opt) => opt.value === maxPrice)?.label || maxPrice}`
    }
    activeFilters.push(priceFilter)
  }

  // Group and sort bedroom filters
  if (selectedBeds.length > 0) {
    const sortedBeds = [...selectedBeds].sort((a, b) => {
      const indexA = BEDROOM_OPTIONS.indexOf(a as any)
      const indexB = BEDROOM_OPTIONS.indexOf(b as any)
      return indexA - indexB
    })
    activeFilters.push(sortedBeds.join(", "))
  }

  // Group property type filters
  if (selectedPropertyMainType !== "all") {
    if (selectedPropertySubTypes.length > 0) {
      activeFilters.push(selectedPropertySubTypes.join(", "))
    } else {
      activeFilters.push(selectedPropertyMainType === "hdb" ? "HDB" : selectedPropertyMainType.charAt(0).toUpperCase() + selectedPropertyMainType.slice(1))
    }
  }

  // Date range filter
  if (dateRangePreset !== "all") {
    const preset = dateRangePresets.find(p => p.value === dateRangePreset)
    if (preset) {
      activeFilters.push(preset.label)
    }
  }

  // PSF range filter
  if (minPsf !== "0" || maxPsf !== "No Limit") {
    let psfFilter = ""
    if (minPsf === "0") {
      psfFilter = `Max PSF ${maxPsfOptions.find((opt) => opt.value === maxPsf)?.label || maxPsf}`
    } else if (maxPsf === "No Limit") {
      psfFilter = `Min PSF ${minPsfOptions.find((opt) => opt.value === minPsf)?.label || minPsf}`
    } else {
      psfFilter = `PSF ${minPsfOptions.find((opt) => opt.value === minPsf)?.label || minPsf} - ${maxPsfOptions.find((opt) => opt.value === maxPsf)?.label || maxPsf}`
    }
    activeFilters.push(psfFilter)
  }

  // Area range filter
  if (minArea !== "0" || maxArea !== "No Limit") {
    let areaFilter = ""
    if (minArea === "0") {
      areaFilter = `Max Area ${maxAreaOptions.find((opt) => opt.value === maxArea)?.label || maxArea}`
    } else if (maxArea === "No Limit") {
      areaFilter = `Min Area ${minAreaOptions.find((opt) => opt.value === minArea)?.label || minArea}`
    } else {
      areaFilter = `Area ${minAreaOptions.find((opt) => opt.value === minArea)?.label || minArea} - ${maxAreaOptions.find((opt) => opt.value === maxArea)?.label || maxArea}`
    }
    activeFilters.push(areaFilter)
  }

  const removeActiveFilter = (filterToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Logic to remove specific filter from URL
    if (TRANSACTION_STATUSES.includes(filterToRemove as (typeof TRANSACTION_STATUSES)[number])) {
      params.delete("status")
    } else if (filterToRemove.includes("Price") || filterToRemove.includes("Min") || filterToRemove.includes("Max")) {
      if (filterToRemove.includes("PSF")) {
        params.delete("minPsf")
        params.delete("maxPsf")
      } else if (filterToRemove.includes("Area")) {
        params.delete("minArea")
        params.delete("maxArea")
      } else {
        params.delete("minPrice")
        params.delete("maxPrice")
      }
    } else if (BEDROOM_OPTIONS.some((bed) => filterToRemove.includes(bed))) {
      params.delete("beds")
    } else if (dateRangePresets.some(preset => filterToRemove.includes(preset.label))) {
      // Handle date range filter
      params.delete("dateRange")
    } else {
      // Handle property type main/subtypes
      const currentMainType = params.get("propertyMainType")
      if (currentMainType && (filterToRemove.toLowerCase() === currentMainType || (filterToRemove === "HDB" && currentMainType === "hdb"))) {
        params.delete("propertyMainType")
        params.delete("propertySubTypes")
      } else if (
        selectedPropertyMainType !== "all" &&
        PROPERTY_SUB_TYPES[selectedPropertyMainType]?.some((subType) => filterToRemove.includes(subType))
      ) {
        params.delete("propertySubTypes")
        if (currentMainType && currentMainType !== "all") {
          params.set("propertyMainType", currentMainType)
        }
      }
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Calculate total active filters for the "Filters" button count
  const calculateTotalActiveFilters = () => {
    let count = 0
    const currentParams = new URLSearchParams(searchParams.toString())

    // Transaction Status
    if (currentParams.get("status") && currentParams.get("status") !== "SOLD") {
      count++
    }

    // Price Range
    if (currentParams.get("minPrice") !== "0" || currentParams.get("maxPrice") !== "No Limit") {
      count++
    }

    // Bedrooms
    const bedsParam = currentParams.get("beds")
    if (bedsParam && bedsParam.split(",").filter(Boolean).length > 0) {
      count++
    }

    // Property Type
    if (currentParams.get("propertyMainType") && currentParams.get("propertyMainType") !== "all") {
      count++
    }

    // Date Range
    if (currentParams.get("dateRange") && currentParams.get("dateRange") !== "all") {
      count++
    }

    // PSF Range
    if (currentParams.get("minPsf") !== "0" || currentParams.get("maxPsf") !== "No Limit") {
      count++
    }

    // Area Range
    if (currentParams.get("minArea") !== "0" || currentParams.get("maxArea") !== "No Limit") {
      count++
    }

    // Other filters
    const filterKeys = [
      "district",
      "minYear",
      "maxYear",
      "minPsf",
      "maxPsf",
      "minArea",
      "maxArea",
      "projectName",
      "agent",
      "distanceToMRT",
      "leaseTerm",
      "availability",
      "furnishing",
      "keyword",
      "floorLevel",
      "tenure",
      "bathroom",
    ]

    filterKeys.forEach((key) => {
      const value = currentParams.get(key)
      if (value && value !== "" && value !== "any" && value !== "all" && value !== "All Agents") {
        if (!key.startsWith("max")) {
          count++
        }
      }
    })

    return count
  }

  const totalActiveFiltersCount = calculateTotalActiveFilters()

  return (
    <>
      <div className="sticky top-16 z-40 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-dark/50 w-4 h-4" />
            <Input
              placeholder="City, Neighborhood, Address, School District, Postal Code..."
              className="pl-10 h-9 rounded-lg border-brand-background-light focus:border-brand-primary-dark focus:ring-brand-primary-dark"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            {/* SOLD / RENTED Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              {TRANSACTION_STATUSES.map((status) => (
                <Button
                  key={status}
                  variant={transactionStatus === status ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTransactionStatusChange(status)}
                  className={`rounded-none h-9 ${
                    transactionStatus === status
                      ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                      : "text-brand-text-dark/70 hover:bg-brand-background-light"
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>

            {/* Transacted Price Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
                >
                  Any Price
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 w-80">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-brand-text-dark mb-2">Transacted Price Range</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-brand-text-dark/70 mb-1 block">Min</label>
                      <Select value={minPrice} onValueChange={(value) => updateSearchParams({ minPrice: value })}>
                        <SelectTrigger className="w-full h-9 text-sm border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="Any" />
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
                    <span className="text-brand-text-dark/70 text-sm mt-4">to</span>
                    <div className="flex-1">
                      <label className="text-xs text-brand-text-dark/70 mb-1 block">Max</label>
                      <Select value={maxPrice} onValueChange={(value) => updateSearchParams({ maxPrice: value })}>
                        <SelectTrigger className="w-full h-9 text-sm border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="No Limit" />
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
                  <Button
                    onClick={handlePriceApply}
                    className="w-full bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                  >
                    Apply
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Any Beds Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
                >
                  Any Beds
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 w-48">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-brand-text-dark mb-2">Any Beds</div>
                  {BEDROOM_OPTIONS.map((bed) => (
                    <div key={bed} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bed-${bed}`}
                        checked={selectedBeds.includes(bed)}
                        onCheckedChange={(checked) => handleBedroomsChange(bed, checked as boolean)}
                      />
                      <label htmlFor={`bed-${bed}`} className="text-sm text-brand-text-dark cursor-pointer">
                        {bed}
                      </label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Property Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
                >
                  Property Type
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-brand-text-dark">Main Type</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAllSubtypes}
                      className="h-auto px-2 py-1 text-xs text-brand-primary-dark hover:bg-brand-accent-blue-25"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {(Object.keys(PROPERTY_SUB_TYPES) as PropertyMainType[]).map((type) => (
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
                      <div className="text-sm font-semibold text-brand-text-dark mt-4 mb-2">Subtypes</div>
                      <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {PROPERTY_SUB_TYPES[selectedPropertyMainType].map((subType) => (
                          <div key={subType} className="flex items-center space-x-2">
                            <Checkbox
                              id={subType}
                              checked={selectedPropertySubTypes.includes(subType)}
                              onCheckedChange={(checked) => handlePropertySubTypeChange(subType, checked as boolean)}
                            />
                            <label htmlFor={subType} className="text-sm text-brand-text-dark cursor-pointer">
                              {subType}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Date Range
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 w-80">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-brand-text-dark mb-2">Quick Presets</div>
                  <div className="grid grid-cols-2 gap-2">
                    {dateRangePresets.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={dateRangePreset === preset.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDateRangeChange(preset.value)}
                        className={`${
                          dateRangePreset === preset.value
                            ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                            : "bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                        }`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                    >
                      Custom Date Range
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PSF Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
                >
                  Any PSF
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 w-80">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-brand-text-dark mb-2">PSF Range</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-brand-text-dark/70 mb-1 block">Min</label>
                      <Select value={minPsf} onValueChange={(value) => updateSearchParams({ minPsf: value })}>
                        <SelectTrigger className="w-full h-9 text-sm border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="Any" />
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
                    <span className="text-brand-text-dark/70 text-sm mt-4">to</span>
                    <div className="flex-1">
                      <label className="text-xs text-brand-text-dark/70 mb-1 block">Max</label>
                      <Select value={maxPsf} onValueChange={(value) => updateSearchParams({ maxPsf: value })}>
                        <SelectTrigger className="w-full h-9 text-sm border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="No Limit" />
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
                  <Button
                    onClick={handlePsfApply}
                    className="w-full bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                  >
                    Apply
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Area Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
                >
                  Any Area
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 w-80">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-brand-text-dark mb-2">Area Range (sqft)</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-brand-text-dark/70 mb-1 block">Min</label>
                      <Select value={minArea} onValueChange={(value) => updateSearchParams({ minArea: value })}>
                        <SelectTrigger className="w-full h-9 text-sm border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="Any" />
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
                    <span className="text-brand-text-dark/70 text-sm mt-4">to</span>
                    <div className="flex-1">
                      <label className="text-xs text-brand-text-dark/70 mb-1 block">Max</label>
                      <Select value={maxArea} onValueChange={(value) => updateSearchParams({ maxArea: value })}>
                        <SelectTrigger className="w-full h-9 text-sm border-brand-text-dark/20 text-brand-text-dark">
                          <SelectValue placeholder="No Limit" />
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
                  <Button
                    onClick={handleAreaApply}
                    className="w-full bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                  >
                    Apply
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-brand-text-dark">Show Map</span>
            <div 
              className="relative inline-block w-12 h-6 cursor-pointer"
              onClick={() => {
                onShowMapChange?.(!showMap)
              }}
            >
              <input 
                type="checkbox" 
                checked={showMap}
                onChange={(e) => {
                  onShowMapChange?.(e.target.checked)
                }}
                className="sr-only" 
              />
              <div className={`block w-12 h-6 rounded-full transition-colors duration-200 ${
                showMap ? 'bg-brand-primary-dark' : 'bg-gray-300'
              }`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                showMap ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Panel - Conditionally displayed */}
      {activeFilters.length > 0 && (
        <div className="sticky top-[8rem] z-30 bg-white border-b border-gray-200 px-6 py-1 flex items-center space-x-2 overflow-x-auto">
          <span className="text-sm font-medium text-brand-text-dark mr-2">Active Filters:</span>
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center bg-brand-accent-blue-25 text-brand-primary-dark text-sm px-3 py-1 rounded-full whitespace-nowrap"
            >
              <span>{filter}</span>
              <button
                onClick={() => removeActiveFilter(filter)}
                className="ml-1 text-brand-primary-dark hover:text-brand-primary-dark/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllFilters}
            className="ml-auto text-brand-primary-dark hover:bg-brand-accent-blue-25"
          >
            Clear All
          </Button>
        </div>
      )}
    </>
  )
} 