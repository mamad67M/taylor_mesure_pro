export type StatutCommande = 'en_cours' | 'pret' | 'solde';

export interface Client {
  id: string;
  user_id?: string;
  nom: string; // max 20 chars
  prenom: string; // max 20 chars
  telephone: string;
  created_at: string;
  updated_at: string;
}

export interface Mesures {
  id: string;
  user_id?: string;
  commande_id: string;
  poitrine: number | null;
  taille: number | null;
  manche: number | null;
  epaules: number | null;
  fesses: number | null;
  cuisses: number | null;
  longueur_chemise: number | null;
  longueur_jupe: number | null;
  longueur_robe: number | null;
  unite: string; // 'cm'
  created_at: string;
  updated_at: string;
}

export interface Commande {
  id: string;
  user_id?: string;
  client_id: string;
  reference: string; // ex: CMD-001
  nom_tissu?: string;
  description_tissu?: string;
  image_tissu: string; // URL or base64 data
  image_modele?: string; // URL or base64 data pour le modèle de couture
  prix_global: number;
  avance: number;
  reste_a_payer: number; // Prix global - Avance
  date_livraison: string; // YYYY-MM-DD
  statut: StatutCommande;
  created_at: string;
  updated_at: string;
}

// Joined views for convenience
export interface CommandeComplete extends Commande {
  client: Client;
  mesures: Mesures;
}

export type ViewType = 'dashboard' | 'clients' | 'client_detail' | 'commandes' | 'commande_detail' | 'settings';
export type ViewTab = 'accueil' | 'commandes' | 'clients' | 'parametres' | 'dashboard' | 'settings';

export type CommandeFilter = 'toutes' | 'en_cours' | 'pret' | 'solde';
export type CommandeSort = 'livraison' | 'recent' | 'statut';

export interface AtelierSettings {
  user_id?: string;
  nom_atelier: string;
  nom_tailleur: string;
  telephone_atelier: string;
  devise: string; // 'FG', 'FCFA', etc.
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}
