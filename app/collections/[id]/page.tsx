"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CollectionPropertiesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const collectionId = params.id

  // In a real application, you would fetch properties for this collectionId
  // For now, we'll use a placeholder.
  const collectionName = `Collection ${collectionId}` // Mock name

  return (
    <div className="min-h-screen bg-brand-background-light flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="w-4 h-4 text-brand-text-dark/70" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark">Properties in {collectionName}</h1>
            <p className="text-brand-text-dark/70 mt-1">View and manage items in this collection</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-brand-text-dark/70">
          <p className="text-lg">This page will display the properties saved in "{collectionName}".</p>
          <p className="text-sm mt-2">(Collection ID: {collectionId}) - Content coming soon!</p>
        </div>
      </div>
    </div>
  )
}
