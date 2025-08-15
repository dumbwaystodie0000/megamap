"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockFolders, mockSavedSearches } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Bell } from "lucide-react"
import { SavedSearch } from "@/lib/types"
import { generateDefaultSearchName } from "@/lib/saved-search-utils"

interface SaveSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  searchParams: URLSearchParams
  onSave: (savedSearch: Omit<SavedSearch, "id" | "createdAt">) => void
}

export function SaveSearchDialog({
  open,
  onOpenChange,
  searchParams,
  onSave,
}: SaveSearchDialogProps) {
  const [folders] = useState(mockFolders)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [searchName, setSearchName] = useState("")
  const [searchNameError, setSearchNameError] = useState<string | null>(null)
  const defaultFolder = "My Saved Searches"
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder)
  const [defaultName, setDefaultName] = useState(() => generateDefaultSearchName(mockSavedSearches, defaultFolder))
  const [receiveAlerts, setReceiveAlerts] = useState(true)
  const [alertFrequency, setAlertFrequency] = useState<"Daily" | "Weekly" | "Instant">("Instant")
  const [newFolderError, setNewFolderError] = useState<string | null>(null)

  // Generate a summary of current filters for display
  const generateSearchSummary = () => {
    const summary: string[] = []

    // Price Range
    const minPrice = searchParams.get("minPrice") || "0"
    const maxPrice = searchParams.get("maxPrice") || "No Limit"
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

    // Property Types
    const propertyMainType = searchParams.get("propertyMainType")
    const propertySubTypes = searchParams.get("propertySubTypes")?.split(",").filter(Boolean) || []
    
    if (propertySubTypes.length > 0) {
      summary.push(propertySubTypes.join(", "))
    } else if (propertyMainType && propertyMainType !== "all") {
      summary.push(propertyMainType === "hdb" ? "HDB" : propertyMainType.charAt(0).toUpperCase() + propertyMainType.slice(1))
    }
    
    // Bedrooms
    const beds = searchParams.get("beds")?.split(",").filter(Boolean) || []
    if (beds.length > 0) {
      // Format beds to match the active filters display (e.g., "2 Beds, 3 Beds, 4 Beds")
      const formattedBeds = beds.map(bed => {
        // If bed already contains "Bed" or "Studio", use as is
        if (bed.includes("Bed") || bed === "Studio") {
          return bed
        }
        return `${bed} ${bed === "1" ? "Bed" : "Beds"}`
      }).join(", ")
      
      summary.push(formattedBeds)
    }
    
    // Transaction Type - only add if it's not the default "For Sale"
    const transactionType = searchParams.get("transactionType")
    if (transactionType && transactionType !== "For Sale") {
      summary.push(transactionType)
    }
    
    // Bathrooms
    const bathrooms = searchParams.get("bathrooms")?.split(",").filter(Boolean) || []
    if (bathrooms.length > 0) {
      const formattedBaths = bathrooms.map(bath => `${bath} ${bath === "1" ? "Bath" : "Baths"}`).join(", ")
      summary.push(formattedBaths)
    }
    
    // Districts
    const districts = searchParams.get("districts")?.split(",").filter(Boolean) || []
    if (districts.length > 0) {
      summary.push(districts.join(", "))
    }
    
    // Add any other non-default filters
    const tenure = searchParams.get("tenure")
    if (tenure) {
      summary.push(tenure)
    }
    
    const floorLevel = searchParams.get("floorLevel")
    if (floorLevel) {
      summary.push(floorLevel)
    }
    
    const distanceToMRT = searchParams.get("distanceToMRT")
    if (distanceToMRT && distanceToMRT !== "any") {
      summary.push(distanceToMRT)
    }
    
    const furnishing = searchParams.get("furnishing")
    if (furnishing) {
      summary.push(furnishing)
    }
    
    const keyword = searchParams.get("keyword")
    if (keyword) {
      summary.push(keyword)
    }

    return summary
  }

  const searchSummary = generateSearchSummary()

  // Extract all filter parameters from searchParams
  const extractFilters = () => {
    const filters: SavedSearch["filters"] = {}
    
    // Add all relevant search parameters to filters
    searchParams.forEach((value, key) => {
      if (value) {
        switch (key) {
          case "beds":
          case "propertySubTypes":
          case "leaseTerm":
          case "bathrooms":
          case "districts":
            filters[key as keyof SavedSearch["filters"]] = value.split(",").filter(Boolean)
            break;
          default:
            // Only add known filter keys
            if (isValidFilterKey(key)) {
              filters[key as keyof SavedSearch["filters"]] = value
            }
        }
      }
    })

    return filters
  }
  
  // With the index signature in the SavedSearch type, we can accept any string key
  // But we'll still validate to avoid adding irrelevant URL parameters
  const isValidFilterKey = (key: string): boolean => {
    // Skip internal Next.js URL parameters and other non-filter keys
    const invalidKeys = ["pathname", "trailingSlash", "locale"]
    return !invalidKeys.includes(key)
  }

  // Update default name when folder changes
  useEffect(() => {
    const folderToUse = selectedFolder || defaultFolder
    setDefaultName(generateDefaultSearchName(mockSavedSearches, folderToUse))
    // Clear any previous errors when folder changes
    setSearchNameError(null)
  }, [selectedFolder, defaultFolder])
  
  // Check for duplicate search name when user types
  useEffect(() => {
    if (searchName.trim()) {
      const folderToCheck = selectedFolder || defaultFolder
      const isDuplicate = mockSavedSearches.some(
        search => search.name.toLowerCase() === searchName.trim().toLowerCase() && 
                 search.folderId === folderToCheck
      )
      
      if (isDuplicate) {
        setSearchNameError(`"${searchName}" already exists in this folder`)
      } else {
        setSearchNameError(null)
      }
    } else {
      setSearchNameError(null) // Clear error if field is empty (will use default name)
    }
  }, [searchName, selectedFolder, mockSavedSearches, defaultFolder])
  
  const handleSave = () => {
    // Check for duplicate search name one more time before saving
    const nameToUse = searchName.trim() || defaultName
    const folderToUse = selectedFolder || defaultFolder
    const isDuplicateSearch = mockSavedSearches.some(
      search => search.name.toLowerCase() === nameToUse.toLowerCase() && 
               search.folderId === folderToUse
    )
    
    if (isDuplicateSearch) {
      setSearchNameError(`"${nameToUse}" already exists in this folder`)
      return // Prevent saving
    }
    
    // If using a new folder, check if it already exists
    if (showNewFolder && newFolderName.trim()) {
      const isDuplicateFolder = folders.some(
        folder => folder.name.toLowerCase() === newFolderName.trim().toLowerCase()
      )
      
      if (isDuplicateFolder) {
        setNewFolderError(`"${newFolderName}" folder already exists`)
        return // Prevent saving
      }
    }

    const savedSearch: Omit<SavedSearch, "id" | "createdAt"> = {
      name: nameToUse,
      folderId: showNewFolder ? newFolderName.trim() : (selectedFolder || defaultFolder),
      notificationType: receiveAlerts ? "Instant" : null,
      filters: extractFilters(),
      matchType: "AND" // Ensure all criteria must match (AND relationship)
    }

    onSave(savedSearch)
    onOpenChange(false)
  }

  const handleCreateFolder = () => {
    // Check if folder name already exists
    if (newFolderName.trim()) {
      const isDuplicateFolder = folders.some(
        folder => folder.name.toLowerCase() === newFolderName.trim().toLowerCase()
      )
      
      if (isDuplicateFolder) {
        setNewFolderError(`"${newFolderName}" folder already exists`)
        return // Prevent creation
      }
      
      // In a real app, you would add the new folder to the database
      // For now, we'll just reset the state and pretend it was created
      setShowNewFolder(false)
      setNewFolderName("")
      setNewFolderError(null)
      // In a real app, you would add the new folder to the list and select it
    } else {
      setNewFolderError("Folder name cannot be empty")
    }
  }
  
  // Check for duplicate folder name when user types
  useEffect(() => {
    if (newFolderName.trim()) {
      const isDuplicate = folders.some(
        folder => folder.name.toLowerCase() === newFolderName.trim().toLowerCase()
      )
      
      if (isDuplicate) {
        setNewFolderError(`"${newFolderName}" folder already exists`)
      } else {
        setNewFolderError(null)
      }
    } else {
      setNewFolderError(null) // Clear error if field is empty
    }
  }, [newFolderName, folders])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-brand-text-dark">Save Your Search</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-brand-text-dark/70 mb-4">
            Save your current search criteria to quickly access it later.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search-name" className="text-sm font-medium text-brand-text-dark mb-2 block">
                Name Your Saved Search
              </Label>
              <Input
                id="search-name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className={`border-brand-text-dark/20 ${searchNameError ? 'border-red-500' : ''}`}
                placeholder={defaultName}
                maxLength={60}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-brand-text-dark/50">
                  {searchName.length}/60 characters
                </div>
                {searchNameError && (
                  <div className="text-xs text-red-500 font-medium">
                    {searchNameError}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-brand-text-dark mb-2 flex justify-between">
                <span>Choose a Folder</span>
                <span className="text-sm font-normal text-brand-text-dark/70">(Optional)</span>
              </Label>
              {!showNewFolder ? (
                <div className="space-y-2">
                  <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                    <SelectTrigger className="border-brand-text-dark/20 text-brand-text-dark">
                      <SelectValue placeholder={defaultFolder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={defaultFolder}>
                        {defaultFolder}
                      </SelectItem>
                      {folders.filter(folder => folder.name !== defaultFolder).map((folder) => (
                        <SelectItem key={folder.name} value={folder.name}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-brand-text-dark/30 text-brand-text-dark hover:bg-brand-background-light"
                    onClick={() => setShowNewFolder(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Folder
                  </Button>
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <Label htmlFor="new-folder" className="text-sm font-medium text-brand-text-dark">
                    New Folder Name
                  </Label>
                  <Input
                    id="new-folder"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className={`mt-1 border-brand-text-dark/20 ${newFolderError ? 'border-red-500' : ''}`}
                    placeholder="e.g. Investment Properties"
                    autoFocus
                  />
                  {newFolderError && (
                    <div className="text-xs text-red-500 font-medium mt-1">
                      {newFolderError}
                    </div>
                  )}
                  <div className="flex space-x-2 mt-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                      onClick={() => {
                        setShowNewFolder(false);
                        setNewFolderError(null);
                        setNewFolderName("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim()}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-brand-text-dark mb-2">Search Summary</h3>
              <div className="space-y-2">
                {searchSummary.map((item, index) => (
                  <div key={index} className="flex items-center text-sm text-brand-text-dark">
                    <span className="w-3 h-3 mr-2 rounded-full bg-brand-accent-blue-25"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receive-alerts"
                  checked={receiveAlerts}
                  onCheckedChange={(checked) => setReceiveAlerts(checked as boolean)}
                />
                <Label htmlFor="receive-alerts" className="text-sm font-medium text-brand-text-dark cursor-pointer">
                  <Bell className="w-4 h-4 inline-block mr-1" />
                  Receive property alerts
                </Label>
              </div>

              <div className="mt-3 ml-6">
                <p className="text-xs text-brand-text-dark">
                  You will receive instant alerts when listings match <strong>all</strong> of your search criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between border-t pt-4">
          <Button
            variant="outline"
            className="bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-brand-accent-orange text-white hover:bg-brand-accent-orange/90"
            onClick={handleSave}
            disabled={!!searchNameError || (showNewFolder && !!newFolderError)}
          >
            Save Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}