"use client";
import { useState, useCallback, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import ArtistCard from "@/components/ui/ArtistCard";
import FilterBlock from "@/components/ui/FilterBlock";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw, AlertCircle } from "lucide-react";
import { Artist } from "@/lib/types";
import { api } from "@/lib/api";

export default function ArtistsPage() {
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch all artists on initial load
  const loadArtists = async (filters?: {
    category?: string;
    location?: string;
    priceRange?: string;
  }) => {
    try {
      setIsLoading(true);
      setError("");

      const data = await api.getArtists(filters);
      console.log("✅ Artists loaded:", data);
      setFilteredArtists(data);
    } catch (err) {
      console.error("❌ Failed to fetch artists:", err);
      setError(err instanceof Error ? err.message : "Failed to load artists");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Now use it safely here:
  useEffect(() => {
    loadArtists();
  }, []);

  // Handle filter changes
  const handleFilter = useCallback(
    async ({
      category,
      location,
      priceRange,
    }: {
      category: string;
      location: string;
      priceRange: string;
    }) => {
      const filters = {
        ...(category && { category }),
        ...(location && { location }),
        ...(priceRange && { priceRange }),
      };

      await loadArtists(filters);
    },
    []
  );

  // Handle artist deletion with better error handling
  const handleDeleteArtist = useCallback(async (artistId: string) => {
    try {
      console.log("🗑️ Deleting artist with ID:", artistId);

      await api.deleteArtist(artistId);

      // Remove from local state immediately for better UX
      setFilteredArtists((prev) =>
        prev.filter((artist) => String(artist.id || artist._id) !== artistId)
      );

      console.log("✅ Artist deleted successfully");

      // Optionally show a success message
      // You can replace this with a toast notification if you have one
      setTimeout(() => {
        // This could be a toast notification instead
        console.log("Artist removed from view");
      }, 500);
    } catch (error) {
      console.error("❌ Failed to delete artist:", error);

      // Re-throw to let the component handle the error display
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete artist"
      );
    }
  }, []);

  // Retry loading artists
  const handleRetry = () => {
    loadArtists();
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  };

  // Loading component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Loading artists...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error && filteredArtists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to Load Artists
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button
              onClick={handleRetry}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4"
      >
        <Head>
          <title>Artistly - Browse Artists</title>
          <meta
            name="description"
            content="Browse and filter artists for your events."
          />
        </Head>

        <div className="max-w-6xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Discover Talented Artists
          </motion.h1>

          {/* Filter Section */}
          <div className="md:flex md:space-y-0 space-y-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2"
              aria-label={showFilters ? "Hide filters" : "Show filters"}
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </Button>
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-auto`}
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
                <FilterBlock onFilter={handleFilter} />
              </div>
            </div>
          </div>

          {/* Show error banner if there's an error but we still have artists */}
          {error && filteredArtists.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  Some operations may not work properly: {error}
                </p>
              </div>
            </div>
          )}

          {/* Artist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist, index) => {
                const normalizedArtist = {
                  ...artist,
                  id: artist._id ?? artist.id,
                };

                return (
                  <motion.div
                    key={normalizedArtist.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <ArtistCard
                      artist={normalizedArtist}
                      onDelete={handleDeleteArtist}
                    />
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center">
                <p className="text-md font-medium text-gray-600 dark:text-gray-300">
                  No artists found.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Try adjusting your filters or submit one via the onboarding
                  form.
                </p>
                <Button
                  onClick={() => loadArtists()}
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Suspense>
  );
}
