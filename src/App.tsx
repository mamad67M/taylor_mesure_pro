import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import {
  ViewTab,
  Client,
  Commande,
  Mesures,
  AtelierSettings,
  CommandeFilter,
  StatutCommande,
} from './types';
import { DBService } from './services/db';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { ClientDetailView } from './components/ClientDetailView';
import { OrdersView } from './components/OrdersView';
import { OrderDetailView } from './components/OrderDetailView';
import { SettingsView } from './components/SettingsView';
import { CreateOrderWizard } from './components/CreateOrderWizard';
import { EditOrderModal } from './components/EditOrderModal';
import { EditMesuresModal } from './components/EditMesuresModal';
import { EditClientModal } from './components/EditClientModal';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthPage, setShowAuthPage] = useState(false);

  // Main navigation tab
  const [currentTab, setCurrentTab] = useState<ViewTab>('accueil');

  // Sub-views state
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedCommandeId, setSelectedCommandeId] = useState<string | null>(null);
  const [ordersFilter, setOrdersFilter] = useState<CommandeFilter>('toutes');

  // Database reactive state
  const [clients, setClients] = useState<Client[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [mesuresList, setMesuresList] = useState<Mesures[]>([]);
  const [settings, setSettings] = useState<AtelierSettings>({
    nom_atelier: 'Atelier MesurePro',
    nom_tailleur: 'Mamadou Diallo',
    telephone_atelier: '+224 622 00 00 00',
    devise: 'FG',
    unite_mesure_defaut: 'cm',
  });

  // Modals state
  const [showOrderWizard, setShowOrderWizard] = useState(false);
  const [wizardPreselectedClientId, setWizardPreselectedClientId] = useState<string | undefined>(undefined);

  const [showClientModal, setShowClientModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | undefined>(undefined);

  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [showEditMesuresModal, setShowEditMesuresModal] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        DBService.setUserId(currentUser.uid);
        await DBService.syncFromCloud();
        setShowAuthPage(false);
      } else {
        DBService.setUserId(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync with DBService
  const loadData = useCallback(() => {
    setClients(DBService.getClients());
    setCommandes(DBService.getCommandes());
    setMesuresList(DBService.getMesures());
    setSettings(DBService.getSettings());
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = DBService.subscribe(loadData);
    return () => unsubscribe();
  }, [loadData]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentTab('accueil');
  };

  // Tab change handler (resets detailed selections)
  const handleTabChange = (tab: ViewTab) => {
    setCurrentTab(tab);
    setSelectedClientId(null);
    setSelectedCommandeId(null);
  };

  // Open Wizard
  const handleOpenOrderWizard = (clientId?: string) => {
    setWizardPreselectedClientId(clientId);
    setShowOrderWizard(true);
  };

  // Open Client Modal
  const handleOpenClientModal = (client?: Client) => {
    setClientToEdit(client);
    setShowClientModal(true);
  };

  // Client Selection Handlers
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedCommandeId(null);
    setCurrentTab('clients');
  };

  // Commande Selection Handlers
  const handleSelectCommande = (commandeId: string) => {
    setSelectedCommandeId(commandeId);
    setCurrentTab('commandes');
  };

  // Filter selection helper (e.g. clicking 'En cours' on dashboard)
  const handleNavigateOrdersWithFilter = (filter: CommandeFilter) => {
    setOrdersFilter(filter);
    setSelectedCommandeId(null);
    setSelectedClientId(null);
    setCurrentTab('commandes');
  };

  // Save new order from wizard
  const handleSaveWizardOrder = (
    clientData: { isNew: boolean; clientId?: string; nom?: string; prenom?: string; telephone?: string },
    commandeData: {
      nom_tissu: string;
      description_tissu: string;
      image_tissu: string;
      image_modele?: string;
      prix_global: number;
      avance: number;
      date_livraison: string;
      statut: StatutCommande;
    },
    mesuresData: {
      poitrine: number | null;
      taille: number | null;
      manche: number | null;
      epaules: number | null;
      fesses: number | null;
      cuisses: number | null;
      longueur_chemise: number | null;
      longueur_jupe: number | null;
      longueur_robe: number | null;
    }
  ) => {
    let finalClientId = clientData.clientId;

    if (clientData.isNew) {
      const newClient = DBService.createClient({
        nom: clientData.nom || 'Client',
        prenom: clientData.prenom || 'Nouveau',
        telephone: clientData.telephone || '',
      });
      finalClientId = newClient.id;
    }

    if (!finalClientId) return;

    // Create order + unique measures atomically
    const { commande } = DBService.createCommandeWithMesures(
      finalClientId,
      commandeData,
      mesuresData
    );

    // If order was created, open its detailed view
    if (commande) {
      setSelectedCommandeId(commande.id);
      setCurrentTab('commandes');
    }
  };

  // Save / Update client modal
  const handleSaveClient = (data: { nom: string; prenom: string; telephone: string }) => {
    if (clientToEdit) {
      DBService.updateClient(clientToEdit.id, data);
    } else {
      const newC = DBService.createClient(data);
      setSelectedClientId(newC.id);
      setCurrentTab('clients');
    }
  };

  // Delete client handler
  const handleDeleteClient = (client: Client) => {
    const clientOrders = DBService.getCommandesByClient(client.id);
    const msg = clientOrders.length > 0
      ? `Attention: Ce client a ${clientOrders.length} commande(s) associée(s). Supprimer ce client supprimera également ses commandes et mesures. Confirmer ?`
      : `Voulez-vous vraiment supprimer le client ${client.prenom} ${client.nom} ?`;

    if (confirm(msg)) {
      DBService.deleteClient(client.id);
      setSelectedClientId(null);
    }
  };

  // Delete commande handler
  const handleDeleteCommande = (commandeId: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette commande et ses mesures associées ?')) {
      DBService.deleteCommande(commandeId);
      setSelectedCommandeId(null);
    }
  };

  // Update commande fields
  const handleSaveEditedOrder = (fields: Partial<Commande>) => {
    if (!selectedCommandeId) return;
    DBService.updateCommande(selectedCommandeId, fields);
  };

  // Update measures fields
  const handleSaveEditedMesures = (fields: Partial<Mesures>) => {
    if (!selectedCommandeId) return;
    const currentMesures = DBService.getMesuresByCommande(selectedCommandeId);
    if (currentMesures) {
      DBService.updateMesures(currentMesures.id, fields);
    }
  };

  // Currently viewed entities
  const activeClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find(c => c.id === selectedClientId) || null;
  }, [selectedClientId, clients]);

  const activeClientOrders = useMemo(() => {
    if (!selectedClientId) return [];
    return commandes.filter(c => c.client_id === selectedClientId);
  }, [selectedClientId, commandes]);

  const activeCommande = useMemo(() => {
    if (!selectedCommandeId) return null;
    return commandes.find(c => c.id === selectedCommandeId) || null;
  }, [selectedCommandeId, commandes]);

  const activeCommandeClient = useMemo(() => {
    if (!activeCommande) return null;
    return clients.find(c => c.id === activeCommande.client_id) || null;
  }, [activeCommande, clients]);

  const activeCommandeMesures = useMemo(() => {
    if (!activeCommande) return null;
    return (
      mesuresList.find(m => m.commande_id === activeCommande.id) || {
        id: 'tmp',
        commande_id: activeCommande.id,
        poitrine: null,
        taille: null,
        manche: null,
        epaules: null,
        fesses: null,
        cuisses: null,
        longueur_chemise: null,
        longueur_jupe: null,
        longueur_robe: null,
        unite: 'cm' as const,
        created_at: '',
        updated_at: '',
      }
    );
  }, [activeCommande, mesuresList]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center">
        <div className="text-[#D4A017] text-lg font-bold">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    if (showAuthPage) {
      return <AuthPage onBack={() => setShowAuthPage(false)} />;
    }
    return <LandingPage onGoToAuth={() => setShowAuthPage(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#0D1B2A] font-sans antialiased flex flex-col selection:bg-[#D4A017]/30 selection:text-[#0D1B2A]">
      {/* Navigation Header & Mobile Dock */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onOpenNewOrder={() => handleOpenOrderWizard()}
        totalClientsCount={clients.length}
        totalCommandesCount={commandes.length}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 pb-20 sm:pb-8">
        {/* TAB 1: ACCUEIL / DASHBOARD */}
        {currentTab === 'accueil' && !selectedCommandeId && !selectedClientId && (
          <DashboardView
            clients={clients}
            commandes={commandes}
            settings={settings}
            onSelectCommande={handleSelectCommande}
            onSelectClient={handleSelectClient}
            onOpenNewOrder={() => handleOpenOrderWizard()}
            onOpenNewClient={() => handleOpenClientModal()}
            onNavigateToClients={() => handleTabChange('clients')}
            onNavigateToCommandes={(filter) => handleNavigateOrdersWithFilter((filter as CommandeFilter) || 'toutes')}
            onFilterByStatus={handleNavigateOrdersWithFilter}
          />
        )}

        {/* TAB 2: COMMANDES VIEW OR COMMANDE DETAIL */}
        {currentTab === 'commandes' && (
          <>
            {selectedCommandeId && activeCommande && activeCommandeClient ? (
              <OrderDetailView
                commande={activeCommande}
                client={activeCommandeClient}
                mesures={activeCommandeMesures}
                settings={settings}
                onBack={() => setSelectedCommandeId(null)}
                onSelectClient={handleSelectClient}
                onEditCommande={() => setShowEditOrderModal(true)}
                onEditMesures={() => setShowEditMesuresModal(true)}
                onUpdateStatus={(st) => DBService.updateCommandeStatus(activeCommande.id, st)}
                onUpdateFabricPhoto={(photo) => DBService.updateCommande(activeCommande.id, { image_tissu: photo })}
                onUpdateModelePhoto={(photo) => DBService.updateCommande(activeCommande.id, { image_modele: photo })}
                onDeleteCommande={() => handleDeleteCommande(activeCommande.id)}
              />
            ) : (
              <OrdersView
                commandes={commandes}
                clients={clients}
                settings={settings}
                activeFilter={ordersFilter}
                onFilterChange={setOrdersFilter}
                onSelectCommande={handleSelectCommande}
                onSelectClient={handleSelectClient}
                onOpenNewOrder={() => handleOpenOrderWizard()}
              />
            )}
          </>
        )}

        {/* TAB 3: CLIENTS VIEW OR CLIENT DETAIL */}
        {currentTab === 'clients' && (
          <>
            {selectedClientId && activeClient ? (
              <ClientDetailView
                client={activeClient}
                commandes={activeClientOrders}
                settings={settings}
                onBack={() => setSelectedClientId(null)}
                onSelectCommande={handleSelectCommande}
                onNewOrder={(cId) => handleOpenOrderWizard(cId)}
                onEditClient={handleOpenClientModal}
                onDeleteClient={handleDeleteClient}
              />
            ) : (
              <ClientsView
                clients={clients}
                commandes={commandes}
                settings={settings}
                onSelectClient={handleSelectClient}
                onOpenNewClient={() => handleOpenClientModal()}
                onOpenNewOrderForClient={(cId) => handleOpenOrderWizard(cId)}
              />
            )}
          </>
        )}

        {/* TAB 4: PARAMÈTRES / ATELIER */}
        {currentTab === 'parametres' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={DBService.updateSettings}
            onResetDemo={DBService.resetToDemo}
            onClearAll={DBService.clearAll}
          />
        )}
        
        {/* Logout Button inside Settings (Quick Hack since we don't modify Navbar) */}
        {currentTab === 'parametres' && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <button 
              onClick={handleLogout}
              className="w-full bg-white border border-red-200 text-red-600 px-4 py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition"
            >
              Déconnexion
            </button>
          </div>
        )}
      </main>

      {/* MODAL: STEP-BY-STEP ORDER WIZARD */}
      {showOrderWizard && (
        <CreateOrderWizard
          clients={clients}
          settings={settings}
          preselectedClientId={wizardPreselectedClientId}
          onClose={() => {
            setShowOrderWizard(false);
            setWizardPreselectedClientId(undefined);
          }}
          onSubmit={handleSaveWizardOrder}
        />
      )}

      {/* MODAL: EDIT / CREATE CLIENT */}
      {showClientModal && (
        <EditClientModal
          client={clientToEdit}
          onClose={() => {
            setShowClientModal(false);
            setClientToEdit(undefined);
          }}
            onSave={handleSaveClient}
        />
      )}

      {/* MODAL: EDIT COMMANDE */}
      {showEditOrderModal && activeCommande && (
        <EditOrderModal
          commande={activeCommande}
          settings={settings}
          onClose={() => setShowEditOrderModal(false)}
          onSave={handleSaveEditedOrder}
        />
      )}

      {/* MODAL: EDIT MESURES (strictly for selected order) */}
      {showEditMesuresModal && activeCommande && activeCommandeMesures && (
        <EditMesuresModal
          mesures={activeCommandeMesures}
          orderReference={activeCommande.reference}
          onClose={() => setShowEditMesuresModal(false)}
          onSave={handleSaveEditedMesures}
        />
      )}
    </div>
  );
}
