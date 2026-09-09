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