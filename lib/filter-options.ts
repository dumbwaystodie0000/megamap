// Centralized filter options for consistency across components

export const PROPERTY_SUB_TYPES = {
  all: [],
  condo: ["Condominium", "Apartment", "Walk-up", "Cluster House", "Executive Condominium"],
  landed: [
    "Terraced House",
    "Detached House",
    "Semi-Detached House",
    "Corner Terrace",
    "Bungalow House",
    "Good Class Bungalow",
    "Shophouse",
    "Land Only",
    "Town House",
    "Conservation House",
    "Cluster House",
  ],
  hdb: [
    "1-Room / Studio",
    "2A",
    "2I (Improved)",
    "2S (Standard)",
    "2-Room Flexi",
    "3A",
    "3NG (New Generation)",
    "3A (Modified)",
    "3NG (Modified)",
    "3I (Improved)",
    "3I (Modified)",
    "3S (Simplified)",
    "3STD (Standard)",
    "3PA (3 Room Premium Apartment)",
    "4A",
    "4NG (New Generation)",
    "4PA (4 Room Premium Apartment)",
    "4I (Improved)",
    "4S (Simplified)",
    "5A",
    "5I",
    "5PA (5 Room Premium Apartment)",
    "5S",
    "Jumbo",
    "EA (Exec Apartment)",
    "EM (Exec Maisonette)",
    "MG (Multi-Generation)",
    "Terrace",
  ],
} as const

export const BEDROOM_OPTIONS = ["Studio", "1 Bed", "2 Beds", "3 Beds", "4 Beds", "5+ Beds"] as const

export const TRANSACTION_TYPES = ["For Sale", "For Rent"] as const

export type PropertyMainType = keyof typeof PROPERTY_SUB_TYPES

export const minPriceOptions = [
  { value: "0", label: "No Min" }, // Changed label from "Any" to "No Min"
  { value: "100000", label: "$100,000" },
  { value: "200000", label: "$200,000" },
  { value: "300000", label: "$300,000" },
  { value: "400000", label: "$400,000" },
  { value: "500000", label: "$500,000" },
  { value: "600000", label: "$600,000" },
  { value: "700000", label: "$700,000" },
  { value: "800000", label: "$800,000" },
  { value: "900000", label: "$900,000" },
  { value: "1000000", label: "$1,000,000" },
  { value: "1500000", label: "$1,500,000" },
  { value: "2000000", label: "$2,000,000" },
  { value: "2500000", label: "$2,500,000" },
  { value: "3000000", label: "$3,000,000" },
  { value: "3500000", label: "$3,500,000" },
  { value: "4000000", label: "$4,000,000" },
  { value: "4500000", label: "$4,500,000" },
  { value: "5000000", label: "$5,000,000" },
  { value: "6000000", label: "$6,000,000" },
  { value: "7000000", label: "$7,000,000" },
  { value: "8000000", label: "$8,000,000" },
  { value: "9000000", label: "$9,000,000" },
  { value: "10000000", label: "$10,000,000" },
]

export const maxPriceOptions = [
  { value: "No Limit", label: "No Max" }, // Changed label from "No Limit" to "No Max"
  { value: "100000", label: "$100,000" },
  { value: "200000", label: "$200,000" },
  { value: "300000", label: "$300,000" },
  { value: "400000", label: "$400,000" },
  { value: "500000", label: "$500,000" },
  { value: "600000", label: "$600,000" },
  { value: "700000", label: "$700,000" },
  { value: "800000", label: "$800,000" },
  { value: "900000", label: "$900,000" },
  { value: "1000000", label: "$1,000,000" },
  { value: "1500000", label: "$1,500,000" },
  { value: "2000000", label: "$2,000,000" },
  { value: "2500000", label: "$2,500,000" },
  { value: "3000000", label: "$3,000,000" },
  { value: "3500000", label: "$3,500,000" },
  { value: "4000000", label: "$4,000,000" },
  { value: "4500000", label: "$4,500,000" },
  { value: "5000000", label: "$5,000,000" },
  { value: "6000000", label: "$6,000,000" },
  { value: "7000000", label: "$7,000,000" },
  { value: "8000000", label: "$8,000,000" },
  { value: "9000000", label: "$9,000,000" },
  { value: "10000000", label: "$10,000,000" },
]

export const minPsfOptions = [
  { value: "0", label: "No Min" },
  ...Array.from({ length: 40 }, (_, i) => ({
    value: (i * 100 + 100).toString(),
    label: `$${(i * 100 + 100).toLocaleString()}`,
  })),
]

export const maxPsfOptions = [
  { value: "No Limit", label: "No Max" },
  ...Array.from({ length: 40 }, (_, i) => ({
    value: (i * 100 + 100).toString(),
    label: `$${(i * 100 + 100).toLocaleString()}`,
  })),
]

const currentYear = new Date().getFullYear()
const startYear = 1960
const endYear = currentYear + 8

// Generate years in descending order
const yearsDescending = Array.from({ length: endYear - startYear + 1 }, (_, i) => (endYear - i).toString())

export const minBuildYearOptions = [
  { value: "any", label: "No Min" },
  ...yearsDescending.map((year) => ({
    value: year,
    label: year,
  })),
]

export const maxBuildYearOptions = [
  { value: "any", label: "No Max" },
  ...yearsDescending.map((year) => ({
    value: year,
    label: year,
  })),
]

export const minAreaOptions = [
  { value: "0", label: "No Min" },
  { value: "100", label: "100" },
  { value: "200", label: "200" },
  { value: "300", label: "300" },
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
  { value: "800", label: "800" },
  { value: "900", label: "900" },
  { value: "1000", label: "1,000" },
  { value: "1500", label: "1,500" },
  { value: "2000", label: "2,000" },
  { value: "2500", label: "2,500" },
  { value: "3000", label: "3,000" },
  { value: "3500", label: "3,500" },
  { value: "4000", label: "4,000" },
  { value: "4500", label: "4,500" },
  { value: "5000", label: "5,000" },
  { value: "6000", label: "6,000" },
  { value: "7000", label: "7,000" },
  { value: "8000", label: "8,000" },
  { value: "9000", label: "9,000" },
  { value: "10000", label: "10,000" },
]

export const maxAreaOptions = [
  { value: "No Limit", label: "No Max" },
  { value: "100", label: "100" },
  { value: "200", label: "200" },
  { value: "300", label: "300" },
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
  { value: "800", label: "800" },
  { value: "900", label: "900" },
  { value: "1000", label: "1,000" },
  { value: "1500", label: "1,500" },
  { value: "2000", label: "2,000" },
  { value: "2500", label: "2,500" },
  { value: "3000", label: "3,000" },
  { value: "3500", label: "3,500" },
  { value: "4000", label: "4,000" },
  { value: "4500", label: "4,500" },
  { value: "5000", label: "5,000" },
  { value: "6000", label: "6,000" },
  { value: "7000", label: "7,000" },
  { value: "8000", label: "8,000" },
  { value: "9000", label: "9,000" },
  { value: "10000", label: "10,000" },
]

// Date range filter options for transactions page
export const dateRangePresets = [
  { value: "all", label: "All Time" },
  { value: "1month", label: "Past 1 Month" },
  { value: "3months", label: "Past 3 Months" },
  { value: "6months", label: "Past 6 Months" },
  { value: "12months", label: "Past 12 Months" },
  { value: "18months", label: "Past 18 Months" },
]

// Helper function to get date range from preset
export const getDateRangeFromPreset = (preset: string) => {
  const now = new Date()
  const startDate = new Date()
  
  switch (preset) {
    case "1month":
      startDate.setMonth(now.getMonth() - 1)
      break
    case "3months":
      startDate.setMonth(now.getMonth() - 3)
      break
    case "6months":
      startDate.setMonth(now.getMonth() - 6)
      break
    case "12months":
      startDate.setMonth(now.getMonth() - 12)
      break
    case "18months":
      startDate.setMonth(now.getMonth() - 18)
      break
    case "all":
    default:
      startDate.setFullYear(1960) // Very old date to show all
      break
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0]
  }
}
