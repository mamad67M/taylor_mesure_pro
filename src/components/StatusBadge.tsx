import React from 'react';
import { Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { StatutCommande } from '../types';

interface StatusBadgeProps {
  statut: StatutCommande;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  statut,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1 gap-1.5 font-medium',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  };

  switch (statut) {
    case 'en_cours':
      return (
        <span
          id={`status-badge-en-cours`}
          className={`inline-flex items-center rounded-full bg-[#0D1B2A] text-[#F7F4EF] shadow-xs border border-[#0D1B2A] ${sizeClasses[size]} ${className}`}
        >
          <Clock size={iconSizes[size]} className="text-[#D4A017] animate-pulse" />
          <span>En cours</span>
        </span>
      );

    case 'pret':
      return (
        <span
          id={`status-badge-pret`}
          className={`inline-flex items-center rounded-full bg-[#D4A017] text-[#0D1B2A] font-semibold shadow-xs border border-[#b8890e] ${sizeClasses[size]} ${className}`}
        >
          <Sparkles size={iconSizes[size]} className="text-[#0D1B2A]" />
          <span>Prêt</span>
        </span>
      );

    case 'solde':
      return (
        <span
          id={`status-badge-solde`}
          className={`inline-flex items-center rounded-full bg-[#1F4D3A] text-white shadow-xs border border-[#173a2c] ${sizeClasses[size]} ${className}`}
        >
          <CheckCircle2 size={iconSizes[size]} className="text-[#86efac]" />
          <span>Soldé</span>
        </span>
      );

    default:
      return null;
  }
};
