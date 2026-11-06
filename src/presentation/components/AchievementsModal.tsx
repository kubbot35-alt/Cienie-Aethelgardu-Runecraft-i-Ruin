import React, { useState } from 'react';
import { Achievement } from '../../domain/types/security.types';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface AchievementsModalProps {
  achievements: readonly Achievement[];
  t: AppTranslation;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, t, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (achievement: Achievement) => {
    const text = `Osiągnięcie odblokowane w Shadows of Aethelgard: ${achievement.title}! Sprawdź swoje siły w mrocznym RPG.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Shadows of Aethelgard', text, url: window.location.href });
        return;
      } catch { /* ignore */ }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="text-base font-bold text-amber-400">{t.achievements}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg">✕</button>
        </div>

        {copied && (
          <div className="p-2 bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 rounded-lg text-center font-mono">
            Skopiowano treść osiągnięcia do schowka do udostępnienia!
          </div>
        )}

        <div className="space-y-2.5 max-h-80 overflow-y-auto">
          {achievements.map((ach) => {
            const unlocked = Boolean(ach.unlockedAt);
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                  unlocked ? 'bg-slate-950/70 border-slate-700' : 'bg-slate-950/30 border-slate-900 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{ach.title}</div>
                    <div className="text-[11px] text-slate-400">{ach.description}</div>
                  </div>
                </div>

                {unlocked && (
                  <button
                    onClick={() => handleShare(ach)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg transition shrink-0"
                  >
                    Udostępnij
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
