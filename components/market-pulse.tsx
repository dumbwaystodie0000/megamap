"use client"

export function MarketPulse() {
  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer group">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-200">Market Pulse</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="group-hover:bg-white/50 rounded p-1 transition-all duration-200">
          <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">Avg. PSF:</span>
          <span className="ml-2 font-bold text-green-600 group-hover:text-green-700 transition-colors duration-200">$2,450</span>
        </div>
        <div className="group-hover:bg-white/50 rounded p-1 transition-all duration-200">
          <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">Active:</span>
          <span className="ml-2 font-bold group-hover:text-gray-800 transition-colors duration-200">2 Units</span>
        </div>
        <div className="group-hover:bg-white/50 rounded p-1 transition-all duration-200">
          <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">Sold (6mo):</span>
          <span className="ml-2 font-bold group-hover:text-gray-800 transition-colors duration-200">8 Units</span>
        </div>
        <div className="group-hover:bg-white/50 rounded p-1 transition-all duration-200">
          <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">Trend:</span>
          <span className="ml-2 font-bold text-green-600 group-hover:text-green-700 transition-colors duration-200">+3.2%</span>
        </div>
      </div>
    </div>
  )
}
