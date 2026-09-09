import React from 'react';
import { motion } from 'motion/react';

interface CtaSectionProps {
  onGoToAuth: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onGoToAuth }) => {
  return (
    <section className="py-16 px-4 sm:px-6 bg-deep-green text-linen relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D1A358_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-sand block mb-3">Rejoignez l'Excellence</span>
        <h2 className="font-serif-editorial text-2xl sm:text-4xl md:text-5xl font-normal leading-tight uppercase mb-4 text-white">
          Rejoignez les tailleurs qui gèrent leur atelier comme des pros.
        </h2>
        <p className="text-xs sm:text-base text-white/80 max-w-xl mx-auto font-light leading-relaxed mb-8">
          Commencez dès aujourd'hui sans carte bancaire et révolutionnez votre quotidien d'artisan créateur.
        </p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoToAuth} 
          className="pill-btn inline-flex items-center justify-center py-4 px-9 rounded-full bg-terracotta text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-terracotta-dark transition-all shadow-xl hover:shadow-2xl"
        >
          Commencer gratuitement
        </motion.button>
        <p className="text-[11px] text-white/50 mt-3">Essai immédiat • Sans engagement • Support en français</p>
      </div>
    </section>
  );
};