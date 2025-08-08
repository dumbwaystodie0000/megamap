import type React from "react"
import { forwardRef } from "react"
import {
  Bed,
  Bath,
  Square,
  Calendar,
  Home,
  DollarSign,
  User,
  Star,
  Building,
  Car,
  Wifi,
  Dumbbell,
  Utensils,
  ShoppingBag,
  School,
  Train,
  Phone,
} from "lucide-react"
import { mockReportNearbySchools, mockReportTransport } from "@/lib/mock-data" // Import mock data

interface PrintablePropertyReportProps {
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
  }
}

export const PrintablePropertyReport = forwardRef<HTMLDivElement, PrintablePropertyReportProps>(
  ({ propertyData }, ref) => {
    // Map string icon names to Lucide React components
    const amenityIcons: { [key: string]: React.ElementType } = {
      Car,
      Wifi,
      Dumbbell,
      Utensils,
      ShoppingBag,
    }

    return (
      <div ref={ref} className="report-container p-8 bg-white text-brand-text-dark">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-primary-dark rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="font-semibold text-lg text-brand-text-dark">PROPERTY LIMBROTHERS</span>
          </div>
          <span className="text-brand-primary-dark font-bold">PLB</span>
        </div>

        <div className="text-center mb-8">
          <span className="px-3 py-1 text-sm font-medium bg-brand-accent-orange text-brand-text-dark rounded-full">
            FEATURED PROPERTY
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-brand-text-dark">{propertyData.title}</h1>
        <p className="text-lg text-brand-text-dark/70 mb-4">{propertyData.address}</p>
        <p className="text-4xl font-bold text-brand-primary-dark mb-6">{propertyData.price}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
          <div className="p-4 border rounded-lg flex flex-col items-center">
            <Bed className="w-8 h-8 text-brand-primary-dark mb-2" />
            <span className="font-semibold text-brand-text-dark">{propertyData.beds}</span>
            <span className="text-sm text-brand-text-dark/70">BEDROOMS</span>
          </div>
          <div className="p-4 border rounded-lg flex flex-col items-center">
            <Bath className="w-8 h-8 text-brand-primary-dark mb-2" />
            <span className="font-semibold text-brand-text-dark">{propertyData.baths}</span>
            <span className="text-sm text-brand-text-dark/70">BATHROOMS</span>
          </div>
          <div className="p-4 border rounded-lg flex flex-col items-center">
            <Square className="w-8 h-8 text-brand-primary-dark mb-2" />
            <span className="font-semibold text-brand-text-dark">{propertyData.size}</span>
            <span className="text-sm text-brand-text-dark/70">SQ FT</span>
          </div>
          <div className="p-4 border rounded-lg flex flex-col items-center">
            <DollarSign className="w-8 h-8 text-brand-primary-dark mb-2" />
            <span className="font-semibold text-brand-text-dark">
              $
              {(
                Number.parseFloat(propertyData.price.replace(/[^0-9.]/g, "")) /
                Number.parseFloat(propertyData.size.replace(/[^0-9.]/g, ""))
              ).toFixed(0)}
            </span>
            <span className="text-sm text-brand-text-dark/70">PSF</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-brand-text-dark">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 mr-2 text-brand-text-dark/50" />
            <span>Type: {propertyData.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4 mr-2 text-brand-text-dark/50" />
            <span>Tenure: {propertyData.tenure}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 mr-2 text-brand-text-dark/50" />
            <span>Built: {propertyData.year}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-brand-text-dark">Property Gallery</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {propertyData.images.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img || "/placeholder.svg"}
              alt={`Property image ${index + 1}`}
              className="w-full h-48 object-cover rounded-md"
            />
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 text-brand-text-dark">Prime Location Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-brand-text-dark">
              <School className="w-5 h-5 text-brand-primary-dark" />
              <span>Schools</span>
            </h3>
            <div className="space-y-2">
              {mockReportNearbySchools.map((school, index) => (
                <div key={index} className="flex justify-between text-sm text-brand-text-dark">
                  <span>{school.split(" (")[0]}</span>
                  <span>{school.split(" (")[1]?.replace(")", "")}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-brand-text-dark">
              <Train className="w-5 h-5 text-brand-primary-dark" />
              <span>Transportation</span>
            </h3>
            <div className="space-y-2">
              {mockReportTransport.map((transport, index) => (
                <div key={index} className="flex justify-between text-sm text-brand-text-dark">
                  <span>{transport.split(" - ")[0]}</span>
                  <span>{transport.split(" - ")[1]}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-brand-text-dark">
              <ShoppingBag className="w-5 h-5 text-brand-primary-dark" />
              <span>Shopping & Dining</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-brand-text-dark">
                <span>Sheng Siong Supermarket</span>
                <span>0.18 km</span>
              </div>
              <div className="flex justify-between text-sm text-brand-text-dark">
                <span>Fairprice Finest</span>
                <span>0.47 km</span>
              </div>
              <div className="flex justify-between text-sm text-brand-text-dark">
                <span>Cold Storage</span>
                <span>0.78 km</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-brand-text-dark">
              <Car className="w-5 h-5 text-brand-primary-dark" />
              <span>Public Transport</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-brand-text-dark">
                <span>Punggol Central</span>
                <span>0.05 km</span>
              </div>
              <div className="flex justify-between text-sm text-brand-text-dark">
                <span>Punggol Point</span>
                <span>0.23 km</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-brand-text-dark">About This Property</h2>
        <p className="text-base text-brand-text-dark/70 leading-relaxed mb-8">{propertyData.description}</p>

        <h2 className="text-xl font-bold mb-4 text-brand-text-dark">Agent Information</h2>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-background-light flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-brand-text-dark/50" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-brand-text-dark">{propertyData.agent.name}</h3>
            <p className="text-base text-brand-text-dark/70">{propertyData.agent.agencyName}</p>
            <p className="text-sm text-brand-text-dark/70">Associate Marketing Director</p>
            <div className="flex items-center text-sm text-brand-text-dark/50 mt-1">
              <Phone className="w-4 h-4 text-brand-accent-orange" />
              <span>
                {propertyData.agent.phone}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-brand-text-dark/70 mb-4">
          <span>Registration: R123456789</span>
          <div className="flex space-x-2">
            <img src="/placeholder.svg?height=64&width=64" alt="QR Code 1" className="w-16 h-16" />
            <img src="/placeholder.svg?height=64&width=64" alt="QR Code 2" className="w-16 h-16" />
          </div>
        </div>
      </div>
    )
  },
)

PrintablePropertyReport.displayName = "PrintablePropertyReport"
