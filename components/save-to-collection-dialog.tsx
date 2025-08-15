"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockCollectionsData } from "@/lib/mock-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Plus } from "lucide-react"
import Image from "next/image"

interface SaveToCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId?: string | number
  propertyName?: string
}

export function SaveToCollectionDialog({
  open,
  onOpenChange,
  propertyId,
  propertyName,
}: SaveToCollectionDialogProps) {
  const [collections] = useState(mockCollectionsData)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleSave = () => {
    // Here you would save the property to the selected collections
    // For now, just close the dialog
    onOpenChange(false)
  }

  const handleCreateCollection = () => {
    // Here you would create a new collection
    // For now, just reset the state
    setShowNewCollection(false)
    setNewCollectionName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-brand-text-dark">Save to Collection</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {propertyName && (
            <div className="mb-4 text-sm text-brand-text-dark/70">
              Save <span className="font-medium text-brand-text-dark">{propertyName}</span> to:
            </div>
          )}

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                  selectedCollections.includes(collection.id)
                    ? "border-brand-primary-dark bg-brand-accent-blue-25"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => handleCollectionToggle(collection.id)}
              >
                <div className="flex-shrink-0 mr-3">
                  {collection.thumbnail ? (
                    <Image
                      src={collection.thumbnail}
                      alt={collection.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[60px] h-[60px] bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-brand-text-dark">{collection.name}</h4>
                  <p className="text-sm text-brand-text-dark/70">
                    {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"} • Updated{" "}
                    {collection.updatedDate}
                  </p>
                </div>
                <div className="ml-3">
                  {selectedCollections.includes(collection.id) ? (
                    <div className="w-6 h-6 rounded-full bg-brand-primary-dark flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!showNewCollection ? (
            <Button
              variant="outline"
              className="mt-4 w-full border-dashed border-brand-text-dark/30 text-brand-text-dark hover:bg-brand-background-light"
              onClick={() => setShowNewCollection(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Collection
            </Button>
          ) : (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <Label htmlFor="new-collection" className="text-sm font-medium text-brand-text-dark">
                New Collection Name
              </Label>
              <Input
                id="new-collection"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="mt-1 border-brand-text-dark/20"
                placeholder="e.g. Dream Homes"
                autoFocus
              />
              <div className="flex space-x-2 mt-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                  onClick={() => setShowNewCollection(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          )}
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
            disabled={selectedCollections.length === 0}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}