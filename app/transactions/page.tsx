"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { TransactionsSearchHeader } from "@/components/transactions-search-header"
import { MapPanel } from "@/components/map-panel"
import { generateFilteredTransactionsData } from "@/lib/unit-functions"

export default function TransactionsPage() {
  const [showMap, setShowMap] = useState(true)
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const searchParams = useSearchParams()
  
  // Get filtered transactions data based on search parameters
  const filteredTransactions = generateFilteredTransactionsData(searchParams)
  
  // Debug: Log the current status filter and results
  const currentStatus = searchParams.get("status") || "SOLD"
  console.log('Transactions Page - Status:', currentStatus, 'Results:', filteredTransactions.length)

  return (
    <div className="h-screen bg-brand-background-light flex flex-col">
      <Header />
      
      {/* Transactions Search Header with status-based filters */}
      <TransactionsSearchHeader 
        showMap={showMap} 
        onShowMapChange={setShowMap}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel - Results Table */}
        <div className={`${showMap ? 'w-1/3' : 'w-full'} bg-white border-r border-gray-200 overflow-y-auto min-h-0`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Transaction Records</h2>
              <div className="text-sm text-gray-600">
                {filteredTransactions.length} transactions found
              </div>
            </div>
            
            {/* Transaction Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[calc(100vh-300px)]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Project</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Address</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">District</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Transacted Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">PSF</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Area</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Beds</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions && filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 cursor-pointer">
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.project}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.address}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.district}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.transacted_price || transaction.price}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.psf}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.area}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.beds}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          No transaction records found. Try adjusting your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Map (conditionally rendered) */}
        {showMap && (
          <div className="w-2/3 bg-brand-background-light min-h-0">
            <MapPanel 
              onPropertyClick={() => {}}
              activeLayer={activeLayer}
              transactionType="transactions"
            />
          </div>
        )}
      </div>
    </div>
  )
}
