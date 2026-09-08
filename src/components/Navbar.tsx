import React from 'react';
import { Home, Users, Scissors, Plus, Settings } from 'lucide-react';
import { Logo } from './Logo';
import { ViewTab } from '../types';
import { WaxHeaderPattern } from './WaxDecorations';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenNewOrder: () => void;
  totalClientsCount?: number;
  totalCommandesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenNewOrder,
  totalClientsCount,
  totalCommandesCount,
}) => {
  const isAccueil = currentTab === 'accueil' || currentTab === 'dashboard';
  const isClients = currentTab === 'clients' || currentTab === 'client_detail';
  const isCommandes = currentTab === 'commandes' || currentTab === 'commande_detail';
  const isParametres = currentTab === 'parametres' || currentTab === 'settings';

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full bg-[#0D1B2A] text-[#F7F4EF] shadow-md border-b border-[#D4A017]/20 relative overflow-hidden">
        <WaxHeaderPattern opacity={0.06} />
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
          <button
            type="button"
            onClick={() => onTabChange('accueil')}
            className="flex items-center text-left focus:outline-hidden group"
          >
            <Logo variant="light" size="sm" withSlogan={false} />
          </button>

          {/* Desktop quick navigation tabs & settings */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-white/10 p-1 rounded-xl border border-white/10 text-xs font-medium mr-2">
              <button
                type="button"
                onClick={() => onTabChange('accueil')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  isAccueil
                    ? 'bg-[#D4A017] text-[#0D1B2A] font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Accueil
              </button>

              <button
                type="button"
                onClick={() => onTabChange('clients')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  isClients
                    ? 'bg-[#D4A017] text-[#0D1B2A] font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>Clients</span>
                {totalClientsCount !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isClients ? 'bg-[#0D1B2A] text-[#D4A017]' : 'bg-white/20 text-white'
                    }`}
                  >
                    {totalClientsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onTabChange('commandes')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  isCommandes
                    ? 'bg-[#D4A017] text-[#0D1B2A] font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>Commandes</span>
                {totalCommandesCount !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isCommandes ? 'bg-[#0D1B2A] text-[#D4A017]' : 'bg-white/20 text-white'
                    }`}
                  >
                    {totalCommandesCount}
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              id="btn-ajouter-header"
              onClick={onOpenNewOrder}
              className="hidden sm:inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#c29213] text-[#0D1B2A] font-bold px-3.5 py-1.5 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>+ Nouvelle</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('parametres')}
              title="Paramètres de l'atelier"
              className={`p-2 rounded-xl border transition ${
                isParametres
                  ? 'bg-[#D4A017] text-[#0D1B2A] border-[#D4A017]'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/10'
              }`}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed with Center Prominent + Action Button) */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1B2A] text-[#F7F4EF] border-t border-[#D4A017]/25 shadow-2xl px-2 py-1.5 pb-safe"
      >
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {/* Accueil */}
          <button
            type="button"
            id="nav-tab-accueil"
            onClick={() => onTabChange('accueil')}
            className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition ${
              isAccueil ? 'text-[#D4A017] font-semibold' : 'text-white/60 hover:text-white/90'
            }`}
          >
            <Home size={20} strokeWidth={isAccueil ? 2.5 : 2} />
            <span className="text-[11px] mt-1 tracking-tight">Accueil</span>
          </button>

          {/* Clients */}
          <button
            type="button"
            id="nav-tab-clients"
            onClick={() => onTabChange('clients')}
            className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition ${
              isClients ? 'text-[#D4A017] font-semibold' : 'text-white/60 hover:text-white/90'
            }`}
          >
            <Users size={20} strokeWidth={isClients ? 2.5 : 2} />
            <span className="text-[11px] mt-1 tracking-tight">Clients</span>
          </button>

          {/* Center Prominent + AJOUTER Button */}
          <div className="relative -top-4 flex items-center justify-center">
            <button
              type="button"
              id="nav-btn-ajouter-central"
              onClick={onOpenNewOrder}
              className="w-14 h-14 rounded-full bg-[#D4A017] text-[#0D1B2A] flex flex-col items-center justify-center shadow-lg hover:bg-[#c29213] active:scale-95 transition border-3 border-[#0D1B2A]"
              title="Créer une commande"
            >
              <Plus size={24} strokeWidth={3} />
              <span className="text-[9px] font-extrabold -mt-0.5 tracking-tighter">AJOUTER</span>
            </button>
          </div>

          {/* Commandes */}
          <button
            type="button"
            id="nav-tab-commandes"
            onClick={() => onTabChange('commandes')}
            className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition ${
              isCommandes ? 'text-[#D4A017] font-semibold' : 'text-white/60 hover:text-white/90'
            }`}
          >
            <Scissors size={20} strokeWidth={isCommandes ? 2.5 : 2} />
            <span className="text-[11px] mt-1 tracking-tight">Commandes</span>
          </button>

          {/* Atelier / Paramètres */}
          <button
            type="button"
            id="nav-tab-settings"
            onClick={() => onTabChange('parametres')}
            className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition ${
              isParametres ? 'text-[#D4A017] font-semibold' : 'text-white/60 hover:text-white/90'
            }`}
          >
            <Settings size={20} strokeWidth={isParametres ? 2.5 : 2} />
            <span className="text-[11px] mt-1 tracking-tight">Atelier</span>
          </button>
        </div>
      </nav>
    </>
  );
};
