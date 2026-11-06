import { CraftingRecipe, InventorySlot, InventoryState, ItemResource } from '../types/crafting.types';
import { CraftResult, ICraftingSystem } from '../interfaces/ICraftingSystem';

export class CraftingSystem implements ICraftingSystem {
  private inventory: InventoryState;
  private readonly recipes: readonly CraftingRecipe[];

  constructor() {
    this.inventory = {
      gold: 50,
      maxSlots: 12,
      slots: [
        { item: { id: 'herb_bloodmoss', name: 'Krwawy Mech', category: 'herb', description: 'Rzadki mech rosnacy na zwiastunach cierpienia.', rarity: 'common', value: 5 }, quantity: 4 },
        { item: { id: 'crystal_ether', name: 'Krysztal Eteru', category: 'rune_fragment', description: 'Świetlisty odłamek skondensowanej energii.', rarity: 'rare', value: 15 }, quantity: 3 },
        { item: { id: 'ore_mithril', name: 'Ruda Obsydianu', category: 'ore', description: 'Twardy, ciemny mineral odporny na magie.', rarity: 'common', value: 8 }, quantity: 2 },
      ],
    };

    this.recipes = [
      {
        id: 'r_potion',
        title: 'Eliksir Odrodzenia',
        outputItem: { id: 'pot_life', name: 'Eliksir Odrodzenia', category: 'potion', description: 'Przywraca 40 punktow zycia.', rarity: 'rare', value: 30 },
        outputQuantity: 1,
        ingredients: [{ resourceId: 'herb_bloodmoss', amount: 2 }, { resourceId: 'crystal_ether', amount: 1 }],
        requiredFocus: 5,
        loreSnippet: 'Alchemiczny destylat stosowany przez kaplanow Przedwiecznych.',
      },
      {
        id: 'r_ward',
        title: 'Glif Obronny',
        outputItem: { id: 'relic_ward', name: 'Glif Obronny', category: 'relic', description: 'Zwieksza tarcze o 30 w pierwszej turze.', rarity: 'rare', value: 45 },
        outputQuantity: 1,
        ingredients: [{ resourceId: 'ore_mithril', amount: 2 }, { resourceId: 'crystal_ether', amount: 2 }],
        requiredFocus: 8,
        loreSnippet: 'Wykuty w chlodzie ruin talizman odbijajacy mrok.',
      },
    ];
  }

  public getInventory(): InventoryState {
    return this.inventory;
  }

  public getRecipes(): readonly CraftingRecipe[] {
    return this.recipes;
  }

  public canCraft(recipeId: string): boolean {
    const recipe = this.recipes.find((r) => r.id === recipeId);
    if (!recipe) return false;
    return recipe.ingredients.every((ing) => {
      const slot = this.inventory.slots.find((s) => s.item.id === ing.resourceId);
      return slot && slot.quantity >= ing.amount;
    });
  }

  public craft(recipeId: string): CraftResult {
    const recipe = this.recipes.find((r) => r.id === recipeId);
    if (!recipe || !this.canCraft(recipeId)) {
      return { success: false, message: 'Brak wymaganych skladnikow lub receptury.' };
    }
    recipe.ingredients.forEach((ing) => this.removeItem(ing.resourceId, ing.amount));
    this.addItem(recipe.outputItem, recipe.outputQuantity);
    return { success: true, message: `Pomyślnie wytworzono: ${recipe.outputItem.name}`, createdItem: recipe.outputItem };
  }

  public addItem(item: ItemResource, quantity = 1): boolean {
    const existing = this.inventory.slots.find((s) => s.item.id === item.id);
    if (existing) {
      existing.quantity += quantity;
      return true;
    }
    if (this.inventory.slots.length >= this.inventory.maxSlots) return false;
    this.inventory.slots.push({ item, quantity });
    return true;
  }

  public removeItem(itemId: string, quantity = 1): boolean {
    const slotIndex = this.inventory.slots.findIndex((s) => s.item.id === itemId);
    if (slotIndex === -1) return false;
    const slot = this.inventory.slots[slotIndex];
    if (slot.quantity < quantity) return false;
    slot.quantity -= quantity;
    if (slot.quantity <= 0) {
      this.inventory.slots.splice(slotIndex, 1);
    }
    return true;
  }
}
