import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Mobile/Desktop generic fallback if not explicitly installable via prompt yet, or iOS
  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowIOSGuide(true);
          }
        }}
        className="flex items-center justify-center gap-2 rounded-full border border-sand-border bg-linen px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal hover:bg-sand-border/40 transition-colors w-full sm:w-auto mt-4"
      >
        <Download className="w-4 h-4" />
        Installer l'Application
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-linen p-6 shadow-2xl border border-sand-border">
            <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Installer l'Application</h3>
            
            {isIOS ? (
              <div className="space-y-4 text-sm text-neutral-700">
                <p className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-deep-green/10 text-deep-green font-bold text-xs shrink-0">1</span>
                  <span>Appuyez sur le bouton <strong>Partager</strong> <Share className="inline w-4 h-4 text-blue-500 mx-1" /> dans la barre de navigation Safari.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-deep-green/10 text-deep-green font-bold text-xs shrink-0">2</span>
                  <span>Faites défiler vers le bas et appuyez sur <strong>Sur l'écran d'accueil</strong> <PlusSquare className="inline w-4 h-4 text-gray-500 mx-1" />.</span>
                </p>
              </div>
            ) : (
               <div className="space-y-4 text-sm text-neutral-700">
                <p>Pour installer l'application sur votre appareil :</p>
                <p className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-deep-green/10 text-deep-green font-bold text-xs shrink-0">1</span>
                  <span>Ouvrez le menu de votre navigateur (les 3 petits points en haut à droite).</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-deep-green/10 text-deep-green font-bold text-xs shrink-0">2</span>
                  <span>Sélectionnez <strong>"Ajouter à l'écran d'accueil"</strong> ou <strong>"Installer l'application"</strong>.</span>
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full rounded-full bg-charcoal py-3 text-xs tracking-wider uppercase font-bold text-linen hover:bg-opacity-90 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
