import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onGoToAuth: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onGoToAuth }) => {
  return (
    <section id="tarifs" className="py-14 bg-[#F5EFE6] border-t border-sand-border px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-terracotta block mb-1">Investissement transparent</span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">
            Des forfaits adaptés à votre atelier
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light">Évoluez selon le rythme de vos confections et de vos fêtes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Plan Gratuit */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-linen-light rounded-2xl p-6 border border-sand-border card-shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Plan Gratuit</h3>
              <p className="text-xs text-neutral-500 mt-1">Pour débuter et tester</p>
              <div className="my-5">
                <span className="font-serif text-3xl font-bold text-charcoal">0 FG</span>
                <span className="text-xs text-neutral-500"> / mois</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-700 pb-6 border-b border-sand-border">
                {['5 clients par mois', '1 utilisateur', 'Fiches mesures de base'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-deep-green font-bold" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={onGoToAuth} className="mt-6 pill-btn block text-center py-3 px-5 rounded-full border border-charcoal/40 text-charcoal text-xs uppercase tracking-wider font-semibold hover:bg-charcoal hover:text-white transition-colors">
              Tester gratuitement
            </button>
          </motion.div>

          {/* Plan PRO */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-deep-green text-linen rounded-2xl p-6 sm:p-7 border-2 border-gold-sand shadow-2xl relative flex flex-col justify-between transform md:-translate-y-2"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-terracotta text-white font-sans text-[10px] uppercase font-bold tracking-widest py-1 px-3.5 rounded-full shadow-md">
              ★ LE PLUS POPULAIRE ★
            </div>
            <div>
              <div className="flex justify-between items-baseline mt-1">
                <h3 className="font-serif text-xl font-bold text-white">Plan PRO</h3>
                <span className="text-[10px] text-gold-sand uppercase tracking-widest font-semibold">Atelier Actif</span>
              </div>
              <p className="text-xs text-white/70 mt-1">La référence des maîtres couturiers</p>
              <div className="my-5">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white">50 000 FG</span>
                <span className="text-xs text-white/70"> / mois</span>
              </div>
              <ul className="space-y-2.5 text-xs text-white/90 pb-6 border-b border-white/20">
                {[
                  <strong>Clients & commandes ILLIMITÉS</strong>,
                  'Calcul automatique solde & acomptes',
                  'Galerie photos tissus illimitée (Wax, Bazin)',
                  'Export des fiches & reçus pour WhatsApp',
                  'Support prioritaire 7j/7'
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-gold-sand font-bold" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={onGoToAuth} className="mt-6 pill-btn block text-center py-3.5 px-6 rounded-full bg-terracotta text-white text-xs uppercase tracking-wider font-bold hover:bg-terracotta-dark transition-colors shadow-lg">
              Passer au Plan Pro
            </button>
          </motion.div>

          {/* Plan Business */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-linen-light rounded-2xl p-6 border border-sand-border card-shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Plan Business</h3>
              <p className="text-xs text-neutral-500 mt-1">Pour maisons de couture & équipes</p>
              <div className="my-5">
                <span className="font-serif text-3xl font-bold text-charcoal">90 000 FG</span>
                <span className="text-xs text-neutral-500"> / mois</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-700 pb-6 border-b border-sand-border">
                {[
                  "Multi-utilisateurs (jusqu'à 5 couturiers)",
                  'Suivi de performance des employés',
                  'Multi-ateliers ou boutiques',
                  "Formations personnalisées de l'équipe"
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-deep-green font-bold" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={onGoToAuth} className="mt-6 pill-btn block text-center py-3 px-5 rounded-full border border-charcoal/40 text-charcoal text-xs uppercase tracking-wider font-semibold hover:bg-charcoal hover:text-white transition-colors">
              Choisir Business
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};