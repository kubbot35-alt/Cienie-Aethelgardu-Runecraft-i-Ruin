import { Combatant, CombatState, EnemyIntent, RuneCard } from '../types/combat.types';
import { ICombatEngine } from '../interfaces/ICombatEngine';

export class CombatEngine implements ICombatEngine {
  private state: CombatState;
  private readonly defaultCards: RuneCard[] = [
    { id: 'c1', name: 'Runiczna Lanca', type: 'attack', etherCost: 15, bloodCost: 0, value: 22, description: 'Zadaje 22 obrazen eterycznych.', symbol: '⚔️' },
    { id: 'c2', name: 'Bariera Cieni', type: 'shield', etherCost: 10, bloodCost: 0, value: 18, description: 'Daje 18 punktow oslony.', symbol: '🛡️' },
    { id: 'c3', name: 'Krwawy Pakt', type: 'curse', etherCost: 0, bloodCost: 6, value: 32, description: 'Pochlania krew, zadaje 32 obrazenia.', symbol: '🩸' },
    { id: 'c4', name: 'Petla Eteru', type: 'time_loop', etherCost: 20, bloodCost: 0, value: 16, description: 'Leczy 16 HP i regeneruje 10 Eteru.', symbol: '⏳' },
  ];

  constructor() {
    this.state = this.buildInitialState('Ghul Cieni', 75);
  }

  public getState(): CombatState {
    return this.state;
  }

  public getAvailableCards(): readonly RuneCard[] {
    return this.defaultCards;
  }

  public startEncounter(enemyName = 'Straznik Otchlani', enemyHp = 85): CombatState {
    this.state = this.buildInitialState(enemyName, enemyHp);
    return this.state;
  }

  private buildInitialState(enemyName: string, enemyHp: number): CombatState {
    const enemyIntent: EnemyIntent = { type: 'attack', value: 16, description: 'Przygotowuje uderzenie cienistym szponem (16 obrazen)' };
    return {
      player: { id: 'player', name: 'Runomistrz', isPlayer: true, hp: 90, maxHp: 100, shield: 0, ether: 45, maxEther: 60 },
      enemy: { id: 'enemy_1', name: enemyName, isPlayer: false, hp: enemyHp, maxHp: enemyHp, shield: 0, ether: 30, maxEther: 30, currentIntent: enemyIntent },
      hand: [...this.defaultCards],
      drawPile: [],
      discardPile: [],
      turnCount: 1,
      isPlayerTurn: true,
      isFinished: false,
      isVictory: false,
      logs: [`Napotkano wroga: ${enemyName}! Gotowy do walki turowej.`],
    };
  }

  public playCard(cardId: string): CombatState {
    if (!this.state.isPlayerTurn || this.state.isFinished) return this.state;
    const card = this.state.hand.find((c) => c.id === cardId);
    if (!card || this.state.player.ether < card.etherCost) return this.state;

    this.state.player.ether -= card.etherCost;
    this.applyCardEffect(card);
    this.checkBattleStatus();
    return this.state;
  }

  private applyCardEffect(card: RuneCard): void {
    if (card.type === 'attack' || card.type === 'curse') {
      const remainingDamage = Math.max(0, card.value - this.state.enemy.shield);
      this.state.enemy.shield = Math.max(0, this.state.enemy.shield - card.value);
      this.state.enemy.hp = Math.max(0, this.state.enemy.hp - remainingDamage);
      this.state.logs.push(`Zagrano [${card.name}]: wróg otrzymuje ${card.value} obrażeń!`);
    } else if (card.type === 'shield') {
      this.state.player.shield += card.value;
      this.state.logs.push(`Zagrano [${card.name}]: zyskano +${card.value} osłony.`);
    } else if (card.type === 'time_loop') {
      this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + card.value);
      this.state.player.ether = Math.min(this.state.player.maxEther, this.state.player.ether + 10);
      this.state.logs.push(`Zagrano [${card.name}]: uleczono ${card.value} HP i odzyskano eter.`);
    }
  }

  public endPlayerTurn(): CombatState {
    if (!this.state.isPlayerTurn || this.state.isFinished) return this.state;
    this.state.isPlayerTurn = false;
    this.executeEnemyAction();
    this.prepareNextTurn();
    this.checkBattleStatus();
    return this.state;
  }

  private executeEnemyAction(): void {
    const intent = this.state.enemy.currentIntent;
    if (!intent) return;
    if (intent.type === 'attack' || intent.type === 'heavy_attack') {
      const damage = Math.max(0, intent.value - this.state.player.shield);
      this.state.player.shield = Math.max(0, this.state.player.shield - intent.value);
      this.state.player.hp = Math.max(0, this.state.player.hp - damage);
      this.state.logs.push(`${this.state.enemy.name} atakuje za ${intent.value} obrażeń!`);
    } else if (intent.type === 'shield') {
      this.state.enemy.shield += intent.value;
      this.state.logs.push(`${this.state.enemy.name} wznosi cienistą tarczę (+${intent.value}).`);
    }
  }

  private prepareNextTurn(): void {
    this.state.turnCount++;
    this.state.isPlayerTurn = true;
    this.state.player.ether = Math.min(this.state.player.maxEther, this.state.player.ether + 15);
    this.state.player.shield = Math.floor(this.state.player.shield * 0.5);
    const intents: EnemyIntent[] = [
      { type: 'attack', value: 18, description: 'Cios widmowym ostrzem (18)' },
      { type: 'heavy_attack', value: 26, description: 'Miazdzace zaklecie ciemnosci (26)' },
      { type: 'shield', value: 16, description: 'Bariera ochronna (16)' },
    ];
    this.state.enemy.currentIntent = intents[this.state.turnCount % intents.length];
  }

  private checkBattleStatus(): void {
    if (this.state.enemy.hp <= 0) {
      this.state.isFinished = true;
      this.state.isVictory = true;
      this.state.logs.push(`Zwycięstwo! ${this.state.enemy.name} został unicestwiony.`);
    } else if (this.state.player.hp <= 0) {
      this.state.isFinished = true;
      this.state.isVictory = false;
      this.state.logs.push('Porażka... Runomistrz uległ cieniom ruin.');
    }
  }

  public flee(): boolean {
    if (this.state.player.hp > 20) {
      this.state.isFinished = true;
      this.state.logs.push('Ucieczka z pola walki zakończona powodzeniem.');
      return true;
    }
    this.state.logs.push('Wróg odciął drogę ucieczki!');
    return false;
  }
}
