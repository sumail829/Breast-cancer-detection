import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import TestimonialsSection from '@/components/landing/testimonials-section';
import Footer from '@/components/landing/footer';
import { LandingHeader } from '@/components/landing/homepage';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}