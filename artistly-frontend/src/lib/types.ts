export interface Artist {
  _id?: string; // From MongoDB
  id?: string | number; // Normalized for frontend use
  name: string;
  category: string;
  priceRange: string;
  location: string;
  image: string;
  categories?: string[];
  bio?: string;
  languages?: string[];
  phone?: string;
  email?: string;
  experience?: string;
}

export interface FormData {
  name: string;
  bio: string;
  categories: string[];
  languages: string[];
  feeRange: string;
  location: string;
  profileImage?: FileList;
  phone: string;
  email: string;
  experience: string;
}
