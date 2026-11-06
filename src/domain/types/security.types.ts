export type AuthMethod = 'guest' | 'webauthn_biometric' | 'totp_2fa';

export interface UserProfile {
  readonly id: string;
  readonly username: string;
  readonly createdAt: string;
  authMethod: AuthMethod;
  has2FaEnabled: boolean;
  twoFactorSecret?: string;
  biometricCredentialId?: string;
  lastLogin: string;
  gdprConsentDate: string;
}

export interface AuditLogEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly action: string;
  readonly details: string;
  readonly ipHash: string;
}

export interface Achievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  unlockedAt: string | null;
  readonly secretCondition?: string;
}

export interface ActivityAnalytics {
  sessionDurationSeconds: number;
  stepsTaken: number;
  puzzlesSolved: number;
  combatsWon: number;
  itemsCrafted: number;
  moralDecisionsMade: number;
}
