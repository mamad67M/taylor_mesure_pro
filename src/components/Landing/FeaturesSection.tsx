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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
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