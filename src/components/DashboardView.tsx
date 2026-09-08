import React, { useMemo } from 'react';
import { Users, Clock, Sparkles, CheckCircle2, Wallet, Calendar, ChevronRight, Plus, Phone } from 'lucide-react';
import { Commande, Client, AtelierSettings, StatutCommande, CommandeFilter } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDateFrench, getDeliveryRelativeText } from '../utils/format';
import { EmptyState } from './EmptyState';
import { WaxHeaderPattern } from './WaxDecorations';

export interface DashboardStats {
  totalClients: number;
  commandesEnCours: number;
  commandesPretes: number;
  commandesSoldees: number;
  totalCommandes: number;
  totalRestantAEncaisser: number;
  prochainesLivraisons: Commande[];
}

interface DashboardViewProps {
  stats?: Partial<DashboardStats>;
  clients?: Client[];
  commandes?: Commande[];
  settings: AtelierSettings;
  onNavigateToClients?: () => void;
  onNavigateToCommandes?: (filter?: StatutCommande | 'toutes') => void;
  onFilterByStatus?: (filter: CommandeFilter) => void;
  onSelectCommande: (id: string) => void;
  onSelectClient: (id: string) => void;
  onOpenNewOrder: () => void;
  onOpenNewClient?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  clients = [],
  commandes = [],
  settings,
  onNavigateToClients,
  onNavigateToCommandes,
  onFilterByStatus,
  onSelectCommande,
  onSelectClient,
  onOpenNewOrder,
  onOpenNewClient,
}) => {
  const getClient = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  // Compute stats safely with complete fallbacks
  const activeStats = useMemo<DashboardStats>(() => {
    const cmds = Array.isArray(commandes) ? commandes : [];
    const cls = Array.isArray(clients) ? clients : [];

    const enCours = cmds.filter(c => c.statut === 'en_cours');
    const pretes = cmds.filter(c => c.statut === 'pret');
    const soldees = cmds.filter(c => c.statut === 'solde');
    const totalRestant = cmds.reduce((sum, c) => sum + (Number(c.reste_a_payer) || 0), 0);

    const upcomingDeliveries = [...cmds]
      .filter(c => c.statut !== 'solde')
      .sort((a, b) => (a.date_livraison || '').localeCompare(b.date_livraison || ''))
      .slice(0, 5);

    return {
      totalClients: stats?.totalClients ?? cls.length,
      commandesEnCours: stats?.commandesEnCours ?? enCours.length,
      commandesPretes: stats?.commandesPretes ?? pretes.length,
      commandesSoldees: stats?.commandesSoldees ?? soldees.length,
      totalCommandes: stats?.totalCommandes ?? cmds.length,
      totalRestantAEncaisser: stats?.totalRestantAEncaisser ?? totalRestant,
      prochainesLivraisons: stats?.prochainesLivraisons ?? upcomingDeliveries,
    };
  }, [stats, commandes, clients]);

  const handleGoToCommandes = (filter?: StatutCommande | 'toutes') => {
    if (onFilterByStatus) {
      onFilterByStatus(filter as CommandeFilter);
    } else if (onNavigateToCommandes) {
      onNavigateToCommandes(filter);
    }
  };

  const handleGoToClients = () => {
    if (onNavigateToClients) {
      onNavigateToClients();
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Atelier Banner / Welcome Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0D1B2A] to-[#1a2f47] text-[#F7F4EF] p-5 sm:p-6 shadow-md overflow-hidden border border-[#D4A017]/20">
        <WaxHeaderPattern opacity={0.07} />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#D4A017] font-semibold">
                {settings.nom_atelier || 'Atelier de couture'}
              </p>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-0.5">
                Tableau de bord
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenNewClient}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition active:scale-95 flex items-center gap-1.5"
              >
                <Users size={14} className="text-[#D4A017]" />
                <span>+ Client</span>
              </button>
              <button
                type="button"
                onClick={onOpenNewOrder}
                className="px-3.5 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#c29213] text-[#0D1B2A] text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-1.5"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>+ Commande</span>
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#F7F4EF]/75 max-w-md">
            « La précision qui valorise votre savoir-faire »
          </p>
        </div>
      </div>

      {/* Primary Financial Metric: Montant restant à encaisser */}
      <div
        id="card-restant-a-encaisser"
        className="rounded-2xl bg-white p-5 border border-[#0D1B2A]/8 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4A017]/15 flex items-center justify-center text-[#9A7000]">
              <Wallet size={18} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#0D1B2A]/70 uppercase tracking-wider">
              Total restant à encaisser
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4A017]/15 text-[#9A7000] font-medium">
            Avances déduites
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#0D1B2A] tracking-tight">
            {formatCurrency(activeStats.totalRestantAEncaisser, settings.devise)}
          </span>
        </div>
        <p className="text-xs text-[#0D1B2A]/60 mt-1">
          Somme automatique due sur l'ensemble de vos commandes
        </p>
      </div>

      {/* Activity Counters Grid: Clients + Commandes by Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Clients */}
        <button
          type="button"
          onClick={handleGoToClients}
          className="text-left bg-white p-4 rounded-2xl border border-[#0D1B2A]/8 shadow-xs hover:border-[#D4A017]/50 active:scale-98 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#0D1B2A]/5 flex items-center justify-center text-[#0D1B2A]">
              <Users size={16} />
            </div>
            <ChevronRight size={14} className="text-[#0D1B2A]/30 group-hover:text-[#D4A017] transition" />
          </div>
          <p className="text-xs font-medium text-[#0D1B2A]/60">Clients</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-[#0D1B2A] mt-0.5">
            {activeStats.totalClients}
          </p>
        </button>

        {/* Commandes En cours */}
        <button
          type="button"
          onClick={() => handleGoToCommandes('en_cours')}
          className="text-left bg-white p-4 rounded-2xl border border-[#0D1B2A]/8 shadow-xs hover:border-[#0D1B2A]/50 active:scale-98 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#0D1B2A] flex items-center justify-center text-[#D4A017]">
              <Clock size={16} />
            </div>
            <span className="w-2 h-2 rounded-full bg-[#0D1B2A]" />
          </div>
          <p className="text-xs font-medium text-[#0D1B2A]/60">En cours</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-[#0D1B2A] mt-0.5">
            {activeStats.commandesEnCours}
          </p>
        </button>

        {/* Commandes Prêtes */}
        <button
          type="button"
          onClick={() => handleGoToCommandes('pret')}
          className="text-left bg-white p-4 rounded-2xl border border-[#0D1B2A]/8 shadow-xs hover:border-[#D4A017] active:scale-98 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4A017] flex items-center justify-center text-[#0D1B2A]">
              <Sparkles size={16} />
            </div>
            <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
          </div>
          <p className="text-xs font-medium text-[#0D1B2A]/60">Prêtes</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-[#0D1B2A] mt-0.5">
            {activeStats.commandesPretes}
          </p>
        </button>

        {/* Commandes Soldées */}
        <button
          type="button"
          onClick={() => handleGoToCommandes('solde')}
          className="text-left bg-white p-4 rounded-2xl border border-[#0D1B2A]/8 shadow-xs hover:border-[#1F4D3A] active:scale-98 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#1F4D3A] flex items-center justify-center text-white">
              <CheckCircle2 size={16} />
            </div>
            <span className="w-2 h-2 rounded-full bg-[#1F4D3A]" />
          </div>
          <p className="text-xs font-medium text-[#0D1B2A]/60">Soldées</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-[#0D1B2A] mt-0.5">
            {activeStats.commandesSoldees}
          </p>
        </button>
      </div>

      {/* Livraisons Prochaines Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#0D1B2A]" />
            <h2 className="font-display font-bold text-base sm:text-lg text-[#0D1B2A]">
              Livraisons prochaines
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleGoToCommandes('toutes')}
            className="text-xs font-semibold text-[#0D1B2A] hover:text-[#D4A017] flex items-center gap-1 transition"
          >
            <span>Voir tout ({activeStats.totalCommandes})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {activeStats.prochainesLivraisons.length === 0 ? (
          <EmptyState
            type="livraisons"
            onAction={onOpenNewOrder}
            actionLabel="+ Nouvelle commande"
          />
        ) : (
          <div className="space-y-2.5">
            {activeStats.prochainesLivraisons.map(cmd => {
              const client = getClient(cmd.client_id);
              const relativeDate = getDeliveryRelativeText(cmd.date_livraison);

              return (
                <div
                  key={cmd.id}
                  id={`livraison-item-${cmd.id}`}
                  onClick={() => onSelectCommande(cmd.id)}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#0D1B2A]/8 shadow-xs hover:border-[#D4A017]/60 active:bg-[#F7F4EF]/50 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  {/* Left: Fabric thumbnail & Client / Tissu details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-[#0D1B2A]/5 flex-shrink-0 border border-[#0D1B2A]/10 relative">
                      {cmd.image_tissu ? (
                        <img
                          src={cmd.image_tissu}
                          alt={cmd.nom_tissu || 'Tissu'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#0D1B2A]/30 text-xs">
                          Tissu
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-[#0D1B2A]/70 text-[9px] text-white text-center font-mono py-0.5">
                        {cmd.reference}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (client) onSelectClient(client.id);
                          }}
                          className="font-bold text-sm sm:text-base text-[#0D1B2A] truncate hover:text-[#D4A017] transition text-left"
                        >
                          {client ? `${client.prenom} ${client.nom}` : 'Client inconnu'}
                        </button>
                      </div>

                      <p className="text-xs text-[#0D1B2A]/70 truncate mt-0.5">
                        {cmd.nom_tissu || 'Tissu personnalisé'}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            relativeDate.isLate
                              ? 'bg-[#A63A3A]/15 text-[#A63A3A] font-bold'
                              : relativeDate.isUrgent
                              ? 'bg-[#D4A017]/20 text-[#9A7000] font-semibold'
                              : 'bg-[#0D1B2A]/5 text-[#0D1B2A]/70'
                          }`}
                        >
                          📅 {relativeDate.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reste à payer & Status badge */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge statut={cmd.statut} size="sm" />
                    <div className="text-right">
                      <span className="text-[10px] text-[#0D1B2A]/50 block">Reste :</span>
                      <span
                        className={`text-xs sm:text-sm font-display font-extrabold ${
                          cmd.reste_a_payer > 0 ? 'text-[#0D1B2A]' : 'text-[#1F4D3A]'
                        }`}
                      >
                        {formatCurrency(cmd.reste_a_payer, settings.devise)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Tips / Atelier Note */}
      <div className="p-4 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/30 text-xs text-[#0D1B2A] flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-[#D4A017] text-[#0D1B2A] font-bold flex items-center justify-center flex-shrink-0 text-xs">
          i
        </div>
        <p className="leading-relaxed">
          <strong className="font-semibold">Principe de précision :</strong> Chaque commande conserve ses propres mesures et son propre tissu de manière indépendante. Modifier une commande ne modifie jamais les autres commandes du client.
        </p>
      </div>
    </div>
  );
};
