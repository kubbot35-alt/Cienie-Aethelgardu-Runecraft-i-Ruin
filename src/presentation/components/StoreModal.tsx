import React, { useState } from 'react';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface StoreModalProps {
  t: AppTranslation;
  onClose: () => void;
  onUnlockPass: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({ t, onClose, onUnlockPass }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulatePayment = (tierName: string) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      onUnlockPass();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <h3 className="text-base font-bold text-amber-400">{t.store}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg">✕</button>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-700/80 rounded-xl text-center space-y-2">
            <div className="text-2xl">✨</div>
            <div className="text-sm font-bold text-emerald-300">Subskrypcja Aktywna!</div>
            <p className="text-xs text-slate-300">Odblokowano legendarne runy i dodatkowe komnaty lochu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-300">Pakt Nowicjusza</div>
                <div className="text-lg font-bold text-amber-400 mt-1">19.99 PLN / mc</div>
                <p className="text-[11px] text-slate-400 mt-2">Dostęp do chmury, 3 dodatkowe eliksiry w każdej wyprawie.</p>
              </div>
              <button
                onClick={() => handleSimulatePayment('Pakt Nowicjusza')}
                disabled={processing}
                className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
              >
                {processing ? 'Przetwarzanie...' : 'Wybierz Bramkę'}
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-amber-600/60 rounded-xl flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-950 px-2 py-0.5 rounded">Polecane</span>
                <div className="text-xs font-semibold text-slate-100 mt-1">Przebudzenie Przedwiecznych</div>
                <div className="text-lg font-bold text-amber-400 mt-1">39.99 PLN / mc</div>
                <p className="text-[11px] text-slate-400 mt-2">Wszystkie rozdziały, ekskluzywne runy czasu, nielimitowany zapis chmurowy.</p>
              </div>
              <button
                onClick={() => handleSimulatePayment('Przebudzenie Przedwiecznych')}
                disabled={processing}
                className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition shadow-md"
              >
                {processing ? 'Łączenie z bramką...' : 'Aktywuj Subskrypcję'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
