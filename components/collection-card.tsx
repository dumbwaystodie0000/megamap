"use client"
import { MoreHorizontal, Edit, FolderOpen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link" // Import Link

interface Collection {
  id: string
  name: string
  itemCount: number
  createdDate: string
  updatedDate: string
  thumbnail: string | null
}

interface CollectionCardProps {
  collection: Collection
  onEdit: (collection: Collection) => void
  onDelete: (collection: Collection) => void
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-brand-background-light flex-shrink-0 overflow-hidden">
        {collection.thumbnail ? (
          <img
            src={collection.thumbnail || "/placeholder.svg"}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center group-hover:bg-brand-background-light/80 transition-all duration-200">
            <FolderOpen className="w-16 h-16 text-brand-text-dark/50 group-hover:text-brand-text-dark/70 group-hover:scale-110 transition-all duration-200" />
          </div>
        )}
        {/* Item Count Badge */}
        <div className="absolute top-3 left-3 bg-brand-primary-dark text-white px-2 py-1 rounded text-sm font-medium group-hover:bg-brand-primary-dark/90 transition-all duration-200">
          {collection.itemCount} Items
        </div>
        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white text-brand-text-dark/70 hover:text-brand-primary-dark transition-all duration-200 rounded-full">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer hover:bg-brand-accent-blue-25 transition-colors duration-200" onClick={() => onEdit(collection)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Collection Name
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10 transition-colors duration-200" onClick={() => onDelete(collection)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-brand-text-dark mb-2 group-hover:text-brand-primary-dark transition-colors duration-200">{collection.name}</h3>
        <div className="text-sm text-brand-text-dark/70 mb-4 flex-grow group-hover:text-brand-text-dark/80 transition-colors duration-200">
          <div>Created {collection.createdDate}</div>
          <div>Updated {collection.updatedDate}</div>
        </div>
        <Link href={`/collections/${collection.id}`} passHref>
          <Button
            variant="outline"
            className="w-full bg-transparent border-brand-primary-dark text-brand-primary-dark hover:bg-brand-accent-blue-25 hover:border-brand-primary-dark/80 hover:text-brand-primary-dark/90 transition-all duration-200 group-hover:shadow-md"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            View Properties
          </Button>
        </Link>
      </div>
    </div>
  )
}
