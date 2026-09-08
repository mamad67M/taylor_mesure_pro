import React, { useState, useMemo } from 'react';
import { Search, Plus, Phone, ChevronRight, Scissors, UserCheck, MessageCircle } from 'lucide-react';
import { Client, Commande, AtelierSettings } from '../types';
import { EmptyState } from './EmptyState';

interface ClientsViewProps {
  clients: Client[];
  commandes: Commande[];
  settings?: AtelierSettings;
  onSelectClient: (clientId: string) => void;
  onOpenNewClient: () => void;
  onNewOrderForClient?: (clientId: string) => void;
  onOpenNewOrderForClient?: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  commandes,
  onSelectClient,
  onOpenNewClient,
  onNewOrderForClient,
  onOpenNewOrderForClient,
}) => {
  const handleNewOrder = (clientId: string) => {
    if (onOpenNewOrderForClient) {
      onOpenNewOrderForClient(clientId);
    } else if (onNewOrderForClient) {
      onNewOrderForClient(clientId);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');

  // Count orders per client
  const clientOrderStats = useMemo(() => {
    const stats: Record<string, { total: number; enCours: number; pretes: number; soldees: number }> = {};
    clients.forEach(c => {
      stats[c.id] = { total: 0, enCours: 0, pretes: 0, soldees: 0 };
    });
    commandes.forEach(cmd => {
      if (stats[cmd.client_id]) {
        stats[cmd.client_id].total += 1;
        if (cmd.statut === 'en_cours') stats[cmd.client_id].enCours += 1;
        if (cmd.statut === 'pret') stats[cmd.client_id].pretes += 1;
        if (cmd.statut === 'solde') stats[cmd.client_id].soldees += 1;
      }
    });
    return stats;
  }, [clients, commandes]);

  // Filter clients by Nom, Prénom, Téléphone
  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter(c => {
      const fullName = `${c.prenom} ${c.nom}`.toLowerCase();
      const reverseName = `${c.nom} ${c.prenom}`.toLowerCase();
      const phone = (c.telephone || '').replace(/\s+/g, '');
      const queryNoSpace = query.replace(/\s+/g, '');

      return (
        fullName.includes(query) ||
        reverseName.includes(query) ||
        phone.includes(queryNoSpace) ||
        (c.telephone && c.telephone.toLowerCase().includes(query))
      );
    });
  }, [clients, searchQuery]);

  return (
    <div className="space-y-4 pb-14">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#0D1B2A]">
            Clients ({clients.length})
          </h1>
          <p className="text-xs text-[#0D1B2A]/60">
            Répertoire et historique de vos clients
          </p>
        </div>

        <button
          type="button"
          id="btn-ajouter-client"
          onClick={onOpenNewClient}
          className="inline-flex items-center gap-2 bg-[#0D1B2A] hover:bg-[#1a2f47] text-[#F7F4EF] font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 flex-shrink-0"
        >
          <Plus size={16} className="text-[#D4A017]" strokeWidth={2.5} />
          <span>+ Ajouter</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0D1B2A]/40">
          <Search size={17} />
        </div>
        <input
          type="text"
          id="input-recherche-client"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, prénom ou téléphone..."
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#0D1B2A]/10 text-sm text-[#0D1B2A] placeholder-[#0D1B2A]/40 focus:outline-hidden focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 shadow-2xs transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-[#0D1B2A]/50 hover:text-[#0D1B2A]"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Clients List */}
      {clients.length === 0 ? (
        <EmptyState
          type="clients"
          onAction={onOpenNewClient}
          actionLabel="+ Ajouter mon premier client"
        />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          type="search"
          customMessage={`Aucun client correspondant à « ${searchQuery} »`}
          onAction={() => setSearchQuery('')}
          actionLabel="Effacer la recherche"
        />
      ) : (
        <div className="space-y-3">
          {filteredClients.map(client => {
            const stats = clientOrderStats[client.id] || { total: 0, enCours: 0, pretes: 0, soldees: 0 };
            const initials = `${(client.prenom?.[0] || '').toUpperCase()}${(client.nom?.[0] || '').toUpperCase()}`;

            return (
              <div
                key={client.id}
                id={`client-card-${client.id}`}
                onClick={() => onSelectClient(client.id)}
                className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs hover:border-[#D4A017]/60 active:scale-99 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Avatar + Names + Phone */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#0D1B2A] text-[#D4A017] flex items-center justify-center font-display font-extrabold text-base flex-shrink-0 shadow-xs">
                    {initials || <UserCheck size={20} />}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base text-[#0D1B2A] group-hover:text-[#D4A017] transition truncate">
                      {client.prenom} {client.nom}
                    </h3>

                    <div className="flex items-center gap-3 mt-0.5">
                      <a
                        href={`tel:${client.telephone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[#0D1B2A]/70 hover:text-[#0D1B2A] font-mono flex items-center gap-1 transition"
                        title="Appeler le client"
                      >
                        <Phone size={12} className="text-[#D4A017]" />
                        <span>{client.telephone}</span>
                      </a>

                      {/* WhatsApp shortcut */}
                      <a
                        href={`https://wa.me/${client.telephone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-[#1F4D3A] bg-[#1F4D3A]/10 hover:bg-[#1F4D3A]/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium transition"
                        title="WhatsApp"
                      >
                        <MessageCircle size={11} />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Order count badge */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#0D1B2A]/5 text-[#0D1B2A]">
                        {stats.total} {stats.total > 1 ? 'commandes' : 'commande'}
                      </span>
                      {stats.enCours > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0D1B2A] text-[#F7F4EF]">
                          {stats.enCours} en cours
                        </span>
                      )}
                      {stats.pretes > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#D4A017] text-[#0D1B2A]">
                          {stats.pretes} prête{stats.pretes > 1 ? 's' : ''}
                        </span>
                      )}
                      {stats.soldees > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1F4D3A] text-white">
                          {stats.soldees} soldée{stats.soldees > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions: + Nouvelle commande button & arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNewOrder(client.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4A017]/15 hover:bg-[#D4A017]/30 text-[#9A7000] font-bold text-xs transition active:scale-95"
                  >
                    <Scissors size={13} />
                    <span>+ Commande</span>
                  </button>

                  <div className="w-8 h-8 rounded-xl bg-[#0D1B2A]/5 flex items-center justify-center text-[#0D1B2A]/40 group-hover:text-[#D4A017] group-hover:bg-[#0D1B2A] transition">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
