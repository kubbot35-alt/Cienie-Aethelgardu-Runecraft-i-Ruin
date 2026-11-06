import React, { useState } from 'react';
import { UserProfile } from '../../domain/types/security.types';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface SecurityAuthModalProps {
  profile: UserProfile;
  t: AppTranslation;
  onBiometricAuth: () => Promise<void>;
  onGenerate2FaSecret: () => string;
  onVerify2FaToken: (token: string) => boolean;
  onClose: () => void;
}

export const SecurityAuthModal: React.FC<SecurityAuthModalProps> = ({
  profile,
  t,
  onBiometricAuth,
  onGenerate2FaSecret,
  onVerify2FaToken,
  onClose,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleBiometric = async () => {
    setMessage('Autoryzacja biometryczna w toku...');
    await onBiometricAuth();
    setMessage('Pomyślnie uwierzytelniono biometrycznie.');
  };

  const handleGenSecret = () => {
    const s = onGenerate2FaSecret();
    setTotpSecret(s);
    setMessage(`Wygenerowano nowy klucz 2FA: ${s}`);
  };

  const handleVerify = () => {
    const success = onVerify2FaToken(tokenInput);
    if (success) {
      setMessage('Kod 2FA poprawny! Ochrona dwuetapowa aktywna.');
      setTokenInput('');
    } else {
      setMessage('Błąd weryfikacji kodu 2FA. Wymagane 6 cyfr.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-amber-400">Centrum Bezpieczeństwa Gracza</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg">✕</button>
        </div>

        {message && (
          <div className="p-2.5 bg-slate-950 border border-slate-800 text-xs text-amber-300 rounded-lg font-mono">
            › {message}
          </div>
        )}

        <div className="space-y-3">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="text-xs font-semibold text-slate-200">1. {t.biometricLogin} (WebAuthn / Passkey)</div>
            <p className="text-[11px] text-slate-400">Zabezpiecz zapisy gry kluczem sprzętowym lub biometrią.</p>
            <button
              onClick={handleBiometric}
              className="w-full py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              👆 Zaloguj / Odcisk Palca
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="text-xs font-semibold text-slate-200">2. {t.twoFactorAuth} (TOTP)</div>
            <p className="text-[11px] text-slate-400">Wygeneruj sekret i wpisz 6-cyfrowy kod uwierzytelniający.</p>
            <button
              onClick={handleGenSecret}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
            >
              Generuj Klucz TOTP
            </button>
            {totpSecret && (
              <div className="text-center font-mono text-xs text-amber-400 py-1 bg-black/40 rounded">
                Klucz: {totpSecret}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                maxLength={6}
                placeholder="np. 482910"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 bg-black/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none font-mono"
              />
              <button
                onClick={handleVerify}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Weryfikuj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
