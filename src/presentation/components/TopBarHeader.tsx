import React from 'react';
import { GameView, Language, WeatherType } from '../../domain/types/game.types';
import { AppTranslation } from '../../infrastructure/i18n/translations';

interface TopBarHeaderProps {
  currentView: GameView;
  language: Language;
  weatherType: WeatherType;
  isMuted: boolean;
  isOffline: boolean;
  t: AppTranslation;
  onNavigate: (view: GameView) => void;
  onToggleMute: () => void;
  onChangeLanguage: (lang: Language) => void;
  onCloudSync: () => void;
}

export const TopBarHeader: React.FC<TopBarHeaderProps> = ({
  currentView,
  language,
  weatherType,
  isMuted,
  isOffline,
  t,
  onNavigate,
  onToggleMute,
  onChangeLanguage,
  onCloudSync,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-base font-bold tracking-tight text-amber-500 whitespace-nowrap shrink-0">
          Shadows of Aethelgard
        </span>
        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
          {weatherType.replace('_', ' ').toUpperCase()}
        </span>
        {isOffline && (
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
            OFFLINE
          </span>
        )}
      </div>

      <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
        <button
          onClick={() => onNavigate('exploration')}
          className={`hover:text-amber-400 transition whitespace-nowrap ${currentView === 'exploration' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Eksploracja
        </button>
        <button
          onClick={() => onNavigate('inventory')}
          className="hover:text-amber-400 transition whitespace-nowrap"
        >
          {t.inventory}
        </button>
        <button
          onClick={() => onNavigate('crafting')}
          className="hover:text-amber-400 transition whitespace-nowrap"
        >
          {t.crafting}
        </button>
        <button
          onClick={() => onNavigate('achievements')}
          className="hover:text-amber-400 transition whitespace-nowrap"
        >
          {t.achievements}
        </button>
        <button
          onClick={() => onNavigate('admin')}
          className="hover:text-amber-400 transition whitespace-nowrap"
        >
          {t.adminDashboard}
        </button>
      </nav>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleMute}
          title="Przełącz dźwięk"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <select
          value={language}
          onChange={(e) => onChangeLanguage(e.target.value as Language)}
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none"
        >
          <option value="pl">PL</option>
          <option value="en">EN</option>
          <option value="it">IT</option>
        </select>

        <button
          onClick={onCloudSync}
          className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition whitespace-nowrap shrink-0 shadow-sm"
        >
          {t.cloudSync}
        </button>
      </div>
    </header>
  );
};
