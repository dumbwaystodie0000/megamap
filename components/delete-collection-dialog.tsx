"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteCollectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (collectionId: string) => void
  collectionId: string | null
  collectionName: string | null
}

export function DeleteCollectionDialog({
  isOpen,
  onClose,
  onConfirm,
  collectionId,
  collectionName,
}: DeleteCollectionDialogProps) {
  const handleConfirm = () => {
    if (collectionId) {
      onConfirm(collectionId)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-brand-text-dark">Delete Collection</DialogTitle>
          <DialogDescription className="text-brand-text-dark/70">
            Are you sure you want to delete the collection "
            <span className="font-semibold text-brand-text-dark">{collectionName}</span>"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-destructive text-white hover:bg-destructive/90">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
