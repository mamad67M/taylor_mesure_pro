import { Client, Commande, Mesures, AtelierSettings } from '../types';

// Sample authentic SVG fabrics as data URLs
export const SAMPLE_FABRIC_IMAGES = {
  bazinBleu: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bazinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%230e2f5c"/>
        <stop offset="50%" stop-color="%231a4a84"/>
        <stop offset="100%" stop-color="%230c2448"/>
      </linearGradient>
      <pattern id="damask" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="%233b82f6" stroke-width="1.5" opacity="0.35"/>
        <circle cx="20" cy="20" r="4" fill="%2360a5fa" opacity="0.4"/>
        <path d="M0 0 L10 10 M30 30 L40 40 M40 0 L30 10 M10 30 L0 40" stroke="%2393c5fd" stroke-width="1" opacity="0.25"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(%23bazinGrad)"/>
    <rect width="400" height="400" fill="url(%23damask)"/>
    <text x="200" y="375" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="1.5" opacity="0.85">BAZIN RICHE TEINT BLEU</text>
  </svg>`,

  waxAfricain: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <radialGradient id="waxBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="%23ea580c"/>
        <stop offset="70%" stop-color="%23c2410c"/>
        <stop offset="100%" stop-color="%237c2d12"/>
      </radialGradient>
      <pattern id="waxPattern" width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="22" fill="%23fbbf24" opacity="0.9"/>
        <circle cx="30" cy="30" r="14" fill="%230d1b2a"/>
        <circle cx="30" cy="30" r="6" fill="%2310b981"/>
        <path d="M0 0 Q 30 15 60 0 Q 45 30 60 60 Q 30 45 0 60 Q 15 30 0 0" fill="none" stroke="%23f59e0b" stroke-width="2" opacity="0.7"/>
        <circle cx="0" cy="0" r="8" fill="%230284c7" opacity="0.8"/>
        <circle cx="60" cy="0" r="8" fill="%230284c7" opacity="0.8"/>
        <circle cx="0" cy="60" r="8" fill="%230284c7" opacity="0.8"/>
        <circle cx="60" cy="60" r="8" fill="%230284c7" opacity="0.8"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(%23waxBg)"/>
    <rect width="400" height="400" fill="url(%23waxPattern)"/>
    <text x="200" y="375" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="1.5" opacity="0.9">WAX HOLLANDAIS OR & TURQUOISE</text>
  </svg>`,

  tissuBlanc: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23ffffff"/>
        <stop offset="100%" stop-color="%23f1f1eb"/>
      </linearGradient>
      <pattern id="embroidery" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="8" fill="none" stroke="%23d4a017" stroke-width="1.2" stroke-dasharray="2,2"/>
        <circle cx="15" cy="15" r="3" fill="%23d4a017" opacity="0.6"/>
        <path d="M15 0 L15 30 M0 15 L30 15" stroke="%23e2e8f0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(%23whiteGrad)"/>
    <rect width="400" height="400" fill="url(%23embroidery)"/>
    <rect x="20" y="20" width="360" height="360" fill="none" stroke="%23d4a017" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.5"/>
    <text x="200" y="375" text-anchor="middle" fill="%23475569" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="1.5">VOILE BLANC BRODÉ OR</text>
  </svg>`,

  bazinVert: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="vertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23064e3b"/>
        <stop offset="50%" stop-color="%23047857"/>
        <stop offset="100%" stop-color="%23065f46"/>
      </linearGradient>
      <pattern id="vertPattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon points="20,5 35,20 20,35 5,20" fill="none" stroke="%2334d399" stroke-width="1.5" opacity="0.3"/>
        <circle cx="20" cy="20" r="3" fill="%23fbbf24" opacity="0.8"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(%23vertGrad)"/>
    <rect width="400" height="400" fill="url(%23vertPattern)"/>
    <text x="200" y="375" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="1.5">BAZIN VERT ÉMERAUDE</text>
  </svg>`
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    nom: 'Diallo',
    prenom: 'Mamadou',
    telephone: '+224 622 10 20 30',
    created_at: '2026-08-10T10:00:00Z',
    updated_at: '2026-08-10T10:00:00Z'
  },
  {
    id: 'cli-002',
    nom: 'Barry',
    prenom: 'Aïssatou',
    telephone: '+224 628 45 67 89',
    created_at: '2026-08-15T14:30:00Z',
    updated_at: '2026-08-15T14:30:00Z'
  },
  {
    id: 'cli-003',
    nom: 'Sow',
    prenom: 'Ibrahima',
    telephone: '+224 620 99 88 77',
    created_at: '2026-08-18T09:15:00Z',
    updated_at: '2026-08-18T09:15:00Z'
  }
];

export const INITIAL_COMMANDES: Commande[] = [
  {
    id: 'cmd-001',
    client_id: 'cli-001',
    reference: 'CMD-001',
    nom_tissu: 'Tissu bleu',
    description_tissu: 'Bazin riche teinté bleu nuit avec broderies royales',
    image_tissu: SAMPLE_FABRIC_IMAGES.bazinBleu,
    prix_global: 50000,
    avance: 20000,
    reste_a_payer: 30000,
    date_livraison: '2026-09-15',
    statut: 'en_cours',
    created_at: '2026-08-10T10:15:00Z',
    updated_at: '2026-08-10T10:15:00Z'
  },
  {
    id: 'cmd-002',
    client_id: 'cli-001',
    reference: 'CMD-002',
    nom_tissu: 'Tissu wax',
    description_tissu: 'Wax hollandais véritable avec motifs soleil et étoiles',
    image_tissu: SAMPLE_FABRIC_IMAGES.waxAfricain,
    prix_global: 75000,
    avance: 50000,
    reste_a_payer: 25000,
    date_livraison: '2026-09-20',
    statut: 'pret',
    created_at: '2026-08-12T11:00:00Z',
    updated_at: '2026-08-12T11:00:00Z'
  },
  {
    id: 'cmd-003',
    client_id: 'cli-001',
    reference: 'CMD-003',
    nom_tissu: 'Tissu blanc',
    description_tissu: 'Voile suisse blanc pur pour grand boubou de fête',
    image_tissu: SAMPLE_FABRIC_IMAGES.tissuBlanc,
    prix_global: 40000,
    avance: 40000,
    reste_a_payer: 0,
    date_livraison: '2026-09-30',
    statut: 'solde',
    created_at: '2026-08-14T16:20:00Z',
    updated_at: '2026-08-14T16:20:00Z'
  },
  {
    id: 'cmd-004',
    client_id: 'cli-002',
    reference: 'CMD-004',
    nom_tissu: 'Bazin vert émeraude',
    description_tissu: 'Ensemble jupe et veste cintrée avec broderies or',
    image_tissu: SAMPLE_FABRIC_IMAGES.bazinVert,
    prix_global: 90000,
    avance: 60000,
    reste_a_payer: 30000,
    date_livraison: '2026-09-08',
    statut: 'en_cours',
    created_at: '2026-08-15T15:00:00Z',
    updated_at: '2026-08-15T15:00:00Z'
  }
];

export const INITIAL_MESURES: Mesures[] = [
  {
    id: 'mes-001',
    commande_id: 'cmd-001',
    poitrine: 102,
    taille: 88,
    manche: 64,
    epaules: 46,
    fesses: 98,
    cuisses: 58,
    longueur_chemise: 82,
    longueur_jupe: null,
    longueur_robe: null,
    unite: 'cm',
    created_at: '2026-08-10T10:15:00Z',
    updated_at: '2026-08-10T10:15:00Z'
  },
  {
    id: 'mes-002',
    commande_id: 'cmd-002',
    poitrine: 104,
    taille: 90,
    manche: 65,
    epaules: 47,
    fesses: 100,
    cuisses: 60,
    longueur_chemise: 84,
    longueur_jupe: null,
    longueur_robe: null,
    unite: 'cm',
    created_at: '2026-08-12T11:00:00Z',
    updated_at: '2026-08-12T11:00:00Z'
  },
  {
    id: 'mes-003',
    commande_id: 'cmd-003',
    poitrine: 103,
    taille: 89,
    manche: 63,
    epaules: 46,
    fesses: 99,
    cuisses: 59,
    longueur_chemise: 80,
    longueur_jupe: null,
    longueur_robe: null,
    unite: 'cm',
    created_at: '2026-08-14T16:20:00Z',
    updated_at: '2026-08-14T16:20:00Z'
  },
  {
    id: 'mes-004',
    commande_id: 'cmd-004',
    poitrine: 94,
    taille: 76,
    manche: 58,
    epaules: 40,
    fesses: 102,
    cuisses: 56,
    longueur_chemise: null,
    longueur_jupe: 95,
    longueur_robe: 135,
    unite: 'cm',
    created_at: '2026-08-15T15:00:00Z',
    updated_at: '2026-08-15T15:00:00Z'
  }
];

export const INITIAL_SETTINGS: AtelierSettings = {
  nom_atelier: 'Atelier Maître Couture',
  nom_tailleur: 'Mamadou Diallo',
  telephone_atelier: '+224 622 00 11 22',
  devise: 'FG'
};
