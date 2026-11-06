import React from 'react';
import { InventoryState } from '../../domain/types/crafting.types';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface InventoryHUDProps {
  inventory: InventoryState;
  t: AppTranslation;
  onUseItem?: (itemId: string) => void;
  onClose: () => void;
}

export const InventoryHUD: React.FC<InventoryHUDProps> = ({
  inventory,
  t,
  onUseItem,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <h3 className="text-base font-bold text-amber-400">{t.inventory}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-amber-300">Zloto: {inventory.gold}</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto">
          {inventory.slots.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-500">
              Twój plecak jest pusty. Zbadaj ruiny lub skrzynie.
            </div>
          ) : (
            inventory.slots.map((slot) => (
              <div
                key={slot.item.id}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-200">{slot.item.name}</span>
                    <span className="text-[11px] font-mono text-amber-400">x{slot.quantity}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{slot.item.description}</p>
                </div>
                {slot.item.category === 'potion' && (
                  <button
                    onClick={() => onUseItem?.(slot.item.id)}
                    className="mt-2 w-full py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-semibold transition"
                  >
                    Uzyj
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
