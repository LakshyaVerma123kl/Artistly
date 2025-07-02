"use client";
import { ReactNode, useState, useEffect, createContext } from "react";
import Head from "next/head";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggleTheme: () => void;
} | null>(null);

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    localStorage.setItem("theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <html lang="en" className={inter.className}>
      <Head>
        <title>Artistly</title>
        <meta name="description" content="Connect with performing artists" />
      </Head>
      <body className="min-h-screen flex flex-col">
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
