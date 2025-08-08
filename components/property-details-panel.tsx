"use client"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  Heart,
  Bed,
  Bath,
  Square,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Share2,
  CheckCircle,
  MapPin,
  DollarSign,
  Ruler,
  User,
  Briefcase,
  Star,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PrintablePropertyReport } from "./printable-property-report"
import { VirtualTourDialog } from "./virtual-tour-dialog"
import { FloorPlanDialog } from "./floor-plan-dialog"

interface PropertyDetailsPanelProps {
  propertyData: {
    id: string
    price: string
    title: string
    address: string
    beds: number
    baths: number
    size: string
    type: string
    tenure: string
    year: string
    status: "ACTIVE" | "SOLD"
    agency: "PLB" | "OTHER"
    description: string
    features: string[]
    images: string[]
    agent: {
      name: string
      phone: string
      email: string
      agencyName: string
    }
    floorPlan: string
    virtualTour: string
    additionalDetails?: string[]
  }
  onClose: () => void
  onSaveToCollection: (itemType: "property", itemData: any) => void // New prop
}

export function PropertyDetailsPanel({ propertyData, onClose, onSaveToCollection }: PropertyDetailsPanelProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [showFloorPlan, setShowFloorPlan] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)



  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length)
  }

  const isPLB = propertyData.agency === "PLB"

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        const content = printRef.current.innerHTML
        printWindow.document.write(`
          <html>
            <head>
              <title>${propertyData.title} Report</title>
              <style>
                /* Basic print styles */
                body { font-family: sans-serif; margin: 20px; }
                @page { size: A4; margin: 20mm; }
                .report-container { width: 100%; max-width: 210mm; margin: 0 auto; }
                img { max-width: 100%; height: auto; display: block; margin-bottom: 10px; }
                h1, h2, h3, h4 { margin-top: 1em; margin-bottom: 0.5em; }
                p { margin-bottom: 0.5em; }
                .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                .flex { display: flex; align-items: center; }
                .space-x-2 > *:not(:first-child) { margin-left: 0.5rem; }
                .space-y-2 > *:not(:first-child) { margin-top: 0.5rem; }
                .space-y-3 > *:not(:first-child) { margin-top: 0.75rem; }
                .space-y-4 > *:not(:first-child) { margin-top: 1rem; }
                .space-x-4 > *:not(:first-child) { margin-left: 1rem; }
                .space-x-2 > *:not(:first-child) { margin-left: 0.5rem; }
                .leading-relaxed { line-height: 1.625; }
                .list-disc { list-style-type: disc; }
                .list-inside { list-style-position: inside; }
                .badge { display: inline-block; padding: 0.25em 0.5em; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
                .text-brand-primary-dark { color: #123B79; } /* Updated */
                .text-brand-text-dark { color: #323433; } /* Updated */
                .text-brand-text-dark\/70 { color: rgba(50, 52, 51, 0.7); } /* Updated */
                .text-brand-text-dark\/50 { color: rgba(50, 52, 51, 0.5); } /* Updated */
                .text-sm { font-size: 0.875rem; }
                .text-xs { font-size: 0.75rem; }
                .font-semibold { font-weight: 600; }
                .font-bold { font-weight: 700; }
                .border-b { border-bottom: 1px solid #e5e7eb; }
                .pb-4 { padding-bottom: 1rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mt-4 { margin-top: 1rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .w-4 { width: 1rem; }
                .h-4 { height: 1rem; }
                .mr-2 { margin-right: 0.5rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .text-center { text-align: center; }
                .rounded-full { border-radius: 9999px; }
                .bg-brand-background-light { background-color: #F3F2F1; } /* Updated */
                .bg-brand-primary-dark { background-color: #123B79; } /* Updated */
                .text-white { color: #fff; }
                .text-brand-accent-orange { color: #F0A939; } /* Updated */
                .text-brand-accent-green { color: #92CDBB; } /* Updated */
                .w-16 { width: 4rem; }
                .h-16 { height: 4rem; }
                .w-8 { width: 2rem; }
                .h-8 { height: 2rem; }
                .w-full { width: 100%; }
                .object-cover { object-fit: cover; }
                .rounded-md { border-radius: 0.375rem; }
                .rounded-lg { border-radius: 0.5rem; }
                .p-4 { padding: 1rem; }
                .p-2 { padding: 0.5rem; }
                .gap-2 { gap: 0.5rem; }
                .gap-3 { gap: 0.75rem; }
                .gap-4 { gap: 1rem; }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  const handleSaveClick = () => {
    onSaveToCollection("property", propertyData)
  }

  return (
    <div className="h-full bg-white flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <ArrowLeft className="w-4 h-4 text-brand-text-dark/70" /> {/* Updated color */}
          </Button>
          <div>
            <h2 className="text-base font-semibold text-brand-text-dark">{propertyData.title}</h2> {/* Updated color */}
            <p className="text-xs text-brand-text-dark/70">{propertyData.address}</p> {/* Updated color */}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 className="w-3 h-3 text-brand-text-dark/70 hover:text-brand-primary-dark" />{" "}
                {/* Updated colors */}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="text-brand-text-dark">Printable Property Report Preview</DialogTitle>{" "}
                {/* Updated color */}
              </DialogHeader>
              <div className="flex-1 overflow-y-auto p-4">
                <PrintablePropertyReport ref={printRef} propertyData={propertyData} />
              </div>
              <div className="p-4 border-t flex justify-end">
                <Button
                  onClick={handlePrint}
                  className="bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white"
                >
                  Print Report
                </Button>{" "}
                {/* Updated colors */}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSaveClick}>
            <Heart className="w-3 h-3 text-brand-text-dark/70 hover:text-brand-accent-orange" /> {/* Updated colors */}
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <img
          src={propertyData.images[currentImageIndex] || "/placeholder.svg"}
          alt={`${propertyData.title} photo ${currentImageIndex + 1}`}
          className="w-full h-48 object-cover"
        />

        {propertyData.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/30 hover:text-white text-white h-6 w-6 p-0 rounded-full"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/30 hover:text-white text-white h-6 w-6 p-0 rounded-full"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
              {currentImageIndex + 1} / {propertyData.images.length}
            </div>
          </>
        )}

        <div className="absolute top-2 left-2 flex space-x-1">
          <Badge
            variant={propertyData.status === "ACTIVE" ? "default" : "secondary"}
            className={`text-xs ${propertyData.status === "ACTIVE" ? "bg-brand-accent-green text-white" : "bg-brand-text-dark/70 text-white"}`}
          >
            {" "}
            {/* Updated colors */}
            {propertyData.status}
          </Badge>
          {isPLB && <Badge className="text-xs bg-brand-primary-dark text-white">{propertyData.agency}</Badge>}{" "}
          {/* Updated colors */}
        </div>
      </div>

      {/* Price and Basic Info */}
      <div className={`p-3 ${isPLB ? "bg-brand-accent-blue-25" : ""}`}>
        {" "}
        {/* Updated color */}
        <div className="text-xl font-bold text-brand-text-dark mb-2">{propertyData.price}</div> {/* Updated color */}
        <div className="grid grid-cols-3 gap-2 text-xs text-brand-text-dark/70">
          {" "}
          {/* Updated color */}
          <div className="flex items-center">
            <Bed className="w-3 h-3 mr-1" />
            {propertyData.beds} beds
          </div>
          <div className="flex items-center">
            <Bath className="w-3 h-3 mr-1" />
            {propertyData.baths} baths
          </div>
          <div className="flex items-center">
            <Square className="w-3 h-3 mr-1" />
            {propertyData.size}
          </div>
        </div>
      </div>

      {/* Combined Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Property Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-brand-text-dark mb-2">Property Overview</h3> {/* Updated color */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center">
              <Building className="w-3 h-3 mr-1 text-brand-text-dark/50" /> {/* Updated color */}
              <span>Type: {propertyData.type}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-brand-text-dark/50" /> {/* Updated color */}
              <span>TOP: {propertyData.year}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-3 h-3 mr-1 text-brand-text-dark/50" /> {/* Updated color */}
              <span>Tenure: {propertyData.tenure}</span>
            </div>
            <div className="flex items-center">
              <Ruler className="w-3 h-3 mr-1 text-brand-text-dark/50" /> {/* Updated color */}
              <span>Built-up: {propertyData.size}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-brand-text-dark/50" /> {/* Updated color */}
              <span>District: D15 (East Coast)</span>
            </div>
            <div className="flex items-center">
              <Bed className="w-3 h-3 mr-1 text-brand-text-dark/50" /> {/* Updated color */}
              <span>Bedrooms: {propertyData.beds}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-3 h-3 mr-1 text-brand-text-dark/50" /> {/* Updated color */}
              <span>Bathrooms: {propertyData.baths}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-brand-text-dark">Description</h3> {/* Updated color */}
          <p className="text-xs text-brand-text-dark/70 leading-relaxed">{propertyData.description}</p>{" "}
          {/* Updated color */}
        </div>

        {/* Floor Plan & Virtual Tour */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-brand-text-dark">Media</h3> {/* Updated color */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`text-xs ${
                propertyData.floorPlan
                  ? "bg-transparent border-brand-primary-dark text-brand-primary-dark hover:bg-brand-accent-blue-25 cursor-pointer"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => propertyData.floorPlan && setShowFloorPlan(true)}
              disabled={!propertyData.floorPlan}
            >
              {" "}
              {/* Updated colors */}
              View Floor Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-xs ${
                propertyData.virtualTour
                  ? "bg-transparent border-brand-primary-dark text-brand-primary-dark hover:bg-brand-accent-blue-25 cursor-pointer"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => propertyData.virtualTour && setShowVirtualTour(true)}
              disabled={!propertyData.virtualTour}
            >
              {" "}
              {/* Updated colors */}
              Virtual Tour
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-brand-text-dark mb-2">Key Features</h3> {/* Updated color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {propertyData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs text-brand-text-dark/70">
                {" "}
                {/* Updated color */}
                <CheckCircle className="w-3 h-3 text-brand-accent-green" /> {/* Updated color */}
                <span>{feature}</span>
              </div>
            ))}
          </div>
          {propertyData.additionalDetails && propertyData.additionalDetails.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-brand-text-dark">Additional Details</h3> {/* Updated color */}
              <ul className="list-disc list-inside text-xs text-brand-text-dark/70 space-y-1">
                {" "}
                {/* Updated color */}
                {propertyData.additionalDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Agent Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-brand-text-dark mb-2">Agent Information</h3> {/* Updated color */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-brand-background-light flex items-center justify-center">
              {" "}
              {/* Updated color */}
              <User className="w-8 h-8 text-brand-text-dark/50" /> {/* Updated color */}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-brand-text-dark">{propertyData.agent.name}</h3>{" "}
              {/* Updated color */}
              <p className="text-sm text-brand-text-dark/70">{propertyData.agent.agencyName}</p> {/* Updated color */}
              <p className="text-sm text-brand-text-dark/70">Associate Marketing Director</p> {/* Updated color */}
            </div>
          </div>
          <div className="space-y-2">
            <Button
              size="sm"
              className="w-full bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white text-xs"
            >
              {" "}
              {/* Updated colors */}
              <Phone className="w-3 h-3 mr-1" />
              Call {propertyData.agent.phone}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs bg-transparent border-brand-primary-dark text-brand-primary-dark hover:bg-brand-accent-blue-25"
            >
              {" "}
              {/* Updated colors */}
              <Mail className="w-3 h-3 mr-1" />
              Send Email to {propertyData.agent.email}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Virtual Tour Dialog */}
      {propertyData.virtualTour && (
        <VirtualTourDialog
          isOpen={showVirtualTour}
          onClose={() => setShowVirtualTour(false)}
          virtualTourHtml={propertyData.virtualTour}
          propertyTitle={propertyData.title}
        />
      )}
      
      {/* Floor Plan Dialog */}
      {propertyData.floorPlan && (
        <FloorPlanDialog
          isOpen={showFloorPlan}
          onClose={() => setShowFloorPlan(false)}
          floorPlanUrl={propertyData.floorPlan}
          propertyTitle={propertyData.title}
        />
      )}
    </div>
  )
}
