"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import ArtistCard from "@/components/ui/ArtistCard";
import FilterBlock from "@/components/ui/FilterBlock";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw, AlertCircle } from "lucide-react";
import { Artist } from "@/lib/types";
import { api } from "@/lib/api";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const loadArtists = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getArtists();
      setArtists(data);
      setFilteredArtists(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load artists");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  const handleFilter = useCallback(
    ({
      category,
      location,
      priceRange,
    }: {
      category: string;
      location: string;
      priceRange: string;
    }) => {
      let filtered = [...artists];
      if (category && category !== "all")
        filtered = filtered.filter((a) => a.category === category);
      if (location && location !== "all")
        filtered = filtered.filter((a) => a.location === location);
      if (priceRange && priceRange !== "all")
        filtered = filtered.filter((a) => a.priceRange === priceRange);
      setFilteredArtists(filtered);
    },
    [artists]
  );

  const handleDeleteArtist = useCallback(async (artistId: string) => {
    try {
      await api.deleteArtist(artistId);
      setArtists((prev) =>
        prev.filter((a) => String(a.id || a._id) !== artistId)
      );
      setFilteredArtists((prev) =>
        prev.filter((a) => String(a.id || a._id) !== artistId)
      );
    } catch (error) {
      console.error("Failed to delete artist:", error);
    }
  }, []);

  const handleRetry = () => loadArtists();

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center text-gray-600 dark:text-gray-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading artists...</p>
        </div>
      </div>
    );
  }

  if (error && filteredArtists.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center text-center">
        <div>
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Failed to Load Artists</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
          <Button
            onClick={handleRetry}
            className="mt-4 bg-purple-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
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
        </Head>

        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Discover Talented Artists
          </h1>

          <div className="md:flex md:space-y-0 space-y-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full bg-purple-600 text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-auto`}
            >
              <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6">
                <FilterBlock onFilter={handleFilter} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist, index) => {
              const normalizedArtist = {
  ...artist,
  id: artist._id ?? artist.id,
  name: artist.name?.trim() || "Unnamed Artist",
  category: artist.category?.trim() || "Uncategorized",
  location: artist.location?.trim() || "Unknown",
  priceRange: artist.priceRange?.trim() || "",
  image:
    artist.image && artist.image.trim() !== ""
      ? artist.image
      : "/placeholder.jpg",
};

              return (
                <motion.div
                  key={normalizedArtist.id || `artist-${index}`}
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
            })}
          </div>

          {filteredArtists.length === 0 && (
            <div className="col-span-full bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-6 text-center">
              <p className="text-md font-medium text-gray-600 dark:text-gray-300">
                No artists found.
              </p>
              <Button onClick={handleRetry} variant="outline" className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </Suspense>
  );
}
