"use client"

import { useState } from "react"
import { Plus, FolderOpen } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CollectionCard } from "@/components/collection-card" // Ensure this import is correct
import { EditCollectionDialog } from "@/components/edit-collection-dialog"
import { DeleteCollectionDialog } from "@/components/delete-collection-dialog"

interface Collection {
  id: string
  name: string
  itemCount: number
  createdDate: string
  updatedDate: string
  thumbnail: string | null
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "Multi-Project 2",
      itemCount: 4,
      createdDate: "25/07/2025",
      updatedDate: "25/07/2025",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      name: "Multi-Project",
      itemCount: 1,
      createdDate: "24/07/2025",
      updatedDate: "25/07/2025",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      name: "Amber Park",
      itemCount: 0,
      createdDate: "24/07/2025",
      updatedDate: "25/07/2025",
      thumbnail: null,
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedCollectionForEdit, setSelectedCollectionForEdit] = useState<Collection | null>(null)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCollectionForDelete, setSelectedCollectionForDelete] = useState<Collection | null>(null)

  const createCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(), // Use string for ID
        name: newCollectionName,
        itemCount: 0,
        createdDate: new Date().toLocaleDateString("en-GB"),
        updatedDate: new Date().toLocaleDateString("en-GB"),
        thumbnail: null,
      }
      setCollections([...collections, newCollection])
      setNewCollectionName("")
      setShowCreateModal(false)
    }
  }

  const handleEditCollectionClick = (collection: Collection) => {
    setSelectedCollectionForEdit(collection)
    setShowEditDialog(true)
  }

  const handleEditConfirm = (id: string, newName: string) => {
    setCollections(
      collections.map((col) =>
        col.id === id ? { ...col, name: newName, updatedDate: new Date().toLocaleDateString("en-GB") } : col,
      ),
    )
    setSelectedCollectionForEdit(null)
  }

  const handleDeleteCollectionClick = (collection: Collection) => {
    setSelectedCollectionForDelete(collection)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = (id: string) => {
    setCollections(collections.filter((col) => col.id !== id))
    setSelectedCollectionForDelete(null)
  }

  return (
    <div className="min-h-screen bg-brand-background-light">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark">Collections</h1>
            <p className="text-brand-text-dark/70 mt-1">Organize your saved properties into collections</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Collection
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={handleEditCollectionClick}
              onDelete={handleDeleteCollectionClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {collections.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-brand-text-dark/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-text-dark mb-2">No collections yet</h3>
            <p className="text-brand-text-dark/70 mb-4">
              Create your first collection to organize your saved properties
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </div>
        )}
      </div>
      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-brand-background-light rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-brand-text-dark mb-4">Create New Collection</h2>
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="mb-4 border-brand-text-dark/20"
              onKeyPress={(e) => e.key === "Enter" && createCollection()}
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
                onClick={() => {
                  setShowCreateModal(false)
                  setNewCollectionName("")
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white"
                onClick={createCollection}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Collection Dialog */}
      <EditCollectionDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onConfirm={handleEditConfirm}
        collectionId={selectedCollectionForEdit?.id || null}
        currentName={selectedCollectionForEdit?.name || null}
      />

      {/* Delete Collection Dialog */}
      <DeleteCollectionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        collectionId={selectedCollectionForDelete?.id || null}
        collectionName={selectedCollectionForDelete?.name || null}
      />
    </div>
  )
}
