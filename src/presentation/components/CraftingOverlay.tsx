import React from 'react';
import { CraftingRecipe, InventoryState } from '../../domain/types/crafting.types';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface CraftingOverlayProps {
  recipes: readonly CraftingRecipe[];
  inventory: InventoryState;
  t: AppTranslation;
  onCraft: (recipeId: string) => void;
  onClose: () => void;
}

export const CraftingOverlay: React.FC<CraftingOverlayProps> = ({
  recipes,
  inventory,
  t,
  onCraft,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚒️</span>
            <h3 className="text-base font-bold text-amber-400">{t.crafting}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {recipes.map((recipe) => {
            const canCraft = recipe.ingredients.every((ing) => {
              const slot = inventory.slots.find((s) => s.item.id === ing.resourceId);
              return slot && slot.quantity >= ing.amount;
            });

            return (
              <div
                key={recipe.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-200">{recipe.title}</div>
                  <div className="text-xs text-slate-400">{recipe.loreSnippet}</div>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                    {recipe.ingredients.map((ing) => {
                      const slot = inventory.slots.find((s) => s.item.id === ing.resourceId);
                      const current = slot ? slot.quantity : 0;
                      const hasEnough = current >= ing.amount;
                      return (
                        <span
                          key={ing.resourceId}
                          className={`px-2 py-0.5 rounded ${hasEnough ? 'bg-slate-800 text-emerald-400' : 'bg-rose-950/60 text-rose-400'}`}
                        >
                          {ing.resourceId.replace('herb_', '').replace('crystal_', '').replace('ore_', '')}: {current}/{ing.amount}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => onCraft(recipe.id)}
                  disabled={!canCraft}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    canCraft
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Wytwórz
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
