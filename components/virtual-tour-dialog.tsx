"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VirtualTourDialogProps {
  isOpen: boolean
  onClose: () => void
  virtualTourHtml: string
  propertyTitle: string
}

export function VirtualTourDialog({ isOpen, onClose, virtualTourHtml, propertyTitle }: VirtualTourDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[65vh] p-0">
        <DialogHeader className="justify-center items-center border-b">
          <DialogTitle className="text-lg font-semibold text-brand-text-dark">
            Virtual Tour - {propertyTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div 
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: virtualTourHtml }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 