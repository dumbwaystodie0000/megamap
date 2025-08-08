// Project data structure - project-level information only
export interface Project {
  id: string;
  name: string;
  address: string;
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