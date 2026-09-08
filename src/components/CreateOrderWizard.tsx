import React, { useState, useRef } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  Check,
  User,
  Plus,
  Scissors,
  Wallet,
  Calendar,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Client, AtelierSettings, StatutCommande } from '../types';
import { formatCurrency, formatDateFrench, processImageFile } from '../utils/format';
import { SAMPLE_FABRIC_IMAGES } from '../utils/sampleData';

interface CreateOrderWizardProps {
  clients: Client[];
  settings: AtelierSettings;
  preselectedClientId?: string;
  onClose: () => void;
  onSubmit: (
    clientData: { isNew: boolean; clientId?: string; nom?: string; prenom?: string; telephone?: string },
    commandeData: {
      nom_tissu: string;
      description_tissu: string;
      image_tissu: string;
      image_modele?: string;
      prix_global: number;
      avance: number;
      date_livraison: string;
      statut: StatutCommande;
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
    }
  ) => void;
}

export const CreateOrderWizard: React.FC<CreateOrderWizardProps> = ({
  clients,
  settings,
  preselectedClientId,
  onClose,
  onSubmit,
}) => {
  // Step navigation: 0 = Client selection/creation, 1 = Tissu, 2 = Mesures, 3 = Paiement, 4 = Livraison, 5 = Confirmation
  const initialStep = preselectedClientId ? 1 : 0;
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Client State
  const [clientMode, setClientMode] = useState<'existing' | 'new'>(preselectedClientId ? 'existing' : (clients.length > 0 ? 'existing' : 'new'));
  const [selectedClientId, setSelectedClientId] = useState<string>(preselectedClientId || (clients[0]?.id || ''));
  const [newClientNom, setNewClientNom] = useState('');
  const [newClientPrenom, setNewClientPrenom] = useState('');
  const [newClientTel, setNewClientTel] = useState('');

  // Step 1: Tissu & Modèle State
  const [nomTissu, setNomTissu] = useState('');
  const [descTissu, setDescTissu] = useState('');
  const [imageTissu, setImageTissu] = useState<string>(SAMPLE_FABRIC_IMAGES.bazinBleu);
  const [imageModele, setImageModele] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputModeleRef = useRef<HTMLInputElement>(null);
  const cameraInputModeleRef = useRef<HTMLInputElement>(null);

  // Step 2: Mesures State (default nulls)
  const [mesures, setMesures] = useState({
    poitrine: '' as string | number,
    taille: '' as string | number,
    manche: '' as string | number,
    epaules: '' as string | number,
    fesses: '' as string | number,
    cuisses: '' as string | number,
    longueur_chemise: '' as string | number,
    longueur_jupe: '' as string | number,
    longueur_robe: '' as string | number,
  });

  // Step 3: Paiement State
  const [prixGlobal, setPrixGlobal] = useState<string>('50000');
  const [avance, setAvance] = useState<string>('20000');

  // Step 4: Livraison & Statut State
  const defaultDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7); // +1 week
    return d.toISOString().split('T')[0];
  };
  const [dateLivraison, setDateLivraison] = useState<string>(defaultDeliveryDate());
  const [statut, setStatut] = useState<StatutCommande>('en_cours');

  // Success screen state
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Computed values
  const numPrix = Math.max(0, Number(prixGlobal) || 0);
  const numAvance = Math.max(0, Number(avance) || 0);
  const resteAPayer = Math.max(0, numPrix - numAvance);
  const isAvanceInvalid = numAvance > numPrix;

  // Selected or New client object for preview
  const currentClient = clientMode === 'existing'
    ? clients.find(c => c.id === selectedClientId)
    : { nom: newClientNom.trim(), prenom: newClientPrenom.trim(), telephone: newClientTel.trim() };

  // Handle Photo selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      setImageTissu(dataUrl);
    } catch (err) {
      alert("Erreur lors de l'import de la photo: " + err);
    }
  };

  const handleModeleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      setImageModele(dataUrl);
    } catch (err) {
      alert("Erreur lors de l'import du modèle: " + err);
    }
  };

  // Adjust numeric measurement with stepper button
  const adjustMesure = (key: keyof typeof mesures, delta: number) => {
    setMesures(prev => {
      const current = prev[key] === '' ? 0 : Number(prev[key]);
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next === 0 ? '' : next };
    });
  };

  // Quick date presets
  const setQuickDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setDateLivraison(d.toISOString().split('T')[0]);
  };

  // Step Validation
  const canProceed = () => {
    setErrorMessage('');
    if (currentStep === 0) {
      if (clientMode === 'new') {
        if (!newClientNom.trim()) {
          setErrorMessage('Veuillez renseigner le nom du client.');
          return false;
        }
        if (!newClientPrenom.trim()) {
          setErrorMessage('Veuillez renseigner le prénom du client.');
          return false;
        }
        if (!newClientTel.trim()) {
          setErrorMessage('Veuillez renseigner le numéro de téléphone.');
          return false;
        }
      } else {
        if (!selectedClientId) {
          setErrorMessage('Veuillez choisir un client existant.');
          return false;
        }
      }
    } else if (currentStep === 1) {
      if (!imageTissu) {
        setErrorMessage('Veuillez ajouter une photo du tissu.');
        return false;
      }
    } else if (currentStep === 3) {
      if (numPrix <= 0) {
        setErrorMessage('Le prix global doit être supérieur à 0.');
        return false;
      }
      if (isAvanceInvalid) {
        setErrorMessage("L'avance ne peut pas être supérieure au prix total.");
        return false;
      }
    } else if (currentStep === 4) {
      if (!dateLivraison) {
        setErrorMessage('Veuillez choisir une date de livraison prévue.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStep > (preselectedClientId ? 1 : 0)) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    if (isAvanceInvalid) {
      setErrorMessage("L'avance ne peut pas être supérieure au prix total.");
      return;
    }

    const clientData = clientMode === 'existing'
      ? { isNew: false, clientId: selectedClientId }
      : { isNew: true, nom: newClientNom.trim(), prenom: newClientPrenom.trim(), telephone: newClientTel.trim() };

    const commandeData = {
      nom_tissu: nomTissu.trim() || 'Tissu couture',
      description_tissu: descTissu.trim(),
      image_tissu: imageTissu,
      image_modele: imageModele || undefined,
      prix_global: numPrix,
      avance: numAvance,
      date_livraison: dateLivraison,
      statut,
    };

    const parsedMesures = {
      poitrine: mesures.poitrine !== '' ? Number(mesures.poitrine) : null,
      taille: mesures.taille !== '' ? Number(mesures.taille) : null,
      manche: mesures.manche !== '' ? Number(mesures.manche) : null,
      epaules: mesures.epaules !== '' ? Number(mesures.epaules) : null,
      fesses: mesures.fesses !== '' ? Number(mesures.fesses) : null,
      cuisses: mesures.cuisses !== '' ? Number(mesures.cuisses) : null,
      longueur_chemise: mesures.longueur_chemise !== '' ? Number(mesures.longueur_chemise) : null,
      longueur_jupe: mesures.longueur_jupe !== '' ? Number(mesures.longueur_jupe) : null,
      longueur_robe: mesures.longueur_robe !== '' ? Number(mesures.longueur_robe) : null,
    };

    onSubmit(clientData, commandeData, parsedMesures);
    setIsSuccess(true);
  };

  const stepLabels = ['Client', 'Tissu & Modèle', 'Mesures', 'Paiement', 'Livraison', 'Confirmation'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#F7F4EF] w-full max-w-xl rounded-3xl shadow-2xl border border-[#0D1B2A]/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-[#0D1B2A] text-white px-5 py-4 flex items-center justify-between border-b border-[#D4A017]/30 flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#D4A017] font-bold">
              Nouvelle Commande
            </span>
            <h2 className="font-display font-extrabold text-lg text-white">
              {stepLabels[currentStep]}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-[#0D1B2A]/90 px-5 py-2 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-1.5 w-full">
            {[0, 1, 2, 3, 4, 5].map(stepIndex => (
              <div
                key={stepIndex}
                className={`h-1.5 rounded-full flex-1 transition-all ${
                  stepIndex <= currentStep ? 'bg-[#D4A017]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#D4A017] font-mono ml-3 font-semibold whitespace-nowrap">
            {currentStep + 1}/6
          </span>
        </div>

        {/* Modal Body / Steps Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Error notification banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#A63A3A]/10 border border-[#A63A3A]/30 text-xs font-semibold text-[#A63A3A] flex items-center gap-2 animate-shake">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-18 h-18 mx-auto rounded-full bg-[#1F4D3A] text-[#86efac] flex items-center justify-center shadow-lg animate-bounce">
                <Check size={36} strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl text-[#0D1B2A]">
                  ✓ Commande enregistrée avec succès
                </h3>
                <p className="text-sm text-[#0D1B2A]/70 mt-1 max-w-sm mx-auto">
                  Le tissu et les mesures ont été rattachés de manière indépendante à cette commande.
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl bg-[#0D1B2A] text-white font-bold text-sm shadow-md hover:bg-[#1a2f47] transition"
                >
                  Voir mes commandes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 0: CLIENT SELECTION OR CREATION */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="flex p-1 bg-white rounded-xl border border-[#0D1B2A]/10 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setClientMode('existing')}
                      className={`flex-1 py-2 rounded-lg transition ${
                        clientMode === 'existing'
                          ? 'bg-[#0D1B2A] text-white shadow-xs'
                          : 'text-[#0D1B2A]/70'
                      }`}
                    >
                      Client existant ({clients.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientMode('new')}
                      className={`flex-1 py-2 rounded-lg transition ${
                        clientMode === 'new'
                          ? 'bg-[#D4A017] text-[#0D1B2A] font-bold shadow-xs'
                          : 'text-[#0D1B2A]/70'
                      }`}
                    >
                      + Nouveau client
                    </button>
                  </div>

                  {clientMode === 'existing' ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#0D1B2A] block">
                        Sélectionnez le client :
                      </label>
                      {clients.length === 0 ? (
                        <p className="text-xs text-[#0D1B2A]/60 italic">
                          Aucun client existant. Cliquez sur "+ Nouveau client".
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {clients.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSelectedClientId(c.id)}
                              className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                                selectedClientId === c.id
                                  ? 'bg-[#0D1B2A] text-white border-[#0D1B2A] shadow-xs'
                                  : 'bg-white text-[#0D1B2A] border-[#0D1B2A]/10 hover:border-[#D4A017]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                    selectedClientId === c.id
                                      ? 'bg-[#D4A017] text-[#0D1B2A]'
                                      : 'bg-[#0D1B2A]/5 text-[#0D1B2A]'
                                  }`}
                                >
                                  {c.prenom[0]}
                                  {c.nom[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-sm">
                                    {c.prenom} {c.nom}
                                  </p>
                                  <p
                                    className={`text-xs font-mono ${
                                      selectedClientId === c.id ? 'text-white/70' : 'text-[#0D1B2A]/60'
                                    }`}
                                  >
                                    {c.telephone}
                                  </p>
                                </div>
                              </div>
                              {selectedClientId === c.id && (
                                <Check size={16} className="text-[#D4A017]" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#0D1B2A]/10">
                      <p className="text-xs text-[#0D1B2A]/60">
                        Renseignez les informations de base du nouveau client :
                      </p>
                      <div>
                        <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                          Prénom * <span className="text-[10px] text-gray-400 font-normal">(max 20 caractères)</span>
                        </label>
                        <input
                          type="text"
                          maxLength={20}
                          value={newClientPrenom}
                          onChange={(e) => setNewClientPrenom(e.target.value)}
                          placeholder="Ex: Mamadou"
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                          Nom * <span className="text-[10px] text-gray-400 font-normal">(max 20 caractères)</span>
                        </label>
                        <input
                          type="text"
                          maxLength={20}
                          value={newClientNom}
                          onChange={(e) => setNewClientNom(e.target.value)}
                          placeholder="Ex: Diallo"
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          value={newClientTel}
                          onChange={(e) => setNewClientTel(e.target.value)}
                          placeholder="Ex: +224 622 00 00 00"
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-[#D4A017] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1: TISSU */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
                    <label className="text-xs font-bold text-[#0D1B2A] block">
                      Photo du tissu *
                    </label>

                    {/* Preview box */}
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#0D1B2A]/5 border-2 border-dashed border-[#0D1B2A]/20 flex items-center justify-center">
                      {imageTissu ? (
                        <img
                          src={imageTissu}
                          alt="Tissu"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera size={36} className="text-[#0D1B2A]/30 mx-auto mb-2" />
                          <p className="text-xs text-[#0D1B2A]/60 font-medium">
                            Prenez une photo ou importez le tissu
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Photo Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="file"
                        ref={cameraInputRef}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="py-2.5 px-3 rounded-xl bg-[#0D1B2A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#1a2f47] transition"
                      >
                        <Camera size={15} className="text-[#D4A017]" />
                        <span>Prendre photo</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-2.5 px-3 rounded-xl bg-white border border-[#0D1B2A]/15 text-[#0D1B2A] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition"
                      >
                        <Upload size={15} />
                        <span>Importer photo</span>
                      </button>
                    </div>

                    {/* Quick fabric samples for testing */}
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[11px] text-[#0D1B2A]/60 block mb-1.5">
                        Ou choisissez un tissu d'exemple :
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setImageTissu(SAMPLE_FABRIC_IMAGES.bazinBleu);
                            setNomTissu('Bazin bleu');
                          }}
                          className="h-10 rounded-lg overflow-hidden border border-[#0D1B2A]/20 hover:scale-105 transition"
                          title="Bazin Bleu"
                        >
                          <img src={SAMPLE_FABRIC_IMAGES.bazinBleu} alt="Bazin" className="w-full h-full object-cover" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageTissu(SAMPLE_FABRIC_IMAGES.waxAfricain);
                            setNomTissu('Tissu wax');
                          }}
                          className="h-10 rounded-lg overflow-hidden border border-[#0D1B2A]/20 hover:scale-105 transition"
                          title="Wax Hollandais"
                        >
                          <img src={SAMPLE_FABRIC_IMAGES.waxAfricain} alt="Wax" className="w-full h-full object-cover" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageTissu(SAMPLE_FABRIC_IMAGES.tissuBlanc);
                            setNomTissu('Tissu blanc');
                          }}
                          className="h-10 rounded-lg overflow-hidden border border-[#0D1B2A]/20 hover:scale-105 transition"
                          title="Voile Blanc"
                        >
                          <img src={SAMPLE_FABRIC_IMAGES.tissuBlanc} alt="Blanc" className="w-full h-full object-cover" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageTissu(SAMPLE_FABRIC_IMAGES.bazinVert);
                            setNomTissu('Bazin vert émeraude');
                          }}
                          className="h-10 rounded-lg overflow-hidden border border-[#0D1B2A]/20 hover:scale-105 transition"
                          title="Bazin Vert"
                        >
                          <img src={SAMPLE_FABRIC_IMAGES.bazinVert} alt="Vert" className="w-full h-full object-cover" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MODÈLE SELECTION */}
                  <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
                    <label className="text-xs font-bold text-[#0D1B2A] block">
                      Photo du modèle de couture (facultatif)
                    </label>

                    {/* Preview box for Modèle */}
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#0D1B2A]/5 border-2 border-dashed border-[#0D1B2A]/20 flex items-center justify-center">
                      {imageModele ? (
                        <img
                          src={imageModele}
                          alt="Modèle de couture"
                          className="w-full h-full object-contain bg-black/5"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera size={36} className="text-[#0D1B2A]/30 mx-auto mb-2" />
                          <p className="text-xs text-[#0D1B2A]/60 font-medium">
                            Ajoutez une photo du modèle choisi
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Photo Action Buttons for Modèle */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="file"
                        ref={cameraInputModeleRef}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleModeleFileChange}
                      />
                      <button
                        type="button"
                        onClick={() => cameraInputModeleRef.current?.click()}
                        className="py-2.5 px-3 rounded-xl bg-[#0D1B2A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#1a2f47] transition"
                      >
                        <Camera size={15} className="text-[#D4A017]" />
                        <span>Prendre photo</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputModeleRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleModeleFileChange}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputModeleRef.current?.click()}
                        className="py-2.5 px-3 rounded-xl bg-white border border-[#0D1B2A]/15 text-[#0D1B2A] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition"
                      >
                        <Upload size={15} />
                        <span>Importer photo</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                        Nom du tissu (facultatif)
                      </label>
                      <input
                        type="text"
                        value={nomTissu}
                        onChange={(e) => setNomTissu(e.target.value)}
                        placeholder="Ex: Bazin riche bleu nuit, Wax 6 yards..."
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#D4A017] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                        Description du tissu (facultatif)
                      </label>
                      <textarea
                        rows={2}
                        value={descTissu}
                        onChange={(e) => setDescTissu(e.target.value)}
                        placeholder="Détails du modèle, broderie demandée, particularités..."
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:border-[#D4A017] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: MESURES (9 fields with quick adjustment buttons) */}
              {currentStep === 2 && (
                <div className="space-y-3">
                  <div className="bg-[#D4A017]/15 p-3 rounded-xl border border-[#D4A017]/30 text-xs text-[#0D1B2A] flex items-center gap-2">
                    <Scissors size={16} className="text-[#0D1B2A] flex-shrink-0" />
                    <span>
                      Mesures en <strong>centimètres (cm)</strong> propres à cette commande uniquement.
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">
                    {[
                      { key: 'poitrine', label: 'Poitrine', placeholder: '102' },
                      { key: 'taille', label: 'Taille', placeholder: '88' },
                      { key: 'manche', label: 'Manche', placeholder: '64' },
                      { key: 'epaules', label: 'Épaules', placeholder: '46' },
                      { key: 'fesses', label: 'Fesses / Bassin', placeholder: '98' },
                      { key: 'cuisses', label: 'Cuisses', placeholder: '58' },
                      { key: 'longueur_chemise', label: 'Longueur chemise', placeholder: '82' },
                      { key: 'longueur_jupe', label: 'Longueur jupe', placeholder: '95' },
                      { key: 'longueur_robe', label: 'Longueur robe', placeholder: '135' },
                    ].map(f => {
                      const fieldKey = f.key as keyof typeof mesures;
                      const val = mesures[fieldKey];

                      return (
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
                              onClick={() => adjustMesure(fieldKey, -1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-sm font-bold text-[#0D1B2A] flex items-center justify-center active:bg-gray-100"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={val}
                              placeholder={f.placeholder}
                              onChange={(e) => {
                                const v = e.target.value;
                                setMesures(prev => ({ ...prev, [fieldKey]: v }));
                              }}
                              className="w-16 p-1.5 rounded-lg border border-gray-300 text-center font-mono font-bold text-sm bg-white focus:border-[#D4A017] focus:outline-hidden"
                            />

                            <button
                              type="button"
                              onClick={() => adjustMesure(fieldKey, 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-sm font-bold text-[#0D1B2A] flex items-center justify-center active:bg-gray-100"
                            >
                              +
                            </button>

                            <span className="text-[11px] text-[#0D1B2A]/50 w-6 text-right">
                              cm
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: PAIEMENT */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#0D1B2A]/10 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                        Prix global de la commande ({settings.devise}) *
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={prixGlobal}
                        onChange={(e) => setPrixGlobal(e.target.value)}
                        placeholder="Ex: 50000"
                        className="w-full p-3 rounded-xl border border-gray-300 font-display font-extrabold text-xl text-[#0D1B2A] focus:border-[#D4A017] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                        Avance versée par le client ({settings.devise})
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={avance}
                        onChange={(e) => setAvance(e.target.value)}
                        placeholder="Ex: 20000"
                        className="w-full p-3 rounded-xl border border-gray-300 font-display font-extrabold text-xl text-[#D4A017] focus:border-[#D4A017] focus:outline-hidden"
                      />
                      {isAvanceInvalid && (
                        <p className="text-xs text-[#A63A3A] font-semibold mt-1">
                          L'avance ne peut pas être supérieure au prix total.
                        </p>
                      )}
                    </div>

                    {/* Auto-calculated Reste à payer */}
                    <div className="pt-4 border-t border-gray-100 bg-[#F7F4EF]/80 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-[#0D1B2A]/60 font-semibold block">
                          Reste à payer calculé
                        </span>
                        <span className="text-[11px] text-[#0D1B2A]/50">
                          (Prix global − Avance)
                        </span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-display font-extrabold text-2xl ${
                            resteAPayer > 0 ? 'text-[#0D1B2A]' : 'text-[#1F4D3A]'
                          }`}
                        >
                          {formatCurrency(resteAPayer, settings.devise)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: LIVRAISON & STATUT */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#0D1B2A]/10 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#0D1B2A] block mb-1">
                        Date de livraison prévue *
                      </label>
                      <input
                        type="date"
                        value={dateLivraison}
                        onChange={(e) => setDateLivraison(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 font-bold text-base text-[#0D1B2A] focus:border-[#D4A017] focus:outline-hidden"
                      />

                      {/* Quick date shortcuts */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setQuickDate(3)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium hover:bg-gray-200 text-[#0D1B2A]"
                        >
                          + 3 jours
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickDate(7)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium hover:bg-gray-200 text-[#0D1B2A]"
                        >
                          + 1 semaine
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickDate(14)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium hover:bg-gray-200 text-[#0D1B2A]"
                        >
                          + 2 semaines
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0D1B2A] block mb-1.5">
                        Statut initial de la commande
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setStatut('en_cours')}
                          className={`p-3 rounded-xl border text-center transition ${
                            statut === 'en_cours'
                              ? 'bg-[#0D1B2A] text-white border-[#0D1B2A] font-bold shadow-xs'
                              : 'bg-white text-[#0D1B2A] border-gray-200 hover:border-[#0D1B2A]'
                          }`}
                        >
                          <Clock size={16} className="mx-auto mb-1 text-[#D4A017]" />
                          <span className="text-xs block">En cours</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatut('pret')}
                          className={`p-3 rounded-xl border text-center transition ${
                            statut === 'pret'
                              ? 'bg-[#D4A017] text-[#0D1B2A] border-[#D4A017] font-extrabold shadow-xs'
                              : 'bg-white text-[#0D1B2A] border-gray-200 hover:border-[#D4A017]'
                          }`}
                        >
                          <Sparkles size={16} className="mx-auto mb-1 text-[#0D1B2A]" />
                          <span className="text-xs block">Prêt</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatut('solde')}
                          className={`p-3 rounded-xl border text-center transition ${
                            statut === 'solde'
                              ? 'bg-[#1F4D3A] text-white border-[#1F4D3A] font-bold shadow-xs'
                              : 'bg-white text-[#0D1B2A] border-gray-200 hover:border-[#1F4D3A]'
                          }`}
                        >
                          <CheckCircle2 size={16} className="mx-auto mb-1 text-white" />
                          <span className="text-xs block">Soldé</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CONFIRMATION & RÉSUMÉ */}
              {currentStep === 5 && (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/10 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] block">
                      Résumé complet avant enregistrement
                    </span>

                    {/* Client recap */}
                    <div className="p-3 rounded-xl bg-[#F7F4EF]/70 border border-[#0D1B2A]/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-[#0D1B2A]" />
                        <span className="text-xs text-[#0D1B2A]/70">Client :</span>
                      </div>
                      <span className="font-bold text-sm text-[#0D1B2A]">
                        {currentClient ? `${currentClient.prenom} ${currentClient.nom}` : '-'}
                      </span>
                    </div>

                    {/* Tissu recap */}
                    <div className="p-3 rounded-xl bg-[#F7F4EF]/70 border border-[#0D1B2A]/5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#0D1B2A]/10 flex-shrink-0">
                        {imageTissu && (
                          <img src={imageTissu} alt="Tissu" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-[#0D1B2A]/70 block">Tissu associé :</span>
                        <span className="font-bold text-sm text-[#0D1B2A]">
                          {nomTissu || 'Tissu sans nom'}
                        </span>
                      </div>
                    </div>

                    {/* Mesures recap */}
                    <div className="p-3 rounded-xl bg-[#F7F4EF]/70 border border-[#0D1B2A]/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-[#0D1B2A]">Mesures enregistrées :</span>
                        <span className="text-[11px] text-[#D4A017] font-bold">Unité: cm</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-[#0D1B2A]">
                        {mesures.poitrine && <span>Poitrine: {mesures.poitrine}</span>}
                        {mesures.taille && <span>Taille: {mesures.taille}</span>}
                        {mesures.manche && <span>Manche: {mesures.manche}</span>}
                        {mesures.epaules && <span>Épaules: {mesures.epaules}</span>}
                        {mesures.fesses && <span>Fesses: {mesures.fesses}</span>}
                        {mesures.cuisses && <span>Cuisses: {mesures.cuisses}</span>}
                        {mesures.longueur_chemise && <span>L. Chemise: {mesures.longueur_chemise}</span>}
                        {mesures.longueur_jupe && <span>L. Jupe: {mesures.longueur_jupe}</span>}
                        {mesures.longueur_robe && <span>L. Robe: {mesures.longueur_robe}</span>}
                      </div>
                    </div>

                    {/* Paiement & Livraison recap */}
                    <div className="p-3 rounded-xl bg-[#0D1B2A] text-white space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">Prix global :</span>
                        <span className="font-bold">{formatCurrency(numPrix, settings.devise)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#D4A017]">Avance versée :</span>
                        <span className="font-bold text-[#D4A017]">{formatCurrency(numAvance, settings.devise)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-1 border-t border-white/15">
                        <span className="font-bold">Reste à payer :</span>
                        <span className="font-display font-extrabold text-[#D4A017]">
                          {formatCurrency(resteAPayer, settings.devise)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10 text-white/80">
                        <span>Date de livraison :</span>
                        <span className="font-semibold">{formatDateFrench(dateLivraison)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer / Navigation Buttons */}
        {!isSuccess && (
          <div className="p-4 bg-white border-t border-[#0D1B2A]/10 flex items-center justify-between gap-3 flex-shrink-0">
            {currentStep > (preselectedClientId ? 1 : 0) ? (
              <button
                type="button"
                onClick={handleBack}
                className="py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-bold text-[#0D1B2A] flex items-center gap-1.5 hover:bg-gray-50 transition"
              >
                <ArrowLeft size={15} />
                <span>Précédent</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-[#0D1B2A] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-[#1a2f47] transition shadow-xs"
              >
                <span>Suivant</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                id="btn-enregistrer-commande-finale"
                onClick={handleFinalSubmit}
                className="py-3 px-6 rounded-xl bg-[#D4A017] hover:bg-[#c29213] text-[#0D1B2A] text-sm sm:text-base font-display font-extrabold flex items-center gap-2 shadow-md active:scale-95 transition"
              >
                <Check size={18} strokeWidth={3} />
                <span>Enregistrer la commande</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
