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
  coupe: {
    id: 'coupe',
    label: '✂️ Coupe',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-700',
    badgeBorder: 'border-gray-200',
    colorHex: '#4B5563', // gray-600
  },
  couture: {
    id: 'couture',
    label: '🧵 En Couture',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    colorHex: '#C2410C', // orange-700
  },
  pret: {
    id: 'pret',
    label: '👔 Prêt pour Essayage',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    colorHex: '#1D4ED8', // blue-700
  },
  livre: {
    id: 'livre',
    label: '✅ Livré',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    badgeBorder: 'border-green-200',
    colorHex: '#15803D', // green-700
  },
  // Fallbacks for old data
  en_cours: {
    id: 'en_cours',
    label: '🧵 En Couture',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    colorHex: '#C2410C',
  },
  solde: {
    id: 'solde',
    label: '✅ Livré',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    badgeBorder: 'border-green-200',
    colorHex: '#15803D',
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
