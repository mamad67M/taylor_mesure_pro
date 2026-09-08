import React, { useState, useRef } from 'react';
import { X, Camera, Check, AlertCircle, Upload } from 'lucide-react';
import { Commande, StatutCommande, AtelierSettings } from '../types';
import { formatCurrency, processImageFile } from '../utils/format';

interface EditOrderModalProps {
  commande: Commande;
  settings: AtelierSettings;
  onClose: () => void;
  onSave: (updatedFields: Partial<Commande>) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  commande,
  settings,
  onClose,
  onSave,
}) => {
  const [nomTissu, setNomTissu] = useState(commande.nom_tissu || '');
  const [descTissu, setDescTissu] = useState(commande.description_tissu || '');
  const [imageTissu, setImageTissu] = useState(commande.image_tissu || '');
  const [imageModele, setImageModele] = useState(commande.image_modele || '');
  const [prixGlobal, setPrixGlobal] = useState(String(commande.prix_global));
  const [avance, setAvance] = useState(String(commande.avance));
  const [dateLivraison, setDateLivraison] = useState(commande.date_livraison);
  const [statut, setStatut] = useState<StatutCommande>(commande.statut);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputModeleRef = useRef<HTMLInputElement>(null);

  const numPrix = Math.max(0, Number(prixGlobal) || 0);
  const numAvance = Math.max(0, Number(avance) || 0);
  const resteAPayer = Math.max(0, numPrix - numAvance);
  const isAvanceInvalid = numAvance > numPrix;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      setImageTissu(dataUrl);
    } catch (err) {
      alert("Erreur d'import d'image : " + err);
    }
  };

  const handleModelePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      setImageModele(dataUrl);
    } catch (err) {
      alert("Erreur d'import du modèle : " + err);
    }
  };

  const handleSave = () => {
    if (isAvanceInvalid) {
      setError("L'avance ne peut pas être supérieure au prix total.");
      return;
    }
    if (numPrix <= 0) {
      setError('Le prix global doit être supérieur à 0.');
      return;
    }

    onSave({
      nom_tissu: nomTissu.trim() || 'Tissu',
      description_tissu: descTissu.trim(),
      image_tissu: imageTissu,
      image_modele: imageModele || undefined,
      prix_global: numPrix,
      avance: numAvance,
      reste_a_payer: resteAPayer,
      date_livraison: dateLivraison,
      statut,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#F7F4EF] w-full max-w-lg rounded-3xl shadow-2xl border border-[#0D1B2A]/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0D1B2A] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-[#D4A017] font-bold">
              Commande {commande.reference}
            </span>
            <h2 className="font-display font-extrabold text-lg">Modifier la commande</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#A63A3A]/10 border border-[#A63A3A]/30 text-xs font-semibold text-[#A63A3A] flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Fabric info */}
          <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
            <label className="text-xs font-bold text-[#0D1B2A] block">Tissu</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                {imageTissu ? (
                  <img src={imageTissu} alt="Tissu" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    Photo
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Camera size={13} className="text-[#D4A017]" />
                  <span>Changer la photo</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#0D1B2A]/70 block mb-1">
                Nom du tissu
              </label>
              <input
                type="text"
                value={nomTissu}
                onChange={e => setNomTissu(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#0D1B2A]/70 block mb-1">
                Description du tissu
              </label>
              <textarea
                rows={2}
                value={descTissu}
                onChange={e => setDescTissu(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modele info */}
          <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
            <label className="text-xs font-bold text-[#0D1B2A] block">Modèle de couture (facultatif)</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                {imageModele ? (
                  <img src={imageModele} alt="Modèle" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    Modèle
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputModeleRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleModelePhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputModeleRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Camera size={13} className="text-[#D4A017]" />
                  <span>{imageModele ? 'Changer le modèle' : 'Ajouter un modèle'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
            <label className="text-xs font-bold text-[#0D1B2A] block">
              Paiement ({settings.devise})
            </label>
            <div>
              <label className="text-xs text-[#0D1B2A]/70 block mb-1">Prix global *</label>
              <input
                type="number"
                value={prixGlobal}
                onChange={e => setPrixGlobal(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 font-bold text-base focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs text-[#0D1B2A]/70 block mb-1">Avance versée</label>
              <input
                type="number"
                value={avance}
                onChange={e => setAvance(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 font-bold text-base text-[#D4A017] focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>

            <div className="p-3 bg-[#F7F4EF] rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0D1B2A]">Reste à payer recalculé :</span>
              <span className="font-display font-extrabold text-base text-[#0D1B2A]">
                {formatCurrency(resteAPayer, settings.devise)}
              </span>
            </div>
          </div>

          {/* Delivery & Status */}
          <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
            <div>
              <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                Date de livraison prévue
              </label>
              <input
                type="date"
                value={dateLivraison}
                onChange={e => setDateLivraison(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#D4A017] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0D1B2A] flex items-center justify-between mb-1">
                <span>Statut de la commande</span>
                {commande.statut === 'solde' && (
                  <span className="text-[10px] text-[#D4A017] font-medium bg-[#D4A017]/10 px-2 py-0.5 rounded-full">
                    Statut verrouillé
                  </span>
                )}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['en_cours', 'pret', 'solde'] as StatutCommande[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    disabled={commande.statut === 'solde'}
                    onClick={() => setStatut(st)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      statut === st
                        ? st === 'en_cours'
                          ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                          : st === 'pret'
                          ? 'bg-[#D4A017] text-[#0D1B2A] border-[#D4A017]'
                          : 'bg-[#1F4D3A] text-white border-[#1F4D3A]'
                        : 'bg-white text-gray-700 border-gray-200'
                    } ${commande.statut === 'solde' && st !== 'solde' ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    {st === 'en_cours' ? 'En cours' : st === 'pret' ? 'Prêt' : 'Soldé'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#0D1B2A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#1a2f47]"
          >
            <Check size={16} className="text-[#D4A017]" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};
