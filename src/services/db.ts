import { Client, Commande, Mesures, AtelierSettings, StatutCommande } from '../types';
import { INITIAL_CLIENTS, INITIAL_COMMANDES, INITIAL_MESURES, INITIAL_SETTINGS } from '../utils/sampleData';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, onSnapshot, query, where, writeBatch } from 'firebase/firestore';

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

// In-memory cache for fast UI updates
let cachedClients: Client[] = [];
let cachedCommandes: Commande[] = [];
let cachedMesures: Mesures[] = [];
let cachedSettings: AtelierSettings = INITIAL_SETTINGS;

let unsubClients: (() => void) | null = null;
let unsubCommandes: (() => void) | null = null;
let unsubMesures: (() => void) | null = null;
let unsubSettings: (() => void) | null = null;

// Error handler based on guidelines
function handleFirestoreError(error: unknown) {
  console.error("Firestore DBService Error:", error);
  // Just throw it so the UI can catch it if needed
  throw error;
}

export const DBService = {
  // Call this to initialize listeners when the user logs in
  initListeners() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      this.clearAllLocal();
      return;
    }

    if (unsubClients) unsubClients();
    if (unsubCommandes) unsubCommandes();
    if (unsubMesures) unsubMesures();
    if (unsubSettings) unsubSettings();

    unsubClients = onSnapshot(query(collection(db, 'clients'), where('user_id', '==', userId)), (snapshot) => {
      cachedClients = snapshot.docs.map(doc => doc.data() as Client);
      notifyChange();
    }, handleFirestoreError);

    unsubCommandes = onSnapshot(query(collection(db, 'commandes'), where('user_id', '==', userId)), (snapshot) => {
      cachedCommandes = snapshot.docs.map(doc => doc.data() as Commande);
      // Sort commandes by date_livraison defaultly if needed or trust UI to do it
      notifyChange();
    }, handleFirestoreError);

    unsubMesures = onSnapshot(query(collection(db, 'mesures'), where('user_id', '==', userId)), (snapshot) => {
      cachedMesures = snapshot.docs.map(doc => doc.data() as Mesures);
      notifyChange();
    }, handleFirestoreError);

    unsubSettings = onSnapshot(doc(db, 'settings', userId), (docSnap) => {
      if (docSnap.exists()) {
        cachedSettings = docSnap.data() as AtelierSettings;
      } else {
        cachedSettings = INITIAL_SETTINGS;
        // Option to create default settings
        setDoc(docSnap.ref, { ...INITIAL_SETTINGS, user_id: userId }).catch(handleFirestoreError);
      }
      notifyChange();
    }, handleFirestoreError);
  },

  clearAllLocal() {
    cachedClients = [];
    cachedCommandes = [];
    cachedMesures = [];
    cachedSettings = INITIAL_SETTINGS;
    if (unsubClients) { unsubClients(); unsubClients = null; }
    if (unsubCommandes) { unsubCommandes(); unsubCommandes = null; }
    if (unsubMesures) { unsubMesures(); unsubMesures = null; }
    if (unsubSettings) { unsubSettings(); unsubSettings = null; }
    notifyChange();
  },

  // CLIENTS
  getClients(): Client[] {
    return cachedClients;
  },

  addClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Client {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Vous devez être connecté");

    const now = new Date().toISOString();
    const newId = 'cli-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    
    const newClient: Client = {
      ...clientData,
      id: newId,
      user_id: userId,
      created_at: now,
      updated_at: now,
    };

    setDoc(doc(db, 'clients', newId), newClient).catch(handleFirestoreError);
    return newClient;
  },

  updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'created_at'>>): Client {
    const current = cachedClients.find(c => c.id === id);
    if (!current) throw new Error('Client introuvable.');

    const updated: Client = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    setDoc(doc(db, 'clients', id), updated).catch(handleFirestoreError);
    return updated;
  },

  deleteClient(id: string): void {
    deleteDoc(doc(db, 'clients', id)).catch(handleFirestoreError);
    // Note: To truly delete, we should also delete related commandes and mesures.
    // For simplicity, we just delete the client and the UI filters gracefully, 
    // or we could use a batch to delete them.
  },

  // COMMANDES
  getCommandes(): Commande[] {
    return cachedCommandes;
  },

  getCommandesByClient(clientId: string): Commande[] {
    return cachedCommandes.filter(c => c.client_id === clientId);
  },

  addCommandeWithMesures(
    commandeData: Omit<Commande, 'id' | 'created_at' | 'updated_at' | 'reste_a_payer'>,
    mesuresData: Partial<Mesures>
  ): { commande: Commande; mesures: Mesures } {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Vous devez être connecté");

    const now = new Date().toISOString();
    const newCommandeId = 'cmd-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    
    const prix = Number(commandeData.prix_global) || 0;
    const avance = Number(commandeData.avance) || 0;
    const reste_a_payer = Math.max(0, prix - avance);

    const newCommande: Commande = {
      ...commandeData,
      id: newCommandeId,
      user_id: userId,
      prix_global: prix,
      avance: avance,
      reste_a_payer,
      created_at: now,
      updated_at: now,
    };

    const newMesuresId = 'mes-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const newMesures: Mesures = {
      id: newMesuresId,
      user_id: userId,
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

    const batch = writeBatch(db);
    batch.set(doc(db, 'commandes', newCommandeId), newCommande);
    batch.set(doc(db, 'mesures', newMesuresId), newMesures);
    batch.commit().catch(handleFirestoreError);

    return { commande: newCommande, mesures: newMesures };
  },

  updateCommande(id: string, updates: Partial<Omit<Commande, 'id' | 'client_id' | 'created_at'>>): Commande {
    const current = cachedCommandes.find(c => c.id === id);
    if (!current) throw new Error('Commande introuvable.');

    let newPrix = updates.prix_global !== undefined ? Math.max(0, Number(updates.prix_global)) : current.prix_global;
    let newAvance = updates.avance !== undefined ? Math.max(0, Number(updates.avance)) : current.avance;
    let newStatut = updates.statut !== undefined ? updates.statut : current.statut;
    
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

    setDoc(doc(db, 'commandes', id), updated).catch(handleFirestoreError);
    return updated;
  },

  updateCommandeStatus(id: string, statut: StatutCommande): Commande {
    return this.updateCommande(id, { statut });
  },

  deleteCommande(id: string): void {
    deleteDoc(doc(db, 'commandes', id)).catch(handleFirestoreError);
    const relatedMesures = cachedMesures.find(m => m.commande_id === id);
    if (relatedMesures) {
      deleteDoc(doc(db, 'mesures', relatedMesures.id)).catch(handleFirestoreError);
    }
  },

  // MESURES
  getMesures(): Mesures[] {
    return cachedMesures;
  },
  
  getAllMesures(): Mesures[] {
    return this.getMesures();
  },

  getMesuresByCommandeId(commandeId: string): Mesures | undefined {
    return cachedMesures.find(m => m.commande_id === commandeId);
  },
  
  getMesuresByCommande(commandeId: string): Mesures | undefined {
    return this.getMesuresByCommandeId(commandeId);
  },

  updateMesures(id: string, updates: Partial<Omit<Mesures, 'id' | 'commande_id' | 'created_at'>>): Mesures {
    const current = cachedMesures.find(m => m.id === id);
    if (!current) throw new Error("Mesure introuvable.");

    const updated: Mesures = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    setDoc(doc(db, 'mesures', id), updated).catch(handleFirestoreError);
    return updated;
  },

  // SETTINGS
  getSettings(): AtelierSettings {
    return cachedSettings;
  },

  updateSettings(settings: Partial<AtelierSettings>): AtelierSettings {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Vous devez être connecté");

    const current = this.getSettings();
    const updated = { ...current, ...settings, user_id: userId };
    
    setDoc(doc(db, 'settings', userId), updated).catch(handleFirestoreError);
    
    // We update local cache optimistically so UI responds immediately
    cachedSettings = updated;
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

  // MOCK FUNCTIONS for compatibility with previous settings page
  resetToDemo(): void {
    console.warn("resetToDemo is disabled in cloud mode.");
  },
  
  clearAll(): void {
    console.warn("clearAll is disabled in cloud mode.");
  },

  subscribe(listener: DBListener) {
    return subscribeToDB(listener);
  },
};
