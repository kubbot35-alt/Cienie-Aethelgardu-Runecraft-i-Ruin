export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  readonly x: number;
  readonly y: number;
}

export type TileType =
  | 'floor'
  | 'wall'
  | 'water'
  | 'plate'
  | 'gate_closed'
  | 'gate_open'
  | 'pillar_inactive'
  | 'pillar_active'
  | 'chest'
  | 'stairs';

export interface MapTile {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  type: TileType;
  walkable: boolean;
  lightLevel: number;
}

export type WeatherType = 'clear' | 'acid_rain' | 'shadow_fog' | 'ash_storm';

export interface WeatherCondition {
  readonly type: WeatherType;
  readonly name: string;
  readonly visibilityModifier: number;
  readonly combatEffectDescription: string;
  readonly staminaDrainPerStep: number;
}

export interface MoralKarma {
  righteousness: number;
  pragmatism: number;
  entropy: number;
}

export type Language = 'pl' | 'en' | 'it';

export type GameView =
  | 'title'
  | 'exploration'
  | 'combat'
  | 'dialogue'
  | 'crafting'
  | 'inventory'
  | 'admin'
  | 'store'
  | 'achievements'
  | 'ending';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  ether: number;
  maxEther: number;
  blood: number;
  focus: number;
}
