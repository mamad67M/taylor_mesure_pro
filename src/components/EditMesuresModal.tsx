import React, { useState } from 'react';
import { X, Ruler, Check, Scissors } from 'lucide-react';
import { Mesures } from '../types';

interface EditMesuresModalProps {
  mesures: Mesures;
  orderReference: string;
  onClose: () => void;
  onSave: (updated: Partial<Mesures>) => void;
}

export const EditMesuresModal: React.FC<EditMesuresModalProps> = ({
  mesures,
  orderReference,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    poitrine: mesures.poitrine !== null ? String(mesures.poitrine) : '',
    taille: mesures.taille !== null ? String(mesures.taille) : '',
    manche: mesures.manche !== null ? String(mesures.manche) : '',
    epaules: mesures.epaules !== null ? String(mesures.epaules) : '',
    fesses: mesures.fesses !== null ? String(mesures.fesses) : '',
    cuisses: mesures.cuisses !== null ? String(mesures.cuisses) : '',
    longueur_chemise: mesures.longueur_chemise !== null ? String(mesures.longueur_chemise) : '',
    longueur_jupe: mesures.longueur_jupe !== null ? String(mesures.longueur_jupe) : '',
    longueur_robe: mesures.longueur_robe !== null ? String(mesures.longueur_robe) : '',
  });

  const adjust = (key: keyof typeof form, delta: number) => {
    setForm(prev => {
      const current = prev[key] === '' ? 0 : Number(prev[key]);
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next === 0 ? '' : String(next) };
    });
  };

  const handleSave = () => {
    onSave({
      poitrine: form.poitrine !== '' ? Number(form.poitrine) : null,
      taille: form.taille !== '' ? Number(form.taille) : null,
      manche: form.manche !== '' ? Number(form.manche) : null,
      epaules: form.epaules !== '' ? Number(form.epaules) : null,
      fesses: form.fesses !== '' ? Number(form.fesses) : null,
      cuisses: form.cuisses !== '' ? Number(form.cuisses) : null,
      longueur_chemise: form.longueur_chemise !== '' ? Number(form.longueur_chemise) : null,
      longueur_jupe: form.longueur_jupe !== '' ? Number(form.longueur_jupe) : null,
      longueur_robe: form.longueur_robe !== '' ? Number(form.longueur_robe) : null,
    });
    onClose();
  };

  const fields: { key: keyof typeof form; label: string }[] = [
    { key: 'poitrine', label: 'Poitrine' },
    { key: 'taille', label: 'Taille' },
    { key: 'manche', label: 'Manche' },
    { key: 'epaules', label: 'Épaules' },
    { key: 'fesses', label: 'Fesses / Bassin' },
    { key: 'cuisses', label: 'Cuisses' },
    { key: 'longueur_chemise', label: 'Longueur chemise' },
    { key: 'longueur_jupe', label: 'Longueur jupe' },
    { key: 'longueur_robe', label: 'Longueur robe' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#F7F4EF] w-full max-w-lg rounded-3xl shadow-2xl border border-[#0D1B2A]/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0D1B2A] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4A017] text-[#0D1B2A] flex items-center justify-center">
              <Ruler size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#D4A017] font-bold">
                Mesures — {orderReference}
              </span>
              <h2 className="font-display font-extrabold text-lg">Modifier les mesures</h2>
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="bg-[#D4A017]/15 p-3 rounded-xl border border-[#D4A017]/30 text-xs text-[#0D1B2A] flex items-center gap-2">
            <Scissors size={15} />
            <span>
              Les modifications s'appliquent <strong>strictement</strong> à la commande {orderReference}.
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-2.5">
            {fields.map(f => (
              <div
                key={f.key}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F7F4EF]/60 border border-[#0D1B2A]/5"
              >
                <label className="text-xs font-semibold text-[#0D1B2A] flex-1">
                  {f.label}
                </label>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => adjust(f.key, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-sm font-bold text-[#0D1B2A] flex items-center justify-center active:bg-gray-100"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    inputMode="numeric"
                    value={form[f.key]}
                    placeholder="—"
                    onChange={e => {
                      const v = e.target.value;
                      setForm(prev => ({ ...prev, [f.key]: v }));
                    }}
                    className="w-16 p-1.5 rounded-lg border border-gray-300 text-center font-mono font-bold text-sm bg-white focus:border-[#D4A017] focus:outline-hidden"
                  />

                  <button
                    type="button"
                    onClick={() => adjust(f.key, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-sm font-bold text-[#0D1B2A] flex items-center justify-center active:bg-gray-100"
                  >
                    +
                  </button>

                  <span className="text-[11px] text-[#0D1B2A]/50 w-6 text-right">
                    cm
                  </span>
                </div>
              </div>
            ))}
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
            className="px-5 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#c29213] text-[#0D1B2A] text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
          >
            <Check size={16} strokeWidth={2.5} />
            <span>Valider les mesures</span>
          </button>
        </div>
      </div>
    </div>
  );
};
