"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditCollectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (collectionId: string, newName: string) => void
  collectionId: string | null
  currentName: string | null
}

export function EditCollectionDialog({
  isOpen,
  onClose,
  onConfirm,
  collectionId,
  currentName,
}: EditCollectionDialogProps) {
  const [newName, setNewName] = useState(currentName || "")

  useEffect(() => {
    setNewName(currentName || "")
  }, [currentName])

  const handleConfirm = () => {
    if (collectionId && newName.trim()) {
      onConfirm(collectionId, newName.trim())
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-brand-text-dark">Edit Collection Name</DialogTitle>
          <DialogDescription className="text-brand-text-dark/70">
            Enter a new name for your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="collection-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New collection name"
            className="col-span-3 border-brand-text-dark/20"
            onKeyPress={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!newName.trim() || newName.trim() === currentName}
            className="bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
