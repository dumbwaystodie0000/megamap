// This file now serves as a compatibility layer, re-exporting everything from the split files
// The actual data and functions are now in:
// - lib/units-data.ts (unit data array)
// - lib/unit-functions.ts (all functions and data generation logic)

// Re-export everything from the new files
export * from './units-data';
export * from './unit-functions'; 