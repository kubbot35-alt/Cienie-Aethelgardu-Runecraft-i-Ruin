import { Direction, MapTile, Position, PlayerStats } from '../types/game.types';
import { IGameEngine, MoveResult } from '../interfaces/IGameEngine';
import { MapGenerator } from './MapGenerator';

export class GameEngine implements IGameEngine {
  private playerPos: Position = { x: 2, y: 7 };
  private stats: PlayerStats = { hp: 100, maxHp: 100, ether: 60, maxEther: 60, blood: 15, focus: 10 };
  private grid: MapTile[][] = MapGenerator.createDefaultDungeon();
  private activatedPlates: Set<string> = new Set();
  private puzzleSolved = false;

  public getPlayerPosition(): Position {
    return { ...this.playerPos };
  }

  public getPlayerStats(): PlayerStats {
    return { ...this.stats };
  }

  public getMapGrid(): readonly (readonly MapTile[])[] {
    return this.grid;
  }

  public isPuzzleCompleted(): boolean {
    return this.puzzleSolved;
  }

  public modifyStats(delta: Partial<PlayerStats>): void {
    if (delta.hp !== undefined) this.stats.hp = Math.min(this.stats.maxHp, Math.max(0, this.stats.hp + delta.hp));
    if (delta.ether !== undefined) this.stats.ether = Math.min(this.stats.maxEther, Math.max(0, this.stats.ether + delta.ether));
    if (delta.blood !== undefined) this.stats.blood = Math.max(0, this.stats.blood + delta.blood);
    if (delta.focus !== undefined) this.stats.focus = Math.max(0, this.stats.focus + delta.focus);
  }

  public movePlayer(direction: Direction): MoveResult {
    const next = this.calcNextPosition(direction);
    const tile = this.grid[next.y]?.[next.x];
    if (!tile || !tile.walkable) {
      return { success: false, newPosition: this.playerPos, steppedOnTile: this.grid[this.playerPos.y][this.playerPos.x] };
    }
    this.playerPos = next;
    const event = this.evaluateSteppedTile(tile);
    return { success: true, newPosition: next, steppedOnTile: tile, eventTriggered: event };
  }

  private calcNextPosition(direction: Direction): Position {
    const deltas: Record<Direction, Position> = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    const delta = deltas[direction];
    return { x: this.playerPos.x + delta.x, y: this.playerPos.y + delta.y };
  }

  private evaluateSteppedTile(tile: MapTile): MoveResult['eventTriggered'] {
    if (tile.type === 'plate') {
      this.activatedPlates.add(`${tile.x}_${tile.y}`);
      if (this.activatedPlates.size >= 3 && !this.puzzleSolved) {
        return this.solveAncientPuzzle();
      }
    }
    if (tile.type === 'chest') return 'dialogue_start';
    if (tile.type === 'stairs') return 'combat_encounter';
    return undefined;
  }

  private solveAncientPuzzle(): MoveResult['eventTriggered'] {
    this.puzzleSolved = true;
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x].type === 'gate_closed') {
          this.grid[y][x].type = 'gate_open';
          this.grid[y][x].walkable = true;
        }
        if (this.grid[y][x].type === 'pillar_inactive') {
          this.grid[y][x].type = 'pillar_active';
        }
      }
    }
    return 'puzzle_solved';
  }

  public interact(): string | null {
    const current = this.grid[this.playerPos.y][this.playerPos.x];
    if (current.type === 'plate') return 'Runiczna plyta lekko wibruje pod Twoim ciezarem.';
    if (current.type === 'chest') return 'Starozytna skrzynia kryje zapomniane ziola i runy alchemiczne.';
    if (this.puzzleSolved) return 'Starozytna brama stoi otworem. Schody prowadza w otchlan.';
    return 'Wkolo panuje grobowa cisza i zapach wilgotnego kamienia.';
  }

  public resetMap(): void {
    this.playerPos = { x: 2, y: 7 };
    this.grid = MapGenerator.createDefaultDungeon();
    this.activatedPlates.clear();
    this.puzzleSolved = false;
  }
}
