"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/loyalty/Hero"
import Benefits from "@/components/loyalty/Benefits"
import Features from "@/components/loyalty/Features"
import Pricing from "@/components/loyalty/Pricing"
import Footer from "@/components/loyalty/Footer"
import HowItWorks from "@/components/loyalty/HowItWorks"
import SocialProof from "@/components/loyalty/SocialProof"
import WhatIs from "@/components/loyalty/WhatIs"
import FinalCTA from "@/components/loyalty/FinalCTA"
import Apps from "@/components/loyalty/Apps"
import Devices from "@/components/loyalty/Devices"
import { LandingHeader } from "@/components/landing/landing-header"
import { ScrollToTop } from "@/components/loyalty/ScrollToTop"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <LandingHeader />
      <main>
        <Hero />
        <SocialProof />
        <WhatIs />
        <Benefits />
        <Features />
        <HowItWorks />
        <Apps />
        <Devices />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
