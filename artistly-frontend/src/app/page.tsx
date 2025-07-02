"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, Mic, Users, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const categories = [
    { name: "Singer", icon: Mic, description: "Professional vocalists" },
    { name: "Web3", icon: Sparkles, description: "Digital creators" },
    { name: "DJ", icon: Music, description: "Music mixers" },
    { name: "Speaker", icon: Users, description: "Thought leaders" },
  ];

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Head>
          <title>Artistly - Connect with Performing Artists</title>
          <meta
            name="description"
            content="Discover and book performing artists for your events. Simple, elegant, effective."
          />
        </Head>

        {/* Hero Section */}
        <motion.section
          className="px-6 py-16 md:py-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-light mb-6 text-gray-900 dark:text-white"
              variants={itemVariants}
            >
              Artistly
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 font-light leading-relaxed max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Connect with top performing artists for your events
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/artists">
                <Button
                  size="lg"
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium px-6 py-3 rounded-full transition-all duration-300 group border-0"
                >
                  <span>Explore Artists</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section
          className="px-6 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-3">
                Categories
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 font-light">
                Find the perfect artist for your event
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                >
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-md">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-colors duration-300">
                      <category.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="px-6 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-8 font-light max-w-2xl mx-auto">
                Whether you&apos;re booking talent or showcasing your skills,
                we&apos;re here to help
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/artists">
                  <Button
                    size="lg"
                    className="bg-purple-600 dark:bg-purple-600 text-white hover:bg-purple-700 dark:hover:bg-purple-700 font-medium px-6 py-2 rounded-full transition-all duration-200 border-0"
                  >
                    Browse Artists
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/30 font-medium px-6 py-2 rounded-full transition-colors duration-200 bg-transparent"
                  >
                    Join as Artist
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <div className="h-16" />
      </div>
    </Suspense>
  );
}
