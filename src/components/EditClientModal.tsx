import React, { useState } from 'react';
import { X, Check, User, AlertCircle } from 'lucide-react';
import { Client } from '../types';

interface EditClientModalProps {
  client?: Client; // If undefined, we are creating a new client
  onClose: () => void;
  onSave: (data: { nom: string; prenom: string; telephone: string }) => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  client,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(client);

  const [nom, setNom] = useState(client?.nom || '');
  const [prenom, setPrenom] = useState(client?.prenom || '');
  const [telephone, setTelephone] = useState(client?.telephone || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNom = nom.trim().slice(0, 20);
    const cleanPrenom = prenom.trim().slice(0, 20);
    const cleanTel = telephone.trim();

    if (!cleanNom) {
      setError('Le nom de famille est obligatoire.');
      return;
    }
    if (!cleanPrenom) {
      setError('Le prénom est obligatoire.');
      return;
    }
    if (!cleanTel) {
      setError('Le numéro de téléphone est obligatoire.');
      return;
    }

    onSave({
      nom: cleanNom,
      prenom: cleanPrenom,
      telephone: cleanTel,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#F7F4EF] w-full max-w-md rounded-3xl shadow-2xl border border-[#0D1B2A]/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0D1B2A] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4A017] text-[#0D1B2A] flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                {isEditing ? 'Modifier le client' : 'Nouveau client'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#A63A3A]/10 border border-[#A63A3A]/30 text-xs font-semibold text-[#A63A3A] flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#0D1B2A]">
                  Prénom *
                </label>
                <span className="text-[10px] text-gray-400 font-mono">
                  {prenom.length}/20 max
                </span>
              </div>
              <input
                type="text"
                maxLength={20}
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                placeholder="Ex: Mamadou"
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#0D1B2A]">
                  Nom *
                </label>
                <span className="text-[10px] text-gray-400 font-mono">
                  {nom.length}/20 max
                </span>
              </div>
              <input
                type="text"
                maxLength={20}
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Ex: Diallo"
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                placeholder="Ex: +224 622 10 20 30"
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0D1B2A] hover:bg-[#1a2f47] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Check size={16} className="text-[#D4A017]" />
              <span>{isEditing ? 'Enregistrer' : 'Créer le client'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
