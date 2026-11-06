import { ActivityAnalytics } from '../../domain/types/security.types';
import { IAnalyticsService } from '../../domain/interfaces/IAnalyticsService';

export class AnalyticsService implements IAnalyticsService {
  private analytics: ActivityAnalytics = {
    sessionDurationSeconds: 0,
    stepsTaken: 0,
    puzzlesSolved: 0,
    combatsWon: 0,
    itemsCrafted: 0,
    moralDecisionsMade: 0,
  };

  public getAnalytics(): ActivityAnalytics {
    return { ...this.analytics };
  }

  public incrementSteps(): void {
    this.analytics.stepsTaken++;
  }

  public incrementPuzzles(): void {
    this.analytics.puzzlesSolved++;
  }

  public incrementCombats(): void {
    this.analytics.combatsWon++;
  }

  public incrementCrafts(): void {
    this.analytics.itemsCrafted++;
  }

  public incrementMoralDecisions(): void {
    this.analytics.moralDecisionsMade++;
  }

  public tickSessionTime(seconds: number): void {
    this.analytics.sessionDurationSeconds += seconds;
  }

  public exportCsv(): string {
    const a = this.analytics;
    const lines = [
      'Metryka,Wartosc,Jednostka',
      `Czas_Sesji,${a.sessionDurationSeconds},sekundy`,
      `Wykonane_Kroki,${a.stepsTaken},liczba`,
      `Rozwiazane_Lamiglowki,${a.puzzlesSolved},liczba`,
      `Wygrane_Walki,${a.combatsWon},liczba`,
      `Wytworzone_Przedmioty,${a.itemsCrafted},liczba`,
      `Podjete_Decyzje_Moralne,${a.moralDecisionsMade},liczba`,
    ];
    return lines.join('\n');
  }
}
