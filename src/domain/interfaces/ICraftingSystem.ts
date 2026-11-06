import { CraftingRecipe, InventoryState, ItemResource } from '../types/crafting.types';

export interface CraftResult {
  readonly success: boolean;
  readonly message: string;
  readonly createdItem?: ItemResource;
}

export interface ICraftingSystem {
  getInventory(): InventoryState;
  getRecipes(): readonly CraftingRecipe[];
  canCraft(recipeId: string): boolean;
  craft(recipeId: string): CraftResult;
  addItem(item: ItemResource, quantity?: number): boolean;
  removeItem(itemId: string, quantity?: number): boolean;
}
