import React, { useState, useMemo } from 'react';
import { Search, Plus, Calendar, ArrowUpDown, Filter, ChevronRight, User, LayoutGrid, List } from 'lucide-react';
import { Commande, Client, StatutCommande, CommandeFilter, CommandeSort, AtelierSettings } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDateFrench, getDeliveryRelativeText } from '../utils/format';
import { EmptyState } from './EmptyState';
import { KanbanBoard } from './KanbanBoard';

interface OrdersViewProps {
  commandes: Commande[];
  clients: Client[];
  settings: AtelierSettings;
  activeFilter: CommandeFilter;
  onFilterChange: (filter: CommandeFilter) => void;
  onSelectCommande: (id: string) => void;
  onSelectClient: (clientId: string) => void;
  onOpenNewOrder: () => void;
  onUpdateOrderStatus?: (id: string, statut: StatutCommande) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  commandes,
  clients,
  settings,
  activeFilter,
  onFilterChange,
  onSelectCommande,
  onSelectClient,
  onOpenNewOrder,
  onUpdateOrderStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<CommandeSort>('livraison');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  // Client lookup dictionary
  const clientMap = useMemo(() => {
    const map = new Map<string, Client>();
    clients.forEach(c => map.set(c.id, c));
    return map;
  }, [clients]);

  // Counts by status
  const filterCounts = useMemo(() => {
    return {
      toutes: commandes.length,
      en_cours: commandes.filter(c => c.statut === 'en_cours').length,
      pret: commandes.filter(c => c.statut === 'pret').length,
      solde: commandes.filter(c => c.statut === 'solde').length,
    };
  }, [commandes]);

  // Filtered & Sorted orders
  const processedCommandes = useMemo(() => {
    let list = [...commandes];

    // Status filter
    if (activeFilter !== 'toutes') {
      list = list.filter(c => c.statut === activeFilter);
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(cmd => {
        const client = clientMap.get(cmd.client_id);
        const clientName = client ? `${client.prenom} ${client.nom}`.toLowerCase() : '';
        const clientTel = client?.telephone?.toLowerCase() || '';
        const ref = (cmd.reference || '').toLowerCase();
        const tissu = (cmd.nom_tissu || '').toLowerCase();
        const desc = (cmd.description_tissu || '').toLowerCase();

        return (
          ref.includes(q) ||
          clientName.includes(q) ||
          clientTel.includes(q) ||
          tissu.includes(q) ||
          desc.includes(q)
        );
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'livraison') {
        return (a.date_livraison || '').localeCompare(b.date_livraison || '');
      } else if (sortBy === 'recent') {
        return (b.created_at || '').localeCompare(a.created_at || '');
      } else if (sortBy === 'statut') {
        const rank: Record<StatutCommande, number> = { en_cours: 1, pret: 2, solde: 3 };
        return rank[a.statut] - rank[b.statut];
      }
      return 0;
    });

    return list;
  }, [commandes, activeFilter, searchQuery, sortBy, clientMap]);

  return (
    <div className="space-y-4 pb-14">
      {/* Header and + Nouvelle Commande */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#0D1B2A]">
            Commandes ({commandes.length})
          </h1>
          <p className="text-xs text-[#0D1B2A]/60">
            Suivi des tissus, paiements et délais
          </p>
        </div>

        <button
          type="button"
          id="btn-ajouter-commande"
          onClick={onOpenNewOrder}
          className="inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#c29213] text-[#0D1B2A] font-extrabold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 flex-shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>+ Nouvelle</span>
        </button>
      </div>

      {/* Filter Tabs: Toutes | En cours | Prêtes | Soldées */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#0D1B2A]/10 overflow-x-auto no-scrollbar shadow-2xs">
        <button
          type="button"
          onClick={() => onFilterChange('toutes')}
          className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeFilter === 'toutes'
              ? 'bg-[#0D1B2A] text-white shadow-xs'
              : 'text-[#0D1B2A]/70 hover:bg-[#F7F4EF]'
          }`}
        >
          Toutes ({filterCounts.toutes})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('en_cours')}
          className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeFilter === 'en_cours'
              ? 'bg-[#0D1B2A] text-[#F7F4EF] shadow-xs'
              : 'text-[#0D1B2A]/70 hover:bg-[#F7F4EF]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#0D1B2A]" />
          <span>En cours ({filterCounts.en_cours})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('pret')}
          className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeFilter === 'pret'
              ? 'bg-[#D4A017] text-[#0D1B2A] font-bold shadow-xs'
              : 'text-[#0D1B2A]/70 hover:bg-[#F7F4EF]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
          <span>Prêtes ({filterCounts.pret})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('solde')}
          className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeFilter === 'solde'
              ? 'bg-[#1F4D3A] text-white shadow-xs'
              : 'text-[#0D1B2A]/70 hover:bg-[#F7F4EF]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#1F4D3A]" />
          <span>Soldées ({filterCounts.solde})</span>
        </button>
      </div>

      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0D1B2A]/40">
            <Search size={16} />
          </div>
          <input
            type="text"
            id="input-recherche-commandes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par client, tissu, référence..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#0D1B2A]/10 text-xs sm:text-sm text-[#0D1B2A] placeholder-[#0D1B2A]/40 focus:outline-hidden focus:border-[#D4A017] shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#0D1B2A]/50"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#0D1B2A]/10 shadow-2xs text-xs">
          <ArrowUpDown size={14} className="text-[#0D1B2A]/50" />
          <span className="text-[#0D1B2A]/60 font-medium whitespace-nowrap hidden sm:inline">Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as CommandeSort)}
            className="bg-transparent font-semibold text-[#0D1B2A] focus:outline-hidden cursor-pointer"
          >
            <option value="livraison">Date de livraison</option>
            <option value="recent">Plus récent</option>
            <option value="statut">Statut</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white rounded-xl border border-[#0D1B2A]/10 shadow-2xs p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#0D1B2A]/10 text-[#0D1B2A]' : 'text-[#0D1B2A]/40 hover:text-[#0D1B2A]/70'}`}
            title="Vue Liste"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-[#0D1B2A]/10 text-[#0D1B2A]' : 'text-[#0D1B2A]/40 hover:text-[#0D1B2A]/70'}`}
            title="Vue Kanban"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Orders List */}
      {commandes.length === 0 ? (
        <EmptyState
          type="commandes"
          onAction={onOpenNewOrder}
          actionLabel="+ Créer la première commande"
        />
      ) : processedCommandes.length === 0 ? (
        <EmptyState
          type="search"
          customMessage="Aucune commande ne correspond aux filtres actuels"
          onAction={() => {
            setSearchQuery('');
            onFilterChange('toutes');
          }}
          actionLabel="Réinitialiser les filtres"
        />
      ) : viewMode === 'kanban' && onUpdateOrderStatus ? (
        <KanbanBoard
          commandes={processedCommandes}
          clientMap={clientMap}
          settings={settings}
          onSelectCommande={onSelectCommande}
          onSelectClient={onSelectClient}
          onUpdateStatus={onUpdateOrderStatus}
        />
      ) : (
        <div className="space-y-3">
          {processedCommandes.map(cmd => {
            const client = clientMap.get(cmd.client_id);
            const relativeDate = getDeliveryRelativeText(cmd.date_livraison);

            return (
              <div
                key={cmd.id}
                id={`commande-card-${cmd.id}`}
                onClick={() => onSelectCommande(cmd.id)}
                className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs hover:border-[#D4A017]/60 active:scale-99 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Fabric Photo & Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#0D1B2A]/5 flex-shrink-0 border border-[#0D1B2A]/10 relative shadow-2xs">
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
                    <span className="absolute bottom-0 inset-x-0 bg-[#0D1B2A]/80 text-[9px] text-white text-center font-mono py-0.5 tracking-wider">
                      {cmd.reference}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (client) onSelectClient(client.id);
                        }}
                        className="font-display font-bold text-sm sm:text-base text-[#0D1B2A] hover:text-[#D4A017] transition text-left truncate flex items-center gap-1.5"
                      >
                        <User size={14} className="text-[#D4A017]" />
                        <span>{client ? `${client.prenom} ${client.nom}` : 'Client inconnu'}</span>
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-[#0D1B2A]/85 mt-0.5 truncate">
                      {cmd.nom_tissu || 'Tissu'}
                    </p>

                    {cmd.description_tissu && (
                      <p className="text-xs text-[#0D1B2A]/55 truncate mt-0.5">
                        {cmd.description_tissu}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${
                          relativeDate.isLate
                            ? 'bg-[#A63A3A]/15 text-[#A63A3A] font-bold'
                            : relativeDate.isUrgent
                            ? 'bg-[#D4A017]/20 text-[#9A7000] font-semibold'
                            : 'bg-[#0D1B2A]/5 text-[#0D1B2A]/70'
                        }`}
                      >
                        <Calendar size={12} />
                        <span>{relativeDate.label}</span>
                      </span>

                      <span className="text-[11px] text-[#0D1B2A]/50">
                        Prix : {formatCurrency(cmd.prix_global, settings.devise)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Payment status + Badge + Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#0D1B2A]/50 block">
                      Reste à payer
                    </span>
                    <span
                      className={`text-sm sm:text-base font-display font-extrabold ${
                        cmd.reste_a_payer > 0 ? 'text-[#0D1B2A]' : 'text-[#1F4D3A]'
                      }`}
                    >
                      {formatCurrency(cmd.reste_a_payer, settings.devise)}
                    </span>
                    {cmd.avance > 0 && (
                      <span className="text-[10px] text-[#0D1B2A]/50 block">
                        (Avance : {formatCurrency(cmd.avance, settings.devise)})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge statut={cmd.statut} size="sm" />
                    <div className="w-7 h-7 rounded-lg bg-[#0D1B2A]/5 flex items-center justify-center text-[#0D1B2A]/30 group-hover:text-[#D4A017] group-hover:bg-[#0D1B2A] transition">
                      <ChevronRight size={15} />
                    </div>
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
