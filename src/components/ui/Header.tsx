"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "@/app/layout";
import {
  Menu,
  X,
  Sun,
  Moon,
  Music,
  Plus,
  Users,
  LayoutDashboard,
  Home,
} from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext)! as {
    theme: string;
    toggleTheme: () => void;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/artists", label: "Artists", icon: Users },
    { href: "/onboarding", label: "Join Us", icon: Plus },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Artistly
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Connect • Create • Celebrate
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group"
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="sm"
                className="relative border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`w-4 h-4 absolute transition-all duration-500 ${
                      theme === "light"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-0"
                    }`}
                  />
                  <Moon
                    className={`w-4 h-4 absolute transition-all duration-500 ${
                      theme === "dark"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-0"
                    }`}
                  />
                </div>
                <span className="ml-2 hidden sm:inline">
                  {theme === "light" ? "Dark" : "Light"}
                </span>
              </Button>

              {/* CTA Button */}
              <Link href="/onboarding" className="hidden sm:block">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 group">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Join as Artist</span>
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                onClick={toggleMenu}
                variant="outline"
                size="sm"
                className="md:hidden border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
              >
                <div className="relative w-5 h-5">
                  <Menu
                    className={`w-4 h-4 absolute transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-0 rotate-90 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    className={`w-4 h-4 absolute transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-0"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-6 pb-6 space-y-2 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isMenuOpen
                    ? "slideInLeft 0.3s ease-out forwards"
                    : "none",
                }}
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link href="/onboarding" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Join as Artist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
