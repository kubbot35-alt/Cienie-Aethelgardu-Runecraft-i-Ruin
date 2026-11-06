import { Language } from '../../domain/types/game.types';

export interface AppTranslation {
  gameTitle: string;
  startAdventure: string;
  resumeGame: string;
  inventory: string;
  crafting: string;
  adminDashboard: string;
  store: string;
  achievements: string;
  offlineMode: string;
  cloudSync: string;
  biometricLogin: string;
  twoFactorAuth: string;
  gdprExport: string;
  gdprForget: string;
  weatherTitle: string;
  combatVictory: string;
  combatDefeat: string;
  fleeCombat: string;
  endTurn: string;
  health: string;
  ether: string;
  shield: string;
  blood: string;
  puzzleSolvedAlert: string;
}

export const translations: Record<Language, AppTranslation> = {
  pl: {
    gameTitle: 'Shadows of Aethelgard',
    startAdventure: 'Rozpocznij Wyprawę',
    resumeGame: 'Kontynuuj',
    inventory: 'Ekwipunek',
    crafting: 'Rzemiosło',
    adminDashboard: 'Panel Administratora',
    store: 'Skarbiec / Subskrypcje',
    achievements: 'Osiągnięcia',
    offlineMode: 'Tryb Offline',
    cloudSync: 'Synchronizuj z Chmurą',
    biometricLogin: 'Logowanie Biometryczne',
    twoFactorAuth: 'Weryfikacja 2FA',
    gdprExport: 'Eksport Danych (CSV)',
    gdprForget: 'Prawo do Bycia Zapomnianym',
    weatherTitle: 'Warunki Atmosferyczne',
    combatVictory: 'Zwycięstwo!',
    combatDefeat: 'Porażka...',
    fleeCombat: 'Uciekaj',
    endTurn: 'Zakończ Turę',
    health: 'Życie',
    ether: 'Eter',
    shield: 'Tarcza',
    blood: 'Krew',
    puzzleSolvedAlert: 'Pradawna Brama została otwarta! Wszystkie runy zapłonęły.',
  },
  en: {
    gameTitle: 'Shadows of Aethelgard',
    startAdventure: 'Begin Journey',
    resumeGame: 'Resume',
    inventory: 'Inventory',
    crafting: 'Crafting',
    adminDashboard: 'Admin Dashboard',
    store: 'Sanctum Vault / Store',
    achievements: 'Achievements',
    offlineMode: 'Offline Mode',
    cloudSync: 'Cloud Sync',
    biometricLogin: 'Biometric Login',
    twoFactorAuth: '2FA Verification',
    gdprExport: 'Export Data (CSV)',
    gdprForget: 'GDPR Right to be Forgotten',
    weatherTitle: 'Weather Anomaly',
    combatVictory: 'Victory!',
    combatDefeat: 'Defeat...',
    fleeCombat: 'Flee',
    endTurn: 'End Turn',
    health: 'Health',
    ether: 'Ether',
    shield: 'Shield',
    blood: 'Blood',
    puzzleSolvedAlert: 'The Ancient Gate has unlocked! All rune pillars are ablaze.',
  },
  it: {
    gameTitle: 'Shadows of Aethelgard',
    startAdventure: 'Inizia Avventura',
    resumeGame: 'Continua',
    inventory: 'Inventario',
    crafting: 'Creazione Runica',
    adminDashboard: 'Pannello Admin',
    store: 'Tesoro / Negozio',
    achievements: 'Obiettivi',
    offlineMode: 'Modalità Offline',
    cloudSync: 'Sincronizza Cloud',
    biometricLogin: 'Accesso Biometrico',
    twoFactorAuth: 'Verifica 2FA',
    gdprExport: 'Esporta Dati (CSV)',
    gdprForget: 'Diritto all\'Oblio (GDPR)',
    weatherTitle: 'Anomalia Climatica',
    combatVictory: 'Vittoria!',
    combatDefeat: 'Sconfitta...',
    fleeCombat: 'Fuggi',
    endTurn: 'Fine Turno',
    health: 'Vita',
    ether: 'Etere',
    shield: 'Scudo',
    blood: 'Sangue',
    puzzleSolvedAlert: 'Il Cancello Antico è aperto! Tutte le rune risplendono.',
  },
};
