export type ResourceCategory = 'ore' | 'herb' | 'rune_fragment' | 'potion' | 'relic';

export interface ItemResource {
  readonly id: string;
  readonly name: string;
  readonly category: ResourceCategory;
  readonly description: string;
  readonly rarity: 'common' | 'rare' | 'mythic';
  readonly value: number;
}

export interface InventorySlot {
  readonly item: ItemResource;
  quantity: number;
}

export interface CraftingIngredient {
  readonly resourceId: string;
  readonly amount: number;
}

export interface CraftingRecipe {
  readonly id: string;
  readonly title: string;
  readonly outputItem: ItemResource;
  readonly outputQuantity: number;
  readonly ingredients: readonly CraftingIngredient[];
  readonly requiredFocus: number;
  readonly loreSnippet: string;
}

export interface InventoryState {
  readonly slots: InventorySlot[];
  gold: number;
  maxSlots: number;
}
