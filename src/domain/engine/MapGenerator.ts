import { MapTile, TileType } from '../types/game.types';

export class MapGenerator {
  public static readonly MAP_WIDTH = 18;
  public static readonly MAP_HEIGHT = 14;

  public static createDefaultDungeon(): MapTile[][] {
    const grid: MapTile[][] = [];
    for (let y = 0; y < this.MAP_HEIGHT; y++) {
      const row: MapTile[] = [];
      for (let x = 0; x < this.MAP_WIDTH; x++) {
        row.push(this.createTileAt(x, y));
      }
      grid.push(row);
    }
    return grid;
  }

  private static createTileAt(x: number, y: number): MapTile {
    const isBoundary = x === 0 || y === 0 || x === this.MAP_WIDTH - 1 || y === this.MAP_HEIGHT - 1;
    if (isBoundary) {
      return this.buildTile(x, y, 'wall', false);
    }
    const specialTile = this.getSpecialTileType(x, y);
    if (specialTile) {
      return this.buildTile(x, y, specialTile.type, specialTile.walkable);
    }
    return this.buildTile(x, y, 'floor', true);
  }

  private static getSpecialTileType(x: number, y: number): { type: TileType; walkable: boolean } | null {
    if ((x === 6 && y === 4) || (x === 6 && y === 9)) return { type: 'wall', walkable: false };
    if ((x === 11 && y === 4) || (x === 11 && y === 9)) return { type: 'wall', walkable: false };
    if (x === 4 && y === 3) return { type: 'plate', walkable: true };
    if (x === 4 && y === 10) return { type: 'plate', walkable: true };
    if (x === 8 && y === 7) return { type: 'plate', walkable: true };
    if (x === 12 && y === 4) return { type: 'pillar_inactive', walkable: false };
    if (x === 12 && y === 9) return { type: 'pillar_inactive', walkable: false };
    if (x === 14 && y === 7) return { type: 'gate_closed', walkable: false };
    if (x === 16 && y === 7) return { type: 'stairs', walkable: true };
    if (x === 10 && y === 2) return { type: 'chest', walkable: true };
    if (x === 10 && y === 11) return { type: 'water', walkable: false };
    return null;
  }

  private static buildTile(x: number, y: number, type: TileType, walkable: boolean): MapTile {
    return {
      id: `tile_${x}_${y}`,
      x,
      y,
      type,
      walkable,
      lightLevel: 1.0,
    };
  }
}
