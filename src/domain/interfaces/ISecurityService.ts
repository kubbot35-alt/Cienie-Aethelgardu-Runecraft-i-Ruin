import { AuditLogEntry, UserProfile } from '../types/security.types';

export interface AuthResult {
  readonly success: boolean;
  readonly message: string;
  readonly profile?: UserProfile;
}

export interface ISecurityService {
  getCurrentProfile(): UserProfile;
  authenticateBiometric(): Promise<AuthResult>;
  verifyTwoFactor(token: string): boolean;
  generateTwoFactorSecret(): string;
  exportAuditDataToCsv(): string;
  exportProfileJson(): string;
  executeGdprDeletion(): boolean;
  getAuditLogs(): readonly AuditLogEntry[];
  recordAudit(action: string, details: string): void;
}
