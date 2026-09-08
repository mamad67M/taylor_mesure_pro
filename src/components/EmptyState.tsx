import React from 'react';
import { Users, Scissors, CalendarCheck, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'clients' | 'commandes' | 'livraisons' | 'search';
  onAction?: () => void;
  actionLabel?: string;
  customMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAction,
  actionLabel,
  customMessage,
}) => {
  let title = '';
  let subtitle = '';
  let defaultAction = '';
  let icon = <Scissors className="w-8 h-8 text-[#D4A017]" />;

  switch (type) {
    case 'clients':
      title = customMessage || 'Aucun client pour le moment';
      subtitle = 'Ajoutez vos clients pour enregistrer leurs commandes et leurs mesures.';
      defaultAction = '+ Ajouter mon premier client';
      icon = <Users className="w-8 h-8 text-[#D4A017]" />;
      break;

    case 'commandes':
      title = customMessage || 'Aucune commande pour le moment';
      subtitle = 'Chaque commande associe un tissu spécifique et un ensemble unique de mesures.';
      defaultAction = '+ Nouvelle commande';
      icon = <Scissors className="w-8 h-8 text-[#D4A017]" />;
      break;

    case 'livraisons':
      title = customMessage || 'Aucune livraison prévue prochainement';
      subtitle = 'Toutes les commandes en cours sont à jour ou déjà livrées aux clients.';
      defaultAction = '+ Nouvelle commande';
      icon = <CalendarCheck className="w-8 h-8 text-[#1F4D3A]" />;
      break;

    case 'search':
      title = customMessage || 'Aucun résultat trouvé';
      subtitle = 'Vérifiez l’orthographe du nom, prénom ou numéro de téléphone.';
      icon = <Search className="w-8 h-8 text-[#0D1B2A]/40" />;
      break;
  }

  const finalActionLabel = actionLabel || defaultAction;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-[#0D1B2A]/8 shadow-xs my-4">
      {/* Decorative circle with couture icon and wax subtle outline */}
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0D1B2A]/5 border border-[#D4A017]/30 flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4A017] flex items-center justify-center shadow-xs">
          <div className="w-2 h-2 rounded-full bg-[#0D1B2A]" />
        </div>
      </div>

      <h3 className="font-display font-bold text-lg text-[#0D1B2A] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#0D1B2A]/65 max-w-sm mb-5 leading-relaxed">
        {subtitle}
      </p>

      {onAction && finalActionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2A] text-[#F7F4EF] hover:bg-[#1a2f47] active:scale-98 transition font-medium text-sm shadow-md"
        >
          <Plus size={16} className="text-[#D4A017]" />
          <span>{finalActionLabel}</span>
        </button>
      )}
    </div>
  );
};
