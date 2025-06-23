"use client";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import DashboardTable from "@/components/ui/DashboardTable";
import { Artist } from "@/lib/types";

export default function DashboardPage() {
  const [artists, setArtists] = useState<Artist[]>([
    {
      id: "1",
      name: "Arijit Singh",
      category: "Singer",
      priceRange: "₹5L-10L",
      location: "Mumbai",
      image: "/images/artist1.jpg",
    },
    {
      id: "2",
      name: "Nritya Dance Co.",
      category: "Dancer",
      priceRange: "₹1L-3L",
      location: "Delhi",
      image: "/images/artist2.jpg",
    },
    {
      id: "3",
      name: "DJ Sukh",
      category: "DJ",
      priceRange: "₹2L-5L",
      location: "Bangalore",
      image: "/images/artist3.jpg",
    },
    {
      id: "4",
      name: "Ravi Sharma",
      category: "Speaker",
      priceRange: "₹50K-1L",
      location: "Pune",
      image: "/images/artist4.jpg",
    },
  ]);

  // Load and deduplicate artists from localStorage
  const loadArtists = () => {
    const storedArtists: Artist[] = JSON.parse(
      localStorage.getItem("artists") || "[]"
    );
    // Deduplicate stored artists by ID, keeping the last occurrence
    const uniqueStoredArtists = storedArtists.reduce(
      (acc: Artist[], artist) => {
        const existingIndex = acc.findIndex((a) => a.id === String(artist.id));
        if (existingIndex !== -1) {
          acc[existingIndex] = { ...artist, id: String(artist.id) };
        } else {
          acc.push({ ...artist, id: String(artist.id) });
        }
        return acc;
      },
      []
    );

    // Save deduplicated artists back to localStorage
    localStorage.setItem("artists", JSON.stringify(uniqueStoredArtists));

    // Combine with hardcoded artists, ensuring no duplicates
    setArtists((prevArtists) => {
      const allArtists = [...prevArtists, ...uniqueStoredArtists];
      const uniqueArtists = allArtists.reduce((acc: Artist[], artist) => {
        const existingIndex = acc.findIndex((a) => a.id === String(artist.id));
        if (existingIndex !== -1) {
          acc[existingIndex] = { ...artist, id: String(artist.id) };
        } else {
          acc.push({ ...artist, id: String(artist.id) });
        }
        return acc;
      }, []);
      return uniqueArtists;
    });
  };

  // Load artists on mount and listen for localStorage changes
  useEffect(() => {
    loadArtists();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "artists") {
        loadArtists();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleDeleteArtist = (id: string | number) => {
    // Update localStorage
    const storedArtists: Artist[] = JSON.parse(
      localStorage.getItem("artists") || "[]"
    );
    const updatedStoredArtists = storedArtists.filter(
      (artist) => artist.id !== String(id)
    );
    localStorage.setItem("artists", JSON.stringify(updatedStoredArtists));

    // Update state
    setArtists((prevArtists) =>
      prevArtists.filter((artist) => artist.id !== String(id))
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Head>
          <title>Artistly - Manager Dashboard</title>
          <meta name="description" content="Manage artist submissions." />
        </Head>
        <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
        <DashboardTable artists={artists} onDeleteArtist={handleDeleteArtist} />
      </motion.div>
    </Suspense>
  );
}
