"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Artist } from "@/lib/types";
import {
  MapPin,
  Star,
  MessageCircle,
  Heart,
  Users,
  Calendar,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ArtistCard({ artist }: { artist: Artist }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Normalize ID to work with _id or id
  const normalizedId = String(artist.id || artist._id);

  useEffect(() => {
    const storedArtists: Artist[] = JSON.parse(
      localStorage.getItem("artists") || "[]"
    );
    setIsAdded(storedArtists.some((a) => String(a.id) === normalizedId));
  }, [normalizedId]);

  const handleQuoteRequest = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert(`Quote request sent to ${artist.name}!`);
  };

  const handleLike = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter")
      return;
    setIsLiked(!isLiked);
  };

  const handleAddToDashboard = () => {
    const storedArtists: Artist[] = JSON.parse(
      localStorage.getItem("artists") || "[]"
    );
    if (storedArtists.some((a) => String(a.id) === normalizedId)) {
      alert(`${artist.name} is already added to the dashboard.`);
      return;
    }

    const newArtist = {
      ...artist,
      id: normalizedId,
    };
    storedArtists.push(newArtist);
    localStorage.setItem("artists", JSON.stringify(storedArtists));
    setIsAdded(true);
    alert(`${artist.name} added to dashboard!`);
  };

  const getImageSrc = () => {
    if (imageError) {
      return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=face";
    }

    const img = artist.image;
    if (!img)
      return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=face";

    return img.startsWith("/uploads/") ? `http://localhost:3001${img}` : img;
  };

  return (
    <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-md mx-auto overflow-hidden border border-gray-200/20 dark:border-gray-700/20">
      {/* Premium Badge */}
      <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-2 py-1 rounded-sm text-xs font-medium flex items-center space-x-1 shadow-sm">
        <Star className="w-3 h-3" />
        <span>4.8</span>
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-[3/2] relative">
          <Image
            src={getImageSrc()}
            alt={artist.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
            onError={() => setImageError(true)}
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button
              onClick={handleLike}
              onKeyDown={handleLike}
              tabIndex={0}
              aria-label={isLiked ? "Unlike artist" : "Like artist"}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                isLiked
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 border-gray-200 dark:border-gray-700"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-sm text-xs font-medium flex items-center space-x-1 shadow-sm">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
            {artist.name}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-xs font-medium">
              {artist.category}
            </span>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-1 text-purple-500" />
              {artist.location}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Starting from
            </span>
            <span className="text-xl font-bold text-green-600">
              {artist.priceRange}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-purple-500" />
              <span>50+ events</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-blue-500" />
              <span>This month</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleQuoteRequest}
            disabled={isLoading}
            aria-label="Request a quote"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              <span>Get Quote</span>
            )}
          </Button>
          <Button
            variant="outline"
            aria-label="Send message"
            className="px-3 py-2 text-sm rounded-lg border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleAddToDashboard}
            disabled={isAdded}
            aria-label={
              isAdded
                ? "Artist already added to dashboard"
                : "Add artist to dashboard"
            }
            className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
              isAdded
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1">
          {(artist.categories || [artist.category]).map(
            (tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-0.5 ring-purple-400/10 transition-all duration-200 pointer-events-none" />
    </div>
  );
}
