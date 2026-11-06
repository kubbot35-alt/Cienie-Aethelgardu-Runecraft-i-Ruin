import { ActivityAnalytics } from '../types/security.types';

export interface IAnalyticsService {
  getAnalytics(): ActivityAnalytics;
  incrementSteps(): void;
  incrementPuzzles(): void;
  incrementCombats(): void;
  incrementCrafts(): void;
  incrementMoralDecisions(): void;
  tickSessionTime(seconds: number): void;
  exportCsv(): string;
}
