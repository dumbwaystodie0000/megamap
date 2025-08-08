"use client"

import { Bell, User } from "lucide-react"
import { usePathname } from "next/navigation" // Import usePathname

export function Header() {
  const pathname = usePathname() // Get current pathname

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand-primary-dark rounded-full flex items-center justify-center hover:bg-brand-primary-dark/90 transition-colors duration-200 cursor-pointer">
            {" "}
            {/* Updated color */}
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-semibold text-brand-text-dark hover:text-brand-primary-dark transition-colors duration-200 cursor-pointer">PROPERTY LIMBROTHERS</span> {/* Updated color */}
        </div>

        <nav className="flex items-center space-x-6">
          <a
            href="/"
            className={`font-medium pb-1 transition-all duration-200 hover:scale-105 ${
              pathname === "/"
                ? "text-brand-primary-dark border-b-2 border-brand-primary-dark"
                : "text-brand-text-dark hover:text-brand-primary-dark hover:border-b-2 hover:border-brand-primary-dark/50"
            }`}
          >
            Map Search
          </a>
          <a
            href="/transactions"
            className={`font-medium pb-1 transition-all duration-200 hover:scale-105 ${
              pathname === "/transactions"
                ? "text-brand-primary-dark border-b-2 border-brand-primary-dark"
                : "text-brand-text-dark hover:text-brand-primary-dark hover:border-b-2 hover:border-brand-primary-dark/50"
            }`}
          >
            Transactions
          </a>
          <a
            href="/collections"
            className={`font-medium pb-1 transition-all duration-200 hover:scale-105 ${
              pathname === "/collections" || pathname.startsWith("/collections/")
                ? "text-brand-primary-dark border-b-2 border-brand-primary-dark"
                : "text-brand-text-dark hover:text-brand-primary-dark hover:border-b-2 hover:border-brand-primary-dark/50"
            }`}
          >
            My Collections
          </a>
          <a
            href="/saved-searches"
            className={`font-medium pb-1 transition-all duration-200 hover:scale-105 ${
              pathname === "/saved-searches"
                ? "text-brand-primary-dark border-b-2 border-brand-primary-dark"
                : "text-brand-text-dark hover:text-brand-primary-dark hover:border-b-2 hover:border-brand-primary-dark/50"
            }`}
          >
            Saved Searches
          </a>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer group">
          <Bell className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary-dark transition-colors duration-200" /> {/* Updated color */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent-orange rounded-full text-xs text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            {" "}
            {/* Updated color */}3
          </span>
        </div>
        <User className="w-5 h-5 text-brand-text-dark hover:text-brand-primary-dark transition-colors duration-200 cursor-pointer" /> {/* Updated color */}
      </div>
    </header>
  )
}
