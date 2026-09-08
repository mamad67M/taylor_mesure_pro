import React, { useState, useRef } from 'react';
import {
  Store,
  Database,
  Download,
  Upload,
  RotateCcw,
  Check,
  Copy,
  Sliders,
  ShieldCheck,
  Trash2,
  Layers,
  Sparkles
} from 'lucide-react';
import { AtelierSettings } from '../types';
import { DBService } from '../services/db';

interface SettingsViewProps {
  settings: AtelierSettings;
  onUpdateSettings: (newSettings: Partial<AtelierSettings>) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemo,
  onClearAll,
}) => {
  const [nomAtelier, setNomAtelier] = useState(settings.nom_atelier);
  const [nomTailleur, setNomTailleur] = useState(settings.nom_tailleur);
  const [telephoneAtelier, setTelephoneAtelier] = useState(settings.telephone_atelier);
  const [devise, setDevise] = useState(settings.devise || 'FG');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  const importFileRef = useRef<HTMLInputElement>(null);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      nom_atelier: nomAtelier.trim(),
      nom_tailleur: nomTailleur.trim(),
      telephone_atelier: telephoneAtelier.trim(),
      devise,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const json = DBService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesurepro_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = DBService.importBackup(content);
      if (ok) {
        alert('✓ Sauvegarde restaurée avec succès !');
      } else {
        alert('Erreur: fichier de sauvegarde non valide.');
      }
    };
    reader.readAsText(file);
  };

  const supabaseSqlScript = `-- ==========================================
-- MESUREPRO : STRUCTURE POSTGRESQL / SUPABASE
-- Conforme aux spécifications du produit
-- ==========================================

-- 1. Table Clients
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(20) NOT NULL,
  prenom VARCHAR(20) NOT NULL,
  telephone VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Table Commandes
CREATE TABLE IF NOT EXISTS public.commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  reference VARCHAR(50) NOT NULL,
  nom_tissu VARCHAR(100),
  description_tissu TEXT,
  image_tissu TEXT NOT NULL,
  prix_global NUMERIC(12, 2) NOT NULL CHECK (prix_global >= 0),
  avance NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (avance >= 0),
  reste_a_payer NUMERIC(12, 2) GENERATED ALWAYS AS (prix_global - avance) STORED,
  date_livraison DATE NOT NULL,
  statut VARCHAR(20) NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'pret', 'solde')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT chk_avance_valide CHECK (avance <= prix_global)
);

-- 3. Table Mesures (1:1 stricte par commande)
CREATE TABLE IF NOT EXISTS public.mesures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID NOT NULL UNIQUE REFERENCES public.commandes(id) ON DELETE CASCADE,
  poitrine NUMERIC(6, 1),
  taille NUMERIC(6, 1),
  manche NUMERIC(6, 1),
  epaules NUMERIC(6, 1),
  fesses NUMERIC(6, 1),
  cuisses NUMERIC(6, 1),
  longueur_chemise NUMERIC(6, 1),
  longueur_jupe NUMERIC(6, 1),
  longueur_robe NUMERIC(6, 1),
  unite VARCHAR(10) NOT NULL DEFAULT 'cm',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Supabase Storage Bucket pour les tissus
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tissus', 'tissus', true)
ON CONFLICT (id) DO NOTHING;

-- RLS & Index de performance
CREATE INDEX IF NOT EXISTS idx_commandes_client_id ON public.commandes(client_id);
CREATE INDEX IF NOT EXISTS idx_mesures_commande_id ON public.mesures(commande_id);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#0D1B2A]">
          Paramètres de l'Atelier
        </h1>
        <p className="text-xs text-[#0D1B2A]/60">
          Personnalisation, devise, sauvegardes et architecture
        </p>
      </div>

      {/* Atelier Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#0D1B2A] text-[#D4A017] flex items-center justify-center">
            <Store size={18} />
          </div>
          <h2 className="font-display font-bold text-base text-[#0D1B2A]">
            Identité de l'atelier
          </h2>
        </div>

        <form onSubmit={handleSaveInfo} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
              Nom de l'atelier
            </label>
            <input
              type="text"
              value={nomAtelier}
              onChange={e => setNomAtelier(e.target.value)}
              placeholder="Ex: Atelier Maître Couture"
              className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                Nom du maître tailleur
              </label>
              <input
                type="text"
                value={nomTailleur}
                onChange={e => setNomTailleur(e.target.value)}
                placeholder="Ex: Mamadou Diallo"
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                Téléphone de l'atelier
              </label>
              <input
                type="tel"
                value={telephoneAtelier}
                onChange={e => setTelephoneAtelier(e.target.value)}
                placeholder="Ex: +224 622 00 11 22"
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
              Devise monétaire par défaut
            </label>
            <select
              value={devise}
              onChange={e => setDevise(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#0D1B2A] focus:border-[#D4A017] focus:outline-hidden bg-white cursor-pointer"
            >
              <option value="FG">Franc guinéen (FG) — Par défaut</option>
              <option value="FCFA">Franc CFA (FCFA / XOF / XAF)</option>
              <option value="GHS">Cedi ghanéen (GHS)</option>
              <option value="NGN">Naira nigérian (NGN)</option>
              <option value="EUR">Euro (€)</option>
              <option value="$">Dollar ($)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-[#1F4D3A] flex items-center gap-1">
                <Check size={14} />
                <span>Paramètres enregistrés !</span>
              </span>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0D1B2A] hover:bg-[#1a2f47] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Check size={15} className="text-[#D4A017]" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup and Restore */}
      <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/8 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D4A017]/20 text-[#9A7000] flex items-center justify-center">
            <Download size={18} />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-[#0D1B2A]">
              Sauvegarde et Restauration
            </h2>
            <p className="text-xs text-[#0D1B2A]/60">
              Exportez ou restaurez toutes vos commandes, clients et mesures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="p-3.5 rounded-xl border border-[#0D1B2A]/15 hover:bg-[#F7F4EF] text-[#0D1B2A] text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Download size={16} className="text-[#D4A017]" />
            <span>Télécharger une sauvegarde JSON</span>
          </button>

          <div>
            <input
              type="file"
              ref={importFileRef}
              accept=".json"
              className="hidden"
              onChange={handleImportBackup}
            />
            <button
              type="button"
              onClick={() => importFileRef.current?.click()}
              className="w-full p-3.5 rounded-xl border border-[#0D1B2A]/15 hover:bg-[#F7F4EF] text-[#0D1B2A] text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Upload size={16} className="text-[#0D1B2A]" />
              <span>Restaurer une sauvegarde</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Technical Architecture & SQL Script */}
      <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/8 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0D1B2A] text-[#D4A017] flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#0D1B2A]">
                Architecture Supabase & Base de données
              </h2>
              <p className="text-xs text-[#0D1B2A]/60">
                Structure PostgreSQL conforme (Tables clients, commandes, mesures)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSqlViewer(!showSqlViewer)}
            className="text-xs font-bold text-[#D4A017] hover:underline"
          >
            {showSqlViewer ? 'Masquer' : 'Afficher le SQL'}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#F7F4EF] text-xs text-[#0D1B2A]/80 leading-relaxed border border-[#0D1B2A]/5">
          <p className="font-semibold text-[#0D1B2A] mb-1">
            Relations strictes respectées :
          </p>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
            <li>1 client → N commandes</li>
            <li>1 commande → 1 tissu</li>
            <li>1 commande → 1 ensemble de mesures indépendantes</li>
            <li>Reste à payer calculé automatiquement</li>
            <li>Stockage Supabase Storage bucket <code className="bg-gray-200 px-1 rounded">tissus/</code></li>
          </ul>
        </div>

        {showSqlViewer && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-500">supabase_schema.sql</span>
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0D1B2A] text-white flex items-center gap-1.5 hover:bg-[#1a2f47]"
              >
                {copiedSql ? <Check size={13} className="text-[#D4A017]" /> : <Copy size={13} />}
                <span>{copiedSql ? 'Copié !' : 'Copier le SQL'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#0D1B2A] text-[#F7F4EF] text-[11px] font-mono overflow-x-auto max-h-60 border border-[#D4A017]/20">
              {supabaseSqlScript}
            </pre>
          </div>
        )}
      </div>

      {/* Reset & Wipe zone */}
      <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-xs space-y-3">
        <h2 className="font-display font-bold text-base text-[#0D1B2A]">
          Zone de réinitialisation
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (confirm('Voulez-vous réinitialiser les données avec les exemples de tailleur (Mamadou Diallo, Bazin, Wax, etc.) ?')) {
                onResetDemo();
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#0D1B2A]/5 hover:bg-[#0D1B2A]/10 text-[#0D1B2A] text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw size={14} />
            <span>Recharger les données de démonstration</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir effacer TOUTES les données ? Cette action est irréversible.')) {
                onClearAll();
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#A63A3A]/10 hover:bg-[#A63A3A]/20 text-[#A63A3A] text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Trash2 size={14} />
            <span>Effacer toutes les données</span>
          </button>
        </div>
      </div>
    </div>
  );
};
