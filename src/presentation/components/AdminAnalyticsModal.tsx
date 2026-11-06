import React from 'react';
import { ActivityAnalytics, AuditLogEntry, UserProfile } from '../../domain/types/security.types';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface AdminAnalyticsModalProps {
  analytics: ActivityAnalytics;
  profile: UserProfile;
  auditLogs: readonly AuditLogEntry[];
  t: AppTranslation;
  onExportCsv: () => void;
  onExportAuditCsv: () => void;
  onForgetMe: () => void;
  onClose: () => void;
}

export const AdminAnalyticsModal: React.FC<AdminAnalyticsModalProps> = ({
  analytics,
  profile,
  auditLogs,
  t,
  onExportCsv,
  onExportAuditCsv,
  onForgetMe,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <div>
              <h3 className="text-base font-bold text-amber-400">{t.adminDashboard}</h3>
              <p className="text-[11px] text-slate-400">Audyt bezpieczeństwa, telemetria i RODO</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg">✕</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400">Czas Sesji</div>
            <div className="text-base font-mono font-bold text-slate-200 mt-1">{analytics.sessionDurationSeconds}s</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400">Wykonane Kroki</div>
            <div className="text-base font-mono font-bold text-sky-400 mt-1">{analytics.stepsTaken}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400">Zagadki Rozwiązane</div>
            <div className="text-base font-mono font-bold text-emerald-400 mt-1">{analytics.puzzlesSolved}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400">Wygrane Walki</div>
            <div className="text-base font-mono font-bold text-amber-400 mt-1">{analytics.combatsWon}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400">Decyzje Moralne</div>
            <div className="text-base font-mono font-bold text-purple-400 mt-1">{analytics.moralDecisionsMade}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400">Metoda Logowania</div>
            <div className="text-xs font-mono font-bold text-slate-300 mt-1 truncate">{profile.authMethod}</div>
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/70 space-y-2">
          <div className="text-xs font-semibold text-slate-300">Zgodność z RODO / GDPR & Eksport Danych</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExportCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
            >
              📥 Eksport Telemetrii (CSV)
            </button>
            <button
              onClick={onExportAuditCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
            >
              📥 Eksport Audytu Logów (CSV)
            </button>
            <button
              onClick={onForgetMe}
              className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-medium rounded-lg transition ml-auto"
            >
              🗑️ {t.gdprForget}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-400">Dziennik Zdarzeń Bezpieczeństwa (Ostatnie)</div>
          <div className="max-h-36 overflow-y-auto bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] text-slate-400 space-y-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex justify-between gap-2 border-b border-slate-900 pb-1">
                <span className="text-sky-400 shrink-0">[{log.action}]</span>
                <span className="text-slate-300 truncate">{log.details}</span>
                <span className="text-slate-600 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
