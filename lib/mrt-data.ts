export interface MRTStation {
  id: string;
  name: string;
  line: string;
  lineCode: string;
  coordinates: [number, number]; // [lat, lng]
  interchange?: boolean;
}

export interface MRTLine {
  code: string;
  name: string;
  color: string;
}

// MRT Line definitions
export const mrtLines: MRTLine[] = [
  { code: "NS", name: "North-South Line", color: "#D42E12" },
  { code: "EW", name: "East-West Line", color: "#009645" },
  { code: "CC", name: "Circle Line", color: "#F8D009" },
  { code: "DT", name: "Downtown Line", color: "#005EC9" },
  { code: "TE", name: "Thomson-East Coast Line", color: "#9D5B25" },
  { code: "CG", name: "Changi Airport Extension", color: "#009645" },
  { code: "CE", name: "Circle Line Extension", color: "#F8D009" },
  { code: "BP", name: "Bukit Panjang LRT", color: "#6C3" },
  { code: "SK", name: "Sengkang LRT", color: "#6C3" },
  { code: "PG", name: "Punggol LRT", color: "#6C3" }
];

// MRT Station data with approximate coordinates
export const mrtStations: MRTStation[] = [
  // North-South Line (NS)
  { id: "NS1", name: "Jurong East", line: "North-South Line", lineCode: "NS", coordinates: [1.3396, 103.7066] },
  { id: "NS2", name: "Bukit Batok", line: "North-South Line", lineCode: "NS", coordinates: [1.3494, 103.7494] },
  { id: "NS3", name: "Bukit Gombak", line: "North-South Line", lineCode: "NS", coordinates: [1.3584, 103.7518] },
  { id: "NS4", name: "Choa Chu Kang", line: "North-South Line", lineCode: "NS", coordinates: [1.3854, 103.7444], interchange: true },
  { id: "NS5", name: "Yew Tee", line: "North-South Line", lineCode: "NS", coordinates: [1.3974, 103.7474] },
  { id: "NS7", name: "Kranji", line: "North-South Line", lineCode: "NS", coordinates: [1.4251, 103.7619] },
  { id: "NS8", name: "Marsiling", line: "North-South Line", lineCode: "NS", coordinates: [1.4325, 103.7741] },
  { id: "NS9", name: "Woodlands", line: "North-South Line", lineCode: "NS", coordinates: [1.4367, 103.7860] },
  { id: "NS10", name: "Admiralty", line: "North-South Line", lineCode: "NS", coordinates: [1.4406, 103.8010] },
  { id: "NS11", name: "Sembawang", line: "North-South Line", lineCode: "NS", coordinates: [1.4490, 103.8200] },
  { id: "NS12", name: "Canberra", line: "North-South Line", lineCode: "NS", coordinates: [1.4427, 103.8297] },
  { id: "NS13", name: "Yishun", line: "North-South Line", lineCode: "NS", coordinates: [1.4294, 103.8350] },
  { id: "NS14", name: "Khatib", line: "North-South Line", lineCode: "NS", coordinates: [1.4172, 103.8329] },
  { id: "NS15", name: "Yio Chu Kang", line: "North-South Line", lineCode: "NS", coordinates: [1.3819, 103.8470] },
  { id: "NS16", name: "Ang Mo Kio", line: "North-South Line", lineCode: "NS", coordinates: [1.3698, 103.8499] },
  { id: "NS17", name: "Bishan", line: "North-South Line", lineCode: "NS", coordinates: [1.3505, 103.8484], interchange: true },
  { id: "NS18", name: "Braddell", line: "North-South Line", lineCode: "NS", coordinates: [1.3404, 103.8469] },
  { id: "NS19", name: "Toa Payoh", line: "North-South Line", lineCode: "NS", coordinates: [1.3325, 103.8476] },
  { id: "NS20", name: "Novena", line: "North-South Line", lineCode: "NS", coordinates: [1.3204, 103.8438] },
  { id: "NS21", name: "Newton", line: "North-South Line", lineCode: "NS", coordinates: [1.3124, 103.8384], interchange: true },
  { id: "NS22", name: "Orchard", line: "North-South Line", lineCode: "NS", coordinates: [1.3040, 103.8324] },
  { id: "NS23", name: "Somerset", line: "North-South Line", lineCode: "NS", coordinates: [1.3000, 103.8380] },
  { id: "NS24", name: "Dhoby Ghaut", line: "North-South Line", lineCode: "NS", coordinates: [1.2990, 103.8457], interchange: true },
  { id: "NS25", name: "City Hall", line: "North-South Line", lineCode: "NS", coordinates: [1.2935, 103.8523], interchange: true },
  { id: "NS26", name: "Raffles Place", line: "North-South Line", lineCode: "NS", coordinates: [1.2844, 103.8515] },
  { id: "NS27", name: "Marina Bay", line: "North-South Line", lineCode: "NS", coordinates: [1.2766, 103.8545] },
  { id: "NS28", name: "Marina South Pier", line: "North-South Line", lineCode: "NS", coordinates: [1.2714, 103.8635] },

  // East-West Line (EW)
  { id: "EW1", name: "Pasir Ris", line: "East-West Line", lineCode: "EW", coordinates: [1.3724, 103.9493] },
  { id: "EW2", name: "Tampines", line: "East-West Line", lineCode: "EW", coordinates: [1.3525, 103.9454] },
  { id: "EW3", name: "Simei", line: "East-West Line", lineCode: "EW", coordinates: [1.3434, 103.9534] },
  { id: "EW4", name: "Tanah Merah", line: "East-West Line", lineCode: "EW", coordinates: [1.3272, 103.9464] },
  { id: "EW5", name: "Bedok", line: "East-West Line", lineCode: "EW", coordinates: [1.3240, 103.9300] },
  { id: "EW6", name: "Kembangan", line: "East-West Line", lineCode: "EW", coordinates: [1.3210, 103.9120] },
  { id: "EW7", name: "Eunos", line: "East-West Line", lineCode: "EW", coordinates: [1.3197, 103.9030] },
  { id: "EW8", name: "Paya Lebar", line: "East-West Line", lineCode: "EW", coordinates: [1.3177, 103.8923], interchange: true },
  { id: "EW9", name: "Aljunied", line: "East-West Line", lineCode: "EW", coordinates: [1.3164, 103.8828] },
  { id: "EW10", name: "Kallang", line: "East-West Line", lineCode: "EW", coordinates: [1.3114, 103.8714] },
  { id: "EW11", name: "Lavender", line: "East-West Line", lineCode: "EW", coordinates: [1.3074, 103.8630] },
  { id: "EW12", name: "Bugis", line: "East-West Line", lineCode: "EW", coordinates: [1.3009, 103.8559] },
  { id: "EW13", name: "Tanjong Pagar", line: "East-West Line", lineCode: "EW", coordinates: [1.2766, 103.8455] },
  { id: "EW14", name: "Outram Park", line: "East-West Line", lineCode: "EW", coordinates: [1.2800, 103.8390], interchange: true },
  { id: "EW15", name: "Tiong Bahru", line: "East-West Line", lineCode: "EW", coordinates: [1.2848, 103.8330] },
  { id: "EW16", name: "Redhill", line: "East-West Line", lineCode: "EW", coordinates: [1.2896, 103.8140] },
  { id: "EW17", name: "Queenstown", line: "East-West Line", lineCode: "EW", coordinates: [1.2944, 103.8058] },
  { id: "EW18", name: "Commonwealth", line: "East-West Line", lineCode: "EW", coordinates: [1.3025, 103.7980] },
  { id: "EW19", name: "Buona Vista", line: "East-West Line", lineCode: "EW", coordinates: [1.3072, 103.7900], interchange: true },
  { id: "EW20", name: "Dover", line: "East-West Line", lineCode: "EW", coordinates: [1.3113, 103.7780] },
  { id: "EW21", name: "Clementi", line: "East-West Line", lineCode: "EW", coordinates: [1.3152, 103.7650] },
  { id: "EW22", name: "Jurong East", line: "East-West Line", lineCode: "EW", coordinates: [1.3396, 103.7066], interchange: true },
  { id: "EW23", name: "Chinese Garden", line: "East-West Line", lineCode: "EW", coordinates: [1.3420, 103.7320] },
  { id: "EW24", name: "Lakeside", line: "East-West Line", lineCode: "EW", coordinates: [1.3440, 103.7200] },
  { id: "EW25", name: "Boon Lay", line: "East-West Line", lineCode: "EW", coordinates: [1.3380, 103.7060] },
  { id: "EW26", name: "Pioneer", line: "East-West Line", lineCode: "EW", coordinates: [1.3375, 103.6970] },
  { id: "EW27", name: "Joo Koon", line: "East-West Line", lineCode: "EW", coordinates: [1.3274, 103.6780] },
  { id: "EW28", name: "Gul Circle", line: "East-West Line", lineCode: "EW", coordinates: [1.3190, 103.6600] },
  { id: "EW29", name: "Tuas Crescent", line: "East-West Line", lineCode: "EW", coordinates: [1.3210, 103.6500] },
  { id: "EW30", name: "Tuas West Road", line: "East-West Line", lineCode: "EW", coordinates: [1.3290, 103.6400] },
  { id: "EW31", name: "Tuas Link", line: "East-West Line", lineCode: "EW", coordinates: [1.3400, 103.6360] },

  // Downtown Line (DT)
  { id: "DT1", name: "Bukit Panjang", line: "Downtown Line", lineCode: "DT", coordinates: [1.3778, 103.7647] },
  { id: "DT2", name: "Cashew", line: "Downtown Line", lineCode: "DT", coordinates: [1.3700, 103.7647] },
  { id: "DT3", name: "Hillview", line: "Downtown Line", lineCode: "DT", coordinates: [1.3620, 103.7647] },
  { id: "DT5", name: "Beauty World", line: "Downtown Line", lineCode: "DT", coordinates: [1.3410, 103.7750] },
  { id: "DT6", name: "King Albert Park", line: "Downtown Line", lineCode: "DT", coordinates: [1.3350, 103.7830] },
  { id: "DT7", name: "Sixth Avenue", line: "Downtown Line", lineCode: "DT", coordinates: [1.3290, 103.7910] },
  { id: "DT8", name: "Tan Kah Kee", line: "Downtown Line", lineCode: "DT", coordinates: [1.3250, 103.8010] },
  { id: "DT9", name: "Botanic Gardens", line: "Downtown Line", lineCode: "DT", coordinates: [1.3220, 103.8150], interchange: true },
  { id: "DT10", name: "Stevens", line: "Downtown Line", lineCode: "DT", coordinates: [1.3200, 103.8250] },
  { id: "DT11", name: "Newton", line: "Downtown Line", lineCode: "DT", coordinates: [1.3124, 103.8384], interchange: true },
  { id: "DT12", name: "Little India", line: "Downtown Line", lineCode: "DT", coordinates: [1.3060, 103.8490] },
  { id: "DT13", name: "Rochor", line: "Downtown Line", lineCode: "DT", coordinates: [1.3000, 103.8520] },
  { id: "DT14", name: "Bugis", line: "Downtown Line", lineCode: "DT", coordinates: [1.3009, 103.8559], interchange: true },
  { id: "DT15", name: "Promenade", line: "Downtown Line", lineCode: "DT", coordinates: [1.2930, 103.8600] },
  { id: "DT16", name: "Bayfront", line: "Downtown Line", lineCode: "DT", coordinates: [1.2820, 103.8580] },
  { id: "DT17", name: "Downtown", line: "Downtown Line", lineCode: "DT", coordinates: [1.2790, 103.8520] },
  { id: "DT18", name: "Telok Ayer", line: "Downtown Line", lineCode: "DT", coordinates: [1.2820, 103.8480] },
  { id: "DT19", name: "Chinatown", line: "Downtown Line", lineCode: "DT", coordinates: [1.2840, 103.8430] },
  { id: "DT20", name: "Fort Canning", line: "Downtown Line", lineCode: "DT", coordinates: [1.2920, 103.8450] },
  { id: "DT21", name: "Bencoolen", line: "Downtown Line", lineCode: "DT", coordinates: [1.2980, 103.8500] },
  { id: "DT22", name: "Jalan Besar", line: "Downtown Line", lineCode: "DT", coordinates: [1.3050, 103.8550] },
  { id: "DT23", name: "Bendemeer", line: "Downtown Line", lineCode: "DT", coordinates: [1.3120, 103.8630] },
  { id: "DT24", name: "Geylang Bahru", line: "Downtown Line", lineCode: "DT", coordinates: [1.3210, 103.8710] },
  { id: "DT25", name: "Mattar", line: "Downtown Line", lineCode: "DT", coordinates: [1.3270, 103.8830] },
  { id: "DT26", name: "MacPherson", line: "Downtown Line", lineCode: "DT", coordinates: [1.3330, 103.8900], interchange: true },
  { id: "DT27", name: "Ubi", line: "Downtown Line", lineCode: "DT", coordinates: [1.3400, 103.8990] },
  { id: "DT28", name: "Kaki Bukit", line: "Downtown Line", lineCode: "DT", coordinates: [1.3350, 103.9080] },
  { id: "DT29", name: "Bedok North", line: "Downtown Line", lineCode: "DT", coordinates: [1.3280, 103.9170] },
  { id: "DT30", name: "Bedok Reservoir", line: "Downtown Line", lineCode: "DT", coordinates: [1.3410, 103.9320] },
  { id: "DT31", name: "Tampines West", line: "Downtown Line", lineCode: "DT", coordinates: [1.3450, 103.9400] },
  { id: "DT32", name: "Tampines", line: "Downtown Line", lineCode: "DT", coordinates: [1.3525, 103.9454], interchange: true },
  { id: "DT33", name: "Tampines East", line: "Downtown Line", lineCode: "DT", coordinates: [1.3560, 103.9500] },
  { id: "DT34", name: "Upper Changi", line: "Downtown Line", lineCode: "DT", coordinates: [1.3400, 103.9610] },
  { id: "DT35", name: "Expo", line: "Downtown Line", lineCode: "DT", coordinates: [1.3340, 103.9610] },

  // Thomson-East Coast Line (TE)
  { id: "TE1", name: "Woodlands North", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.4480, 103.7850] },
  { id: "TE2", name: "Woodlands", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.4367, 103.7860], interchange: true },
  { id: "TE3", name: "Woodlands South", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.4280, 103.7860] },
  { id: "TE4", name: "Springleaf", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3980, 103.8170] },
  { id: "TE5", name: "Lentor", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3860, 103.8350] },
  { id: "TE6", name: "Mayflower", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3720, 103.8380] },
  { id: "TE7", name: "Bright Hill", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3600, 103.8380] },
  { id: "TE8", name: "Upper Thomson", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3540, 103.8150] },
  { id: "TE9", name: "Caldecott", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3380, 103.8390], interchange: true },
  { id: "TE10", name: "Mount Pleasant", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3250, 103.8390] },
  { id: "TE11", name: "Stevens", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3200, 103.8250], interchange: true },
  { id: "TE12", name: "Napier", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3080, 103.8150] },
  { id: "TE13", name: "Orchard Boulevard", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3040, 103.8324] },
  { id: "TE14", name: "Orchard", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.3040, 103.8324], interchange: true },
  { id: "TE15", name: "Great World", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2920, 103.8320] },
  { id: "TE16", name: "Havelock", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2880, 103.8320] },
  { id: "TE17", name: "Outram Park", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2800, 103.8390], interchange: true },
  { id: "TE18", name: "Maxwell", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2800, 103.8450] },
  { id: "TE19", name: "Shenton Way", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2800, 103.8500] },
  { id: "TE20", name: "Marina Bay", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2766, 103.8545], interchange: true },
  { id: "TE21", name: "Marina South", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2720, 103.8540] },
  { id: "TE22", name: "Gardens by the Bay", line: "Thomson-East Coast Line", lineCode: "TE", coordinates: [1.2810, 103.8630] }
];

// Helper functions
export function getStationsForLine(lineCode: string): MRTStation[] {
  return mrtStations.filter(station => station.lineCode === lineCode);
}

export function getInterchangeStations(): MRTStation[] {
  return mrtStations.filter(station => station.interchange);
}

export function getLineColor(lineCode: string): string {
  const line = mrtLines.find(l => l.code === lineCode);
  return line ? line.color : "#666666";
}

export function getLineName(lineCode: string): string {
  const line = mrtLines.find(l => l.code === lineCode);
  return line ? line.name : "Unknown Line";
} 