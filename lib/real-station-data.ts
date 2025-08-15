// Real MRT station data from LTA sources

export interface RealMRTStation {
  station_name: string;
  line: string;
  code: string;
  latitude: number;
  longitude: number;
}

export interface ProcessedStation {
  id: string;
  name: string;
  line: string;
  lineCode: string;
  coordinates: [number, number]; // [lat, lng]
  interchange?: boolean;
}

/**
 * Loads the real MRT station data from the JSON file
 */
export async function loadRealStationData(): Promise<RealMRTStation[]> {
  try {
    const response = await fetch('/TrainStation_Apr2025/singapore-mrt-station.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load real station data:', error);
    return [];
  }
}

/**
 * Processes the real station data to identify interchange stations
 * and convert to the format needed by the map component
 */
export function processStationData(stations: RealMRTStation[]): ProcessedStation[] {
  console.log('Raw stations data sample:', stations.slice(0, 5));
  
  // Group stations by location to find interchanges
  const stationGroups = new Map<string, RealMRTStation[]>();
  
  stations.forEach(station => {
    // Skip invalid stations for grouping
    if (station.latitude === null || station.longitude === null ||
        station.latitude === undefined || station.longitude === undefined ||
        station.latitude === "" || station.longitude === "" ||
        typeof station.latitude !== 'number' || typeof station.longitude !== 'number' ||
        isNaN(station.latitude) || isNaN(station.longitude)) {
      return; // Skip this station for grouping
    }
    
    // Create a location key based on coordinates (with some tolerance)
    const latKey = Math.round(station.latitude * 10000) / 10000;
    const lngKey = Math.round(station.longitude * 10000) / 10000;
    const locationKey = `${latKey},${lngKey}`;
    
    if (!stationGroups.has(locationKey)) {
      stationGroups.set(locationKey, []);
    }
    stationGroups.get(locationKey)!.push(station);
  });
  
  // Convert to processed format
  const processedStations = stations.map(station => {
    // Validate coordinates before processing
    if (station.latitude === null || station.longitude === null ||
        station.latitude === undefined || station.longitude === undefined ||
        station.latitude === "" || station.longitude === "" ||
        typeof station.latitude !== 'number' || typeof station.longitude !== 'number' ||
        isNaN(station.latitude) || isNaN(station.longitude) ||
        station.latitude < -90 || station.latitude > 90 ||
        station.longitude < -180 || station.longitude > 180) {
      console.error('Invalid coordinates for station:', station.station_name, 'coordinates:', [station.latitude, station.longitude], 'types:', typeof station.latitude, typeof station.longitude);
      return null; // Return null for invalid stations
    }
    
    const latKey = Math.round(station.latitude * 10000) / 10000;
    const lngKey = Math.round(station.longitude * 10000) / 10000;
    const locationKey = `${latKey},${lngKey}`;
    const group = stationGroups.get(locationKey) || [];
    
    // Determine if this is an interchange station
    const isInterchange = group.length > 1;
    
    // Extract line code from station code (e.g., "NS15" -> "NS")
    const lineCode = station.code.replace(/\d+$/, '');
    
    return {
      id: station.code,
      name: station.station_name,
      line: station.line,
      lineCode: lineCode,
      coordinates: [station.latitude, station.longitude],
      interchange: isInterchange
    };
  }).filter(station => station !== null) as ProcessedStation[]; // Filter out null values
  
  console.log(`Processed ${stations.length} stations, ${processedStations.length} valid, ${stations.length - processedStations.length} invalid`);
  
  // Additional debugging: show some examples of invalid stations
  const invalidStations = stations.filter(station => 
    station.latitude === null || station.longitude === null ||
    station.latitude === undefined || station.longitude === undefined ||
    station.latitude === "" || station.longitude === "" ||
    typeof station.latitude !== 'number' || typeof station.longitude !== 'number' ||
    isNaN(station.latitude) || isNaN(station.longitude) ||
    station.latitude < -90 || station.latitude > 90 ||
    station.longitude < -180 || station.longitude > 180
  );
  
  if (invalidStations.length > 0) {
    console.log('Sample invalid stations:', invalidStations.slice(0, 3));
  }
  
  // Debug: show line code distribution
  const lineCodeCounts: { [key: string]: number } = {};
  processedStations.forEach(station => {
    lineCodeCounts[station.lineCode] = (lineCodeCounts[station.lineCode] || 0) + 1;
  });
  console.log('Line code distribution:', lineCodeCounts);
  
  return processedStations;
}

/**
 * Gets stations for a specific line
 */
export function getStationsForLine(stations: ProcessedStation[], lineCode: string): ProcessedStation[] {
  return stations.filter(station => station.lineCode === lineCode);
}

/**
 * Gets all interchange stations
 */
export function getInterchangeStations(stations: ProcessedStation[]): ProcessedStation[] {
  return stations.filter(station => station.interchange);
}

/**
 * Maps line codes to their official colors
 */
export function getLineColor(lineCode: string): string {
  const colorMap: { [key: string]: string } = {
    "NS": "#D42E12", // North-South Line
    "EW": "#009645", // East-West Line
    "CC": "#F8D009", // Circle Line
    "DT": "#005EC9", // Downtown Line
    "TE": "#9D5B25", // Thomson-East Coast Line
    "NE": "#9B26B6", // North East Line (Purple)
    "CG": "#009645", // Changi Airport Extension
    "CE": "#F8D009", // Circle Line Extension
    "BP": "#6C3",    // Bukit Panjang LRT
    "SK": "#6C3",    // Sengkang LRT
    "PG": "#6C3",    // Punggol LRT
    "JW": "#00B4D8", // Jurong Region Line (West)
    "JS": "#00B4D8", // Jurong Region Line (South)
    "JE": "#00B4D8", // Jurong Region Line (East)
    "RL": "#666666"  // Default for unknown lines
  };
  
  return colorMap[lineCode] || colorMap["RL"];
}

/**
 * Gets the display name for a line
 */
export function getLineName(lineCode: string): string {
  const lineNameMap: { [key: string]: string } = {
    "NS": "North-South Line",
    "EW": "East-West Line",
    "CC": "Circle Line",
    "DT": "Downtown Line",
    "TE": "Thomson-East Coast Line",
    "NE": "North East Line",
    "CG": "Changi Airport Extension",
    "CE": "Circle Line Extension",
    "BP": "Bukit Panjang LRT",
    "SK": "Sengkang LRT",
    "PG": "Punggol LRT",
    "JW": "Jurong Region Line (West)",
    "JS": "Jurong Region Line (South)",
    "JE": "Jurong Region Line (East)"
  };
  
  return lineNameMap[lineCode] || "Unknown Line";
} 