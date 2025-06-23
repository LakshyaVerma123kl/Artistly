"use client";
import Link from "next/link";
import {
  Music,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Artists", href: "/artists" },
    { name: "Join Us", href: "/onboarding" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const categories = [
    "Singers",
    "Dancers",
    "Musicians",
    "Speakers",
    "DJs",
    "Comedians",
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Artistly
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Connect • Create • Celebrate
                </p>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Connecting talented performers with event planners worldwide.
              Discover amazing artists for your next event.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
                >
                  <social.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-600 transition-colors duration-300"></span>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={`/artists?category=${category.toLowerCase()}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600 transition-colors duration-300"></span>
                    <span className="font-medium">{category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 group">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <Mail className="w-4 h-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                </div>
                <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300 font-medium">
                  hello@artistly.com
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 group">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <Phone className="w-4 h-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                </div>
                <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300 font-medium">
                  +91 98765XXXXX
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 group">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-4 h-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                </div>
                <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300 font-medium">
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                © {currentYear} Artistly. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>for artists worldwide</span>
              </div>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
              >
                Terms of Service
              </Link>
              <Link
                href="/support"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
