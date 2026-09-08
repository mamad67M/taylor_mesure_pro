import { Client, Commande, Mesures, AtelierSettings, StatutCommande } from '../types';
import { INITIAL_CLIENTS, INITIAL_COMMANDES, INITIAL_MESURES, INITIAL_SETTINGS } from '../utils/sampleData';
import { supabase } from '../lib/supabase';

// We no longer rely on Firebase auth.
// If the user isn't logged in via Firebase, we just use a default 'local_user'
// so that the data can still be synced to Supabase for the current instance.
let currentUserId: string | null = 'local_user';

const getStorageKey = (base: string) => {
  return currentUserId ? `${base}_${currentUserId}` : base;
};

const STORAGE_KEYS = {
  get CLIENTS() { return getStorageKey('mesurepro_clients_v1'); },
  get COMMANDES() { return getStorageKey('mesurepro_commandes_v1'); },
  get MESURES() { return getStorageKey('mesurepro_mesures_v1'); },
  get SETTINGS() { return getStorageKey('mesurepro_settings_v1'); },
};

// Listeners for reactive updates
type DBListener = () => void;
const listeners: Set<DBListener> = new Set();

export const subscribeToDB = (listener: DBListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyChange = () => {
  listeners.forEach(fn => fn());
};

// Safe LocalStorage helpers
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading key ${key} from storage:`, err);
    return fallback;
  }
}

// Background sync to Supabase
async function syncCollectionToCloud(collectionName: string, items: any[]) {
  if (!currentUserId) return;
  try {
    const itemsWithUser = items.map(item => {
      // Create a copy of the item
      const cleanedItem = { ...item, user_id: currentUserId };
      
      // If this is the commandes collection, we MUST remove reste_a_payer 
      // before sending to Supabase because it's a Generated Column (calculated by the DB).
      // Trying to insert a value into a generated column throws error 428C9.
      if (collectionName === 'commandes') {
        delete cleanedItem.reste_a_payer;
      }
      
      return cleanedItem;
    });
    
    const { error } = await supabase
      .from(collectionName)
      .upsert(itemsWithUser, { onConflict: 'id' });
      
    if (error) {
      console.error(`Supabase Error (${collectionName}):`, error);
      alert(`Erreur de synchronisation avec Supabase (${collectionName}): ${error.message}`);
      throw error;
    }
  } catch (err: any) {
    console.error(`Error syncing ${collectionName} to cloud:`, err);
    // Don't alert here if it's already alerted above
    if (!err.message?.includes('Supabase Error')) {
        alert(`Erreur de synchronisation avec Supabase (${collectionName}): ${err.message}`);
    }
  }
}

function saveToStorage<T>(key: string, data: T, collectionName?: string): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    
    // Asynchronously sync to cloud if it's an array and collectionName is provided
    if (currentUserId && collectionName && Array.isArray(data)) {
      syncCollectionToCloud(collectionName, data).catch(console.error);
    }
  } catch (err) {
    console.error(`Error saving key ${key} to storage:`, err);
  }
}

// Initial bootstrap check
function initStorageIfNeeded() {
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
    saveToStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS, 'clients');
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMANDES)) {
    saveToStorage(STORAGE_KEYS.COMMANDES, INITIAL_COMMANDES, 'commandes');
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESURES)) {
    saveToStorage(STORAGE_KEYS.MESURES, INITIAL_MESURES, 'mesures');
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS, 'settings');
  }
}

// Initialize on module load
initStorageIfNeeded();

export const DBService = {
  setUserId(uid: string | null) {
    currentUserId = uid;
    initStorageIfNeeded();
    notifyChange();
  },

  async syncFromCloud() {
    if (!currentUserId) return;
    try {
      // Fetch Clients
      const { data: clients, error: errClients } = await supabase.from('clients').select('*').eq('user_id', currentUserId);
      if (clients && clients.length > 0) localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));

      // Fetch Commandes
      const { data: commandes, error: errCmds } = await supabase.from('commandes').select('*').eq('user_id', currentUserId);
      if (commandes && commandes.length > 0) localStorage.setItem(STORAGE_KEYS.COMMANDES, JSON.stringify(commandes));

      // Fetch Mesures
      const { data: mesures, error: errMes } = await supabase.from('mesures').select('*').eq('user_id', currentUserId);
      if (mesures && mesures.length > 0) localStorage.setItem(STORAGE_KEYS.MESURES, JSON.stringify(mesures));

      notifyChange();
    } catch (err) {
      console.error('Error syncing from cloud:', err);
    }
  },

  // CLIENTS
  getClients(): Client[] {
    const clients = loadFromStorage<Client[]>(STORAGE_KEYS.CLIENTS, []);
    return clients.sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  getClientById(id: string): Client | undefined {
    const clients = this.getClients();
    return clients.find(c => c.id === id);
  },

  createClient(data: { nom: string; prenom: string; telephone: string }): Client {
    const cleanNom = (data.nom || '').trim().slice(0, 20);
    const cleanPrenom = (data.prenom || '').trim().slice(0, 20);
    const cleanTel = (data.telephone || '').trim();

    if (!cleanNom) throw new Error('Le nom du client est obligatoire.');
    if (!cleanPrenom) throw new Error('Le prénom du client est obligatoire.');
    if (!cleanTel) throw new Error('Le numéro de téléphone est obligatoire.');

    const newClient: Client = {
      id: 'cli-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nom: cleanNom,
      prenom: cleanPrenom,
      telephone: cleanTel,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const clients = this.getClients();
    clients.unshift(newClient);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients, 'clients');
    notifyChange();
    return newClient;
  },

  updateClient(id: string, data: { nom?: string; prenom?: string; telephone?: string }): Client {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Client introuvable.');

    const current = clients[index];
    const updated: Client = {
      ...current,
      nom: data.nom !== undefined ? data.nom.trim().slice(0, 20) : current.nom,
      prenom: data.prenom !== undefined ? data.prenom.trim().slice(0, 20) : current.prenom,
      telephone: data.telephone !== undefined ? data.telephone.trim() : current.telephone,
      updated_at: new Date().toISOString(),
    };

    if (!updated.nom) throw new Error('Le nom du client ne peut pas être vide.');
    if (!updated.prenom) throw new Error('Le prénom du client ne peut pas être vide.');
    if (!updated.telephone) throw new Error('Le téléphone ne peut pas être vide.');

    clients[index] = updated;
    saveToStorage(STORAGE_KEYS.CLIENTS, clients, 'clients');
    notifyChange();
    return updated;
  },

  deleteClient(id: string, cascade = false): { success: boolean; deletedOrdersCount: number } {
    const clients = this.getClients();
    const clientExists = clients.some(c => c.id === id);
    if (!clientExists) throw new Error('Client introuvable.');

    const commandes = this.getCommandesByClientId(id);
    if (commandes.length > 0 && !cascade) {
      throw new Error(`Ce client possède encore ${commandes.length} commande(s).`);
    }

    if (commandes.length > 0) {
      commandes.forEach(cmd => {
        this.deleteCommande(cmd.id);
      });
    }

    const filtered = clients.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered, 'clients');
    
    if (currentUserId) {
      // Async delete from cloud
      supabase.from('clients').delete().eq('id', id).eq('user_id', currentUserId).then();
    }

    notifyChange();
    return { success: true, deletedOrdersCount: commandes.length };
  },

  // COMMANDES
  getCommandes(): Commande[] {
    const cmds = loadFromStorage<Commande[]>(STORAGE_KEYS.COMMANDES, []);
    return cmds.map(c => {
      // Fix auto pour les commandes soldées qui auraient encore un reste à payer
      if (c.statut === 'solde' && c.reste_a_payer > 0) {
        return {
          ...c,
          avance: c.prix_global,
          reste_a_payer: 0
        };
      }
      return c;
    }).sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  getCommandeById(id: string): Commande | undefined {
    const cmds = this.getCommandes();
    return cmds.find(c => c.id === id);
  },

  getCommandesByClientId(clientId: string): Commande[] {
    const cmds = this.getCommandes();
    return cmds.filter(c => c.client_id === clientId);
  },

  getCommandesByClient(clientId: string): Commande[] {
    return this.getCommandesByClientId(clientId);
  },

  getNextOrderReference(): string {
    const cmds = this.getCommandes();
    const count = cmds.length + 1;
    return `CMD-${String(count).padStart(3, '0')}`;
  },

  createCommandeWithMesures(
    clientId: string,
    commandeData: {
      nom_tissu?: string;
      description_tissu?: string;
      image_tissu: string;
      image_modele?: string;
      prix_global: number;
      avance: number;
      date_livraison: string;
      statut?: StatutCommande;
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
      unite?: string;
    }
  ): { commande: Commande; mesures: Mesures } {
    return this.createCommande({ ...commandeData, client_id: clientId }, mesuresData);
  },

  createCommande(
    commandeData: {
      client_id: string;
      reference?: string;
      nom_tissu?: string;
      description_tissu?: string;
      image_tissu: string;
      image_modele?: string;
      prix_global: number;
      avance: number;
      date_livraison: string;
      statut?: StatutCommande;
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
      unite?: string;
    }
  ): { commande: Commande; mesures: Mesures } {
    const client = this.getClientById(commandeData.client_id);
    if (!client) throw new Error('Client associé introuvable.');

    const prix = Math.max(0, Number(commandeData.prix_global) || 0);
    let avance = Math.max(0, Number(commandeData.avance) || 0);
    const statut = commandeData.statut || 'en_cours';

    if (statut === 'solde') {
      avance = prix;
    }

    if (avance > prix) {
      throw new Error("L'avance ne peut pas être supérieure au prix global.");
    }

    const reste = Math.max(0, prix - avance);
    const reference = commandeData.reference?.trim() || this.getNextOrderReference();
    const now = new Date().toISOString();

    const newCommandeId = 'cmd-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    const newCommande: Commande = {
      id: newCommandeId,
      client_id: commandeData.client_id,
      reference,
      nom_tissu: commandeData.nom_tissu?.trim() || 'Tissu sans nom',
      description_tissu: commandeData.description_tissu?.trim() || '',
      image_tissu: commandeData.image_tissu || '',
      image_modele: commandeData.image_modele || undefined,
      prix_global: prix,
      avance: avance,
      reste_a_payer: reste,
      date_livraison: commandeData.date_livraison || new Date().toISOString().split('T')[0],
      statut: commandeData.statut || 'en_cours',
      created_at: now,
      updated_at: now,
    };

    const newMesuresId = 'mes-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const newMesures: Mesures = {
      id: newMesuresId,
      commande_id: newCommandeId,
      poitrine: mesuresData.poitrine !== null ? Number(mesuresData.poitrine) : null,
      taille: mesuresData.taille !== null ? Number(mesuresData.taille) : null,
      manche: mesuresData.manche !== null ? Number(mesuresData.manche) : null,
      epaules: mesuresData.epaules !== null ? Number(mesuresData.epaules) : null,
      fesses: mesuresData.fesses !== null ? Number(mesuresData.fesses) : null,
      cuisses: mesuresData.cuisses !== null ? Number(mesuresData.cuisses) : null,
      longueur_chemise: mesuresData.longueur_chemise !== null ? Number(mesuresData.longueur_chemise) : null,
      longueur_jupe: mesuresData.longueur_jupe !== null ? Number(mesuresData.longueur_jupe) : null,
      longueur_robe: mesuresData.longueur_robe !== null ? Number(mesuresData.longueur_robe) : null,
      unite: mesuresData.unite || 'cm',
      created_at: now,
      updated_at: now,
    };

    const cmds = this.getCommandes();
    cmds.unshift(newCommande);
    saveToStorage(STORAGE_KEYS.COMMANDES, cmds, 'commandes');

    const allMesures = loadFromStorage<Mesures[]>(STORAGE_KEYS.MESURES, []);
    allMesures.unshift(newMesures);
    saveToStorage(STORAGE_KEYS.MESURES, allMesures, 'mesures');

    notifyChange();
    return { commande: newCommande, mesures: newMesures };
  },

  updateCommande(id: string, updates: Partial<Omit<Commande, 'id' | 'client_id' | 'created_at'>>): Commande {
    const cmds = this.getCommandes();
    const index = cmds.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Commande introuvable.');

    const current = cmds[index];

    let newPrix = updates.prix_global !== undefined ? Math.max(0, Number(updates.prix_global)) : current.prix_global;
    let newAvance = updates.avance !== undefined ? Math.max(0, Number(updates.avance)) : current.avance;
    let newStatut = updates.statut !== undefined ? updates.statut : current.statut;

    // Si la commande est soldée, on met automatiquement l'avance au niveau du prix pour annuler le reste à payer
    if (newStatut === 'solde') {
      newAvance = newPrix;
    }

    if (newAvance > newPrix) {
      throw new Error("L'avance ne peut pas être supérieure au prix total.");
    }

    const reste_a_payer = Math.max(0, newPrix - newAvance);

    const updated: Commande = {
      ...current,
      ...updates,
      statut: newStatut,
      prix_global: newPrix,
      avance: newAvance,
      reste_a_payer,
      updated_at: new Date().toISOString(),
    };

    cmds[index] = updated;
    saveToStorage(STORAGE_KEYS.COMMANDES, cmds, 'commandes');
    notifyChange();
    return updated;
  },

  updateCommandeStatus(id: string, statut: StatutCommande): Commande {
    return this.updateCommande(id, { statut });
  },

  deleteCommande(id: string): void {
    const cmds = this.getCommandes();
    const filteredCmds = cmds.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.COMMANDES, filteredCmds, 'commandes');

    const allMesures = loadFromStorage<Mesures[]>(STORAGE_KEYS.MESURES, []);
    const filteredMesures = allMesures.filter(m => m.commande_id !== id);
    saveToStorage(STORAGE_KEYS.MESURES, filteredMesures, 'mesures');

    if (currentUserId) {
      supabase.from('commandes').delete().eq('id', id).eq('user_id', currentUserId).then();
    }

    notifyChange();
  },

  // MESURES
  getMesures(): Mesures[] {
    return loadFromStorage<Mesures[]>(STORAGE_KEYS.MESURES, []);
  },

  getAllMesures(): Mesures[] {
    return this.getMesures();
  },

  getMesuresByCommandeId(commandeId: string): Mesures | undefined {
    const allMesures = this.getMesures();
    return allMesures.find(m => m.commande_id === commandeId);
  },

  getMesuresByCommande(commandeId: string): Mesures | undefined {
    return this.getMesuresByCommandeId(commandeId);
  },

  updateMesures(commandeId: string, updates: Partial<Omit<Mesures, 'id' | 'commande_id' | 'created_at'>>): Mesures {
    const allMesures = loadFromStorage<Mesures[]>(STORAGE_KEYS.MESURES, []);
    const index = allMesures.findIndex(m => m.commande_id === commandeId);

    if (index === -1) {
      const now = new Date().toISOString();
      const newMes: Mesures = {
        id: 'mes-' + Date.now().toString(36),
        commande_id: commandeId,
        poitrine: updates.poitrine ?? null,
        taille: updates.taille ?? null,
        manche: updates.manche ?? null,
        epaules: updates.epaules ?? null,
        fesses: updates.fesses ?? null,
        cuisses: updates.cuisses ?? null,
        longueur_chemise: updates.longueur_chemise ?? null,
        longueur_jupe: updates.longueur_jupe ?? null,
        longueur_robe: updates.longueur_robe ?? null,
        unite: updates.unite || 'cm',
        created_at: now,
        updated_at: now,
      };
      allMesures.unshift(newMes);
      saveToStorage(STORAGE_KEYS.MESURES, allMesures, 'mesures');
      notifyChange();
      return newMes;
    }

    const current = allMesures[index];
    const updated: Mesures = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    allMesures[index] = updated;
    saveToStorage(STORAGE_KEYS.MESURES, allMesures, 'mesures');
    notifyChange();
    return updated;
  },

  // DASHBOARD STATS
  getDashboardStats() {
    const clients = this.getClients();
    const commandes = this.getCommandes();

    const enCours = commandes.filter(c => c.statut === 'en_cours');
    const pretes = commandes.filter(c => c.statut === 'pret');
    const soldees = commandes.filter(c => c.statut === 'solde');

    const totalRestantAEncaisser = commandes.reduce((sum, c) => sum + (c.reste_a_payer || 0), 0);

    const prochainesLivraisons = commandes
      .filter(c => c.statut !== 'solde')
      .sort((a, b) => a.date_livraison.localeCompare(b.date_livraison))
      .slice(0, 5);

    return {
      totalClients: clients.length,
      commandesEnCours: enCours.length,
      commandesPretes: pretes.length,
      commandesSoldees: soldees.length,
      totalCommandes: commandes.length,
      totalRestantAEncaisser,
      prochainesLivraisons,
    };
  },

  // SETTINGS
  getSettings(): AtelierSettings {
    return loadFromStorage<AtelierSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings(settings: Partial<AtelierSettings>): AtelierSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    saveToStorage(STORAGE_KEYS.SETTINGS, updated, 'settings');
    notifyChange();
    return updated;
  },

  // BACKUP / RESTORE
  exportBackup(): string {
    const data = {
      version: 1,
      exported_at: new Date().toISOString(),
      clients: this.getClients(),
      commandes: this.getCommandes(),
      mesures: loadFromStorage<Mesures[]>(STORAGE_KEYS.MESURES, []),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.clients) && Array.isArray(parsed.commandes) && Array.isArray(parsed.mesures)) {
        saveToStorage(STORAGE_KEYS.CLIENTS, parsed.clients, 'clients');
        saveToStorage(STORAGE_KEYS.COMMANDES, parsed.commandes, 'commandes');
        saveToStorage(STORAGE_KEYS.MESURES, parsed.mesures, 'mesures');
        if (parsed.settings) {
          saveToStorage(STORAGE_KEYS.SETTINGS, parsed.settings, 'settings');
        }
        notifyChange();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  resetToDemo(): void {
    saveToStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS, 'clients');
    saveToStorage(STORAGE_KEYS.COMMANDES, INITIAL_COMMANDES, 'commandes');
    saveToStorage(STORAGE_KEYS.MESURES, INITIAL_MESURES, 'mesures');
    saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS, 'settings');
    notifyChange();
  },

  clearAll(): void {
    saveToStorage(STORAGE_KEYS.CLIENTS, [], 'clients');
    saveToStorage(STORAGE_KEYS.COMMANDES, [], 'commandes');
    saveToStorage(STORAGE_KEYS.MESURES, [], 'mesures');
    notifyChange();
  },

  subscribe(listener: DBListener) {
    return subscribeToDB(listener);
  },
};
