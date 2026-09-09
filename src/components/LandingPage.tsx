import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Users, Scissors, Calculator, Image as ImageIcon, AlertCircle, FileX, CreditCard, Star, Check } from 'lucide-react';

interface LandingPageProps {
  onGoToAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
    <div className="bg-linen text-charcoal min-h-screen flex flex-col overflow-x-hidden selection:bg-terracotta selection:text-white">
      {/* HEADER */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-linen/95 backdrop-blur-md border-b border-sand-border shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group focus:outline-none">
            <motion.span whileHover={{ rotate: 90 }} className="w-8 h-8 rounded-full bg-deep-green text-linen flex items-center justify-center font-serif text-xs font-semibold tracking-wider">
              TM
            </motion.span>
            <div className="flex flex-col">
              <span className="font-serif-editorial text-base sm:text-lg font-bold tracking-tight text-charcoal leading-none">TAILORMESURE<span className="text-terracotta ml-0.5">PRO</span></span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Atelier OS</span>
            </div>
          </a>
          <div className="flex items-center gap-2.5">
            <a href="#tarifs" className="hidden sm:inline-flex text-xs uppercase tracking-widest font-semibold text-charcoal px-3 py-2 hover:text-terracotta transition-colors">Tarifs</a>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onGoToAuth} className="pill-btn text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full bg-charcoal text-linen hover:bg-terracotta hover:text-white transition-colors">Essai gratuit</motion.button>
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 -mr-1 rounded-full text-charcoal hover:bg-sand-border/40 transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="sm:hidden bg-linen border-b border-sand-border px-5 py-4 flex flex-col gap-3 shadow-lg overflow-hidden">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-1.5 border-b border-neutral-200/60 text-charcoal hover:text-terracotta">{link.label}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* TICKER */}
      <aside className="bg-deep-green text-linen py-2 border-y border-deep-green-dark overflow-hidden select-none">
        <div className="ticker-track text-[11px] uppercase tracking-[0.22em] font-medium flex items-center space-x-6">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="inline-flex items-center gap-2"><span>✦</span> NOUVELLE ÈRE DE LA HAUTE COUTURE OUEST-AFRICAINE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-sand inline-block"></span>
              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FBF8F3]"></span> Warm Ivory</span>
              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-terracotta"></span> Terracotta Doux</span>
              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#1B3528]"></span> Deep Green</span>
              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#D1A358]"></span> Pagne Tissé & Kente</span>
              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#D97706]"></span> Wax Authentique & Bazin</span>
            </React.Fragment>
          ))}
        </div>
      </aside>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="pt-8 pb-14 px-4 sm:px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-terracotta"></span>
              <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-terracotta font-sans">TAILORMESURE PRO — LOGICIEL D'ATELIER</p>
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-charcoal mb-4 uppercase">Fini les carnets perdus et les commandes dépassées.</h1>
            <p className="text-neutral-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-light mb-6">L'application moderne conçue pour les maîtres tailleurs et créateurs ouest-africains : gérez vos clients, mesures exactes, acomptes et livraisons en toute sérénité.</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGoToAuth} className="pill-btn inline-flex justify-center items-center py-3.5 px-7 rounded-full bg-charcoal text-linen font-medium text-xs tracking-wider uppercase hover:bg-terracotta transition-colors shadow-sm">Commencer gratuitement</motion.button>
              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href="#mockup-interactive" className="pill-btn inline-flex justify-center items-center py-3.5 px-7 rounded-full border border-charcoal/30 bg-transparent text-charcoal font-medium text-xs tracking-wider uppercase hover:bg-charcoal/5 transition-colors">Voir la démo</motion.a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative rounded-2xl overflow-hidden border border-sand-border mb-8 shadow-xl">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuARKNk0uUWd01IwwaABwNYflRmVH2_3rbYKB1f8jqWvt65wUbKgVdbLbg9OpY9zYtOjHugy2jkEHqnnmjEMum2N0P5GOTu-w0j2dUHNAzXidLd69WnshyTmmEXx6nigmqtTPE_SaHUiNgFTe0fYVSwbfU7XKo3ZSSKKr7awTJFSQALvfKfajGXdQUe6_nV7dveObtwgjF6hrjoJx8tlm7gmAuf0VtCgNvlqVi9eRlANe9LjzmRX0OClcw" alt="Atelier" className="w-full h-[320px] sm:h-[420px] object-cover object-center transform hover:scale-[1.01] transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-linen flex items-end justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase bg-terracotta/90 px-2.5 py-1 rounded-full text-white font-semibold">Atelier Prestige</span>
                <p className="font-serif text-sm sm:text-base mt-1 italic text-white/90">Dakar • Abidjan • Conakry • Bamako</p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Mockup */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} id="mockup-interactive" className="bg-linen-light rounded-2xl border border-sand-border p-4 sm:p-6 card-shadow">
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
                <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta bg-terracotta/10 px-2 py-1 rounded-md">En confection (80%)</span>
              </div>
              <div className="flex items-center gap-2.5 mt-2.5 pt-2.5 border-t border-neutral-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-900 border border-gold-sand shadow-inner flex-shrink-0"></div>
                <div className="truncate">
                  <span className="text-[11px] text-neutral-500 block">Tissu sélectionné</span>
                  <span className="text-xs font-medium text-charcoal">Bazin Riche Teint Artisanal</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* PROBLEM SECTION */}
        <section id="probleme" className="py-12 bg-[#F5EFE6] border-y border-sand-border px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-terracotta block mb-2">Les réalités du métier</span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">Pourquoi tant d'ateliers perdent du temps ?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                { num: '01', title: 'Carnets usés', desc: "Commandes oubliées lors des périodes intenses.", icon: <FileX size={20} /> },
                { num: '02', title: 'Mesures perdues', desc: "Retouches infinies et tissu gâché.", icon: <AlertCircle size={20} /> },
                { num: '03', title: 'Suivi chaotique', desc: "Litiges récurrents sur les avances perçues.", icon: <CreditCard size={20} /> }
              ].map((prob, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className="bg-linen-light rounded-xl p-5 border border-sand-border card-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-serif text-lg font-bold mb-3">{prob.num}</div>
                    <h3 className="font-serif text-lg font-bold text-charcoal mb-2">{prob.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">{prob.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="fonctionnalites" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-deep-green block mb-1">Conçu sur mesure</span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">Tout votre atelier dans le creux de la main</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: <Users className="w-5 h-5" />, color: 'bg-deep-green text-linen', title: 'Gestion Clients', desc: "Historique de chaque habit et dates de livraison garanties." },
              { icon: <Scissors className="w-5 h-5" />, color: 'bg-terracotta text-linen', title: 'Mesures Détaillées', desc: "Plus de 25 points de mesure précis selon chaque modèle." },
              { icon: <Calculator className="w-5 h-5" />, color: 'bg-gold-sand text-charcoal', title: 'Comptabilité', desc: "Gestion transparente des acomptes et solde restant." },
              { icon: <ImageIcon className="w-5 h-5" />, color: 'bg-charcoal text-linen', title: 'Galerie Tissus', desc: "Photos des coupons confiés rattachées à la commande." }
            ].map((feat, idx) => (
              <motion.article key={idx} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-linen-light rounded-2xl p-5 sm:p-6 border border-sand-border card-shadow hover:border-terracotta/40 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>{feat.icon}</div>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">{feat.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="tarifs" className="py-14 bg-[#F5EFE6] border-y border-sand-border px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-terracotta block mb-1">Forfaits</span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal uppercase leading-tight font-normal">Démarrez gratuitement</h2>
            </div>
            <div className="max-w-md mx-auto bg-linen-light rounded-2xl p-6 border border-sand-border card-shadow text-center">
              <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Plan Gratuit</h3>
              <span className="font-serif text-4xl font-bold text-terracotta">0 FG</span>
              <p className="text-xs text-neutral-500 mt-2 mb-6">Testez l'application sans limite de temps.</p>
              <button onClick={onGoToAuth} className="w-full pill-btn py-3 rounded-full bg-charcoal text-white font-bold uppercase tracking-wider text-sm hover:bg-terracotta transition-colors">Créer mon compte</button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 bg-deep-green text-linen text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D1A358_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif-editorial text-2xl sm:text-4xl text-white uppercase mb-6">Rejoignez l'Excellence</h2>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onGoToAuth} className="pill-btn py-4 px-9 rounded-full bg-terracotta text-white font-bold text-sm uppercase tracking-wider hover:bg-terracotta-dark shadow-xl">Commencer gratuitement</motion.button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#12231A] text-white/80 border-t border-deep-green-dark py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-7 h-7 rounded-full bg-gold-sand text-charcoal flex items-center justify-center font-serif text-xs font-bold">TM</span>
          <span className="font-serif-editorial text-lg font-bold text-white tracking-tight">TAILORMESURE<span className="text-terracotta">PRO</span></span>
        </div>
        <p className="text-[11px] text-white/50">© {new Date().getFullYear()} TailorMesurePro. Tous droits réservés.</p>
      </footer>
    </div>
  );
};
