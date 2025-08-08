"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Bookmark, X, ChevronDown, MapPin, Home, Building, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FilterPanel } from "@/components/filter-panel"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  BEDROOM_OPTIONS,
  PROPERTY_SUB_TYPES,
  TRANSACTION_TYPES,
  minPriceOptions,
  maxPriceOptions,
  type PropertyMainType,
} from "@/lib/filter-options"

interface GlobalSearchHeaderProps {
  showMap?: boolean
  onShowMapChange?: (show: boolean) => void
}

export function GlobalSearchHeader({ showMap = true, onShowMapChange }: GlobalSearchHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [showFilterPanel, setShowFilterPanel] = useState(false)

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
  const transactionType = (searchParams.get("transactionType") || "For Sale") as (typeof TRANSACTION_TYPES)[number]
  const minPrice = searchParams.get("minPrice") || "0"
  const maxPrice = searchParams.get("maxPrice") || "No Limit"
  const selectedBeds = searchParams.get("beds")?.split(",").filter(Boolean) || []
  const selectedPropertyMainType = (searchParams.get("propertyMainType") || "all") as PropertyMainType
  const selectedPropertySubTypes = searchParams.get("propertySubTypes")?.split(",").filter(Boolean) || []

  // Handlers for filter changes, now updating URL
  const handleTransactionTypeChange = (type: (typeof TRANSACTION_TYPES)[number]) => {
    updateSearchParams({ transactionType: type })
  }

  const handlePriceApply = () => {
    // This function is now redundant as price changes update immediately
    // but keeping it for consistency if a user clicks "Apply" in the dropdown
    updateSearchParams({ minPrice, maxPrice })
  }

  const handleBedroomsChange = (bed: string, checked: boolean) => {
    const newBeds = checked ? [...selectedBeds, bed as any] : selectedBeds.filter((b) => b !== bed)
    updateSearchParams({ beds: newBeds })
  }

  const handlePropertyMainTypeChange = (mainType: PropertyMainType) => {
    updateSearchParams({ propertyMainType: mainType, propertySubTypes: null }) // Clear subtypes when main type changes
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

  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("transactionType")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("beds")
    params.delete("propertyMainType")
    params.delete("propertySubTypes")
    params.delete("district")
    params.delete("minYear")
    params.delete("maxYear")
    params.delete("minPsf")
    params.delete("maxPsf")
    params.delete("minArea")
    params.delete("maxArea")
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
  if (transactionType !== "For Sale") {
    activeFilters.push(transactionType)
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
      activeFilters.push(selectedPropertyMainType.charAt(0).toUpperCase() + selectedPropertyMainType.slice(1))
    }
  }

  const removeActiveFilter = (filterToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Logic to remove specific filter from URL
    if (TRANSACTION_TYPES.includes(filterToRemove as (typeof TRANSACTION_TYPES)[number])) {
      params.delete("transactionType")
    } else if (filterToRemove.includes("Price") || filterToRemove.includes("Min") || filterToRemove.includes("Max")) {
      params.delete("minPrice")
      params.delete("maxPrice")
    } else if (BEDROOM_OPTIONS.some((bed) => filterToRemove.includes(bed))) {
      // Check if it's a grouped bedroom filter
      params.delete("beds")
    } else {
      // Handle property type main/subtypes
      const currentMainType = params.get("propertyMainType")
      // Check if the filterToRemove matches a main type (e.g., "Condo")
      if (currentMainType && filterToRemove.toLowerCase() === currentMainType) {
        params.delete("propertyMainType")
        params.delete("propertySubTypes") // Clear subtypes if main type is removed
      } else if (
        selectedPropertyMainType !== "all" &&
        PROPERTY_SUB_TYPES[selectedPropertyMainType]?.some((subType) => filterToRemove.includes(subType))
      ) {
        // Check if it's a grouped subtype filter
        params.delete("propertySubTypes")
        // If all subtypes are removed, and a main type was selected, re-add main type to active filters
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

    // Transaction Type
    if (currentParams.get("transactionType") && currentParams.get("transactionType") !== "For Sale") {
      count++
    }

    // Price Range
    if (currentParams.get("minPrice") !== "0" || currentParams.get("maxPrice") !== "No Limit") {
      count++
    }

    // Bedrooms
    const bedsParam1 = currentParams.get("beds")
    if (bedsParam1 && bedsParam1.split(",").filter(Boolean).length > 0) {
      count++
    }

    // Property Type
    if (currentParams.get("propertyMainType") && currentParams.get("propertyMainType") !== "all") {
      count++
    }

    // Other filters from FilterPanel (check for existence of parameter)
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
        // Special handling for min/max pairs to count as one filter
        if (
          (key === "minYear" && currentParams.get("maxYear")) ||
          (key === "minPsf" && currentParams.get("maxPsf")) ||
          (key === "minArea" && currentParams.get("maxArea"))
        ) {
          // If both min and max exist, count only once for the pair
          if (
            (key === "minYear" && currentParams.get("minYear") !== "any") ||
            (key === "minPsf" && currentParams.get("minPsf") !== "") ||
            (key === "minArea" && currentParams.get("minArea") !== "")
          ) {
            // Only count if min is not default
            if (
              (key === "minYear" && currentParams.get("maxYear") !== "any") ||
              (key === "minPsf" && currentParams.get("maxPsf") !== "") ||
              (key === "minArea" && currentParams.get("maxArea") !== "")
            ) {
              // Only count if max is not default
              // This logic is tricky for pairs. Let's simplify: if *any* part of the pair is set, count it.
              // To avoid double counting, we'll only check the 'min' key for pairs.
              if (key.startsWith("min")) {
                count++
              }
            }
          }
        } else if (!key.startsWith("max")) {
          // For single parameters, or the 'min' part of a pair, count if not default
          count++
        }
      }
    })

    // Refined counting for min/max pairs to ensure they count as one filter
    const hasYearFilter =
      (currentParams.get("minYear") && currentParams.get("minYear") !== "any") ||
      (currentParams.get("maxYear") && currentParams.get("maxYear") !== "any")
    const hasPsfFilter =
      (currentParams.get("minPsf") && currentParams.get("minPsf") !== "") ||
      (currentParams.get("maxPsf") && currentParams.get("maxPsf") !== "")
    const hasAreaFilter =
      (currentParams.get("minArea") && currentParams.get("minArea") !== "") ||
      (currentParams.get("maxArea") && currentParams.get("maxArea") !== "")

    // Adjust count for pairs to be exactly 1 if any part is active
    if (hasYearFilter)
      count =
        count +
        1 -
        (currentParams.get("minYear") && currentParams.get("minYear") !== "any" ? 1 : 0) -
        (currentParams.get("maxYear") && currentParams.get("maxYear") !== "any" ? 1 : 0)
    if (hasPsfFilter)
      count =
        count +
        1 -
        (currentParams.get("minPsf") && currentParams.get("minPsf") !== "" ? 1 : 0) -
        (currentParams.get("maxPsf") && currentParams.get("maxPsf") !== "" ? 1 : 0)
    if (hasAreaFilter)
      count =
        count +
        1 -
        (currentParams.get("minArea") && currentParams.get("minArea") !== "" ? 1 : 0) -
        (currentParams.get("maxArea") && currentParams.get("maxArea") !== "" ? 1 : 0)

    // Simpler counting logic for the filter button:
    let totalCount = 0
    if (currentParams.get("transactionType") && currentParams.get("transactionType") !== "For Sale") totalCount++
    if (currentParams.get("minPrice") !== "0" || currentParams.get("maxPrice") !== "No Limit") totalCount++
    const bedsParam2 = currentParams.get("beds")
    if (bedsParam2 && bedsParam2.split(",").filter(Boolean).length > 0) totalCount++
    if (currentParams.get("propertyMainType") && currentParams.get("propertyMainType") !== "all") totalCount++
    if (currentParams.get("district") && currentParams.get("district") !== "all") totalCount++
    if (
      (currentParams.get("minYear") && currentParams.get("minYear") !== "any") ||
      (currentParams.get("maxYear") && currentParams.get("maxYear") !== "any")
    )
      totalCount++
    if (
      (currentParams.get("minPsf") && currentParams.get("minPsf") !== "") ||
      (currentParams.get("maxPsf") && currentParams.get("maxPsf") !== "")
    )
      totalCount++
    if (
      (currentParams.get("minArea") && currentParams.get("minArea") !== "") ||
      (currentParams.get("maxArea") && currentParams.get("maxArea") !== "")
    )
      totalCount++
    if (currentParams.get("projectName") && currentParams.get("projectName") !== "") totalCount++
    if (currentParams.get("agent") && currentParams.get("agent") !== "All Agents") totalCount++
    if (currentParams.get("distanceToMRT") && currentParams.get("distanceToMRT") !== "any") totalCount++
    if (currentParams.get("leaseTerm") && currentParams.get("leaseTerm") !== "") totalCount++
    if (currentParams.get("availability") && currentParams.get("availability") !== "") totalCount++
    if (currentParams.get("furnishing") && currentParams.get("furnishing") !== "") totalCount++
    if (currentParams.get("keyword") && currentParams.get("keyword") !== "") totalCount++
    if (currentParams.get("floorLevel") && currentParams.get("floorLevel") !== "") totalCount++
    if (currentParams.get("tenure") && currentParams.get("tenure") !== "") totalCount++
    if (currentParams.get("bathroom") && currentParams.get("bathroom") !== "") totalCount++

    return totalCount
  }

  const totalActiveFiltersCount = calculateTotalActiveFilters()

  return (
    <>
      <div className="sticky top-16 z-40 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-dark/50 w-4 h-4" />
            <Input
              placeholder="City, Neighborhood, Address, School District, Postal Code..."
              className="pl-10 h-10 rounded-lg border-brand-background-light focus:border-brand-primary-dark focus:ring-brand-primary-dark"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            {/* For Sale / For Rent Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              {TRANSACTION_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={transactionType === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTransactionTypeChange(type)}
                  className={`rounded-none h-10 ${
                    transactionType === type
                      ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                      : "text-brand-text-dark/70 hover:bg-brand-background-light"
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Any Price Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
                >
                  Any Price
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 w-80">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-brand-text-dark mb-2">Asking Price Range</div>
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
                  className="h-10 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
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
                  className="h-10 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
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
                        {type.charAt(0).toUpperCase() + type.slice(1)}
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

            <Button
              variant="outline"
              size="sm"
              className="h-10 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
              onClick={() => setShowFilterPanel(true)}
            >
              <Filter className="w-3 h-3 mr-1" />
              Filters {totalActiveFiltersCount > 0 && `(${totalActiveFiltersCount})`}
            </Button>
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
          <Button
            variant="outline"
            size="sm"
            className="h-10 bg-brand-background-light text-brand-text-dark border-brand-background-light hover:bg-brand-background-light"
          >
            <Bookmark className="w-3 h-3 mr-1" />
            Save Search
          </Button>
        </div>
      </div>

      {/* Active Filters Panel - Conditionally displayed */}
      {activeFilters.length > 0 && (
        <div className="sticky top-[8rem] z-30 bg-white border-b border-gray-200 px-6 py-3 flex items-center space-x-2 overflow-x-auto">
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

      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        searchParams={searchParams}
        updateSearchParams={updateSearchParams}
      />
    </>
  )
}
