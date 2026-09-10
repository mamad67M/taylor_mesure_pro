import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { Scissors, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot_password';

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas.');
        }
        if (password.length < 6) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: fullName
          });
        }
      } else if (mode === 'forgot_password') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Un email de réinitialisation a été envoyé à votre adresse.');
        setMode('login'); // switch back to login
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Les mots de passe ne correspondent pas.' || err.message === 'Le mot de passe doit contenir au moins 6 caractères.') {
        setError(err.message);
      } else {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Adresse email invalide.');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setError('Identifiants incorrects.');
            break;
          case 'auth/email-already-in-use':
            setError('Un compte existe déjà avec cet email.');
            break;
          case 'auth/weak-password':
            setError('Le mot de passe est trop faible (min. 6 caractères).');
            break;
          default:
            setError('Une erreur est survenue. Veuillez vérifier vos informations.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
        
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('La connexion a été annulée.');
      } else {
        setError('Une erreur est survenue lors de la connexion Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col items-center justify-center p-4 selection:bg-[#D4A017]/30">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 p-2 rounded-full bg-white shadow-sm text-[#0D1B2A] hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 border border-[#0D1B2A]/5">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#0D1B2A] text-[#D4A017] p-2 rounded-xl shadow-lg">
              <Scissors size={24} />
            </div>
            <h2 className="text-2xl font-display font-black text-[#0D1B2A] tracking-tight">
              MesurePro
            </h2>
          </div>
          <p className="text-[#0D1B2A]/60 text-sm mt-1 text-center">
            Gérez vos commandes en toute simplicité.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {mode !== 'forgot_password' && (
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-[#0D1B2A] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-[#0D1B2A] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inscription
            </button>
          </div>
        )}

        {mode === 'forgot_password' && (
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-[#0D1B2A] mb-2">Mot de passe oublié ?</h3>
            <p className="text-sm text-gray-500">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Amadou Fall"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] outline-none transition"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@entreprise.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] outline-none transition"
              required
            />
          </div>

          {mode !== 'forgot_password' && (
            <div className={`${mode === 'register' ? 'grid grid-cols-2 gap-4' : ''}`}>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                  {mode === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => { setMode('forgot_password'); setError(''); setSuccess(''); }} 
                      className="text-xs text-gray-500 hover:text-[#0D1B2A] transition font-medium"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? "Min. 6 car." : "••••••••"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] outline-none transition"
                  required
                  minLength={6}
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] outline-none transition"
                    required
                    minLength={6}
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D1B2A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#15273F] transition shadow-sm disabled:opacity-70 mt-2"
          >
            {loading ? 'Veuillez patienter...' : mode === 'login' ? 'Se connecter' : mode === 'register' ? 'Créer mon compte' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        {mode === 'forgot_password' && (
          <button 
            type="button" 
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }} 
            className="w-full text-center text-sm text-gray-500 mt-4 hover:text-[#0D1B2A] transition font-medium"
          >
            Retour à la connexion
          </button>
        )}

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Ou</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-200 text-[#0D1B2A] py-3.5 rounded-xl font-bold text-sm hover:border-gray-300 transition shadow-sm disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuer avec Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#0D1B2A]/40">
            En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
};
