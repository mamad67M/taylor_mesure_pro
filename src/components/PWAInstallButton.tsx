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

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center justify-center gap-2 rounded-full bg-deep-green px-4 py-2 text-xs font-bold uppercase tracking-wider text-linen shadow-sm hover:bg-opacity-90 transition-colors w-full sm:w-auto"
      >
        <Download className="w-4 h-4" />
        Installer l'Application
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center justify-center gap-2 rounded-full border border-sand-border bg-linen px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal hover:bg-sand-border/40 transition-colors w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          Installer (iOS)
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-linen p-6 shadow-2xl border border-sand-border">
              <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Installer sur iPhone / iPad</h3>
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
  }

  return null;
};
