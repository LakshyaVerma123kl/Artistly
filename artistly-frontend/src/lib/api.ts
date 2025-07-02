import { Artist } from "@/lib/types"; // Adjust the path if needed

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://artistly-1jpx.onrender.com";

// Centralized response handler
const handleResponse = async <T>(res: Response, retries = 1): Promise<T> => {
  if (res.ok) return res.json();

  const errorData = await res.json().catch(() => ({}));
  const message = errorData.message || `API error: ${res.status}`;

  if (res.status === 429 && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return fetch(res.url, res).then((retryRes) =>
      handleResponse<T>(retryRes, retries - 1)
    );
  }

  throw new Error(message);
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

  // DELETE artist (Updated to void return + custom error message)
  async deleteArtist(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/artists/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete artist: ${res.status}`
      );
    }

    // Successful deletion returns void
    return;
  },

  // POST upload image
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    }).then(handleResponse) as Promise<{ filename: string; path: string }>;
  },

  // GET health (optional backend check)
  getHealth: () =>
    fetch(`${API_BASE_URL}/api`).then(handleResponse) as Promise<{
      message: string;
      endpoints: string[];
    }>,
};

export default api;
