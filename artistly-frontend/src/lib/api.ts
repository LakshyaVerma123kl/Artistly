import { Artist } from "@/lib/types"; // Adjust the path if needed

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://artistly-1jpx.onrender.com";

// Centralized response handler with better error handling
const handleResponse = async <T>(res: Response, retries = 1): Promise<T> => {
  console.log(`📡 API Response: ${res.status} - ${res.url}`);

  if (res.ok) {
    const data = await res.json();
    console.log("✅ API Success:", data);
    return data;
  }

  let errorData;
  try {
    errorData = await res.json();
  } catch {
    errorData = { message: `HTTP ${res.status}: ${res.statusText}` };
  }

  const message =
    errorData.message || `API error: ${res.status} ${res.statusText}`;
  console.error("❌ API Error:", { status: res.status, message, errorData });

  // Retry on rate limiting
  if (res.status === 429 && retries > 0) {
    console.log("⏳ Rate limited, retrying in 1.5s...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const originalRequest = new Request(res.url, {
      method: res.headers.get("x-original-method") || "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return fetch(originalRequest).then((retryRes) =>
      handleResponse<T>(retryRes, retries - 1)
    );
  }

  throw new Error(message);
};

export const api = {
  // ✅ GET all artists (optionally filtered)
  async getArtists(params?: {
    category?: string;
    location?: string;
    priceRange?: string;
  }): Promise<Artist[]> {
    try {
      const searchParams = new URLSearchParams();

      if (
        params?.category &&
        params.category.trim() !== "" &&
        params.category !== "all"
      ) {
        searchParams.append("category", params.category.trim());
      }
      if (
        params?.location &&
        params.location.trim() !== "" &&
        params.location !== "all"
      ) {
        searchParams.append("location", params.location.trim());
      }
      if (
        params?.priceRange &&
        params.priceRange.trim() !== "" &&
        params.priceRange !== "all"
      ) {
        searchParams.append("priceRange", params.priceRange.trim());
      }

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/api/artists${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("🔍 Fetching artists from:", url);
      console.log("📋 Query params:", params);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await handleResponse<Artist[]>(response);

      if (!Array.isArray(data)) {
        console.error("❌ Expected array but got:", typeof data, data);
        throw new Error("Invalid response format: expected array of artists");
      }

      // ✅ Clean invalid artist entries
      const cleaned = data.filter(
        (artist) => artist && (artist._id || artist.id) && artist.name
      );

      console.log(`✅ Successfully fetched ${cleaned.length} valid artists`);
      return cleaned;
    } catch (error) {
      console.error("❌ Failed to fetch artists:", error);
      throw error;
    }
  },

  // ✅ GET one artist by ID
  async getArtist(id: string): Promise<Artist> {
    try {
      const url = `${API_BASE_URL}/api/artists/${id}`;
      console.log("🔍 Fetching artist from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return await handleResponse<Artist>(response);
    } catch (error) {
      console.error(`❌ Failed to fetch artist ${id}:`, error);
      throw error;
    }
  },

  // ✅ POST create new artist
  async createArtist(data: Artist): Promise<Artist> {
    try {
      const url = `${API_BASE_URL}/api/artists`;
      console.log("➕ Creating artist:", data);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      return await handleResponse<Artist>(response);
    } catch (error) {
      console.error("❌ Failed to create artist:", error);
      throw error;
    }
  },

  // ✅ PUT update artist
  async updateArtist(id: string, data: Partial<Artist>): Promise<Artist> {
    try {
      const url = `${API_BASE_URL}/api/artists/${id}`;
      console.log(`🔄 Updating artist ${id}:`, data);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      return await handleResponse<Artist>(response);
    } catch (error) {
      console.error(`❌ Failed to update artist ${id}:`, error);
      throw error;
    }
  },

  // ✅ DELETE artist
  async deleteArtist(id: string): Promise<void> {
    try {
      const url = `${API_BASE_URL}/api/artists/${id}`;
      console.log(`🗑️ Deleting artist ${id}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        throw new Error(
          errorData.message || `Failed to delete artist: ${response.status}`
        );
      }

      console.log(`✅ Successfully deleted artist ${id}`);
      return;
    } catch (error) {
      console.error(`❌ Failed to delete artist ${id}:`, error);
      throw error;
    }
  },

  // ✅ POST upload image
  async uploadImage(file: File): Promise<{ filename: string; path: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = `${API_BASE_URL}/api/upload`;
      console.log("📤 Uploading image:", file.name);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      return await handleResponse<{ filename: string; path: string }>(response);
    } catch (error) {
      console.error("❌ Failed to upload image:", error);
      throw error;
    }
  },

  // ✅ GET health
  async getHealth(): Promise<{ message: string; endpoints: string[] }> {
    try {
      const url = `${API_BASE_URL}/api`;
      console.log("🏥 Checking API health");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return await handleResponse<{ message: string; endpoints: string[] }>(
        response
      );
    } catch (error) {
      console.error("❌ Health check failed:", error);
      throw error;
    }
  },

  // ✅ Connection test helper
  async testConnection(): Promise<boolean> {
    try {
      await this.getHealth();
      return true;
    } catch {
      return false;
    }
  },
};

export default api;
