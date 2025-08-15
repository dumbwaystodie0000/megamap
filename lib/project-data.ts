// Project data structure - project-level information only
export interface Project {
  id: string;
  name: string;
  address: string; // Primary address
  addresses: string[]; // Array of all addresses for the project (different blocks, postal codes)
  district: string;
  tenure: string;
  year: string;
  type: string;
  coordinates: [number, number]; // [latitude, longitude]
  amenities: string[];
  nearbySchools: string[];
  transport: string[];
  description: string;
  images: string[];
}

// Project definitions
export const projects: Project[] = [
  {
    id: "amber-park",
    name: "Amber Park",
    address: "14 Amber Gardens, Singapore 439959",
    addresses: [
      "14 Amber Gardens, Singapore 439959",
      "16 Amber Gardens, Singapore 439960",
      "18 Amber Gardens, Singapore 439961"
    ],
    district: "D15",
    tenure: "Freehold",
    year: "2023",
    type: "Condominium",
    coordinates: [1.3081, 103.8997], // Amber Gardens, Singapore
    amenities: ["Swimming Pool", "Gymnasium", "BBQ Area", "Tennis Court", "24/7 Security"],
    nearbySchools: ["Tanjong Katong Primary School (0.5 km)", "Haig Girls' School (1.2 km)", "Victoria School (2.0 km)"],
    transport: ["Kembangan MRT - 5 mins walk", "Eunos MRT - 8 mins walk", "Multiple bus stops nearby"],
    description: "A prestigious condominium development offering luxurious living with modern amenities and excellent connectivity.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: "meyer-mansion",
    name: "Meyer Mansion",
    address: "79 Meyer Road, Singapore 437906",
    addresses: [
      "79 Meyer Road, Singapore 437906",
      "81 Meyer Road, Singapore 437907"
    ],
    district: "D15",
    tenure: "Freehold",
    year: "2023",
    type: "Condominium",
    coordinates: [1.3056, 103.8972], // Meyer Road, Singapore
    amenities: ["Swimming Pool", "Gymnasium", "BBQ Area", "Tennis Court", "24/7 Security"],
    nearbySchools: ["Tanjong Katong Primary School (0.8 km)", "Haig Girls' School (1.5 km)", "Victoria School (2.2 km)"],
    transport: ["Kembangan MRT - 7 mins walk", "Eunos MRT - 10 mins walk", "Multiple bus stops nearby"],
    description: "An exclusive residential development featuring elegant architecture and premium facilities.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: "sail-marina-bay",
    name: "The Sail @ Marina Bay",
    address: "2 Marina Boulevard, Singapore 018987",
    addresses: [
      "2 Marina Boulevard, Singapore 018987",
      "4 Marina Boulevard, Singapore 018988",
      "6 Marina Boulevard, Singapore 018989"
    ],
    district: "D01",
    tenure: "99-year Leasehold",
    year: "2008",
    type: "Condominium",
    coordinates: [1.2831, 103.8516], // Marina Boulevard, Singapore
    amenities: ["Marina Bay view", "Swimming Pool", "Gymnasium", "BBQ Area", "24/7 Security"],
    nearbySchools: ["Raffles Institution (1.0 km)", "St. Margaret's Primary School (1.5 km)"],
    transport: ["Raffles Place MRT - 3 mins walk", "Marina Bay MRT - 5 mins walk", "Multiple bus stops nearby"],
    description: "Iconic waterfront development offering stunning views of Marina Bay and the city skyline.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: "reflections-keppel-bay",
    name: "Reflections at Keppel Bay",
    address: "1 Keppel Bay View, Singapore 098401",
    addresses: [
      "1 Keppel Bay View, Singapore 098401",
      "3 Keppel Bay View, Singapore 098402",
      "5 Keppel Bay View, Singapore 098403",
      "7 Keppel Bay View, Singapore 098404"
    ],
    district: "D04",
    tenure: "99-year Leasehold",
    year: "2011",
    type: "Condominium",
    coordinates: [1.2711, 103.8244], // Keppel Bay View, Singapore
    amenities: ["Waterfront view", "Swimming Pool", "Gymnasium", "BBQ Area", "Private pool", "24/7 Security"],
    nearbySchools: ["Telok Kurau Primary School (0.8 km)", "Victoria School (1.2 km)"],
    transport: ["Tanjong Katong MRT - 8 mins walk", "Eunos MRT - 10 mins walk", "Multiple bus stops nearby"],
    description: "Luxurious waterfront development with private pools and stunning sea views.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: "wallich-residence",
    name: "Wallich Residence",
    address: "3 Wallich Street, Singapore 078882",
    addresses: [
      "3 Wallich Street, Singapore 078882",
      "5 Wallich Street, Singapore 078883"
    ],
    district: "D02",
    tenure: "99-year Leasehold",
    year: "2017",
    type: "Condominium",
    coordinates: [1.2841, 103.8436], // Wallich Street, Singapore
    amenities: ["Direct MRT access", "Swimming Pool", "Gymnasium", "BBQ Area", "Smart home system", "24/7 Security"],
    nearbySchools: ["Raffles Institution (0.8 km)", "St. Margaret's Primary School (1.2 km)"],
    transport: ["Tanjong Pagar MRT - Direct access", "Outram Park MRT - 5 mins walk", "Multiple bus stops nearby"],
    description: "Premium residential development with direct MRT access and integrated smart home technology.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: "one-north-residences",
    name: "One North Residences",
    address: "7 One North Gateway, Singapore 138642",
    addresses: [
      "7 One North Gateway, Singapore 138642",
      "9 One North Gateway, Singapore 138643",
      "11 One North Gateway, Singapore 138644"
    ],
    district: "D05",
    tenure: "99-year Leasehold",
    year: "2009",
    type: "Condominium",
    coordinates: [1.3020, 103.7896], // One North Gateway, Singapore
    amenities: ["Swimming Pool", "Gymnasium", "BBQ Area", "Jacuzzi", "Playground", "Wading Pool"],
    nearbySchools: ["Fairfield Methodist School (Primary) (1km)", "New Town Primary School (1km)", "Fairfield Methodist School (Secondary) (1km)", "Henry Park Primary School (1km)", "Henry Park Secondary School (1.5km)"],
    transport: ["One North MRT - 5 mins walk", "Buona Vista MRT - 8 mins walk", "Multiple bus stops nearby"],
    description: "Just 390m to One-North MRT and minutes to Buona Vista interchange, this property sits in the heart of Singapore's tech hub. With a strong annual rental yield, it's an ideal portfolio addition or pivot home for future growth.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: "arc-at-tampines",
    name: "Arc at Tampines",
    address: "5 Tampines Avenue 8, Singapore 529596",
    addresses: [
      "5 Tampines Avenue 8, Singapore 529596",
      "7 Tampines Avenue 8, Singapore 529597",
      "9 Tampines Avenue 8, Singapore 529598",
      "11 Tampines Avenue 8, Singapore 529599"
    ],
    district: "D18",
    tenure: "99-year Leasehold",
    year: "2014",
    type: "Executive Condominium",
    coordinates: [1.3504793, 103.928823], 
    amenities: ["Lap Pool", "Gymnasium", "BBQ Area", "Jacuzzi", "Tennis Court", "Clubhouse", "Jogging Track"],
    nearbySchools: ["St. Hilda's Primary School (1km)", "Angsana Primary School (1-2km)", "Junyuan Primary School (1-2km)", "Poi Ching School (1-2km)", "Red Swastika School (1-2km)", "Tampins Primary School (1-2km)", "Yu Neng Primary School (1-2km)"],
    transport: ["Tampines West MRT (DT31)", "Easy access to expressway"],
    description: "Located at 5 Tampines Avenue 8, this modern executive condominium is situated in the vibrant District 18 neighbourhood of Tampines. Residents enjoy excellent connectivity with Tampines West MRT station located nearby, providing easy access to the rest of Singapore. <br/>Completed in 2014, this 99-year leasehold development consists of 574 units across 11 blocks. Developed by Hoi Hup Sunway Tampines Pte Ltd, the project offers a variety of 2, 3, and 4-bedroom layouts, catering to different family sizes and needs.",
    images: ["project_thumbnail/arc-ec-tampines.jpg"],
  },
  {
    id: "anchorvale-plains",
    name: "Anchorvale Plain",
    address: "353 Anchorvale Lane, Singapore 540353",
    addresses: [
      "353 Anchorvale Lane, Singapore 540353",
      "353A Anchorvale Lane, Singapore 541353",
      "353B Anchorvale Lane, Singapore 542353",
      "355A Anchorvale Lane, Singapore 541355",
      "356 Anchorvale Lane, Singapore 540356",
      "356A Anchorvale Lane, Singapore 541356",
      "356B Anchorvale Lane, Singapore 542356",
    ],
    district: "D19",
    tenure: "99-year Leasehold",
    year: "2021",
    type: "HDB",
    coordinates: [1.3926293, 103.8844285], // One North Gateway, Singapore
    amenities: "",
    nearbySchools: ["Springdale Primary School", "Nan Chiau Primary School", "Anchor Green Primary School", "Fern Green Primary School", "Fernvale Primary School", "Sengkang Green Primary School", "Compassvale Primary School", "Seng Kang Primary School"],
    transport: ["Tongkang LRT Station (SW7)"],
    description: "Anchorvale Plains is a 99-year leasehold HDB development in District 19, completed in 2019 with 7 blocks. Located at Anchorvale Lane, it offers convenient access to Tongkang LRT station within walking distance. The development is family-friendly with nearby schools including Anchor Green Primary and Springdale Primary.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  }
  
];

// Helper functions for project data
export const getProjectById = (projectId: string) => {
  return projects.find(p => p.id === projectId);
};

export const getProjectsByDistrict = (district: string) => {
  return projects.filter(p => p.district === district);
};

export const getAllProjects = () => {
  return projects;
}; 