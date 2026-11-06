import React from 'react';
import { DialogueChoice, DialogueNode } from '../../domain/types/dialogue.types';
import { MoralKarma } from '../../domain/types/game.types';

interface DialogueOverlayProps {
  node: DialogueNode | null;
  karma: MoralKarma;
  onSelectChoice: (choice: DialogueChoice) => void;
  onClose: () => void;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  node,
  karma,
  onSelectChoice,
  onClose,
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-xl p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-lg">
              📜
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-400">{node.speaker}</h3>
              <div className="text-[11px] text-slate-400">Moralnosc: S+{karma.righteousness} | P+{karma.pragmatism} | E+{karma.entropy}</div>
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-200 bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80 font-serif">
          {node.text}
        </p>

        {node.isEnding ? (
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-amber-950/40 border border-amber-700/60 rounded-lg text-xs text-amber-200">
              Osiągnięto jedno z zakończeń sagi Aethelgard. Twoje wybory ukształtowały los krainy.
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition"
            >
              Powrót do eksploracji
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            {node.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onSelectChoice(choice)}
                className="w-full p-2.5 text-left text-xs text-slate-200 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition flex justify-between items-center group"
              >
                <span>{choice.text}</span>
                {choice.moralImpact && (
                  <span className="text-[10px] text-amber-400 font-mono ml-2 shrink-0">
                    {choice.moralImpact.righteousness ? `+${choice.moralImpact.righteousness} Prawość` : ''}
                    {choice.moralImpact.pragmatism ? `+${choice.moralImpact.pragmatism} Pragmatyzm` : ''}
                    {choice.moralImpact.entropy ? `+${choice.moralImpact.entropy} Entropia` : ''}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
