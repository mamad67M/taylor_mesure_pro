# Cahier des Charges et Document de Reproduction : TailorMesure Pro (Atelier OS)

Ce document contient toutes les informations contextuelles, techniques et conceptuelles permettant à un LLM (Large Language Model) de reproduire, maintenir ou étendre l'application "TailorMesure Pro". 

## 1. Présentation du Projet
* **Nom de l'application :** TailorMesure Pro (Atelier OS)
* **Cible :** Maîtres tailleurs, couturiers et créateurs de mode en Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Guinée, Mali, etc.).
* **Rôle :** Un logiciel métier (SaaS) permettant de digitaliser la gestion d'un atelier de couture. Il remplace les carnets de mesures papier souvent perdus ou abîmés.
* **Avantage principal (Valeur perçue) :** Apporte de la sérénité, du professionnalisme et un suivi financier clair (gestion des acomptes et restes à payer) pour l'artisan, tout en valorisant son image de marque auprès de ses clients.

## 2. Stack Technologique (Outils utilisés)
* **Frontend :** React 18 (via Vite), TypeScript.
* **Styling :** Tailwind CSS (utilisation stricte des classes utilitaires).
* **Base de données & Backend :** Firebase (Firestore pour la base de données NoSQL, Firebase Auth pour l'authentification).
* **Icônes :** `lucide-react`.
* **Animations :** `motion/react` (Framer Motion) pour des transitions fluides et professionnelles.
* **Architecture :** Single Page Application (SPA) 100% client-side (pas de serveur backend customisé tel que Express, tout passe par les SDK Firebase côté client).

## 3. Design System & Charte Graphique (Crucial)
L'application suit une charte stricte dite "Anti-Slop" (pas de dégradés bas de gamme, pas de bordures fluo, pas de UI surchargée). L'esthétique est celle du luxe discret, de l'artisanat d'art et du "Quiet Luxury".

### Couleurs (Définies dans index.css via @theme)
* **Fond principal :** Linen (`#FBF8F3`) - Un beige/écru très clair et chaleureux.
* **Texte principal :** Charcoal (`#181816`) - Un noir doux, pas de `#000000` pur.
* **Accents primaires :** Deep Green (`#1B3528`) pour la stabilité/confiance, Terracotta (`#C85A32`) pour les alertes/boutons dynamiques.
* **Bordures :** Sand Border (`#E6DECFC2`) - Très discrètes.

### Typographie
* **Titres (Hero, Noms de clients, Marques) :** Serif éditorial ("Playfair Display", Georgia). Donne un côté haute-couture.
* **Corps de texte & UI (Boutons, menus) :** Sans-serif moderne ("Plus Jakarta Sans").
* **Règle UI stricte :** Les boutons utilisent la classe `.pill-btn`, ont des bords très arrondis (`rounded-full`), un texte en majuscule, très espacé (`tracking-wider`), petit (`text-xs`), et en gras (`font-bold`).

## 4. Architecture de la Base de Données (Firestore)
La base de données utilise 3 collections principales liées au `user_id` (le tailleur connecté) :

1. **`clients`** : Stocke les informations de contact (Nom, téléphone, WhatsApp).
2. **`mesures`** : Liée à un client. Contient des champs de mesure très spécifiques à la couture (Tour de cou, Épaules, Poitrine, Longueur manche, Longueur boubou, etc.).
3. **`commandes`** : Lie un client, des mesures, et ajoute les informations financières (Prix total, Acompte payé, Reste à payer), les dates (livraison prévue), le type de vêtement (ex: Boubou 3 pièces), et l'état d'avancement.

*Subtilité Firebase Règles de Sécurité :*
Pour éviter les erreurs `Missing or insufficient permissions` lors de la création d'éléments avec des références complexes, les règles Firestore ont été simplifiées au maximum pour l'environnement de production/développement actuel :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 5. Fonctionnalités Principales Développées
1. **Landing Page (Page de destination) :**
   * Header sticky avec un bouton d'action vert profond.
   * Hero Section avec une proposition de valeur forte, centrée, typographie élégante, sans surcharge. Bouton pour créer un compte ou voir une démo interactive.
   * Fausse interface (Mockup interactif) démontrant à quoi ressemble le tableau de bord d'un tailleur.
2. **Authentification :**
   * Système de Login/Signup géré par Firebase.
3. **Tableau de bord (Cockpit) :**
   * **Vue Clients :** Liste des clients, création d'un client.
   * **Vue Commandes :** Wizard (assistant) de création de commande permettant de lier un client existant, de définir un prix total et un acompte (calculant automatiquement le reste à payer), et d'assigner les mesures.
   * **Vue Mesures :** Formulaire détaillé pour enregistrer toutes les mensurations.

## 6. Subtilités Techniques à Respecter par l'IA Repreneuse
* **Aération et Marges (Whitespace) :** Toujours laisser respirer les éléments. Utiliser des padding généreux (ex: `p-6`, `py-14`).
* **Composants Modulaires :** Le code ne doit pas être un monolithe géant. La `LandingPage` est divisée en sous-composants (`HeroSection`, `Header`, etc.) dans un dossier `/Landing`.
* **Pas de maquettes ou de données factices (Mock data) :** Si l'utilisateur est connecté, l'application doit toujours récupérer et écrire les données *réelles* depuis Firestore via des écouteurs en temps réel (`onSnapshot`).
* **Futur : Mode "Offline-First" (PWA) :** Le projet est architecturé pour basculer facilement en PWA. Firebase devra être configuré avec `enableIndexedDbPersistence` pour gérer la création de commandes sans réseau, et Vite devra utiliser `vite-plugin-pwa` pour le cache via Service Worker.
