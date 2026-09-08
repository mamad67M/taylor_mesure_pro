import React from 'react';
import { Scissors, CheckCircle, Clock, Smartphone, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onGoToAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#0D1B2A] font-sans">
      {/* Header */}
      <header className="px-6 py-8 md:px-12 md:py-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-[#0D1B2A] text-[#D4A017] p-2 rounded-xl">
            <Scissors size={24} />
          </div>
          <span className="text-xl sm:text-2xl font-display font-black tracking-tight text-[#0D1B2A]">
            Mesure<span className="text-[#D4A017]">Pro</span>
          </span>
        </div>
        <button
          onClick={onGoToAuth}
          className="bg-[#0D1B2A] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#1a2f47] transition shadow-md flex items-center gap-2"
        >
          Se connecter
          <ChevronRight size={16} className="text-[#D4A017]" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24">
        {/* Text Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-block border border-[#D4A017]/30 bg-[#D4A017]/10 px-4 py-1.5 rounded-full text-xs font-bold text-[#9A7000] tracking-wider uppercase">
            L'Élégance sur Mesure
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-extrabold leading-[1.1] tracking-tight">
            Gérez votre atelier <br />
            <span className="text-[#D4A017] font-serif italic font-normal">avec excellence.</span>
          </h1>
          
          <p className="text-lg text-[#0D1B2A]/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            MesurePro est l'assistant digital conçu exclusivement pour les tailleurs et créateurs de mode. Simplifiez la prise de mesures, organisez vos commandes et sublimez la relation avec vos clients.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={onGoToAuth}
              className="w-full sm:w-auto bg-[#D4A017] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#b58812] transition shadow-lg flex justify-center items-center gap-2"
            >
              Créer mon atelier
              <ChevronRight size={18} />
            </button>
            <button
              onClick={onGoToAuth}
              className="w-full sm:w-auto bg-white border-2 border-[#0D1B2A]/10 text-[#0D1B2A] px-8 py-4 rounded-full font-bold text-base hover:border-[#0D1B2A]/30 transition flex justify-center items-center"
            >
              J'ai déjà un compte
            </button>
          </div>
        </div>

        {/* Visual / Image Concept (CSS only drawing) */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative">
          <div className="aspect-square rounded-[3rem] bg-[#0D1B2A] relative overflow-hidden shadow-2xl flex items-center justify-center border-4 border-[#D4A017]/20 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A017]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl transform rotate-2 hover:rotate-0 transition duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#F7F4EF] rounded-full flex items-center justify-center">
                  <Scissors size={20} className="text-[#D4A017]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0D1B2A]">Robe Sirène Wax</h3>
                  <p className="text-xs text-[#0D1B2A]/60">Amina Diallo • Prêt demain</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-[#F7F4EF] rounded-full"></div>
                <div className="h-2 w-4/5 bg-[#F7F4EF] rounded-full"></div>
                <div className="h-2 w-5/6 bg-[#F7F4EF] rounded-full"></div>
              </div>
              <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-[#0D1B2A]/50">Étape 3/4</span>
                <span className="bg-[#D4A017]/15 text-[#9A7000] text-xs font-bold px-3 py-1 rounded-full">En cours</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white border-t border-[#0D1B2A]/5 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0D1B2A] mb-4">
              Pensé pour les artisans exigeants
            </h2>
            <p className="text-[#0D1B2A]/60 max-w-2xl mx-auto text-lg">
              Tout ce dont vous avez besoin pour moderniser votre atelier et fidéliser votre clientèle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F7F4EF] p-8 rounded-3xl border border-[#0D1B2A]/5 hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xs mb-6 text-[#D4A017]">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0D1B2A]">Gain de temps</h3>
              <p className="text-[#0D1B2A]/70 leading-relaxed">
                Fini les carnets de notes perdus. Retrouvez instantanément les mesures, les tissus et l'historique de chaque client en quelques secondes.
              </p>
            </div>

            <div className="bg-[#0D1B2A] p-8 rounded-3xl shadow-xl transform md:-translate-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-[#D4A017]">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Suivi des Commandes</h3>
              <p className="text-white/70 leading-relaxed">
                Gardez un œil sur les échéances et les livraisons. Ajoutez les photos des modèles directement depuis votre téléphone pour ne rater aucun détail.
              </p>
            </div>

            <div className="bg-[#F7F4EF] p-8 rounded-3xl border border-[#0D1B2A]/5 hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xs mb-6 text-[#D4A017]">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0D1B2A]">Professionnalisme</h3>
              <p className="text-[#0D1B2A]/70 leading-relaxed">
                Gérez vos paiements (avances, restes à payer) et présentez une image moderne et structurée qui rassurera votre clientèle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Scissors size={20} className="text-[#D4A017]" />
          <span className="text-xl font-display font-black tracking-tight text-white">
            Mesure<span className="text-[#D4A017]">Pro</span>
          </span>
        </div>
        <p className="text-white/50 text-sm">
          © {new Date().getFullYear()} MesurePro. Dédié à l'élégance et à l'artisanat.
        </p>
      </footer>
    </div>
  );
};
