"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FolderOpen, MapPin } from "lucide-react"
import { mockCollectionsData } from "@/lib/mock-data" // Import mock data

interface Collection {
  id: string
  name: string
  itemCount: number
  updatedDate: string
  thumbnail?: string | null
}

interface SaveToCollectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedCollectionIds: string[], newCollectionName: string) => void
  itemType: "building" | "property" | null
  itemData: any | null // Can be Building or Property data
}

export function SaveToCollectionDialog({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemData,
}: SaveToCollectionDialogProps) {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [newCollectionName, setNewCollectionName] = useState("")

  const mockCollections: Collection[] = mockCollectionsData // Use imported mock data

  const handleCheckboxChange = (collectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedCollections((prev) => [...prev, collectionId])
    } else {
      setSelectedCollections((prev) => prev.filter((id) => id !== collectionId))
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedCollections, newCollectionName)
    setSelectedCollections([])
    setNewCollectionName("")
  }

  if (!isOpen || !itemData) return null

  const isBuilding = itemType === "building"
  const titleText = isBuilding
    ? `Save "${itemData.name}" project to collections`
    : `Save "${itemData.title}" to collections`
  const descriptionText = isBuilding
    ? `This will save all ${itemData.associatedListings?.length || 0} listings from this project`
    : `This will save this particular listing`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-semibold text-brand-text-dark">Save to Collection</DialogTitle>{" "}
          {/* Updated color */}
          <DialogDescription className="text-brand-text-dark/70">{titleText}</DialogDescription> {/* Updated color */}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isBuilding && (
            <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4 bg-brand-accent-blue-25">
              {" "}
              {/* Updated color */}
              {itemData.mainImage ? (
                <img
                  src={itemData.mainImage || "/placeholder.svg"}
                  alt={itemData.name}
                  className="w-20 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-20 h-16 bg-brand-background-light rounded-md flex items-center justify-center">
                  {" "}
                  {/* Updated color */}
                  <FolderOpen className="w-8 h-8 text-brand-text-dark/50" /> {/* Updated color */}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-brand-text-dark">{itemData.name}</h3> {/* Updated color */}
                <p className="text-sm text-brand-text-dark/70 flex items-center">
                  {" "}
                  {/* Updated color */}
                  <MapPin className="w-3 h-3 mr-1" /> {itemData.address}
                </p>
                <p className="text-sm text-brand-text-dark/70">{itemData.priceRange}</p> {/* Updated color */}
                <p className="text-sm text-brand-primary-dark mt-1">{descriptionText}</p> {/* Updated color */}
              </div>
            </div>
          )}
          {!isBuilding && (
            <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4 bg-brand-accent-blue-25">
              {" "}
              {/* Updated color */}
              {itemData.image ? (
                <img
                  src={itemData.image || "/placeholder.svg"}
                  alt={itemData.title}
                  className="w-20 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-20 h-16 bg-brand-background-light rounded-md flex items-center justify-center">
                  {" "}
                  {/* Updated color */}
                  <FolderOpen className="w-8 h-8 text-brand-text-dark/50" /> {/* Updated color */}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-brand-text-dark">{itemData.title}</h3> {/* Updated color */}
                <p className="text-sm text-brand-text-dark/70 flex items-center">
                  {" "}
                  {/* Updated color */}
                  <MapPin className="w-3 h-3 mr-1" /> {itemData.address}
                </p>
                <p className="text-sm text-brand-text-dark/70">{itemData.price}</p> {/* Updated color */}
                <p className="text-sm text-brand-primary-dark mt-1">{descriptionText}</p> {/* Updated color */}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-brand-text-dark mb-3">Your Collections</h3> {/* Updated color */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {" "}
              {mockCollections.map((collection) => (
                <div key={collection.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`collection-${collection.id}`}
                    checked={selectedCollections.includes(collection.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(collection.id, checked as boolean)}
                  />
                  <label htmlFor={`collection-${collection.id}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      {collection.thumbnail ? (
                        <img
                          src={collection.thumbnail || "/placeholder.svg"}
                          alt={collection.name}
                          className="w-10 h-8 object-cover rounded-sm"
                        />
                      ) : (
                        <div className="w-10 h-8 bg-brand-background-light rounded-sm flex items-center justify-center">
                          {" "}
                          {/* Updated color */}
                          <FolderOpen className="w-4 h-4 text-brand-text-dark/50" /> {/* Updated color */}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-brand-text-dark">{collection.name}</div> {/* Updated color */}
                        <div className="text-xs text-brand-text-dark/70">{collection.itemCount} property</div>{" "}
                        {/* Updated color */}
                        <div className="text-xs text-brand-text-dark/50">Updated {collection.updatedDate}</div>{" "}
                        {/* Updated color */}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-brand-text-dark mb-3">Create New Collection</h3> {/* Updated color */}
            <Input
              placeholder="New collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="border-brand-text-dark/20" // Updated color
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
          >
            {" "}
            {/* Updated colors */}
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedCollections.length === 0 && !newCollectionName.trim()}
            className="bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
          >
            {" "}
            {/* Updated colors */}
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
