export interface Artist {
  id: string | number;
  name: string;
  category: string;
  priceRange: string;
  location: string;
  image: string;
  categories?: string[]; // Optional to support existing artists without categories
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
