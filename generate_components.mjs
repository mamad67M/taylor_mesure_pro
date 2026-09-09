import fs from 'fs';
import path from 'path';

const components = {
  'Header.tsx': `
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onGoToAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoToAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Le Problème', href: '#probleme' },
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Comment ça marche', href: '#etapes' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'Forfaits', href: '#tarifs' },
  ];

  return (
    <>
      <header className={\`sticky top-0 z-50 transition-all duration-300 \${isScrolled ? 'bg-linen/95 backdrop-blur-md border-b border-sand-border shadow-sm' : 'bg-transparent'}\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group focus:outline-none" aria-label="Page d'accueil TailorMesure Pro">
            <motion.span 
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="w-8 h-8 rounded-full bg-deep-green text-linen flex items-center justify-center font-serif text-xs font-semibold tracking-wider"
            >
              TM
            </motion.span>
            <div className="flex flex-col">
              <span className="font-serif-editorial text-base sm:text-lg font-bold tracking-tight text-charcoal leading-none">
                TAILORMESURE<span className="text-terracotta ml-0.5">PRO</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Atelier OS</span>
            </div>
          </a>

          <div className="flex items-center gap-2.5">
            <a href="#tarifs" className="hidden sm:inline-flex text-xs uppercase tracking-widest font-semibold text-charcoal px-3 py-2 hover:text-terracotta transition-colors">
              Tarifs
            </a>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoToAuth} 
              className="pill-btn text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full bg-charcoal text-linen hover:bg-terracotta hover:text-white transition-colors duration-200"
            >
              Essai gratuit
            </motion.button>
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 -mr-1 rounded-full text-charcoal hover:bg-sand-border/40 transition-colors focus:outline-none" 
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.8} /> : <Menu className="w-5 h-5" strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-linen border-b border-sand-border px-5 py-4 flex flex-col gap-3 shadow-lg overflow-hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-1.5 border-b border-neutral-200/60 text-charcoal hover:text-terracotta"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
`,
  'BrandTicker.tsx': `
import React from 'react';

export const BrandTicker: React.FC = () => {
  const items = [
    { text: "NOUVELLE ÈRE DE LA HAUTE COUTURE OUEST-AFRICAINE", icon: "✦", color: "" },
    { dot: true, color: "bg-gold-sand" },
    { text: "Warm Ivory", dotColor: "bg-[#FBF8F3]" },
    { text: "Terracotta Doux", dotColor: "bg-terracotta" },
    { text: "Deep Green", dotColor: "bg-[#1B3528]" },
    { text: "Pagne Tissé & Kente", dotColor: "bg-[#D1A358]" },
    { text: "Wax Authentique & Bazin", dotColor: "bg-[#D97706]" }
  ];

  return (
    <aside className="bg-deep-green text-linen py-2 border-y border-deep-green-dark overflow-hidden select-none">
      <div className="ticker-track text-[11px] uppercase tracking-[0.22em] font-medium flex items-center space-x-6">
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {items.map((item, index) => (
              item.dot ? (
                <span key={index} className={\`w-1.5 h-1.5 rounded-full \${item.color} inline-block\`}></span>
              ) : (
                <span key={index} className="inline-flex items-center gap-2">
                  {item.icon ? <span>{item.icon}</span> : <span className={\`w-2 h-2 rounded-full \${item.dotColor}\`}></span>}
                  {item.text}
                </span>
              )
            ))}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};
`,
  'HeroSection.tsx': `
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
`,
  'ProblemSection.tsx': `
import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, FileX, CreditCard } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      num: '01',
      title: 'Commandes dispersées dans des carnets usés',
      desc: "Feuilles déchirées, écritures illisibles et commandes oubliées au fond d'un tiroir lors des périodes intenses de Tabaski, de mariages ou de cérémonies.",
      warning: "Risque d'oubli critique",
      icon: <FileX size={20} />
    },
    {
      num: '02',
      title: 'Mesures perdues ou mal retranscrites',
      desc: "Retouches infinies, tissu haut de gamme gâché et mécontentement des clients à cause d'un centimètre mal noté ou confondu avec un autre client.",
      warning: "Gâchis de tissus précieux",
      icon: <AlertCircle size={20} />
    },
    {
      num: '03',
      title: 'Suivi des acomptes et livraisons chaotique',
      desc: "« Combien il me restait déjà ? » Litiges récurrents sur les avances perçues et retards de livraison qui abîment durablement votre réputation d'artisan.",
      warning: "Tensions sur les paiements",
      icon: <CreditCard size={20} />
    }
  ];

  return (
    <section id="probleme" className="py-12 bg-[#F5EFE6] border-y border-sand-border px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-terracotta block mb-2">Les réalités du métier</span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">
            Pourquoi tant d'ateliers perdent du temps et de l'argent ?
          </h2>
          <div className="w-12 h-0.5 bg-terracotta mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {problems.map((prob, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-linen-light rounded-xl p-5 border border-sand-border card-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-serif text-lg font-bold mb-3">
                  {prob.num}
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-2 leading-snug">
                  {prob.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                  {prob.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-border/60 flex items-center gap-1.5 text-[11px] text-terracotta font-medium">
                <span className="text-terracotta">{prob.icon}</span> {prob.warning}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
`,
  'FeaturesSection.tsx': `
import React from 'react';
import { motion } from 'motion/react';
import { Users, Scissors, Calculator, Image as ImageIcon } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      color: 'bg-deep-green text-linen',
      title: 'Gestion complète des Clients & Commandes',
      desc: "Historique complet de chaque habit commandé, dates de livraison garanties et système de rappels automatiques par SMS & WhatsApp pour prévenir quand l'habit est prêt."
    },
    {
      icon: <Scissors className="w-5 h-5" />,
      color: 'bg-terracotta text-linen',
      title: 'Fiches Mesures Ultra Détaillées',
      desc: "Enregistrez plus de 25 points de mesure précis selon chaque modèle africain : Grand Bazin brodé, Robe Wax sirène, Costume Kente cintré ou Kaftan sénégalais."
    },
    {
      icon: <Calculator className="w-5 h-5" />,
      color: 'bg-gold-sand text-charcoal',
      title: 'Comptabilité Claire & Reste à Payer Automatique',
      desc: "Gestion transparente des acomptes, calcul instantané du solde restant et génération de reçus de paiement professionnels téléchargeables d'un simple toucher."
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      color: 'bg-charcoal text-linen',
      title: 'Galerie Visuelle des Tissus & Motifs',
      desc: "Prenez en photo les coupons confiés par vos clients (Wax Hollandais, Pagne Baoulé, Kente, Bogolan, Soie ou Lin) directement rattachés à leur commande."
    }
  ];

  return (
    <section id="fonctionnalites" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-deep-green block mb-1">Conçu sur mesure</span>
        <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">
          Tout votre atelier dans le creux de votre main
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light">Quatre outils essentiels pour moderniser votre savoir-faire artisanal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {features.map((feat, idx) => (
          <motion.article 
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-linen-light rounded-2xl p-5 sm:p-6 border border-sand-border card-shadow hover:border-terracotta/40 transition-colors"
          >
            <div className={\`w-10 h-10 rounded-xl flex items-center justify-center mb-4 \${feat.color}\`}>
              {feat.icon}
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal mb-2">
              {feat.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              {feat.desc}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
`,
  'HowItWorksSection.tsx': `
import React from 'react';
import { motion } from 'motion/react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Inscrivez-vous en 30 secondes',
      desc: "Aucune compétence technique requise. Utilisable instantanément sur n'importe quel smartphone Android ou iPhone sans installation lourde."
    },
    {
      num: '02',
      title: 'Ajoutez votre premier client et ses mesures',
      desc: "Sélectionnez le type d'habit et complétez les mensurations en quelques touches rapides grâce aux modèles anatomiques préconfigurés."
    },
    {
      num: '03',
      title: 'Pilotez vos confections et encaissez avec fierté',
      desc: "Suivez l'avancement pas à pas, notifiez votre client dès que la création est prête et recevez votre solde en toute clarté."
    }
  ];

  return (
    <section id="etapes" className="py-14 bg-[#FAF5EE] border-t border-sand-border px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-terracotta block mb-1">Simplicité totale</span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">
            3 étapes pour moderniser votre atelier
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-linen-light p-6 rounded-2xl border border-sand-border relative hover:border-charcoal/20 transition-colors"
            >
              <span className="text-4xl font-serif font-bold text-terracotta/20 block mb-2">{step.num}</span>
              <h3 className="font-serif text-base font-bold text-charcoal mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
`,
  'TestimonialsSection.tsx': `
import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Pendant la dernière fête, j'avais plus de 120 commandes de boubous. Avec TailorMesurePro, pas une seule erreur de mesure ni de dispute sur les acomptes. Un gain de temps inestimable.",
      author: 'Mamadou Sow',
      role: 'Maître Tailleur à Conakry, Guinée'
    },
    {
      quote: "Mes clientes apprécient le professionnalisme de recevoir leur fiche de mesure et leur reçu directement par WhatsApp. Mon atelier est passé au niveau supérieur.",
      author: 'Fatoumata Diop',
      role: 'Styliste & Créatrice à Dakar, Sénégal'
    },
    {
      quote: "Prendre en photo les pagnes et les modèles choisis m'évite de confondre les tissus de mes clients. L'application est intuitive et fluide même sans connexion rapide.",
      author: 'Kouassi Kouamé',
      role: "Atelier d'élégance à Abidjan, Côte d'Ivoire"
    }
  ];

  return (
    <section id="temoignages" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-deep-green block mb-1">La voix des maîtres</span>
        <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">
          Ils ont transformé leur atelier
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((testimonial, idx) => (
          <motion.blockquote 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-linen-light p-5 sm:p-6 rounded-2xl border border-sand-border flex flex-col justify-between card-shadow hover:-translate-y-1 transition-transform"
          >
            <div>
              <div className="flex text-gold-sand mb-3 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="font-serif text-sm italic text-neutral-800 leading-relaxed mb-4">
                « {testimonial.quote} »
              </p>
            </div>
            <footer className="pt-3 border-t border-sand-border/80">
              <cite className="not-italic font-bold text-xs uppercase tracking-wider text-charcoal block">{testimonial.author}</cite>
              <span className="text-[11px] text-neutral-500">{testimonial.role}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};
`,
  'PricingSection.tsx': `
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
`,
  'CtaSection.tsx': `
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
`,
  'Footer.tsx': `
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#12231A] text-white/80 border-t border-deep-green-dark pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pb-10 border-b border-white/10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-gold-sand text-charcoal flex items-center justify-center font-serif text-xs font-bold">TM</span>
              <span className="font-serif-editorial text-lg font-bold text-white tracking-tight">TAILORMESURE<span className="text-terracotta">PRO</span></span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              La solution numérique tout-en-un pour les ateliers de couture, créateurs et tailleurs d'Afrique de l'Ouest.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <h4 className="font-serif text-white font-semibold mb-3 tracking-wide">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#fonctionnalites" className="hover:text-gold-sand transition-colors">Fonctionnalités</a></li>
                <li><a href="#tarifs" className="hover:text-gold-sand transition-colors">Tarifs & Plans</a></li>
                <li><a href="#temoignages" className="hover:text-gold-sand transition-colors">Témoignages</a></li>
                <li><a href="#mockup-interactive" className="hover:text-gold-sand transition-colors">Démo interactive</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold mb-3 tracking-wide">Contact & Aide</h4>
              <ul className="space-y-2">
                <li><a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-gold-sand transition-colors flex items-center gap-1"><span>💬</span> WhatsApp Support</a></li>
                <li><a href="mailto:contact@tailormesurepro.com" className="hover:text-gold-sand transition-colors">Contact atelier</a></li>
                <li><span className="text-white/40 block text-[11px]">Dakar • Abidjan • Conakry</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/50">
          <p className="text-center sm:text-left">
            Fait avec fierté en Afrique de l'Ouest ✦ Conçu pour l'excellence de nos artisans.
          </p>
          <p className="text-center sm:text-right">
            © {new Date().getFullYear()} TailorMesurePro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join('src/components/Landing', filename), content.trim());
}
console.log('Components created successfully');
