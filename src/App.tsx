import { useEffect, useState } from 'react';
import { useGameEngine } from './presentation/hooks/useGameEngine';
import { PixelCanvasViewport } from './presentation/components/PixelCanvasViewport';
import { TopBarHeader } from './presentation/components/TopBarHeader';
import { CombatOverlay } from './presentation/components/CombatOverlay';
import { DialogueOverlay } from './presentation/components/DialogueOverlay';
import { CraftingOverlay } from './presentation/components/CraftingOverlay';
import { InventoryHUD } from './presentation/components/InventoryHUD';
import { AdminAnalyticsModal } from './presentation/components/AdminAnalyticsModal';
import { SecurityAuthModal } from './presentation/components/SecurityAuthModal';
import { StoreModal } from './presentation/components/StoreModal';
import { AchievementsModal } from './presentation/components/AchievementsModal';
import { MobileGamepadDock } from './presentation/components/MobileGamepadDock';
import { Language } from './domain/types/game.types';
import { translations } from './infrastructure/i18n/translations';

export default function App() {
  const g = useGameEngine();
  const [lang, setLang] = useState<Language>('pl');
  const t = translations[lang];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (g.currentView !== 'exploration') return;
      if (e.key === 'w' || e.key === 'ArrowUp') g.handleMove('up');
      else if (e.key === 's' || e.key === 'ArrowDown') g.handleMove('down');
      else if (e.key === 'a' || e.key === 'ArrowLeft') g.handleMove('left');
      else if (e.key === 'd' || e.key === 'ArrowRight') g.handleMove('right');
      else if (e.key === 'e' || e.key === ' ') {
        const msg = g.engine.interact();
        if (msg) g.setToast(msg);
      } else if (e.key === 'i') g.setView('inventory');
      else if (e.key === 'c') g.setView('crafting');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [g]);

  const handleCloudSync = async () => {
    g.setToast('Rozpoczynanie synchronizacji z chmurą...');
    const res = await g.storage.syncWithCloud();
    g.setToast(res.synced ? 'Pomyślnie zsynchronizowano zapisy z chmurą.' : 'Tryb offline - zapisano lokalnie w IndexedDB.');
  };

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      <TopBarHeader
        currentView={g.currentView}
        language={lang}
        weatherType={g.weatherCond.type}
        isMuted={g.isMuted}
        isOffline={g.isOffline}
        t={t}
        onNavigate={(v) => g.setView(v)}
        onToggleMute={() => {
          g.setIsMuted(!g.isMuted);
          g.audio.setMuted(!g.isMuted);
        }}
        onChangeLanguage={(l) => setLang(l)}
        onCloudSync={handleCloudSync}
      />

      {g.toastMessage && (
        <div className="bg-amber-950/90 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs flex justify-between items-center transition-all">
          <span>{g.toastMessage}</span>
          <button onClick={() => g.setToast(null)} className="ml-2 font-bold hover:text-white">✕</button>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-2 relative overflow-hidden">
        <PixelCanvasViewport
          grid={g.grid}
          playerPosition={g.pos}
          weatherType={g.weatherCond.type}
          onTileClick={() => {
            const msg = g.engine.interact();
            if (msg) g.setToast(msg);
          }}
        />

        <div className="mt-2 text-center text-[11px] text-slate-500 hidden sm:block">
          WASD / Strzałki: Ruch · Spacja / E: Akcja · I: Ekwipunek · C: Rzemiosło
        </div>

        <MobileGamepadDock
          onMove={(d) => g.handleMove(d)}
          onInteract={() => {
            const msg = g.engine.interact();
            if (msg) g.setToast(msg);
          }}
          onOpenInventory={() => g.setView('inventory')}
        />
      </main>

      {g.currentView === 'combat' && (
        <CombatOverlay
          combatState={g.combatState}
          t={t}
          onPlayCard={g.handlePlayCard}
          onEndTurn={g.handleEndTurn}
          onFlee={() => {
            if (g.combat.flee()) g.setView('exploration');
          }}
          onLeaveCombat={() => g.setView('exploration')}
        />
      )}

      {g.currentView === 'dialogue' && (
        <DialogueOverlay
          node={g.dialogueNode}
          karma={g.karma}
          onSelectChoice={g.handleSelectChoice}
          onClose={() => g.setView('exploration')}
        />
      )}

      {g.currentView === 'crafting' && (
        <CraftingOverlay
          recipes={g.crafting.getRecipes()}
          inventory={g.inventory}
          t={t}
          onCraft={g.handleCraft}
          onClose={() => g.setView('exploration')}
        />
      )}

      {g.currentView === 'inventory' && (
        <InventoryHUD
          inventory={g.inventory}
          t={t}
          onClose={() => g.setView('exploration')}
        />
      )}

      {g.currentView === 'admin' && (
        <AdminAnalyticsModal
          analytics={g.analytics.getAnalytics()}
          profile={g.security.getCurrentProfile()}
          auditLogs={g.security.getAuditLogs()}
          t={t}
          onExportCsv={() => handleDownloadFile(g.analytics.exportCsv(), 'telemetria_aethelgard.csv', 'text/csv')}
          onExportAuditCsv={() => handleDownloadFile(g.security.exportAuditDataToCsv(), 'audyt_bezpieczenstwa.csv', 'text/csv')}
          onForgetMe={() => {
            g.security.executeGdprDeletion();
            g.setToast('Dane usunięte zgodnie z RODO.');
          }}
          onClose={() => g.setView('exploration')}
        />
      )}

      {g.currentView === 'store' && (
        <StoreModal
          t={t}
          onClose={() => g.setView('exploration')}
          onUnlockPass={() => g.setToast('Aktywowano pakiet przedwiecznych!')}
        />
      )}

      {g.currentView === 'achievements' && (
        <AchievementsModal
          achievements={g.achievements}
          t={t}
          onClose={() => g.setView('exploration')}
        />
      )}
    </div>
  );
}
