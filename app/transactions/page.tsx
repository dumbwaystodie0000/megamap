"use client"

import { useState } from "react"
import { Search, MapPin, Table } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyDetailsPanel } from "@/components/property-details-panel" // Import PropertyDetailsPanel
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Import Dialog components
import { mockTransactionsPageData, mockAgents, mockAgentData } from "@/lib/mock-data" // Import mock data

export default function TransactionsPage() {
  const [saleType, setSaleType] = useState("sale")
  const [heatmapMode, setHeatmapMode] = useState("transactions") // 'transactions' or 'price'
  const [displayMode, setDisplayMode] = useState<"heatmap" | "table">("heatmap") // New state for display mode
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false)
  const [selectedTransactionProperty, setSelectedTransactionProperty] = useState<any>(null)

  const [filters, setFilters] = useState({
    district: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    minPsf: "",
    maxPsf: "",
    minArea: "",
    maxArea: "",
    bedrooms: [] as string[],
    projectName: "",
    agent: "", // New agent filter
  })

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleBedroomChange = (bed: string) => {
    setFilters((prev) => {
      const currentBeds = prev.bedrooms
      if (currentBeds.includes(bed)) {
        return { ...prev, bedrooms: currentBeds.filter((b) => b !== bed) }
      } else {
        return { ...prev, bedrooms: [...currentBeds, bed] }
      }
    })
  }

  const handleRowClick = (transaction: any) => {
    // Map transaction data to propertyData format for PropertyDetailsPanel
    const propertyData = {
      id: transaction.id.toString(),
      price: transaction.price,
      title: transaction.project,
      address: transaction.address,
      beds: transaction.beds,
      baths: transaction.baths,
      size: transaction.area,
      type: "Condominium", // Default or infer from project
      tenure: transaction.tenure,
      year: transaction.year,
      status: transaction.status,
      agency: transaction.agency,
      description: transaction.description,
      features: transaction.features,
      images: transaction.images,
      agent: {
        name: transaction.agent,
        phone: mockAgentData.phone,
        email: `${transaction.agent.toLowerCase().replace(" ", ".")}@example.com`,
        agencyName: transaction.agency === "PLB" ? "Property Lim Brothers" : "Other Agency",
      },
      floorPlan: transaction.floorPlan,
      virtualTour: transaction.virtualTour,
    }
    setSelectedTransactionProperty(propertyData)
    setShowPropertyDetailsModal(true)
  }

  const filteredAndSortedTransactions = mockTransactionsPageData // Use imported mock data
    .filter((transaction) => {
      // Apply sale type filter
      if (transaction.type !== saleType) return false

      // Apply project name search
      if (filters.projectName && !transaction.project.toLowerCase().includes(filters.projectName.toLowerCase())) {
        return false
      }

      // Apply district filter
      if (filters.district && filters.district !== "all" && transaction.district !== filters.district) return false

      // Apply price filter (simplified for mock data, assumes numeric conversion)
      const transactionPrice = Number.parseFloat(transaction.price.replace(/[^0-9.]/g, ""))
      if (filters.minPrice && transactionPrice < Number.parseFloat(filters.minPrice)) return false
      if (filters.maxPrice && transactionPrice > Number.parseFloat(filters.maxPrice)) return false

      // Apply year filter
      if (
        filters.minYear &&
        filters.minYear !== "any" &&
        Number.parseInt(transaction.year) < Number.parseInt(filters.minYear)
      )
        return false
      if (
        filters.maxYear &&
        filters.maxYear !== "any" &&
        Number.parseInt(transaction.year) > Number.parseInt(filters.maxYear)
      )
        return false

      // Apply PSF filter
      const transactionPsf = Number.parseFloat(transaction.psf.replace(/[^0-9.]/g, ""))
      if (filters.minPsf && transactionPsf < Number.parseFloat(filters.minPsf)) return false
      if (filters.maxPsf && transactionPsf > Number.parseFloat(filters.maxPsf)) return false

      // Apply area filter
      const transactionArea = Number.parseFloat(transaction.area.replace(/[^0-9.]/g, ""))
      if (filters.minArea && transactionArea < Number.parseFloat(filters.minArea)) return false
      if (filters.maxArea && transactionArea > Number.parseFloat(filters.maxArea)) return false

      // Apply bedrooms filter
      if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(transaction.beds.toString())) return false

      // Apply agent filter
      if (filters.agent && filters.agent !== "All Agents" && transaction.agent !== filters.agent) return false

      return true
    })
    .sort((a, b) => {
      // Sort by date in descending order (most recent first)
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })

  const districts = [
    "D01",
    "D02",
    "D03",
    "D04",
    "D05",
    "D06",
    "D07",
    "D08",
    "D09",
    "D10",
    "D11",
    "D12",
    "D13",
    "D14",
    "D15",
    "D16",
    "D17",
    "D18",
    "D19",
    "D20",
    "D21",
    "D22",
    "D23",
    "D24",
    "D25",
    "D26",
    "D27",
    "D28",
  ]

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())

  return (
    <div className="min-h-screen bg-brand-background-light flex flex-col">
      {" "}
      {/* Updated color */}
      <Header />
      <div className="flex flex-1">
        {/* Filter Sidebar - Conditionally rendered */}
        {displayMode === "table" && (
          <div className="w-80 border-r border-gray-200 bg-white p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-brand-text-dark mb-6">Transaction Filters</h2> {/* Updated color */}
            <div className="space-y-6">
              {/* Sale Type */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">Sale Type</label>{" "}
                {/* Updated color */}
                <div className="flex space-x-2">
                  <Button
                    variant={saleType === "sale" ? "default" : "outline"}
                    onClick={() => setSaleType("sale")}
                    className="flex-1 bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" // Updated colors
                  >
                    Sale
                  </Button>
                  <Button
                    variant={saleType === "rental" ? "default" : "outline"}
                    onClick={() => setSaleType("rental")}
                    className="flex-1 bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light" // Updated colors
                  >
                    Rental
                  </Button>
                </div>
              </div>
              {/* Search Project Name */}
              <div>
                <label htmlFor="project-search" className="block text-sm font-medium text-brand-text-dark mb-2">
                  {" "}
                  {/* Updated color */}
                  Project Name / Address
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-dark/50 w-4 h-4" />{" "}
                  {/* Updated color */}
                  <Input
                    id="project-search"
                    placeholder="e.g. Amber Park, Orchard Road"
                    className="pl-10 border-brand-text-dark/20" // Updated color
                    value={filters.projectName}
                    onChange={(e) => handleFilterChange("projectName", e.target.value)}
                  />
                </div>
              </div>
              {/* District */}
              <div>
                <label htmlFor="district-select" className="block text-sm font-medium text-brand-text-dark mb-2">
                  {" "}
                  {/* Updated color */}
                  District
                </label>
                <Select onValueChange={(value) => handleFilterChange("district", value)}>
                  <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                    {" "}
                    {/* Updated colors */}
                    <SelectValue placeholder="Select District" className="px-0" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Transacted Price */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">Transacted Price</label>{" "}
                {/* Updated color */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Min Price"
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="border-brand-text-dark/20" // Updated color
                  />
                  <Input
                    placeholder="Max Price"
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="border-brand-text-dark/20" // Updated color
                  />
                </div>
              </div>
              {/* Transacted Year */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">Transacted Year</label>{" "}
                {/* Updated color */}
                <div className="grid grid-cols-2 gap-4">
                  <Select onValueChange={(value) => handleFilterChange("minYear", value)}>
                    <SelectTrigger className="border-brand-text-dark/20 text-brand-text-dark">
                      {" "}
                      {/* Updated colors */}
                      <SelectValue placeholder="Min Year" className="px-0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => handleFilterChange("maxYear", value)}>
                    <SelectTrigger className="border-brand-text-dark/20 text-brand-text-dark">
                      {" "}
                      {/* Updated colors */}
                      <SelectValue placeholder="Max Year" className="px-0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Transacted PSF */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">Transacted PSF</label>{" "}
                {/* Updated color */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Min PSF"
                    type="number"
                    value={filters.minPsf}
                    onChange={(e) => handleFilterChange("minPsf", e.target.value)}
                    className="border-brand-text-dark/20" // Updated color
                  />
                  <Input
                    placeholder="Max PSF"
                    type="number"
                    value={filters.maxPsf}
                    onChange={(e) => handleFilterChange("maxPsf", e.target.value)}
                    className="border-brand-text-dark/20" // Updated color
                  />
                </div>
              </div>
              {/* Unit Area */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">Unit Area (sqft)</label>{" "}
                {/* Updated color */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Min Area"
                    type="number"
                    value={filters.minArea}
                    onChange={(e) => handleFilterChange("minArea", e.target.value)}
                    className="border-brand-text-dark/20" // Updated color
                  />
                  <Input
                    placeholder="Max Area"
                    type="number"
                    value={filters.maxArea}
                    onChange={(e) => handleFilterChange("maxArea", e.target.value)}
                    className="border-brand-text-dark/20" // Updated color
                  />
                </div>
              </div>
              {/* Number of Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">Bedrooms</label>{" "}
                {/* Updated color */}
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5+"].map((bed) => (
                    <Button
                      key={bed}
                      variant={filters.bedrooms.includes(bed) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleBedroomChange(bed)}
                      className={`${filters.bedrooms.includes(bed) ? "bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90" : "bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"}`} // Updated colors
                    >
                      {bed}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Agent Filter */}
              <div>
                <label htmlFor="agent-select" className="block text-sm font-medium text-brand-text-dark mb-2">
                  {" "}
                  {/* Updated color */}
                  Agent
                </label>
                <Select onValueChange={(value) => handleFilterChange("agent", value)}>
                  <SelectTrigger className="w-full border-brand-text-dark/20 text-brand-text-dark">
                    {" "}
                    {/* Updated colors */}
                    <SelectValue placeholder="Select Agent" className="px-0" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    {mockAgents.map((agent) => (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-brand-primary-dark hover:bg-brand-primary-dark/90 text-white">
                Apply Filters
              </Button>{" "}
              {/* Updated colors */}
              <Button
                variant="outline"
                className="w-full bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light"
              >
                {" "}
                {/* Updated colors */}
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col rounded-lg shadow-sm">
          {/* Heatmap Controls and View Toggle */}
          <div className="flex items-center justify-between p-6 bg-white rounded-t-lg">
            <h1 className="text-2xl font-bold text-brand-text-dark">Transaction Dashboard</h1> {/* Updated color */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayMode(displayMode === "heatmap" ? "table" : "heatmap")}
              className="bg-transparent text-brand-text-dark border-brand-text-dark/20 hover:bg-brand-background-light" // Updated colors
            >
              {displayMode === "heatmap" ? (
                <>
                  <Table className="w-4 h-4 mr-2" />
                  Table View
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Heatmap View
                </>
              )}
            </Button>
          </div>

          {/* Heatmap Placeholder - Conditionally rendered */}
          {displayMode === "heatmap" && (
            <div className="relative bg-brand-background-light flex-1 flex items-center justify-center rounded-b-lg p-6">
              {" "}
              {/* Updated color */}
              <div className="text-center text-brand-text-dark/70">
                {" "}
                {/* Updated color */}
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-semibold">Interactive Heatmap</p>
                <p className="text-sm">
                  Showing{" "}
                  {heatmapMode === "transactions" && "highest number of transactions in a project / street address"}
                  {heatmapMode === "price" && "highest price transacted"}
                  {heatmapMode === "district" && "transactions by district"}
                </p>
              </div>
              {/* Heatmap by dropdown moved inside map container */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-brand-text-dark text-sm">Heatmap by:</span> {/* Updated color */}
                  <Select onValueChange={setHeatmapMode} defaultValue={heatmapMode}>
                    <SelectTrigger className="w-[180px] h-8 text-sm border-brand-text-dark/20 text-brand-text-dark">
                      {" "}
                      {/* Updated colors */}
                      <SelectValue placeholder="Select Heatmap Mode" className="px-0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transactions">Number of Transactions</SelectItem>
                      <SelectItem value="price">Highest Price Transacted</SelectItem>
                      <SelectItem value="district">Transactions by District</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Transaction List - Conditionally rendered */}
          {displayMode === "table" && (
            <div className="flex-1 overflow-y-auto bg-brand-background-light rounded-b-lg p-6">
              <h2 className="text-xl font-bold text-brand-text-dark mb-4">
                {" "}
                {/* Updated color */}
                Transaction Records ({filteredAndSortedTransactions.length})
              </h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-full inline-block align-middle">
                    <div className="grid grid-cols-8 gap-4 bg-brand-primary-dark p-4 font-semibold text-sm text-white border-b text-left">
                      {" "}
                      {/* Updated colors */}
                      <div>Project</div>
                      <div>Address</div>
                      <div>District</div>
                      <div>Price</div>
                      <div>Date</div>
                      <div>PSF</div>
                      <div>Area</div>
                      <div>Beds</div>
                    </div>
                    {filteredAndSortedTransactions.length > 0 ? (
                      filteredAndSortedTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="grid grid-cols-8 gap-4 p-4 border-b border-gray-100 bg-white hover:bg-brand-accent-blue-25 text-sm cursor-pointer text-left text-brand-text-dark" // Updated colors
                          onClick={() => handleRowClick(transaction)}
                        >
                          <div>{transaction.project}</div>
                          <div>{transaction.address}</div>
                          <div>{transaction.district}</div>
                          <div>{transaction.price}</div>
                          <div>
                            {new Date(transaction.date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div>{transaction.psf}</div>
                          <div>{transaction.area}</div>
                          <div>{transaction.beds}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-brand-text-dark/70">
                        No transactions found matching your criteria.
                      </div> // Updated color
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Property Details Modal */}
      <Dialog open={showPropertyDetailsModal} onOpenChange={setShowPropertyDetailsModal}>
        <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-brand-text-dark">Property Details</DialogTitle> {/* Updated color */}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {selectedTransactionProperty && (
              <PropertyDetailsPanel
                propertyData={selectedTransactionProperty}
                onClose={() => setShowPropertyDetailsModal(false)}
                onSaveToCollection={() => {}} // Placeholder, as this panel doesn't directly save
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
