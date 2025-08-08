"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FloorPlanDialogProps {
  isOpen: boolean
  onClose: () => void
  floorPlanUrl: string
  propertyTitle: string
}

export function FloorPlanDialog({ isOpen, onClose, floorPlanUrl, propertyTitle }: FloorPlanDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
        <DialogHeader className="justify-center items-center border-b">
          <DialogTitle className="text-lg font-semibold text-brand-text-dark">
            Floor Plan - {propertyTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-4 flex items-center justify-center overflow-auto">
          <div className="w-full h-full flex items-center justify-center min-h-0">
            <img 
              src={floorPlanUrl}
              alt={`Floor plan for ${propertyTitle}`}
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: 'calc(90vh - 120px)' }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 