"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import OnboardingForm from "@/components/ui/OnboardingForm";
import Head from "next/head";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Head>
          <title>Artistly - Onboard Artist</title>
          <meta name="description" content="Submit artist profile for review" />
        </Head>

        <div className="max-w-3xl mx-auto space-y-8">
          <motion.h1
            className="text-3xl font-bold text-center bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Artist Onboarding Form
          </motion.h1>

          <OnboardingForm />
        </div>
      </motion.div>
    </Suspense>
  );
}
