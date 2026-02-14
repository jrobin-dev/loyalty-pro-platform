"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { ClientLogos } from "@/components/landing/client-logos"
import { FeaturesSection } from "@/components/landing/features-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { NewsletterSection } from "@/components/landing/newsletter-section"
import { LandingFooter } from "@/components/landing/landing-footer"
import { FAQSection } from "@/components/landing/faq-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden selection:bg-emerald-500/30">
      <LandingHeader />
      <main>
        <HeroSection />
        <ClientLogos />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
      </main>
      <LandingFooter />
    </div>
  )
}
