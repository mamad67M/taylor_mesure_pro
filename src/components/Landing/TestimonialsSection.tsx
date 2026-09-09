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