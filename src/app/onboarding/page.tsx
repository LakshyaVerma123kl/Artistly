"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import OnboardingForm from "@/components/ui/OnboardingForm";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8"
      >
        <Head>
          <title>Artistly - Artist Onboarding</title>
          <meta
            name="description"
            content="Join Artistly as a performing artist and showcase your talent."
          />
          <meta
            name="keywords"
            content="artist onboarding, performing arts, booking platform"
          />
        </Head>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Artist Onboarding
          </h1>
          <OnboardingForm />
        </div>
      </motion.div>
    </Suspense>
  );
}
