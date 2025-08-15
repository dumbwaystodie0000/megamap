import { SavedSearch } from "./types"

/**
 * Generates a default name for a new saved search based on existing searches in the folder
 * 
 * @param existingSearches Array of existing saved searches
 * @param folderName The folder where the search will be saved
 * @returns A default name in the format "Saved Search (n)" where n is the next available number
 */
export function generateDefaultSearchName(existingSearches: SavedSearch[], folderName: string): string {
  // Filter searches to only those in the specified folder
  const folderSearches = existingSearches.filter(search => search.folderId === folderName)
  
  // Find searches that follow the "Saved Search (n)" pattern
  const defaultNamePattern = /^Saved Search \((\d+)\)$/
  const numberedSearches = folderSearches
    .map(search => {
      const match = search.name.match(defaultNamePattern)
      return match ? parseInt(match[1], 10) : null
    })
    .filter((num): num is number => num !== null)
    .sort((a, b) => a - b)
  
  // Find the first available number
  let nextNumber = 1
  for (const num of numberedSearches) {
    if (num > nextNumber) {
      // Found a gap, use this number
      break
    }
    nextNumber = num + 1
  }
  
  return `Saved Search (${nextNumber})`
}

/**
 * Formats search filters into a human-readable summary
 * 
 * @param filters The filters object from a SavedSearch
 * @returns Array of strings describing the filters
 */
export function formatSearchFilters(filters: SavedSearch["filters"]): string[] {
  const summary: string[] = []
  
  // Price Range
  if (filters.minPrice || filters.maxPrice) {
    const minPrice = filters.minPrice || "0"
    const maxPrice = filters.maxPrice || "No Limit"
    
    if (minPrice !== "0" || maxPrice !== "No Limit") {
      let priceFilter = ""
      if (minPrice === "0") {
        priceFilter = `Up to $${parseInt(maxPrice).toLocaleString()}`
      } else if (maxPrice === "No Limit") {
        priceFilter = `$${parseInt(minPrice).toLocaleString()}+`
      } else {
        priceFilter = `$${parseInt(minPrice).toLocaleString()} - $${parseInt(maxPrice).toLocaleString()}`
      }
      summary.push(priceFilter)
    }
  }
  
  // Property Types
  if (filters.propertySubTypes && filters.propertySubTypes.length > 0) {
    summary.push(filters.propertySubTypes.join(", "))
  } else if (filters.propertyMainType && filters.propertyMainType !== "all") {
    summary.push(filters.propertyMainType === "hdb" ? "HDB" : filters.propertyMainType.charAt(0).toUpperCase() + filters.propertyMainType.slice(1))
  }
  
  // Bedrooms
  if (filters.beds && filters.beds.length > 0) {
    // Format beds to match the active filters display (e.g., "2 Beds, 3 Beds, 4 Beds")
    const formattedBeds = filters.beds.map(bed => {
      // If bed already contains "Bed" or "Studio", use as is
      if (bed.includes("Bed") || bed === "Studio") {
        return bed
      }
      return `${bed} ${bed === "1" ? "Bed" : "Beds"}`
    }).join(", ")
    
    summary.push(formattedBeds)
  }
  
  // Transaction Type - only add if it's not the default "For Sale"
  if (filters.transactionType && filters.transactionType !== "For Sale") {
    summary.push(filters.transactionType)
  }
  
  // Bathrooms
  if (filters.bathrooms && filters.bathrooms.length > 0) {
    const formattedBaths = filters.bathrooms.map(bath => `${bath} ${bath === "1" ? "Bath" : "Baths"}`).join(", ")
    summary.push(formattedBaths)
  }
  
  // Districts
  if (filters.districts && filters.districts.length > 0) {
    summary.push(filters.districts.join(", "))
  }
  
  // Add any other non-default filters
  if (filters.tenure) {
    summary.push(filters.tenure)
  }
  
  if (filters.floorLevel) {
    summary.push(filters.floorLevel)
  }
  
  if (filters.distanceToMRT && filters.distanceToMRT !== "any") {
    summary.push(filters.distanceToMRT)
  }
  
  if (filters.furnishing) {
    summary.push(filters.furnishing)
  }
  
  if (filters.keyword) {
    summary.push(filters.keyword)
  }
  
  return summary
}