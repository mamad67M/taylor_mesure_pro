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