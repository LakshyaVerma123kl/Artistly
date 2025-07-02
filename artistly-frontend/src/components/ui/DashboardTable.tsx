"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Artist } from "@/lib/types";
import { Eye, Star, MapPin, Users, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DashboardTable({
  artists,
  onDeleteArtist,
}: {
  artists: Artist[];
  onDeleteArtist: (id: string | number) => void;
}) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handleViewProfile = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleContact = (artist: Artist) => {
    const message = `Hi ${artist.name}, I'm interested in booking you for an event. Please let me know your availability.`;
    alert(`Contact initiated with ${artist.name}!\n\nMessage: ${message}`);
  };

  const handleDelete = (artist: Artist) => {
    if (confirm(`Are you sure you want to delete ${artist.name}?`)) {
      onDeleteArtist(artist.id!);
    }
  };

  return (
    <>
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/20 overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none">
              <TableHead className="p-6 font-semibold text-white text-left">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Artist</span>
                </div>
              </TableHead>
              <TableHead className="p-6 font-semibold text-white text-left">
                Category
              </TableHead>
              <TableHead className="p-6 font-semibold text-white text-left">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
              </TableHead>
              <TableHead className="p-6 font-semibold text-white text-left">
                Fee Range
              </TableHead>
              <TableHead className="p-6 font-semibold text-white text-left">
                Rating
              </TableHead>
              <TableHead className="p-6 font-semibold text-white text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.length ? (
              artists.map((artist, index) => (
                <TableRow
                  key={artist.id}
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all duration-300 border-b border-gray-200/50 dark:border-gray-700/50 group"
                  style={{
                    animationName: "fadeIn",
                    animationDuration: "0.5s",
                    animationTimingFunction: "ease-out",
                    animationFillMode: "forwards",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center border border-purple-200 dark:border-purple-700">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {artist.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {artist.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Professional Artist
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                      {artist.category}
                    </span>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 font-medium">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>{artist.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {artist.priceRange}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Starting price
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        4.8
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        (124)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(artist)}
                        className="border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-xl group"
                      >
                        <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleContact(artist)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group"
                      >
                        <span className="group-hover:scale-105 transition-transform duration-200">
                          Contact
                        </span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(artist)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 group"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        No artists found
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Start by adding some artist submissions to see them
                        here.
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedArtist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Artist Profile
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedArtist(null)}
                className="rounded-full w-8 h-8 p-0"
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedArtist.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedArtist.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedArtist.category}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Location:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedArtist.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Price Range:
                  </span>
                  <span className="font-medium text-green-600">
                    {selectedArtist.priceRange}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rating:
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      4.8
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => handleContact(selectedArtist)}
                >
                  Contact Artist
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedArtist(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
