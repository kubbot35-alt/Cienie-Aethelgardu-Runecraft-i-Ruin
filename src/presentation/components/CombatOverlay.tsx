import React from 'react';
import { CombatState } from '../../domain/types/combat.types';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface CombatOverlayProps {
  combatState: CombatState;
  t: AppTranslation;
  onPlayCard: (cardId: string) => void;
  onEndTurn: () => void;
  onFlee: () => void;
  onLeaveCombat: () => void;
}

export const CombatOverlay: React.FC<CombatOverlayProps> = ({
  combatState,
  t,
  onPlayCard,
  onEndTurn,
  onFlee,
  onLeaveCombat,
}) => {
  const { player, enemy, hand, isPlayerTurn, isFinished, isVictory, logs } = combatState;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/90 flex flex-col justify-between p-4 max-w-4xl mx-auto backdrop-blur-sm">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-amber-500">{enemy.name}</h2>
          <div className="text-xs text-rose-400 mt-0.5">
            {enemy.currentIntent ? `Zamiar: ${enemy.currentIntent.description}` : 'Oczekuje...'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-slate-300">HP: {enemy.hp} / {enemy.maxHp}</div>
          <div className="text-xs font-mono text-sky-400">{t.shield}: {enemy.shield}</div>
        </div>
      </div>

      <div className="my-auto py-2">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3 max-h-36 overflow-y-auto space-y-1 font-mono text-xs text-slate-300">
          {logs.slice(-5).map((log, idx) => (
            <div key={idx} className="leading-relaxed">› {log}</div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono px-1">
          <div>Runomistrz · {t.health}: <span className="text-emerald-400">{player.hp}/{player.maxHp}</span></div>
          <div>{t.ether}: <span className="text-sky-400">{player.ether}/{player.maxEther}</span> · {t.shield}: <span className="text-amber-400">{player.shield}</span></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {hand.map((card) => {
            const canAfford = player.ether >= card.etherCost && isPlayerTurn && !isFinished;
            return (
              <button
                key={card.id}
                onClick={() => onPlayCard(card.id)}
                disabled={!canAfford}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  canAfford
                    ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 shadow-lg'
                    : 'bg-slate-950/50 border-slate-900 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-base">{card.symbol}</span>
                  <span className="text-xs font-mono text-sky-400">{card.etherCost} {t.ether}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1">{card.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{card.description}</div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 pt-1">
          {isFinished ? (
            <button
              onClick={onLeaveCombat}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold shadow-md transition ${
                isVictory ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-700 hover:bg-rose-600 text-white'
              }`}
            >
              {isVictory ? t.combatVictory : t.combatDefeat} — {t.resumeGame}
            </button>
          ) : (
            <>
              <button
                onClick={onEndTurn}
                disabled={!isPlayerTurn}
                className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold uppercase tracking-wider transition disabled:opacity-40"
              >
                {t.endTurn}
              </button>
              <button
                onClick={onFlee}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                {t.fleeCombat}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
