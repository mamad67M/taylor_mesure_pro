import React from 'react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onGoToAuth: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGoToAuth }) => {
  return (
    <section className="pt-8 pb-14 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-6 bg-terracotta"></span>
          <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-terracotta font-sans">
            TAILORMESURE PRO — LOGICIEL D'ATELIER & COUTURE
          </p>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-charcoal mb-4 uppercase">
          Fini les carnets perdus et les commandes dépassées.
        </h1>

        <p className="text-neutral-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-light mb-6">
          L'application moderne conçue pour les maîtres tailleurs et créateurs ouest-africains : gérez vos clients, mesures exactes, acomptes et livraisons en toute sérénité.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToAuth} 
            className="pill-btn inline-flex justify-center items-center py-3.5 px-7 rounded-full bg-charcoal text-linen font-medium text-xs tracking-wider uppercase hover:bg-terracotta transition-colors shadow-sm"
          >
            Commencer gratuitement
          </motion.button>
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#mockup-interactive" 
            className="pill-btn inline-flex justify-center items-center py-3.5 px-7 rounded-full border border-charcoal/30 bg-transparent text-charcoal font-medium text-xs tracking-wider uppercase hover:bg-charcoal/5 transition-colors"
          >
            Voir la démo
          </motion.a>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden border border-sand-border mb-8 shadow-xl"
      >
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuARKNk0uUWd01IwwaABwNYflRmVH2_3rbYKB1f8jqWvt65wUbKgVdbLbg9OpY9zYtOjHugy2jkEHqnnmjEMum2N0P5GOTu-w0j2dUHNAzXidLd69WnshyTmmEXx6nigmqtTPE_SaHUiNgFTe0fYVSwbfU7XKo3ZSSKKr7awTJFSQALvfKfajGXdQUe6_nV7dveObtwgjF6hrjoJx8tlm7gmAuf0VtCgNvlqVi9eRlANe9LjzmRX0OClcw" 
          alt="Maître tailleur ouest-africain dans son atelier" 
          className="w-full h-[320px] sm:h-[420px] object-cover object-center transform hover:scale-[1.01] transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-linen flex items-end justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase bg-terracotta/90 px-2.5 py-1 rounded-full text-white font-semibold">Atelier Prestige</span>
            <p className="font-serif text-sm sm:text-base mt-1 italic text-white/90">Dakar • Abidjan • Conakry • Bamako • Cotonou</p>
          </div>
          <span className="text-[11px] font-sans text-white/80 hidden sm:inline-block">Confection d'artisanat d'art & Bazin</span>
        </div>
      </motion.div>

      {/* Interactive Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        id="mockup-interactive" 
        className="bg-linen-light rounded-2xl border border-sand-border p-4 sm:p-6 card-shadow"
      >
        <div className="flex items-center justify-between pb-3 border-b border-sand-border mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">Cockpit Maître Tailleur</span>
          </div>
          <span className="text-[11px] font-semibold text-deep-green bg-deep-green/10 px-2.5 py-0.5 rounded-full">Commande active</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-sand-border mb-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Client & Modèle</p>
              <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal">Amadou Diallo</h3>
              <p className="text-xs text-neutral-600">Boubou 3 pièces Royal</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta bg-terracotta/10 px-2 py-1 rounded-md">
              En confection (80%)
            </span>
          </div>

          <div className="flex items-center gap-2.5 mt-2.5 pt-2.5 border-t border-neutral-100">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-900 border border-gold-sand shadow-inner flex-shrink-0" title="Échantillon Bazin Riche Teint Artisanal"></div>
            <div className="truncate">
              <span className="text-[11px] text-neutral-500 block">Tissu sélectionné</span>
              <span className="text-xs font-medium text-charcoal">Bazin Riche Teint Artisanal & Broderie Or</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-linen rounded-xl p-3 border border-sand-border mb-3 text-center">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold">Total</p>
            <p className="text-xs sm:text-sm font-bold text-charcoal">150 000 FG</p>
          </div>
          <div className="border-x border-sand-border">
            <p className="text-[9px] uppercase tracking-wider text-deep-green font-semibold">Acompte</p>
            <p className="text-xs sm:text-sm font-bold text-deep-green">100 000 FG</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-terracotta font-semibold">Reste</p>
            <p className="text-xs sm:text-sm font-bold text-terracotta">50 000 FG</p>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-3 border border-sand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Fiche mesure rapide</span>
            <span className="text-[10px] font-mono text-neutral-400">4 / 25 points</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {['Tour de cou', 'Épaules', 'Poitrine', 'Longueur'].map((label, i) => (
              <div key={label} className="bg-linen p-2 rounded-lg border border-neutral-200/50">
                <span className="text-[10px] text-neutral-500 block">{label}</span>
                <span className="font-bold text-charcoal">{['42 cm', '48 cm', '104 cm', '145 cm'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};