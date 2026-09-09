import React from 'react';
import { Header } from './Landing/Header';
import { BrandTicker } from './Landing/BrandTicker';
import { HeroSection } from './Landing/HeroSection';
import { ProblemSection } from './Landing/ProblemSection';
import { FeaturesSection } from './Landing/FeaturesSection';
import { HowItWorksSection } from './Landing/HowItWorksSection';
import { TestimonialsSection } from './Landing/TestimonialsSection';
import { PricingSection } from './Landing/PricingSection';
import { CtaSection } from './Landing/CtaSection';
import { Footer } from './Landing/Footer';

interface LandingPageProps {
  onGoToAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  return (
    <div className="bg-linen text-charcoal min-h-screen flex flex-col overflow-x-hidden selection:bg-terracotta selection:text-white">
      <Header onGoToAuth={onGoToAuth} />
      <BrandTicker />
      
      <main className="flex-grow">
        <HeroSection onGoToAuth={onGoToAuth} />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection onGoToAuth={onGoToAuth} />
        <CtaSection onGoToAuth={onGoToAuth} />
      </main>
      
      <Footer />
    </div>
  );
};
