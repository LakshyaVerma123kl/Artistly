"use client";
import { useState, useCallback, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import ArtistCard from "@/components/ui/ArtistCard";
import FilterBlock from "@/components/ui/FilterBlock";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import data from "@/lib/data.json";
import { Artist } from "@/lib/types";

export default function ArtistsPage() {
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load artists from localStorage and combine with static data
  useEffect(() => {
    const storedArtists: Artist[] = JSON.parse(
      localStorage.getItem("artists") || "[]"
    );
    const allArtists = [...data.artists, ...storedArtists].reduce(
      (acc: Artist[], artist) => {
        if (!acc.find((a) => a.id === String(artist.id))) {
          acc.push({ ...artist, id: String(artist.id) });
        }
        return acc;
      },
      []
    );
    setFilteredArtists(allArtists);
  }, []);

  // Memoize the filter handler
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
      const storedArtists: Artist[] = JSON.parse(
        localStorage.getItem("artists") || "[]"
      );
      const allArtists = [...data.artists, ...storedArtists].reduce(
        (acc: Artist[], artist) => {
          if (!acc.find((a) => a.id === String(artist.id))) {
            acc.push({ ...artist, id: String(artist.id) });
          }
          return acc;
        },
        []
      );
      let filtered = allArtists;
      if (category)
        filtered = filtered.filter((artist) => artist.category === category);
      if (location)
        filtered = filtered.filter((artist) => artist.location === location);
      if (priceRange)
        filtered = filtered.filter(
          (artist) => artist.priceRange === priceRange
        );
      setFilteredArtists(filtered);
    },
    []
  );

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  };

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

          {/* Filter Toggle for Mobile */}
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

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <ArtistCard artist={artist} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center">
                <p className="text-md font-medium text-gray-600 dark:text-gray-300">
                  No artists found.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Suspense>
  );
}
