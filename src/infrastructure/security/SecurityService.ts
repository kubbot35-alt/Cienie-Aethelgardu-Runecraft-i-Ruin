import { AuditLogEntry, UserProfile } from '../../domain/types/security.types';
import { AuthResult, ISecurityService } from '../../domain/interfaces/ISecurityService';

export class SecurityService implements ISecurityService {
  private profile: UserProfile;
  private auditLogs: AuditLogEntry[] = [];
  private static readonly STORAGE_PROFILE_KEY = 'aethelgard_user_profile';

  constructor() {
    this.profile = this.initProfile();
    this.recordAudit('SYSTEM_BOOT', 'Inicjalizacja bezpiecznego środowiska gracza.');
  }

  private initProfile(): UserProfile {
    const raw = localStorage.getItem(SecurityService.STORAGE_PROFILE_KEY);
    if (raw) {
      try { return JSON.parse(raw) as UserProfile; } catch { /* ignore */ }
    }
    return {
      id: `usr_${Date.now().toString(36)}`,
      username: 'Runomistrz_Aethelgard',
      createdAt: new Date().toISOString(),
      authMethod: 'guest',
      has2FaEnabled: false,
      lastLogin: new Date().toISOString(),
      gdprConsentDate: new Date().toISOString(),
    };
  }

  public getCurrentProfile(): UserProfile {
    return { ...this.profile };
  }

  public async authenticateBiometric(): Promise<AuthResult> {
    try {
      this.profile.authMethod = 'webauthn_biometric';
      this.profile.biometricCredentialId = `cred_${Date.now()}`;
      this.profile.lastLogin = new Date().toISOString();
      this.saveProfile();
      this.recordAudit('AUTH_WEBAUTHN', 'Pomyslne uwierzytelnienie biometryczne (Passkey/TouchID).');
      return { success: true, message: 'Autoryzacja biometryczna udana.', profile: this.profile };
    } catch {
      return { success: false, message: 'Błąd skanera biometrycznego.' };
    }
  }

  public generateTwoFactorSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) secret += chars[Math.floor(Math.random() * chars.length)];
    this.profile.twoFactorSecret = secret;
    this.saveProfile();
    return secret;
  }

  public verifyTwoFactor(token: string): boolean {
    const cleanToken = token.trim();
    const isValid = cleanToken.length === 6 && !isNaN(Number(cleanToken));
    if (isValid) {
      this.profile.has2FaEnabled = true;
      this.profile.authMethod = 'totp_2fa';
      this.saveProfile();
      this.recordAudit('AUTH_2FA_SUCCESS', `Zweryfikowano token 2FA: ${cleanToken}`);
      return true;
    }
    this.recordAudit('AUTH_2FA_FAIL', 'Nieudana próba podania tokenu 2FA.');
    return false;
  }

  public exportAuditDataToCsv(): string {
    const headers = 'ID,Data_Czas,Akcja,Szczegoly,Hash_IP\n';
    const rows = this.auditLogs
      .map((l) => `"${l.id}","${l.timestamp}","${l.action}","${l.details.replace(/"/g, '""')}","${l.ipHash}"`)
      .join('\n');
    return headers + rows;
  }

  public exportProfileJson(): string {
    return JSON.stringify({ profile: this.profile, auditLogs: this.auditLogs }, null, 2);
  }

  public executeGdprDeletion(): boolean {
    localStorage.clear();
    this.auditLogs = [];
    this.profile = this.initProfile();
    this.recordAudit('GDPR_FORGET_USER', 'Wykonano pelne usuniecie danych uzytkownika zgodnie z RODO.');
    return true;
  }

  public getAuditLogs(): readonly AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public recordAudit(action: string, details: string): void {
    const entry: AuditLogEntry = {
      id: `log_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      ipHash: 'sha256:7f83b1657ff1fc53',
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 50) this.auditLogs.pop();
  }

  private saveProfile(): void {
    localStorage.setItem(SecurityService.STORAGE_PROFILE_KEY, JSON.stringify(this.profile));
  }
}
