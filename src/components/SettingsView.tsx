import React, { useState, useRef } from 'react';
import { AtelierSettings } from '../types';
import { Settings, Download, Upload, Trash2, RotateCcw, Check, Database, Copy } from 'lucide-react';

interface SettingsViewProps {
  settings: AtelierSettings;
  onUpdateSettings: (s: Partial<AtelierSettings>) => void;
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
  const [nomTailleur, setNomTailleur] = useState(settings.nom_tailleur || '');
  const [telephoneAtelier, setTelephoneAtelier] = useState(settings.telephone_atelier || '');
  const [devise, setDevise] = useState(settings.devise);
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ 
      nom_atelier: nomAtelier, 
      nom_tailleur: nomTailleur,
      telephone_atelier: telephoneAtelier,
      devise 
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    // In cloud mode, maybe export is handled differently or disabled.
    alert("L'exportation locale est désactivée car vos données sont sauvegardées en toute sécurité sur le Cloud (Firestore).");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    alert("L'importation locale est désactivée car vos données sont gérées par le Cloud.");
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-2xl bg-[#0D1B2A] text-[#D4A017] flex items-center justify-center shadow-xs">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-[#0D1B2A]">
            Paramètres
          </h1>
          <p className="text-xs text-[#0D1B2A]/60">
            Configurez votre atelier et gérez vos données
          </p>
        </div>
      </div>

      {/* Atelier Configuration */}
      <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/8 shadow-xs">
        <h2 className="font-display font-bold text-base text-[#0D1B2A] mb-4">
          Informations de l'Atelier
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
              Nom de l'atelier
            </label>
            <input
              type="text"
              value={nomAtelier}
              onChange={e => setNomAtelier(e.target.value)}
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
            <Database size={18} />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-[#0D1B2A]">
              Sauvegarde Cloud (Firestore)
            </h2>
            <p className="text-xs text-[#0D1B2A]/60">
              Vos données sont automatiquement synchronisées et sécurisées
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

    </div>
  );
};
