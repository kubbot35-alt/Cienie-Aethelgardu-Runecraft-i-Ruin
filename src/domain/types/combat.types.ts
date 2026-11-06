export type RuneCardType = 'attack' | 'shield' | 'curse' | 'heal' | 'time_loop';

export interface RuneCard {
  readonly id: string;
  readonly name: string;
  readonly type: RuneCardType;
  readonly etherCost: number;
  readonly bloodCost: number;
  readonly value: number;
  readonly description: string;
  readonly symbol: string;
}

export type EnemyIntentType = 'attack' | 'heavy_attack' | 'shield' | 'drain';

export interface EnemyIntent {
  readonly type: EnemyIntentType;
  readonly value: number;
  readonly description: string;
}

export interface Combatant {
  readonly id: string;
  readonly name: string;
  readonly isPlayer: boolean;
  hp: number;
  maxHp: number;
  shield: number;
  ether: number;
  maxEther: number;
  currentIntent?: EnemyIntent;
}

export interface CombatState {
  player: Combatant;
  enemy: Combatant;
  hand: RuneCard[];
  drawPile: RuneCard[];
  discardPile: RuneCard[];
  turnCount: number;
  isPlayerTurn: boolean;
  isFinished: boolean;
  isVictory: boolean;
  logs: string[];
}
