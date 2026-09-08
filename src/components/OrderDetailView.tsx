import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Calendar,
  Wallet,
  Scissors,
  Edit,
  Camera,
  Trash2,
  Share2,
  Maximize2,
  Check,
  Ruler
} from 'lucide-react';
import { Commande, Client, Mesures, AtelierSettings, StatutCommande } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDateFrench, getDeliveryRelativeText, processImageFile } from '../utils/format';
import { WaxHeaderPattern } from './WaxDecorations';

interface OrderDetailViewProps {
  commande: Commande;
  client: Client;
  mesures: Mesures;
  settings: AtelierSettings;
  onBack: () => void;
  onSelectClient: (clientId: string) => void;
  onEditCommande: () => void;
  onEditMesures: () => void;
  onUpdateStatus: (statut: StatutCommande) => void;
  onUpdateFabricPhoto: (newPhotoUrl: string) => void;
  onUpdateModelePhoto?: (newPhotoUrl: string) => void;
  onDeleteCommande: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  commande,
  client,
  mesures,
  settings,
  onBack,
  onSelectClient,
  onEditCommande,
  onEditMesures,
  onUpdateStatus,
  onUpdateFabricPhoto,
  onUpdateModelePhoto,
  onDeleteCommande,
}) => {
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const [showFullModelePhoto, setShowFullModelePhoto] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputModeleRef = useRef<HTMLInputElement>(null);

  const relativeDelivery = getDeliveryRelativeText(commande.date_livraison);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      onUpdateFabricPhoto(dataUrl);
    } catch (err) {
      alert("Erreur lors de l'importation de la photo : " + err);
    }
  };

  const handleModelePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      if (onUpdateModelePhoto) onUpdateModelePhoto(dataUrl);
    } catch (err) {
      alert("Erreur lors de l'importation du modèle : " + err);
    }
  };

  // Measurement fields descriptor
  const mesureFields = [
    { key: 'poitrine', label: 'Poitrine', value: mesures.poitrine },
    { key: 'taille', label: 'Taille', value: mesures.taille },
    { key: 'manche', label: 'Manche', value: mesures.manche },
    { key: 'epaules', label: 'Épaules', value: mesures.epaules },
    { key: 'fesses', label: 'Fesses / Bassin', value: mesures.fesses },
    { key: 'cuisses', label: 'Cuisses', value: mesures.cuisses },
    { key: 'longueur_chemise', label: 'Longueur chemise', value: mesures.longueur_chemise },
    { key: 'longueur_jupe', label: 'Longueur jupe', value: mesures.longueur_jupe },
    { key: 'longueur_robe', label: 'Longueur robe', value: mesures.longueur_robe },
  ];

  // WhatsApp receipt message generator
  const generateWhatsAppMessage = () => {
    const text = `*Reçu de Commande - ${settings.nom_atelier || 'MesurePro'}*
Client : ${client.prenom} ${client.nom}
Commande : ${commande.reference}
Tissu : ${commande.nom_tissu || 'Tissu couture'}
Livraison prévue : ${formatDateFrench(commande.date_livraison)}
Statut : ${commande.statut === 'en_cours' ? 'En cours' : commande.statut === 'pret' ? 'Prêt pour retrait' : 'Soldé'}

*Paiement :*
• Prix global : ${formatCurrency(commande.prix_global, settings.devise)}
• Avance versée : ${formatCurrency(commande.avance, settings.devise)}
• *Reste à payer : ${formatCurrency(commande.reste_a_payer, settings.devise)}*

Merci pour votre confiance !`;

    return encodeURIComponent(text);
  };

  const handleShare = () => {
    const shareText = `Commande ${commande.reference} - ${client.prenom} ${client.nom} - Reste : ${formatCurrency(commande.reste_a_payer, settings.devise)}`;
    if (navigator.share) {
      navigator.share({
        title: `Commande ${commande.reference}`,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top back navigation and Reference header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D1B2A]/70 hover:text-[#0D1B2A] transition"
        >
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-[#0D1B2A]/10 text-[#0D1B2A] text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1.5"
            title="Partager le résumé de la commande"
          >
            {copySuccess ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copySuccess ? 'Copié !' : 'Partager'}</span>
          </button>

          <button
            type="button"
            onClick={onDeleteCommande}
            className="p-2 rounded-xl bg-[#A63A3A]/10 hover:bg-[#A63A3A]/20 text-[#A63A3A] transition"
            title="Supprimer la commande"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/8 shadow-xs relative overflow-hidden">
        <WaxHeaderPattern opacity={0.04} />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-extrabold bg-[#0D1B2A] text-[#D4A017] px-2.5 py-1 rounded-lg">
                {commande.reference}
              </span>
              <h1 className="font-display font-extrabold text-xl text-[#0D1B2A]">
                {commande.nom_tissu || 'Fiche Commande'}
              </h1>
            </div>
            {commande.description_tissu && (
              <p className="text-xs text-[#0D1B2A]/70 mt-1">
                {commande.description_tissu}
              </p>
            )}
          </div>

          <StatusBadge statut={commande.statut} size="md" />
        </div>

        {/* Quick status switcher for the tailor */}
        {commande.statut !== 'solde' && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[#0D1B2A]/60">Changer statut :</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateStatus('en_cours')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  commande.statut === 'en_cours'
                    ? 'bg-[#0D1B2A] text-white'
                    : 'bg-gray-100 text-[#0D1B2A]/70 hover:bg-gray-200'
                }`}
              >
                En cours
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus('pret')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                  commande.statut === 'pret'
                    ? 'bg-[#D4A017] text-[#0D1B2A]'
                    : 'bg-gray-100 text-[#0D1B2A]/70 hover:bg-gray-200'
                }`}
              >
                Prêt
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus('solde')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  commande.statut === 'solde'
                    ? 'bg-[#1F4D3A] text-white'
                    : 'bg-gray-100 text-[#0D1B2A]/70 hover:bg-gray-200'
                }`}
              >
                Soldé
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Client Information Card with Quick Actions */}
      <div className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0D1B2A]/50">
            Client
          </span>
          <button
            type="button"
            onClick={() => onSelectClient(client.id)}
            className="text-xs text-[#D4A017] hover:underline font-bold"
          >
            Voir la fiche client
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#0D1B2A]">
              {client.prenom} {client.nom}
            </h2>
            <p className="font-mono text-xs text-[#0D1B2A]/70 mt-0.5">
              {client.telephone}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${client.telephone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D1B2A] text-white hover:bg-[#1a2f47] font-semibold text-xs transition active:scale-95 shadow-xs"
              title="Appeler le client"
            >
              <Phone size={14} className="text-[#D4A017]" />
              <span>Appeler</span>
            </a>

            <a
              href={`https://wa.me/${client.telephone.replace(/[^0-9]/g, '')}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#163a2c] transition active:scale-95 shadow-xs"
              title="Envoyer reçu WhatsApp"
            >
              <MessageCircle size={17} />
            </a>
          </div>
        </div>
      </div>

      {/* Fabric Section: Grande photo du tissu */}
      <div className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0D1B2A]/50">
            Tissu de la commande
          </span>

          {/* Photo replacement trigger */}
          <div className="flex items-center gap-2">
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
              className="text-xs font-medium text-[#0D1B2A] hover:text-[#D4A017] flex items-center gap-1 bg-[#0D1B2A]/5 px-2.5 py-1 rounded-lg transition"
            >
              <Camera size={13} />
              <span>Remplacer la photo</span>
            </button>
          </div>
        </div>

        {/* Big Fabric Photo Preview */}
        <div className="relative rounded-2xl overflow-hidden border border-[#0D1B2A]/10 bg-[#0D1B2A]/5 aspect-4/3 sm:aspect-16/9 flex items-center justify-center group">
          {commande.image_tissu ? (
            <>
              <img
                src={commande.image_tissu}
                alt={commande.nom_tissu || 'Tissu'}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowFullPhoto(true)}
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setShowFullPhoto(true)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#0D1B2A]/80 text-white hover:bg-[#0D1B2A] transition backdrop-blur-xs flex items-center gap-1.5 text-xs font-medium"
              >
                <Maximize2 size={13} />
                <span>Agrandir</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Camera size={32} className="text-[#0D1B2A]/30 mb-2" />
              <p className="text-xs text-[#0D1B2A]/50">Aucune photo enregistrée pour ce tissu</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 px-3 py-1.5 rounded-xl bg-[#0D1B2A] text-white text-xs font-medium"
              >
                Ajouter une photo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modele Section: Photo du modèle */}
      <div className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0D1B2A]/50">
            Modèle de couture
          </span>

          <div className="flex items-center gap-2">
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
              className="text-xs font-medium text-[#0D1B2A] hover:text-[#D4A017] flex items-center gap-1 bg-[#0D1B2A]/5 px-2.5 py-1 rounded-lg transition"
            >
              <Camera size={13} />
              <span>{commande.image_modele ? 'Remplacer' : 'Ajouter'}</span>
            </button>
          </div>
        </div>

        {/* Big Modele Photo Preview */}
        <div className="relative rounded-2xl overflow-hidden border border-[#0D1B2A]/10 bg-[#0D1B2A]/5 aspect-4/3 sm:aspect-16/9 flex items-center justify-center group">
          {commande.image_modele ? (
            <>
              <img
                src={commande.image_modele}
                alt="Modèle de couture"
                className="w-full h-full object-contain cursor-pointer bg-black/5"
                onClick={() => setShowFullModelePhoto(true)}
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setShowFullModelePhoto(true)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#0D1B2A]/80 text-white hover:bg-[#0D1B2A] transition backdrop-blur-xs flex items-center gap-1.5 text-xs font-medium"
              >
                <Maximize2 size={13} />
                <span>Agrandir</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Camera size={32} className="text-[#0D1B2A]/30 mb-2" />
              <p className="text-xs text-[#0D1B2A]/50">Aucun modèle associé</p>
              <button
                type="button"
                onClick={() => fileInputModeleRef.current?.click()}
                className="mt-3 px-3 py-1.5 rounded-xl bg-[#0D1B2A] text-white text-xs font-medium"
              >
                Ajouter un modèle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment and Delivery Cards in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payment Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0D1B2A]/50 flex items-center gap-1.5">
              <Wallet size={14} className="text-[#D4A017]" />
              <span>Paiement</span>
            </span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#0D1B2A]/70">Prix global</span>
              <span className="font-bold text-[#0D1B2A]">
                {formatCurrency(commande.prix_global, settings.devise)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#0D1B2A]/70">Avance versée</span>
              <span className="font-semibold text-[#D4A017]">
                {formatCurrency(commande.avance, settings.devise)}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-[#0D1B2A]">Reste à payer</span>
              <span
                className={`font-display font-extrabold text-lg ${
                  commande.reste_a_payer > 0 ? 'text-[#0D1B2A]' : 'text-[#1F4D3A]'
                }`}
              >
                {formatCurrency(commande.reste_a_payer, settings.devise)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0D1B2A]/50 flex items-center gap-1.5">
              <Calendar size={14} className="text-[#D4A017]" />
              <span>Livraison</span>
            </span>
            <StatusBadge statut={commande.statut} size="sm" />
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs text-[#0D1B2A]/60 block">Date prévue</span>
              <span className="font-bold text-base text-[#0D1B2A]">
                {formatDateFrench(commande.date_livraison)}
              </span>
            </div>

            <div className="pt-2">
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  relativeDelivery.isLate
                    ? 'bg-[#A63A3A]/15 text-[#A63A3A]'
                    : relativeDelivery.isUrgent
                    ? 'bg-[#D4A017]/20 text-[#9A7000]'
                    : 'bg-[#0D1B2A]/5 text-[#0D1B2A]/70'
                }`}
              >
                📅 {relativeDelivery.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mesures Card: Specific to ONLY this order */}
      <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/8 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ruler size={18} className="text-[#D4A017]" />
            <h2 className="font-display font-bold text-base sm:text-lg text-[#0D1B2A]">
              Mesures ({mesures.unite || 'cm'})
            </h2>
          </div>

          <button
            type="button"
            onClick={onEditMesures}
            className="text-xs font-bold text-[#0D1B2A] hover:text-[#D4A017] flex items-center gap-1 bg-[#0D1B2A]/5 hover:bg-[#0D1B2A]/10 px-3 py-1.5 rounded-xl transition"
          >
            <Edit size={13} />
            <span>Modifier les mesures</span>
          </button>
        </div>

        <p className="text-xs text-[#0D1B2A]/55 mb-4">
          Ces mesures sont enregistrées uniquement pour la commande <span className="font-bold font-mono">{commande.reference}</span>.
        </p>

        {/* 9-Measurement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {mesureFields.map(m => (
            <div
              key={m.key}
              className="p-2.5 rounded-xl bg-[#F7F4EF]/70 border border-[#0D1B2A]/5 flex items-center justify-between"
            >
              <span className="text-xs text-[#0D1B2A]/70 font-medium">
                {m.label}
              </span>
              <span className="font-mono font-bold text-sm text-[#0D1B2A]">
                {m.value !== null && m.value !== undefined ? `${m.value} cm` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Buttons at Bottom: Modifier la commande / Modifier les mesures / Appeler */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
        <button
          type="button"
          onClick={onEditCommande}
          className="py-3 px-4 rounded-xl bg-[#0D1B2A] hover:bg-[#1a2f47] text-[#F7F4EF] font-bold text-sm shadow-sm transition active:scale-98 flex items-center justify-center gap-2"
        >
          <Edit size={16} className="text-[#D4A017]" />
          <span>Modifier la commande</span>
        </button>

        <button
          type="button"
          onClick={onEditMesures}
          className="py-3 px-4 rounded-xl bg-[#D4A017] hover:bg-[#c29213] text-[#0D1B2A] font-extrabold text-sm shadow-sm transition active:scale-98 flex items-center justify-center gap-2"
        >
          <Scissors size={16} />
          <span>Modifier les mesures</span>
        </button>

        <a
          href={`tel:${client.telephone}`}
          className="py-3 px-4 rounded-xl bg-white border border-[#0D1B2A]/15 hover:bg-gray-50 text-[#0D1B2A] font-bold text-sm transition active:scale-98 flex items-center justify-center gap-2"
        >
          <Phone size={16} className="text-[#D4A017]" />
          <span>Appeler le client</span>
        </a>
      </div>

      {/* Full Photo Modal */}
      {showFullPhoto && commande.image_tissu && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowFullPhoto(false)}
        >
          <div className="relative max-w-2xl max-h-[85vh] w-full" onClick={e => e.stopPropagation()}>
            <img
              src={commande.image_tissu}
              alt={commande.nom_tissu || 'Tissu'}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 flex items-center justify-between text-white text-xs">
              <span className="font-bold">{commande.nom_tissu} ({commande.reference})</span>
              <button
                type="button"
                onClick={() => setShowFullPhoto(false)}
                className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Modele Modal */}
      {showFullModelePhoto && commande.image_modele && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowFullModelePhoto(false)}
        >
          <div className="relative max-w-2xl max-h-[85vh] w-full" onClick={e => e.stopPropagation()}>
            <img
              src={commande.image_modele}
              alt="Modèle de couture"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 flex items-center justify-between text-white text-xs">
              <span className="font-bold">Modèle de couture ({commande.reference})</span>
              <button
                type="button"
                onClick={() => setShowFullModelePhoto(false)}
                className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
