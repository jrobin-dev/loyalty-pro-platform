import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { StatsSection } from "@/components/landing/stats-section"
import { ClientLogos } from "@/components/landing/client-logos"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FAQSection } from "@/components/landing/faq-section"
import { NewsletterSection } from "@/components/landing/newsletter-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
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
