import { StatutCommande } from '../types';

export function formatCurrency(amount: number, devise = 'FG'): string {
  const rounded = Math.round(amount || 0);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${devise}`;
}

export function formatDateFrench(dateString: string): string {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ];

      return `${day} ${months[monthIndex]} ${year}`;
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getDeliveryRelativeText(dateString: string): { label: string; isUrgent: boolean; isLate: boolean } {
  if (!dateString) return { label: '', isUrgent: false, isLate: false };
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateString.split('-');
    const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `En retard de ${Math.abs(diffDays)} j`,
        isUrgent: true,
        isLate: true,
      };
    } else if (diffDays === 0) {
      return { label: "Aujourd'hui", isUrgent: true, isLate: false };
    } else if (diffDays === 1) {
      return { label: 'Demain', isUrgent: true, isLate: false };
    } else if (diffDays <= 5) {
      return { label: `Dans ${diffDays} jours`, isUrgent: true, isLate: false };
    } else {
      return { label: formatDateFrench(dateString), isUrgent: false, isLate: false };
    }
  } catch {
    return { label: dateString, isUrgent: false, isLate: false };
  }
}

export interface StatusStyle {
  id: StatutCommande;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  colorHex: string;
}

export const STATUS_CONFIG: Record<StatutCommande, StatusStyle> = {
  en_cours: {
    id: 'en_cours',
    label: 'En cours',
    badgeBg: 'bg-[#0D1B2A]/10',
    badgeText: 'text-[#0D1B2A]',
    badgeBorder: 'border-[#0D1B2A]/30',
    colorHex: '#0D1B2A',
  },
  pret: {
    id: 'pret',
    label: 'Prêt',
    badgeBg: 'bg-[#D4A017]/15',
    badgeText: 'text-[#9A7000]',
    badgeBorder: 'border-[#D4A017]/40',
    colorHex: '#D4A017',
  },
  solde: {
    id: 'solde',
    label: 'Soldé',
    badgeBg: 'bg-[#1F4D3A]/12',
    badgeText: 'text-[#1F4D3A]',
    badgeBorder: 'border-[#1F4D3A]/30',
    colorHex: '#1F4D3A',
  },
};

// Client-side image compression for reliable local & storage persistence
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Impossible de charger l'image."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}
