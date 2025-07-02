import { Artist } from "@/lib/types"; // Adjust the path if needed

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://artistly-1jpx.onrender.com";

// Centralized response handler
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${res.status}`);
  }
  return res.json();
};

export const api = {
  // GET all artists (optionally filtered)
  getArtists: (params?: {
    category?: string;
    location?: string;
    priceRange?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.location) searchParams.append("location", params.location);
    if (params?.priceRange)
      searchParams.append("priceRange", params.priceRange);

    const queryString = searchParams.toString();
    return fetch(
      `${API_BASE_URL}/api/artists${queryString ? `?${queryString}` : ""}`
    ).then(handleResponse) as Promise<Artist[]>;
  },

  // GET one artist by ID
  getArtist: (id: string) =>
    fetch(`${API_BASE_URL}/api/artists/${id}`).then(
      handleResponse
    ) as Promise<Artist>,

  // POST create new artist
  createArtist: (data: Artist) =>
    fetch(`${API_BASE_URL}/api/artists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse) as Promise<Artist>,

  // PUT update artist
  updateArtist: (id: string, data: Partial<Artist>) =>
    fetch(`${API_BASE_URL}/api/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse) as Promise<Artist>,

  // DELETE artist
  deleteArtist: (id: string) =>
    fetch(`${API_BASE_URL}/api/artists/${id}`, {
      method: "DELETE",
    }).then(handleResponse) as Promise<{ message: string }>,

  // POST upload image
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    }).then(handleResponse) as Promise<{ imageUrl: string }>;
  },

  // GET health (optional backend check)
  getHealth: () =>
    fetch(`${API_BASE_URL}/api`).then(handleResponse) as Promise<{
      message: string;
      endpoints: string[];
    }>,
};

export default api;
