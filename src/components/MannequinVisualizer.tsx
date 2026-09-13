import React from 'react';
import { Mesures } from '../types';

interface MannequinVisualizerProps {
  activeField: keyof Mesures | null;
}

export const MannequinVisualizer: React.FC<MannequinVisualizerProps> = ({ activeField }) => {
  // Helper to determine line style based on active field
  const getLineStyle = (field: keyof Mesures) => {
    const isActive = activeField === field;
    return {
      stroke: isActive ? '#D4A017' : '#0D1B2A',
      strokeWidth: isActive ? 4 : 1.5,
      opacity: isActive ? 1 : 0.2,
      transition: 'all 0.3s ease',
      strokeLinecap: 'round' as const,
      strokeDasharray: isActive ? 'none' : '4 4'
    };
  };

  return (
    <div className="w-full max-w-[200px] aspect-[1/2] mx-auto relative flex items-center justify-center">
      <svg 
        viewBox="0 0 200 400" 
        className="w-full h-full drop-shadow-md"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Silhouette Base */}
        <g stroke="#0D1B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.1">
          {/* Head */}
          <circle cx="100" cy="40" r="25" />
          {/* Neck */}
          <path d="M90 64 L90 80 M110 64 L110 80" />
          {/* Shoulders & Torso */}
          <path d="M90 80 C 60 80 40 90 30 110 L 40 200 L 60 200 L 70 210 L 70 380 L 95 380 L 100 240 L 105 380 L 130 380 L 130 210 L 140 200 L 160 200 L 170 110 C 160 90 140 80 110 80 Z" />
          {/* Arms (Resting) */}
          <path d="M30 110 C 20 130 15 160 15 210 L 35 210 L 40 150" />
          <path d="M170 110 C 180 130 185 160 185 210 L 165 210 L 160 150" />
        </g>

        {/* Measurement Lines */}
        
        {/* Epaules (Shoulders) - Line across the top of shoulders */}
        <path d="M 40 90 Q 100 80 160 90" {...getLineStyle('epaules')} />
        <circle cx="40" cy="90" r="4" fill={activeField === 'epaules' ? '#D4A017' : 'transparent'} />
        <circle cx="160" cy="90" r="4" fill={activeField === 'epaules' ? '#D4A017' : 'transparent'} />

        {/* Poitrine (Chest) - Horizontal line across chest */}
        <path d="M 35 130 L 165 130" {...getLineStyle('poitrine')} />
        
        {/* Taille (Waist) - Horizontal line at narrowest torso part */}
        <path d="M 48 180 L 152 180" {...getLineStyle('taille')} />

        {/* Fesses (Hips) - Horizontal line at widest hip part */}
        <path d="M 40 220 L 160 220" {...getLineStyle('fesses')} />

        {/* Cuisses (Thighs) - Horizontal line on one leg */}
        <path d="M 68 260 L 98 260" {...getLineStyle('cuisses')} />

        {/* Manche (Sleeve) - Line down the arm */}
        <path d="M 170 110 C 180 140 185 170 185 210" {...getLineStyle('manche')} />
        
        {/* Longueur Chemise (Shirt Length) - Vertical line from neck to crotch/hips */}
        <path d="M 100 80 L 100 230" {...getLineStyle('longueur_chemise')} />

        {/* Longueur Jupe (Skirt Length) - Vertical line from waist down */}
        <path d="M 120 180 L 120 320" {...getLineStyle('longueur_jupe')} />

        {/* Longueur Robe (Dress Length) - Vertical line from neck to knees/calves */}
        <path d="M 80 80 L 80 340" {...getLineStyle('longueur_robe')} />

      </svg>
      
      {/* Active Field Label */}
      <div className="absolute -bottom-6 left-0 right-0 text-center">
        {activeField ? (
          <span className="bg-[#0D1B2A] text-[#D4A017] text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-in fade-in slide-in-from-bottom-2">
            {activeField.replace('_', ' ').toUpperCase()}
          </span>
        ) : (
          <span className="text-[#0D1B2A]/40 text-xs font-medium">Sélectionnez une mesure</span>
        )}
      </div>
    </div>
  );
};
