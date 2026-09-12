import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Scissors, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { Client, Commande } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  commandes: Commande[];
  onSelectClient: (id: string) => void;
  onSelectCommande: (id: string) => void;
}

type SearchResultItem = 
  | { type: 'client'; data: Client; id: string }
  | { type: 'commande'; data: Commande; id: string; clientName?: string };

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  clients,
  commandes,
  onSelectClient,
  onSelectCommande
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Client lookup for order results
  const clientMap = new Map<string, Client>(clients.map(c => [c.id, c]));

  // Combine and format data for Fuse.js
  const searchData: SearchResultItem[] = [
    ...clients.map(c => ({ type: 'client' as const, data: c, id: c.id })),
    ...commandes.map(cmd => ({ 
      type: 'commande' as const, 
      data: cmd, 
      id: cmd.id,
      clientName: clientMap.get(cmd.client_id) ? `${clientMap.get(cmd.client_id)!.prenom} ${clientMap.get(cmd.client_id)!.nom}` : undefined
    }))
  ];

  const fuseOptions = {
    keys: [
      { name: 'data.nom', weight: 0.3 },
      { name: 'data.prenom', weight: 0.3 },
      { name: 'data.telephone', weight: 0.4 },
      { name: 'data.reference', weight: 0.5 },
      { name: 'data.nom_tissu', weight: 0.3 },
      { name: 'data.description_tissu', weight: 0.2 },
      { name: 'clientName', weight: 0.2 } // Allow searching orders by client name
    ],
    threshold: 0.4, // Fuzzy threshold (0.0 is exact match, 1.0 is match anything)
    includeMatches: true,
  };

  const fuse = new Fuse(searchData, fuseOptions);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const searchResults = fuse.search(query);
    setResults(searchResults.map(result => result.item).slice(0, 8)); // Max 8 results
  }, [query, clients, commandes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0D1B2A]/40 backdrop-blur-sm sm:p-4">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-auto bg-[#F7F4EF] flex flex-col sm:rounded-2xl shadow-2xl overflow-hidden h-full sm:h-auto sm:max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-top-4 duration-200">
        
        {/* Search Input Area */}
        <div className="p-3 sm:p-4 bg-white border-b border-[#0D1B2A]/10 flex items-center gap-3">
          <div className="flex-1 relative flex items-center bg-[#F7F4EF] rounded-xl overflow-hidden border border-[#0D1B2A]/10 focus-within:border-[#D4A017] focus-within:ring-2 focus-within:ring-[#D4A017]/20 transition-all">
            <Search className="absolute left-3 text-[#0D1B2A]/40" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Chercher un client (nom, tel), tissu, référence..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent py-3.5 pl-10 pr-10 outline-none text-[#0D1B2A] font-medium placeholder-[#0D1B2A]/40"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 rounded-full text-[#0D1B2A]/40 hover:bg-[#0D1B2A]/10 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white border border-[#0D1B2A]/10 text-[#0D1B2A] rounded-xl font-bold text-sm hover:bg-[#0D1B2A]/5 transition-colors sm:hidden"
          >
            Fermer
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 pb-24 sm:pb-4">
          {!query.trim() ? (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
              <Search size={48} className="mb-4 text-[#0D1B2A]/30" strokeWidth={1.5} />
              <p className="text-[#0D1B2A] font-medium text-lg">Recherche globale</p>
              <p className="text-[#0D1B2A]/70 text-sm mt-1 max-w-[250px]">
                Tapez un nom, un numéro (ex: 77...), une référence de commande ou un tissu.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-70">
              <p className="text-[#0D1B2A] font-medium text-lg">Aucun résultat</p>
              <p className="text-[#0D1B2A]/60 text-sm mt-1">
                Vérifiez l'orthographe ou essayez un autre mot-clé.
              </p>
            </div>
          ) : (
            results.map((item, index) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => {
                  onClose();
                  if (item.type === 'client') onSelectClient(item.id);
                  else onSelectCommande(item.id);
                }}
                className="w-full text-left bg-white p-3 sm:p-4 rounded-xl border border-[#0D1B2A]/5 shadow-sm hover:border-[#D4A017] hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'client' ? 'bg-[#3A7CA6]/10 text-[#3A7CA6]' : 'bg-[#D4A017]/15 text-[#9A7000]'
                  }`}>
                    {item.type === 'client' ? <User size={20} /> : <Scissors size={20} />}
                  </div>
                  
                  <div className="min-w-0">
                    <p className="font-display font-bold text-[#0D1B2A] text-sm sm:text-base truncate">
                      {item.type === 'client' 
                        ? `${item.data.prenom} ${item.data.nom}` 
                        : item.data.nom_tissu || 'Commande sans nom de tissu'
                      }
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#0D1B2A]/60 mt-0.5 truncate">
                      {item.type === 'client' ? (
                        <span>{item.data.telephone}</span>
                      ) : (
                        <>
                          <span className="font-mono bg-[#0D1B2A]/5 px-1.5 py-0.5 rounded text-[#0D1B2A]/70">
                            {item.data.reference}
                          </span>
                          <span className="truncate flex-1">&bull; {item.clientName || 'Client inconnu'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <ChevronRight size={18} className="text-[#0D1B2A]/20 group-hover:text-[#D4A017] transition-colors shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
