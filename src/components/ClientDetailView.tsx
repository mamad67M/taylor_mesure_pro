import React from 'react';
import { ArrowLeft, Phone, MessageCircle, Edit3, Trash2, Plus, Calendar, Wallet, Scissors, ChevronRight } from 'lucide-react';
import { Client, Commande, AtelierSettings } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDateFrench, getDeliveryRelativeText } from '../utils/format';
import { EmptyState } from './EmptyState';
import { WaxHeaderPattern } from './WaxDecorations';

interface ClientDetailViewProps {
  client: Client;
  commandes: Commande[];
  settings: AtelierSettings;
  onBack: () => void;
  onSelectCommande: (commandeId: string) => void;
  onNewOrder: (clientId: string) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  client,
  commandes,
  settings,
  onBack,
  onSelectCommande,
  onNewOrder,
  onEditClient,
  onDeleteClient,
}) => {
  const initials = `${(client.prenom?.[0] || '').toUpperCase()}${(client.nom?.[0] || '').toUpperCase()}`;

  // Total balance pending for this specific client
  const clientTotalReste = commandes.reduce((sum, c) => sum + (c.reste_a_payer || 0), 0);

  return (
    <div className="space-y-4 pb-16">
      {/* Top back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D1B2A]/70 hover:text-[#0D1B2A] transition"
      >
        <ArrowLeft size={16} />
        <span>Retour aux clients</span>
      </button>

      {/* Client Identity Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/8 shadow-xs relative overflow-hidden">
        <WaxHeaderPattern opacity={0.04} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#0D1B2A] text-[#D4A017] flex items-center justify-center font-display font-extrabold text-xl shadow-xs flex-shrink-0">
              {initials}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#0D1B2A]">
                {client.prenom} {client.nom}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs sm:text-sm">
                <a
                  href={`tel:${client.telephone}`}
                  className="font-mono text-[#0D1B2A] hover:text-[#D4A017] flex items-center gap-1 font-semibold transition"
                >
                  <Phone size={13} className="text-[#D4A017]" />
                  <span>{client.telephone}</span>
                </a>

                <a
                  href={`https://wa.me/${client.telephone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#1F4D3A] bg-[#1F4D3A]/10 hover:bg-[#1F4D3A]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium transition"
                >
                  <MessageCircle size={12} />
                  <span>Écrire sur WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Edit / Delete Buttons */}
          <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <button
              type="button"
              onClick={() => onEditClient(client)}
              className="p-2.5 rounded-xl bg-[#0D1B2A]/5 hover:bg-[#0D1B2A]/10 text-[#0D1B2A] transition"
              title="Modifier les coordonnées du client"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDeleteClient(client)}
              className="p-2.5 rounded-xl bg-[#A63A3A]/10 hover:bg-[#A63A3A]/20 text-[#A63A3A] transition"
              title="Supprimer ce client"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Quick financial indicator for client */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#0D1B2A]/50 block">Commandes au total</span>
            <span className="font-display font-bold text-base text-[#0D1B2A]">
              {commandes.length}
            </span>
          </div>
          <div>
            <span className="text-[#0D1B2A]/50 block">Reste à payer cumulé</span>
            <span
              className={`font-display font-bold text-base ${
                clientTotalReste > 0 ? 'text-[#0D1B2A]' : 'text-[#1F4D3A]'
              }`}
            >
              {formatCurrency(clientTotalReste, settings.devise)}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Action Button: + Nouvelle commande */}
      <div className="pt-1">
        <button
          type="button"
          id="btn-nouvelle-commande-client"
          onClick={() => onNewOrder(client.id)}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#D4A017] hover:bg-[#c29213] text-[#0D1B2A] font-display font-extrabold text-base flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition"
        >
          <Plus size={20} strokeWidth={3} />
          <span>+ Nouvelle commande pour {client.prenom}</span>
        </button>
      </div>

      {/* Section: Mes commandes */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors size={18} className="text-[#0D1B2A]" />
            <h2 className="font-display font-bold text-lg text-[#0D1B2A]">
              Commandes associées ({commandes.length})
            </h2>
          </div>
        </div>

        {commandes.length === 0 ? (
          <EmptyState
            type="commandes"
            customMessage={`Aucune commande pour ${client.prenom}`}
            onAction={() => onNewOrder(client.id)}
            actionLabel="+ Créer la première commande"
          />
        ) : (
          <div className="space-y-3">
            {commandes.map(cmd => {
              const relativeDate = getDeliveryRelativeText(cmd.date_livraison);

              return (
                <div
                  key={cmd.id}
                  id={`client-commande-${cmd.id}`}
                  onClick={() => onSelectCommande(cmd.id)}
                  className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs hover:border-[#D4A017]/60 active:scale-99 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left: Fabric & details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0D1B2A]/5 flex-shrink-0 border border-[#0D1B2A]/10 relative">
                      {cmd.image_tissu ? (
                        <img
                          src={cmd.image_tissu}
                          alt={cmd.nom_tissu || 'Tissu'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#0D1B2A]/30">
                          Tissu
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0D1B2A] bg-[#0D1B2A]/5 px-2 py-0.5 rounded-md">
                          {cmd.reference}
                        </span>
                        <h3 className="font-display font-bold text-sm sm:text-base text-[#0D1B2A] truncate">
                          {cmd.nom_tissu || 'Tissu'}
                        </h3>
                      </div>

                      {cmd.description_tissu && (
                        <p className="text-xs text-[#0D1B2A]/60 line-clamp-1 mt-0.5">
                          {cmd.description_tissu}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#0D1B2A]/70">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#D4A017]" />
                          <span>Livraison : {formatDateFrench(cmd.date_livraison)}</span>
                        </span>

                        <span className="flex items-center gap-1 font-semibold">
                          <Wallet size={12} className="text-[#D4A017]" />
                          <span>Reste : {formatCurrency(cmd.reste_a_payer, settings.devise)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Badge & Arrow */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    <StatusBadge statut={cmd.statut} size="sm" />
                    <div className="w-7 h-7 rounded-lg bg-[#0D1B2A]/5 flex items-center justify-center text-[#0D1B2A]/30 group-hover:text-[#D4A017] group-hover:bg-[#0D1B2A] transition">
                      <ChevronRight size={15} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
