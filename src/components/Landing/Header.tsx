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
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-linen/95 backdrop-blur-md border-b border-sand-border shadow-sm' : 'bg-transparent'}`}>
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

          <div className="flex items-center gap-2 sm:gap-3">
            <a href="#tarifs" className="hidden sm:inline-flex text-[10px] uppercase tracking-widest font-semibold text-charcoal px-3 py-2 hover:text-terracotta transition-colors">
              Tarifs
            </a>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoToAuth} 
              className="pill-btn whitespace-nowrap text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-deep-green text-linen hover:bg-opacity-90 transition-all duration-200"
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
