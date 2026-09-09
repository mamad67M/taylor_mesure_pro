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