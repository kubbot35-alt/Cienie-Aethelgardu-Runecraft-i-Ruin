import { useCallback, useEffect, useMemo, useState } from 'react';
import { GameEngine } from '../../domain/engine/GameEngine';
import { CombatEngine } from '../../domain/engine/CombatEngine';
import { WeatherSystem } from '../../domain/engine/WeatherSystem';
import { CraftingSystem } from '../../domain/engine/CraftingSystem';
import { DialogueSystem } from '../../domain/engine/DialogueSystem';
import { IndexedDbService } from '../../infrastructure/storage/IndexedDbService';
import { SecurityService } from '../../infrastructure/security/SecurityService';
import { WebAudioSynthService } from '../../infrastructure/audio/WebAudioSynthService';
import { AnalyticsService } from '../../infrastructure/analytics/AnalyticsService';
import { GamepadService } from '../../infrastructure/gamepad/GamepadService';
import { Direction, GameView, MoralKarma } from '../../domain/types/game.types';
import { DialogueChoice } from '../../domain/types/dialogue.types';
import { Achievement } from '../../domain/types/security.types';

export function useGameEngine() {
  const engine = useMemo(() => new GameEngine(), []);
  const combat = useMemo(() => new CombatEngine(), []);
  const weather = useMemo(() => new WeatherSystem(), []);
  const crafting = useMemo(() => new CraftingSystem(), []);
  const dialogue = useMemo(() => new DialogueSystem(), []);
  const storage = useMemo(() => new IndexedDbService(), []);
  const security = useMemo(() => new SecurityService(), []);
  const audio = useMemo(() => new WebAudioSynthService(), []);
  const analytics = useMemo(() => new AnalyticsService(), []);
  const gamepad = useMemo(() => new GamepadService(), []);

  const [pos, setPos] = useState(engine.getPlayerPosition());
  const [stats, setStats] = useState(engine.getPlayerStats());
  const [grid, setGrid] = useState(engine.getMapGrid());
  const [weatherCond, setWeatherCond] = useState(weather.getCurrentWeather());
  const [combatState, setCombatState] = useState(combat.getState());
  const [dialogueNode, setDialogueNode] = useState(dialogue.getCurrentNode());
  const [inventory, setInventory] = useState(crafting.getInventory());
  const [currentView, setView] = useState<GameView>('exploration');
  const [karma, setKarma] = useState<MoralKarma>({ righteousness: 0, pragmatism: 0, entropy: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [isOffline, setIsOffline] = useState(storage.isOffline());
  const [toastMessage, setToast] = useState<string | null>(null);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_step', title: 'Pierwszy Krok', description: 'Postaw nogę w ruinach Aethelgard.', icon: '👣', unlockedAt: new Date().toISOString() },
    { id: 'puzzle_master', title: 'Mistrz Łamigłówek', description: 'Aktywuj wszystkie runiczne płyty i otwórz Bramę.', icon: '🗝️', unlockedAt: null },
    { id: 'dark_slayer', title: 'Pogromca Cieni', description: 'Zwycięż pierwsze turowe starcie runiczne.', icon: '⚔️', unlockedAt: null },
    { id: 'alchemist', title: 'Alchemik Ruin', description: 'Wytwórz swój pierwszy eliksir lub glif.', icon: '🧪', unlockedAt: null },
  ]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id && !a.unlockedAt ? { ...a, unlockedAt: new Date().toISOString() } : a))
    );
  }, []);

  const handleMove = useCallback((dir: Direction) => {
    const res = engine.movePlayer(dir);
    if (!res.success) return;
    setPos(res.newPosition);
    audio.playSfx('step');
    analytics.incrementSteps();

    if (res.eventTriggered === 'puzzle_solved') {
      audio.playSfx('puzzle_solve');
      analytics.incrementPuzzles();
      unlockAchievement('puzzle_master');
      setToast('Wszystkie runy rozbłysły! Pradawna Brama stoi otworem.');
    } else if (res.eventTriggered === 'combat_encounter') {
      combat.startEncounter('Strażnik Bramy Otchłani', 90);
      setCombatState(combat.getState());
      setView('combat');
    } else if (res.eventTriggered === 'dialogue_start') {
      dialogue.startDialogue('node_intro');
      setDialogueNode(dialogue.getCurrentNode());
      setView('dialogue');
    }
  }, [engine, audio, analytics, unlockAchievement, combat, dialogue]);

  const handleSelectChoice = useCallback((choice: DialogueChoice) => {
    const res = dialogue.chooseOption(choice, karma);
    setDialogueNode(res.nextNode);
    if (res.moralReward) {
      setKarma((prev) => ({
        righteousness: prev.righteousness + (res.moralReward?.righteousness || 0),
        pragmatism: prev.pragmatism + (res.moralReward?.pragmatism || 0),
        entropy: prev.entropy + (res.moralReward?.entropy || 0),
      }));
      analytics.incrementMoralDecisions();
    }
    audio.playSfx('dialogue_beep');
  }, [dialogue, karma, audio, analytics]);

  const handlePlayCard = useCallback((cardId: string) => {
    const s = combat.playCard(cardId);
    setCombatState({ ...s });
    audio.playSfx('combat_hit');
    if (s.isVictory) {
      audio.playSfx('combat_victory');
      analytics.incrementCombats();
      unlockAchievement('dark_slayer');
    }
  }, [combat, audio, analytics, unlockAchievement]);

  const handleEndTurn = useCallback(() => {
    const s = combat.endPlayerTurn();
    setCombatState({ ...s });
    audio.playSfx('combat_shield');
  }, [combat, audio]);

  const handleCraft = useCallback((recipeId: string) => {
    const res = crafting.craft(recipeId);
    if (res.success) {
      setInventory({ ...crafting.getInventory() });
      audio.playSfx('craft_success');
      analytics.incrementCrafts();
      unlockAchievement('alchemist');
      setToast(res.message);
    }
  }, [crafting, audio, analytics, unlockAchievement]);

  useEffect(() => {
    const timer = setInterval(() => {
      analytics.tickSessionTime(1);
      const gpAction = gamepad.pollInput();
      if (gpAction) {
        const d = gamepad.toDirection(gpAction);
        if (d && currentView === 'exploration') handleMove(d);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [analytics, gamepad, currentView, handleMove]);

  useEffect(() => {
    const weatherTimer = setInterval(() => {
      setWeatherCond(weather.tick());
      audio.playSfx('weather_whoosh');
    }, 45000);
    return () => clearInterval(weatherTimer);
  }, [weather, audio]);

  return {
    engine, combat, weather, crafting, dialogue, storage, security, audio, analytics,
    pos, stats, grid, weatherCond, combatState, dialogueNode, inventory, currentView, karma,
    isMuted, isOffline, toastMessage, achievements,
    setView, handleMove, handleSelectChoice, handlePlayCard, handleEndTurn, handleCraft,
    setToast, setIsMuted, setIsOffline,
  };
}
