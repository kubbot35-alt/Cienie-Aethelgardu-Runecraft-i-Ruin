import { CombatState, RuneCard } from '../types/combat.types';

export interface ICombatEngine {
  getState(): CombatState;
  startEncounter(enemyName?: string, enemyHp?: number): CombatState;
  playCard(cardId: string): CombatState;
  endPlayerTurn(): CombatState;
  flee(): boolean;
  getAvailableCards(): readonly RuneCard[];
}
