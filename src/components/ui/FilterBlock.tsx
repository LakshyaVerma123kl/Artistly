"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterBlock({
  onFilter,
}: {
  onFilter: (filters: {
    category: string;
    location: string;
    priceRange: string;
  }) => void;
}) {
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Memoize the filter application to prevent infinite loops
  const applyFilters = useCallback(() => {
    onFilter({
      category: category === "all" ? "" : category,
      location: location === "all" ? "" : location,
      priceRange: priceRange === "all" ? "" : priceRange,
    });
  }, [category, location, priceRange, onFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {["Singer", "Dancer", "DJ", "Speaker"].map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger>
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {["Mumbai", "Delhi", "Bangalore", "Pune"].map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priceRange} onValueChange={setPriceRange}>
        <SelectTrigger>
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          {["₹50K-1L", "₹1L-3L", "₹2L-5L", "₹5L-10L"].map((price) => (
            <SelectItem key={price} value={price}>
              {price}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
