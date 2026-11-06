import { Direction, MapTile, Position, PlayerStats } from '../types/game.types';

export interface MoveResult {
  readonly success: boolean;
  readonly newPosition: Position;
  readonly steppedOnTile: MapTile;
  readonly eventTriggered?: 'puzzle_solved' | 'gate_unlocked' | 'combat_encounter' | 'dialogue_start';
}

export interface IGameEngine {
  getPlayerPosition(): Position;
  getPlayerStats(): PlayerStats;
  getMapGrid(): readonly (readonly MapTile[])[];
  movePlayer(direction: Direction): MoveResult;
  interact(): string | null;
  resetMap(): void;
  isPuzzleCompleted(): boolean;
  modifyStats(delta: Partial<PlayerStats>): void;
}
